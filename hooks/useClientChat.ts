import { useState, useCallback, useRef } from 'react';
import { useAISettingsStore } from '@/stores/aiSettingsStore';
import { getClientModel } from '@/lib/ai/clientProviders';
import { getClientTools } from '@/lib/ai/clientTools';
import { SYSTEM_PROMPT } from '@/components/new-ai-chat/systemPrompt';
import { streamText } from 'ai';

export interface ToolInvocation {
    toolName: string;
    [key: string]: any;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    toolInvocations?: ToolInvocation[];
}

interface UseClientChatOptions {
    provider?: 'google' | 'ollama';
    model?: string;
}

/**
 * A custom React hook that manages the AI Chat state entirely on the client,
 * avoiding Serverless API Routes and their associated Timeouts entirely.
 */
export function useClientChat(options: UseClientChatOptions = {}) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Ref to hold an abort controller for stopping generations
    const abortControllerRef = useRef<AbortController | null>(null);

    const { dataAccess, customPrompt, googleApiKey, ollamaUrl } = useAISettingsStore();

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInput(e.target.value);
    }, []);

    const stop = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setIsLoading(false);
        }
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement> | { preventDefault: () => void }) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        // 1. Initial Setup Data
        const providerType = options.provider || 'google';
        const modelId = options.model || 'gemini-2.5-flash';

        // Warn if missing API keys
        if (providerType === 'google' && !googleApiKey) {
            setMessages(prev => [...prev, {
                id: crypto.randomUUID(),
                role: 'user',
                content: input.trim()
            }, {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: '⚠️ **Missing Google API Key**: Please open the Settings (gear icon) and configure your Google Gemini API Key to use this provider.',
            }]);
            setInput('');
            return;
        }

        // 2. Prepare user message & Update UI
        const userContent = input.trim();
        const newUserMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: userContent };

        // We create a blank assistant message to stream into. 
        // We attach tool invocations as they happen.
        const assistantMessageId = crypto.randomUUID();
        const initialAssistantMessage: ChatMessage = { id: assistantMessageId, role: 'assistant', content: '', toolInvocations: [] };

        const contextMessages = [...messages, newUserMessage];
        setMessages([...contextMessages, initialAssistantMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // 3. Compose model instance
            const curModel = getClientModel(providerType, modelId, { googleApiKey, ollamaUrl });

            // 4. Compose system instructions
            const finalSystemPrompt = customPrompt
                ? `${SYSTEM_PROMPT}\n\nUser Custom Instructions:\n${customPrompt}`
                : SYSTEM_PROMPT;

            // 5. Convert Local ChatMessage to CoreMessage
            const coreMessages: any[] = [
                { role: 'system', content: finalSystemPrompt },
                ...contextMessages.map(m => ({
                    role: m.role as 'user' | 'assistant' | 'system',
                    content: m.content
                }))
            ];

            abortControllerRef.current = new AbortController();

            // 6. Leverage Vercel SDK streamText natively in JS Environment
            const { textStream } = await streamText({
                model: curModel as any,
                messages: coreMessages,
                tools: getClientTools(dataAccess),
                abortSignal: abortControllerRef.current.signal,
                onStepFinish: (step: any) => {
                    // Whenever a step finishes (which might include a tool call),
                    // We can intercept the tool calls made to display them in the UI.
                    if (step.toolCalls && step.toolCalls.length > 0) {
                        setMessages(prev => prev.map(msg => {
                            if (msg.id !== assistantMessageId) return msg;

                            const newTools = step.toolCalls.map((tc: any) => ({
                                toolName: tc.toolName,
                                args: tc.args || tc.arguments || {}
                            }));

                            return {
                                ...msg,
                                toolInvocations: [...(msg.toolInvocations || []), ...newTools]
                            };
                        }));
                    }
                }
            });

            // 7. Process the incoming text stream and apply characters to state gradually
            let cumulativeResponse = '';
            for await (const textPart of textStream) {
                if (abortControllerRef.current?.signal.aborted) break;
                cumulativeResponse += textPart;

                setMessages(prev => prev.map(msg =>
                    msg.id === assistantMessageId
                        ? { ...msg, content: cumulativeResponse }
                        : msg
                ));
            }

        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Stream aborted');
            } else {
                console.error('Chat error:', error);
                setMessages(prev => prev.map(msg =>
                    msg.id === assistantMessageId
                        ? { ...msg, content: msg.content + '\n\n*Error: Failed to fetch response. Please check your AI API key and connection.*' }
                        : msg
                ));
            }
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    }, [input, messages, isLoading, options.provider, options.model, dataAccess, customPrompt, googleApiKey, ollamaUrl]);

    return {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        setMessages,
        stop,
        // Provide append map for potential future UI upgrades (quick action chips)
        append: (msg: { role: 'user', content: string }) => {
            setInput(msg.content);
            // We rely on React's microtask batching to safely execute handleSubmit with the new input,
            // but a more robust way is to just call submit manually
            setTimeout(() => {
                handleSubmit({ preventDefault: () => { } } as React.FormEvent<HTMLFormElement>);
            }, 50);
        }
    };
}
