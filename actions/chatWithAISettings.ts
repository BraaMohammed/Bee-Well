'use server'

import { ChatMessage, ChatRequest, chatWithAI } from './chatWithAI';
import { SYSTEM_PROMPT } from '@/components/new-ai-chat/systemPrompt';

interface EnhancedChatRequest extends ChatRequest {
  userSettings?: {
    dataAccess: {
      notes: boolean;
      habits: boolean;
      journal: boolean;
    };
    customPrompt: string;
  };
}

export async function chatWithAISettings({ 
  messages, 
  provider = 'google', 
  model = 'gemini-2.5-flash',
  userSettings 
}: EnhancedChatRequest) {
  try {
    // If no user settings provided, use defaults (all access enabled)
    const settings = userSettings || {
      dataAccess: { notes: true, habits: true, journal: true },
      customPrompt: ''
    };

    // Create modified system prompt based on user settings
    let modifiedSystemPrompt = SYSTEM_PROMPT;
    
    // Add custom user instructions if provided
    if (settings.customPrompt?.trim()) {
      modifiedSystemPrompt += `\n\nUser's Custom Instructions:\n${settings.customPrompt.trim()}`;
    }

    // Add data access restrictions to system prompt
    const enabledDataSources = [];
    if (settings.dataAccess.notes) enabledDataSources.push('notes and labels');
    if (settings.dataAccess.habits) enabledDataSources.push('habit tracking data');
    if (settings.dataAccess.journal) enabledDataSources.push('journal entries');

    if (enabledDataSources.length === 0) {
      modifiedSystemPrompt += `\n\nIMPORTANT: You do not have access to any user data. Provide general assistance only.`;
    } else if (enabledDataSources.length < 3) {
      modifiedSystemPrompt += `\n\nDATA ACCESS: You can only access the following user data: ${enabledDataSources.join(', ')}. Do not attempt to access other data sources.`;
    }

    // Modify messages to include the custom system prompt
    const modifiedMessages: ChatMessage[] = [
      {
        id: 'system',
        role: 'system',
        content: modifiedSystemPrompt
      },
      ...messages.filter(msg => msg.role !== 'system') // Remove any existing system messages
    ];

    // Call the original chatWithAI function with modified messages and data access settings
    const result = await chatWithAI({
      messages: modifiedMessages,
      provider,
      model,
      dataAccessSettings: settings.dataAccess
    });

    return result;

  } catch (error) {
    console.error('Enhanced chat AI error:', error);
    return {
      success: false,
      error: 'Internal Server Error'
    };
  }
}