'use client'

import { useAISettingsStore } from '@/stores/aiSettingsStore';

export interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
  details?: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

export interface OllamaModelsResponse {
  available: boolean;
  models: OllamaModel[];
  ollamaUrl?: string;
  error?: string;
}

export async function getOllamaModels(): Promise<OllamaModelsResponse> {
  try {
    // Get Ollama API endpoint from user settings, fallback to env or default
    const settingsUrl = useAISettingsStore.getState().ollamaUrl;
    const ollamaUrl = settingsUrl || process.env.OLLAMA_API_URL || 'http://localhost:11434';
    
    const response = await fetch(`${ollamaUrl}/api/tags`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        error: 'Failed to fetch models from Ollama',
        available: false,
        models: []
      };
    }

    const data = await response.json();
    
    return {
      available: true,
      models: data.models || [],
      ollamaUrl
    };
  } catch (error) {
    console.error('Error connecting to Ollama:', error);
    return {
      error: 'Ollama not available. Make sure Ollama is running locally.',
      available: false,
      models: []
    };
  }
}