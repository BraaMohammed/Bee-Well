import { useState, useCallback } from 'react';
import { chatWithAISettings } from '@/actions/chatWithAISettings';
import { type ChatMessage } from '@/actions/chatWithAI';
import { useAISettingsStore } from '@/stores/aiSettingsStore';

interface UseChatServerActionsOptions {
  provider?: 'google' | 'ollama';
  model?: string;
}

export function useChatServerActions(options: UseChatServerActionsOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Get AI settings
  const { dataAccess, customPrompt } = useAISettingsStore();

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatWithAISettings({
        messages: newMessages,
        provider: options.provider,
        model: options.model,
        userSettings: {
          dataAccess,
          customPrompt
        }
      });

      if (result.success && result.message) {
        setMessages([...newMessages, result.message]);
      } else {
        // Handle error
        const errorMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: result.error || 'Sorry, I encountered an error processing your request.'
        };
        setMessages([...newMessages, errorMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.'
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, isLoading, options.provider, options.model]);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages
  };
}