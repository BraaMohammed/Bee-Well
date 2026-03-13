import { useState, useCallback, useRef, useEffect } from 'react';
import { useAISettingsStore } from '@/stores/aiSettingsStore';
import { useAIChatStore } from '@/stores/aiChatStore';
import { getClientModel } from '@/lib/ai/clientProviders';
import { getClientTools } from '@/lib/ai/clientTools';
import { SYSTEM_PROMPT } from '@/components/new-ai-chat/systemPrompt';
import { stepCountIs, streamText } from 'ai';

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
    provider?: 'google' | 'ollama' | 'groq';
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

    const { dataAccess, customPrompt, googleApiKey, ollamaUrl, groqApiKey } = useAISettingsStore();

    // ------------------------------------------------------------------
    // FIX: The handleSubmit callback captures provider/model via closure.
    // When the user changes the model in the selector, the closure still
    // holds the OLD values. We use live refs that are always kept in sync
    // with the store so handleSubmit always reads the latest selection.
    // ------------------------------------------------------------------
    const { selectedProvider, selectedModel } = useAIChatStore();
    const liveProviderRef = useRef(selectedProvider);
    const liveModelRef = useRef(selectedModel);

    useEffect(() => {
        liveProviderRef.current = selectedProvider;
        liveModelRef.current = selectedModel;
        console.log(`[ModelSelector] 🔄 Store updated → provider=${selectedProvider} | model=${selectedModel}`);
    }, [selectedProvider, selectedModel]);

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

        // 1. Initial Setup Data — always read from live refs to defeat stale closure
        const providerType = liveProviderRef.current || options.provider || 'google';
        const modelId = liveModelRef.current || options.model || 'gemini-2.5-flash';

        console.log(`[Chat] ────────────── New Submission ──────────────`);
        console.log(`[Chat] 📤 provider=${providerType} | model=${modelId}`);
        console.log(`[Chat] 🔑 googleApiKey=${!!googleApiKey} | groqApiKey=${!!groqApiKey} | ollamaUrl=${ollamaUrl}`);

        // Warn if missing API keys
        if (providerType === 'google' && !googleApiKey) {
            console.warn('[Chat] ⚠️ No Google API key — showing inline warning');
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

        if (providerType === 'groq' && !groqApiKey) {
            console.warn('[Chat] ⚠️ No Groq API key — showing inline warning');
            setMessages(prev => [...prev, {
                id: crypto.randomUUID(),
                role: 'user',
                content: input.trim()
            }, {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: '⚠️ **Missing Groq API Key**: Please open the Settings (gear icon) and configure your Groq API Key. You can get a free key at [console.groq.com](https://console.groq.com).',
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
            console.log(`[Chat] 🤖 Creating model client for ${providerType}/${modelId}...`);
            const curModel = getClientModel(providerType, modelId, { googleApiKey, ollamaUrl, groqApiKey });
            console.log('[Chat] ✅ Model client created successfully');

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
            // CRITICAL: maxSteps must be > 1 to allow tool-call → result → reply loops.
            // Default is maxSteps=1, which calls the tool then STOPS before the model
            // can read the result and generate the final answer.
            console.log('[Chat] 🌊 Starting streamText with maxSteps=10...');
            const { textStream } = await streamText({
                model: curModel as any,
                messages: coreMessages,
                tools: getClientTools(dataAccess),
                stopWhen: stepCountIs(5),
                abortSignal: abortControllerRef.current.signal,
                onStepFinish: (step: any) => {
                    const stepType = step.stepType ?? 'unknown';
                    console.log(`[Chat] 📍 Step finished | type=${stepType} | text_len=${step.text?.length ?? 0} | toolCalls=${step.toolCalls?.length ?? 0} | toolResults=${step.toolResults?.length ?? 0} | finishReason=${step.finishReason}`);

                    if (step.toolCalls && step.toolCalls.length > 0) {
                        console.log(`[Chat] 🔧 Tool calls:`, step.toolCalls.map((tc: any) => `${tc.toolName}(${JSON.stringify(tc.args).substring(0, 80)})`));
                    }
                    if (step.toolResults && step.toolResults.length > 0) {
                        step.toolResults.forEach((tr: any) => {
                            const resultPreview = JSON.stringify(tr.result).substring(0, 120);
                            console.log(`[Chat] 📦 Tool result [${tr.toolName}]: ${resultPreview}`);
                        });
                    }

                    // Surface tool call badges in the UI on every step
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
            let chunkCount = 0;
            let hasLoggedFirstThinkBlock = false;

            for await (const textPart of textStream) {
                if (abortControllerRef.current?.signal.aborted) break;
                cumulativeResponse += textPart;
                chunkCount++;

                // On first chunk — log it so we can see what we're getting
                if (chunkCount === 1) {
                    console.log(`[Chat] 📡 First chunk received: ${JSON.stringify(textPart)}`);
                }

                // Every 25 chunks log a snapshot so we can trace think blocks forming
                if (chunkCount % 25 === 0) {
                    const preview = JSON.stringify(cumulativeResponse.substring(0, 150));
                    console.log(`[Chat] 📡 Chunk #${chunkCount} | len=${cumulativeResponse.length} | preview=${preview}`);
                }

                // Log the first time we detect a think-block opening in the stream
                if (!hasLoggedFirstThinkBlock && /<(think|thinking|reasoning|reason|reflection|reflect)>/i.test(cumulativeResponse)) {
                    hasLoggedFirstThinkBlock = true;
                    console.log(`[Thinking] 🧠 Detected think block opening at chunk #${chunkCount}`);
                    console.log(`[Thinking] 🧠 Content so far: ${JSON.stringify(cumulativeResponse.substring(0, 200))}`);
                }

                setMessages(prev => prev.map(msg =>
                    msg.id === assistantMessageId
                        ? { ...msg, content: cumulativeResponse }
                        : msg
                ));
            }

            console.log(`[Chat] ✅ Stream complete | total chunks=${chunkCount} | total length=${cumulativeResponse.length}`);
            // Log the full think-block structure at the end
            const thinkStart = cumulativeResponse.indexOf('<think');
            const thinkEnd = cumulativeResponse.indexOf('</think');
            if (thinkStart !== -1) {
                console.log(`[Thinking] 🧠 Think block found at [${thinkStart}..${thinkEnd}]`);
                console.log(`[Thinking] 🧠 First 300 chars of content: ${JSON.stringify(cumulativeResponse.substring(0, 300))}`);
            } else {
                console.log(`[Thinking] ℹ️ No <think> block detected in final response`);
            }

        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('[Chat] 🛑 Stream aborted by user');
            } else {
                console.error('[Chat] ❌ Chat error:', error);
                console.error('[Chat] ❌ Details:', { name: error.name, message: error.message, status: error.status });
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
    }, [input, messages, isLoading, dataAccess, customPrompt, googleApiKey, ollamaUrl, groqApiKey]);

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
