'use server'

import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getNotes } from '@/actions/getNotes';
import { getLabels } from '@/actions/getLabels';
import { getJournalEntriesByYear } from '@/actions/getAllJournalEntries';
import { SYSTEM_PROMPT } from '@/components/new-ai-chat/systemPrompt';

export interface ToolInvocation {
  toolName: string;
  [key: string]: any;
}

export interface OllamaModel {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
}

// Function to get available Ollama models
export async function getOllamaModels(): Promise<{ success: boolean; models?: OllamaModel[]; error?: string }> {
  try {
    const ollamaUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';
    
    const response = await fetch(`${ollamaUrl}/api/tags`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Ollama models: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      models: data.models || []
    };
  } catch (error) {
    console.error('Error fetching Ollama models:', error);
    return {
      success: false,
      error: 'Failed to connect to Ollama or fetch models'
    };
  }
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolInvocations?: ToolInvocation[];
}

export interface ChatRequest {
  messages: ChatMessage[];
  provider?: 'google' | 'ollama';
  model?: string;
}

// Custom Google Gemini provider function using REST API
// Implements function calling with rate limit protection
async function handleGoogleGeminiChat(messages: ChatMessage[], model: string, userId: string, systemPrompt?: string, tools?: any) {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      error: 'Google AI API key not configured'
    };
  }

  try {
    // Convert messages to Gemini format
    const contents = messages
      .filter(m => m.role !== 'system') // Filter out system messages
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

    // Build request body
    const requestBody: any = {
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    };

    // Add system instruction if provided
    if (systemPrompt) {
      requestBody.systemInstruction = {
        parts: [{ text: systemPrompt }]
      };
    }

    // Add tools if provided (Google supports function calling)
    if (tools && Object.keys(tools).length > 0) {
      const functionDeclarations = Object.entries(tools).map(([name, toolDef]: [string, any]) => {
        // Convert Zod schema to JSON Schema format for Google
        const convertZodToJsonSchema = (zodSchema: any): any => {
          if (!zodSchema || !zodSchema._def) {
            return { type: 'object', properties: {} };
          }

          const typeName = zodSchema._def.typeName;
          
          if (typeName === 'ZodObject') {
            const shape = zodSchema._def.shape();
            const properties: any = {};
            const required: string[] = [];

            for (const [key, value] of Object.entries(shape)) {
              const field = value as any;
              if (field._def) {
                const fieldType = field._def.typeName;
                let isOptional = false;
                
                if (fieldType === 'ZodString') {
                  properties[key] = {
                    type: 'string',
                    description: field._def.description || ''
                  };
                } else if (fieldType === 'ZodNumber') {
                  properties[key] = {
                    type: 'number',
                    description: field._def.description || ''
                  };
                } else if (fieldType === 'ZodBoolean') {
                  properties[key] = {
                    type: 'boolean',
                    description: field._def.description || ''
                  };
                } else if (fieldType === 'ZodArray') {
                  // Handle array types
                  const itemType = field._def.type?._def?.typeName;
                  properties[key] = {
                    type: 'array',
                    description: field._def.description || '',
                    items: itemType === 'ZodString' ? { type: 'string' } :
                           itemType === 'ZodNumber' ? { type: 'number' } :
                           { type: 'string' }
                  };
                } else if (fieldType === 'ZodOptional') {
                  isOptional = true;
                  const innerType = field._def.innerType._def.typeName;
                  if (innerType === 'ZodString') {
                    properties[key] = {
                      type: 'string',
                      description: field._def.innerType._def.description || ''
                    };
                  } else if (innerType === 'ZodNumber') {
                    properties[key] = {
                      type: 'number',
                      description: field._def.innerType._def.description || ''
                    };
                  } else if (innerType === 'ZodArray') {
                    const arrayItemType = field._def.innerType._def.type?._def?.typeName;
                    properties[key] = {
                      type: 'array',
                      description: field._def.innerType._def.description || '',
                      items: arrayItemType === 'ZodString' ? { type: 'string' } :
                             arrayItemType === 'ZodNumber' ? { type: 'number' } :
                             { type: 'string' }
                    };
                  }
                }
                
                // Only add to required if not optional and property was defined
                if (!isOptional && fieldType !== 'ZodOptional' && properties[key]) {
                  required.push(key);
                }
              }
            }

            return {
              type: 'object',
              properties,
              ...(required.length > 0 ? { required } : {})
            };
          }

          return { type: 'object', properties: {} };
        };

        const parameters = toolDef.parameters 
          ? convertZodToJsonSchema(toolDef.parameters)
          : { type: 'object', properties: {} };

        return {
          name,
          description: toolDef.description || '',
          parameters
        };
      });

      requestBody.tools = [{
        functionDeclarations
      }];
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Google AI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    console.log('💬 Model response received from Google Gemini' , data  );
    
    // Extract the response text
    let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
    
    // Clean the response
    responseText = responseText.replace(/<think>[\s\S]*?<\/think>/gi, '');
    responseText = responseText.replace(/<\/?think>/gi, '');
    responseText = responseText.replace(/\*\*Response:\*\*/gi, '');
    responseText = responseText.trim();

    // Check for function calls
    const functionCall = data.candidates?.[0]?.content?.parts?.[0]?.functionCall;
    const toolInvocations: ToolInvocation[] = [];

    if (functionCall && tools) {
      console.log('🔧 Function call detected:', functionCall.name, 'with args:', functionCall.args);
      
      // Execute the function call
      const tool = tools[functionCall.name];
      if (tool && tool.execute) {
        try {
          console.log('⚙️ Executing function:', functionCall.name);
          const result = await tool.execute(functionCall.args || {});
          console.log('✅ Function executed successfully, result:', JSON.stringify(result).substring(0, 200) + '...');
          
          toolInvocations.push({
            toolName: functionCall.name,
            args: functionCall.args,
            result
          });
          
          // Add random delay to avoid rate limiting (1-3 seconds)
          const delayMs = 1000 + Math.random() * 2000;
          console.log(`⏳ Waiting ${Math.round(delayMs)}ms to avoid rate limiting...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          
          console.log('🔄 Sending function result back to model for final response...');
          
          // Make a follow-up request with the tool result
          const followUpBody = {
            ...requestBody,
            contents: [
              ...contents,
              {
                role: 'model',
                parts: [{ functionCall }]
              },
              {
                role: 'user',
                parts: [{
                  functionResponse: {
                    name: functionCall.name,
                    response: result
                  }
                }]
              }
            ]
          };

          const followUpResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(followUpBody)
            }
          );

          if (followUpResponse.ok) {
            const followUpData = await followUpResponse.json();
            responseText = followUpData.candidates?.[0]?.content?.parts?.[0]?.text || responseText;
            console.log('💬 Model generated final response after function call');
          } else {
            console.error('❌ Follow-up request failed:', followUpResponse.status);
            if (followUpResponse.status === 429) {
              // Rate limit error - return what we have with a note
              responseText = `I found the information you requested, but encountered a rate limit when processing it. Here's a summary of what I found:\n\n${JSON.stringify(result, null, 2)}`;
              console.log('⚠️ Rate limit hit - returning raw data instead');
            }
          }
        } catch (toolError) {
          console.error('❌ Error executing tool:', toolError);
        }
      } else {
        console.warn('⚠️ Tool not found or no execute function:', functionCall.name);
      }
    } else if (functionCall) {
      console.log('⚠️ Function call detected but no tools provided');
    } else {
      console.log('💬 Direct response (no function call)');
    }

    return {
      success: true,
      message: {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: responseText,
        toolInvocations: toolInvocations.length > 0 ? toolInvocations : undefined
      }
    };

  } catch (error) {
    console.error('Google Gemini chat error:', error);
    return {
      success: false,
      error: `Failed to connect to Google Gemini: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Custom Ollama provider function with tool support
async function handleOllamaChat(messages: ChatMessage[], model: string, userId: string, systemPrompt?: string, tools?: any) {
  const ollamaUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';
  
  // Get available models and validate the requested model
  let validatedModel = model;
  try {
    const modelsResponse = await fetch(`${ollamaUrl}/api/tags`);
    if (modelsResponse.ok) {
      const modelsData = await modelsResponse.json();
      const availableModels = modelsData.models?.map((m: any) => m.name) || [];
      
      console.log('Available models:', availableModels);
      console.log('Requested model:', model);
      
      // Check if the exact model exists
      if (!availableModels.includes(model)) {
        // Try to find a model that starts with the requested name
        const partialMatch = availableModels.find((m: string) => 
          m.startsWith(model) || model.startsWith(m.split(':')[0])
        );
        
        if (partialMatch) {
          validatedModel = partialMatch;
          console.log('Using matched model:', validatedModel);
        } else {
          // Fall back to the first available model
          validatedModel = availableModels[0] || 'deepseek-r1:7b';
          console.log('Using fallback model:', validatedModel);
        }
      }
    }
  } catch (error) {
    console.warn('Could not fetch available models, using provided model:', model);
  }

  try {
    console.log('Making request to Ollama with validated model:', validatedModel);
    
    // Convert messages to Ollama chat format
    const ollamaMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }));

    // Build request body
    const requestBody: any = {
      model: validatedModel,
      messages: ollamaMessages,
      stream: false,
      options: {
        temperature: 0.7,
      }
    };

    // Add system prompt if provided
    if (systemPrompt) {
      requestBody.system = systemPrompt;
    }

    // Add tools if provided (for models that support function calling)
    if (tools && Object.keys(tools).length > 0) {
      console.log('🔧 Adding tools to Ollama request');
      
      const ollamaTools = Object.entries(tools).map(([name, toolDef]: [string, any]) => {
        // Convert Zod schema to simple JSON Schema
        const convertZodToJsonSchema = (zodSchema: any): any => {
          if (!zodSchema || !zodSchema._def) {
            return { type: 'object', properties: {} };
          }

          const typeName = zodSchema._def.typeName;
          
          if (typeName === 'ZodObject') {
            const shape = zodSchema._def.shape();
            const properties: any = {};
            const required: string[] = [];

            for (const [key, value] of Object.entries(shape)) {
              const field = value as any;
              if (field._def) {
                const fieldType = field._def.typeName;
                let isOptional = false;
                
                if (fieldType === 'ZodString') {
                  properties[key] = {
                    type: 'string',
                    description: field._def.description || ''
                  };
                } else if (fieldType === 'ZodNumber') {
                  properties[key] = {
                    type: 'number',
                    description: field._def.description || ''
                  };
                } else if (fieldType === 'ZodBoolean') {
                  properties[key] = {
                    type: 'boolean',
                    description: field._def.description || ''
                  };
                } else if (fieldType === 'ZodArray') {
                  // Handle array types
                  const itemType = field._def.type?._def?.typeName;
                  properties[key] = {
                    type: 'array',
                    description: field._def.description || '',
                    items: itemType === 'ZodString' ? { type: 'string' } :
                           itemType === 'ZodNumber' ? { type: 'number' } :
                           { type: 'string' }
                  };
                } else if (fieldType === 'ZodOptional') {
                  isOptional = true;
                  const innerType = field._def.innerType._def.typeName;
                  if (innerType === 'ZodString') {
                    properties[key] = {
                      type: 'string',
                      description: field._def.innerType._def.description || ''
                    };
                  } else if (innerType === 'ZodNumber') {
                    properties[key] = {
                      type: 'number',
                      description: field._def.innerType._def.description || ''
                    };
                  } else if (innerType === 'ZodArray') {
                    const arrayItemType = field._def.innerType._def.type?._def?.typeName;
                    properties[key] = {
                      type: 'array',
                      description: field._def.innerType._def.description || '',
                      items: arrayItemType === 'ZodString' ? { type: 'string' } :
                             arrayItemType === 'ZodNumber' ? { type: 'number' } :
                             { type: 'string' }
                    };
                  }
                }
                
                // Only add to required if not optional and property was defined
                if (!isOptional && fieldType !== 'ZodOptional' && properties[key]) {
                  required.push(key);
                }
              }
            }

            return {
              type: 'object',
              properties,
              ...(required.length > 0 ? { required } : {})
            };
          }

          return { type: 'object', properties: {} };
        };

        const parameters = toolDef.parameters 
          ? convertZodToJsonSchema(toolDef.parameters)
          : { type: 'object', properties: {} };

        return {
          type: 'function',
          function: {
            name,
            description: toolDef.description || '',
            parameters
          }
        };
      });

      requestBody.tools = ollamaTools;
    }

    const response = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ollama API error response:', errorText);
      throw new Error(`Ollama API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Ollama response:', data);
    
    // Check for tool calls in response
    const toolCalls = data.message?.tool_calls;
    const toolInvocations: ToolInvocation[] = [];

    if (toolCalls && toolCalls.length > 0 && tools) {
      console.log('🔧 Tool calls detected:', toolCalls.length);
      
      // Execute all tool calls
      for (const toolCall of toolCalls) {
        const functionName = toolCall.function?.name;
        const functionArgs = toolCall.function?.arguments;
        
        if (functionName && tools[functionName]) {
          console.log('⚙️ Executing function:', functionName, 'with args:', functionArgs);
          
          try {
            const result = await tools[functionName].execute(functionArgs || {});
            console.log('✅ Function executed successfully');
            
            toolInvocations.push({
              toolName: functionName,
              args: functionArgs,
              result
            });

            // Add random delay to avoid rate limiting (500ms-1.5s for local Ollama)
            const delayMs = 500 + Math.random() * 1000;
            console.log(`⏳ Waiting ${Math.round(delayMs)}ms before follow-up request...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));

            // Add tool result to messages and make follow-up request
            const followUpMessages = [
              ...ollamaMessages,
              data.message,
              {
                role: 'tool',
                content: JSON.stringify(result)
              }
            ];

            console.log('🔄 Sending function result back to model...');

            const followUpResponse = await fetch(`${ollamaUrl}/api/chat`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({
                model: validatedModel,
                messages: followUpMessages,
                stream: false,
                options: {
                  temperature: 0.7,
                }
              })
            });

            if (followUpResponse.ok) {
              const followUpData = await followUpResponse.json();
              const finalResponse = followUpData.message?.content || data.message?.content || 'No response';
              console.log('💬 Model generated final response after function call');
              
              // Clean the response
              let cleanedResponse = finalResponse;
              cleanedResponse = cleanedResponse.replace(/<think>[\s\S]*?<\/think>/gi, '');
              cleanedResponse = cleanedResponse.replace(/<\/?think>/gi, '');
              cleanedResponse = cleanedResponse.replace(/\*\*Response:\*\*/gi, '');
              cleanedResponse = cleanedResponse.trim();
              
              return {
                success: true,
                message: {
                  id: crypto.randomUUID(),
                  role: 'assistant' as const,
                  content: cleanedResponse,
                  toolInvocations: toolInvocations.length > 0 ? toolInvocations : undefined
                }
              };
            }
          } catch (toolError) {
            console.error('❌ Error executing tool:', toolError);
          }
        }
      }
    } else {
      console.log('💬 Direct response (no tool calls)');
    }
    
    // Get response text
    let cleanedResponse = data.message?.content || 'No response from Ollama';
    
    // Clean the response
    cleanedResponse = cleanedResponse.replace(/<think>[\s\S]*?<\/think>/gi, '');
    cleanedResponse = cleanedResponse.replace(/<\/?think>/gi, '');
    cleanedResponse = cleanedResponse.replace(/\*\*Response:\*\*/gi, '');
    cleanedResponse = cleanedResponse.trim();
    
    return {
      success: true,
      message: {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: cleanedResponse,
        toolInvocations: toolInvocations.length > 0 ? toolInvocations : undefined
      }
    };
    
  } catch (error) {
    console.error('Ollama chat error:', error);
    return {
      success: false,
      error: `Failed to connect to Ollama: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export async function chatWithAI({ messages, provider = 'google', model = 'gemini-2.5-flash', dataAccessSettings }: ChatRequest & { dataAccessSettings?: { notes: boolean; habits: boolean; journal: boolean } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    // Build tools object based on data access settings
    const defaultDataAccess = { notes: true, habits: true, journal: true };
    const dataAccess = dataAccessSettings || defaultDataAccess;
    
    const tools: any = {};

    // Add notes-related tools if access is granted
    // PROGRESSIVE FETCHING PATTERN: Overview → Selection → Detailed Fetch
    if (dataAccess.notes) {
      // STEP 1: Get overview of all notes (titles + labels only)
      tools.getNotesOverview = tool({
        description: 'Get an overview of all user notes with titles and labels only (no content). Use this FIRST to see what notes exist, then call getNotesByIds for specific content.',
        parameters: z.object({
          labelName: z.string().optional().describe('Optional label name to filter notes by category'),
        }),
        execute: async ({ labelName }) => {
          try {
            const notes = await getNotes({ labelName });
            
            console.log(`📋 Overview: Found ${notes.length} notes${labelName ? ` in label "${labelName}"` : ''}`);
            
            return {
              success: true,
              count: notes.length,
              notes: notes.map(note => ({
                id: note.id,
                heading: note.heading || 'Untitled',
                labelName: note.labelName,
                created_at: note.created_at,
                // Give hint about content size without sending it
                hasContent: !!note.content
              }))
            };
          } catch (error) {
            console.error('Error fetching notes overview:', error);
            return {
              success: false,
              error: 'Failed to fetch notes overview'
            };
          }
        },
      });

      // STEP 2: Get full content of specific notes by IDs
      tools.getNotesByIds = tool({
        description: 'Get full content of specific notes by their IDs. Use this AFTER getNotesOverview to fetch only relevant notes.',
        parameters: z.object({
          noteIds: z.array(z.string()).describe('Array of note IDs to fetch full content for'),
        }),
        execute: async ({ noteIds }) => {
          try {
            const allNotes = await getNotes({});
            const selectedNotes = allNotes.filter(note => noteIds.includes(note.id));
            
            console.log(`📝 Fetching ${selectedNotes.length} specific notes by ID`);
            
            if (selectedNotes.length === 0) {
              return {
                success: false,
                error: 'No notes found with provided IDs'
              };
            }
            
            return {
              success: true,
              count: selectedNotes.length,
              notes: selectedNotes.map(note => ({
                id: note.id,
                heading: note.heading,
                content: note.content,
                htmlContent: note.htmlContent,
                labelName: note.labelName,
                backgroundColor: note.backgroundColor,
                created_at: note.created_at
              }))
            };
          } catch (error) {
            console.error('Error fetching specific notes:', error);
            return {
              success: false,
              error: 'Failed to fetch specific notes'
            };
          }
        },
      });

      // Get all available labels
      tools.getLabels = tool({
        description: 'Get all user labels/categories to understand note organization',
        parameters: z.object({}),
        execute: async () => {
          try {
            const labels = await getLabels();
            
            console.log(`🏷️ Found ${labels.length} labels`);
            
            return {
              success: true,
              labels: labels.map(label => ({
                id: label.id,
                name: label.name,
                color: label.color,
                notesCount: label.notesIds?.length || 0
              }))
            };
          } catch (error) {
            console.error('Error fetching labels:', error);
            return {
              success: false,
              error: 'Failed to fetch labels'
            };
          }
        },
      });
    }

    // Add journal-related tools if access is granted
    // PROGRESSIVE FETCHING PATTERN: Overview → Date Range Selection → Detailed Fetch
    if (dataAccess.journal) {
      // STEP 1: Get overview of journal entries (dates only)
      tools.getJournalOverview = tool({
        description: 'Get an overview of journal entries showing only dates and entry count. Use this FIRST to see available journal dates, then use getJournalEntriesByDateRange for specific content.',
        parameters: z.object({
          year: z.number().describe('Year to get journal overview for (e.g., 2025)'),
        }),
        execute: async ({ year }) => {
          try {
            const entries = await getJournalEntriesByYear(year);
            
            console.log(`📅 Journal overview: Found ${entries.length} entries in ${year}`);
            
            return {
              success: true,
              year,
              count: entries.length,
              dates: entries.map(entry => ({
                id: entry.id,
                date: entry.date,
                createdAt: entry.createdAt,
                hasContent: !!entry.content
              }))
            };
          } catch (error) {
            console.error('Error fetching journal overview:', error);
            return {
              success: false,
              error: 'Failed to fetch journal overview'
            };
          }
        },
      });

      // STEP 2: Get journal entries within a specific date range
      tools.getJournalEntriesByDateRange = tool({
        description: 'Get full journal entries within a specific date range. Use this AFTER getJournalOverview to fetch only relevant time periods.',
        parameters: z.object({
          startDate: z.string().describe('Start date in YYYY-MM-DD format'),
          endDate: z.string().describe('End date in YYYY-MM-DD format'),
        }),
        execute: async ({ startDate, endDate }) => {
          try {
            // Extract year from startDate to query
            const year = parseInt(startDate.split('-')[0]);
            const allEntries = await getJournalEntriesByYear(year);
            
            // Filter by date range
            const filteredEntries = allEntries.filter(entry => {
              const entryDate = entry.date instanceof Date 
                ? entry.date.toISOString().split('T')[0]
                : entry.date;
              return entryDate >= startDate && entryDate <= endDate;
            });
            
            console.log(`📖 Fetching ${filteredEntries.length} journal entries from ${startDate} to ${endDate}`);
            
            return {
              success: true,
              count: filteredEntries.length,
              startDate,
              endDate,
              entries: filteredEntries.map(entry => ({
                id: entry.id,
                date: entry.date,
                content: entry.content,
                createdAt: entry.createdAt,
                updatedAt: entry.updatedAt
              }))
            };
          } catch (error) {
            console.error('Error fetching journal entries by date range:', error);
            return {
              success: false,
              error: 'Failed to fetch journal entries'
            };
          }
        },
      });
    }

    // Add habit-related tools if access is granted
    // PROGRESSIVE FETCHING PATTERN: Template Overview → Time Selection → Records Fetch
    if (dataAccess.habits) {
      const { getHabitTemplate } = await import('@/actions/getHabitTemplate');
      const { getDailyEntries } = await import('@/actions/getDailyEntries');
      
      // STEP 1: Get habit template (current habits being tracked)
      tools.getHabitsOverview = tool({
        description: 'Get an overview of all habits currently being tracked (names, categories, types). Use this FIRST to see what habits exist, then use getHabitRecords for historical data.',
        parameters: z.object({}),
        execute: async () => {
          try {
            const result = await getHabitTemplate();
            
            if (!result.success || !result.data) {
              return {
                success: false,
                error: result.error || 'No habit template found'
              };
            }
            
            // Extract habit overview from categories
            const habitsOverview = Object.entries(result.data.categories || {}).flatMap(([categoryName, category]: [string, any]) => 
              Object.entries((category as any).habits || {}).map(([habitKey, habit]: [string, any]) => ({
                habitKey,
                name: habit.name || habitKey,
                category: categoryName,
                type: habit.type || 'unknown',
                config: habit.type === 'checkbox' ? 'Yes/No tracking' : 
                        habit.type === 'counter' ? `Counter (Goal: ${habit.goal || 'N/A'})` :
                        habit.type === 'slider' ? `Slider (Range: ${habit.min || 0}-${habit.max || 100})` :
                        'Unknown type'
              }))
            );
            
            console.log(`🎯 Habits overview: Found ${habitsOverview.length} tracked habits`);
            
            return {
              success: true,
              count: habitsOverview.length,
              habits: habitsOverview
            };
          } catch (error) {
            console.error('Error fetching habits overview:', error);
            return {
              success: false,
              error: 'Failed to fetch habits overview'
            };
          }
        },
      });

      // STEP 2: Get habit records within a date range
      tools.getHabitRecords = tool({
        description: 'Get habit tracking records within a specific date range. Use this AFTER getHabitsOverview to analyze habit performance over time.',
        parameters: z.object({
          startDate: z.string().describe('Start date in YYYY-MM-DD format'),
          endDate: z.string().describe('End date in YYYY-MM-DD format'),
        }),
        execute: async ({ startDate, endDate }) => {
          try {
            const result = await getDailyEntries(session.user.id!, startDate, endDate);
            
            if (!result.success) {
              return {
                success: false,
                error: result.error || 'Failed to fetch habit records'
              };
            }
            
            console.log(`📊 Fetched ${result.data?.length || 0} habit records from ${startDate} to ${endDate}`);
            
            return {
              success: true,
              count: result.data?.length || 0,
              startDate,
              endDate,
              records: result.data || []
            };
          } catch (error) {
            console.error('Error fetching habit records:', error);
            return {
              success: false,
              error: 'Failed to fetch habit records'
            };
          }
        },
      });

      // Get full habit template for detailed configuration
      tools.getHabitTemplateDetails = tool({
        description: 'Get the complete habit template with all configuration details. Use this when you need to understand habit goals, thresholds, and detailed settings.',
        parameters: z.object({}),
        execute: async () => {
          try {
            const result = await getHabitTemplate();
            
            if (!result.success) {
              return {
                success: false,
                error: result.error || 'Failed to fetch habit template'
              };
            }
            
            console.log(`⚙️ Retrieved complete habit template configuration`);
            
            return {
              success: true,
              template: result.data
            };
          } catch (error) {
            console.error('Error fetching habit template details:', error);
            return {
              success: false,
              error: 'Failed to fetch habit template details'
            };
          }
        },
      });
    }

    // Get system prompt from messages if available
    const systemMessage = messages.find(m => m.role === 'system');
    const systemPrompt = systemMessage?.content || SYSTEM_PROMPT;

    // Handle Ollama separately
    if (provider === 'ollama') {
      let ollamaModel = model;
      if (model === 'gemini-2.5-flash' || !model) {
        ollamaModel = 'deepseek-r1:7b';
      }
      return await handleOllamaChat(
        messages, 
        ollamaModel, 
        session.user.id, 
        systemPrompt,
        Object.keys(tools).length > 0 ? tools : undefined
      );
    }

    // Handle Google Gemini (default provider)
    return await handleGoogleGeminiChat(
      messages, 
      model, 
      session.user.id, 
      systemPrompt,
      Object.keys(tools).length > 0 ? tools : undefined
    );

  } catch (error) {
    console.error('Chat AI error:', error);
    return {
      success: false,
      error: 'Internal Server Error'
    };
  }
}