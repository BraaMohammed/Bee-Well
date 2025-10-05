import { create } from 'zustand';

export interface ModelOption {
  id: string;
  name: string;
  provider: 'google' | 'ollama';
  description?: string;
}

interface AIChatState {
  // Model selection state
  selectedProvider: 'google' | 'ollama';
  selectedModel: string;
  availableModels: ModelOption[];
  ollamaModels: any[];
  isModelLoading: boolean;

  // Actions
  setSelectedProvider: (provider: 'google' | 'ollama') => void;
  setSelectedModel: (model: string) => void;
  setOllamaModels: (models: any[]) => void;
  setIsModelLoading: (loading: boolean) => void;
  
  // Computed getters
  getCurrentModels: () => ModelOption[];
  getAllModelOptions: () => ModelOption[];
  
  // Initialize store
  initialize: () => void;
}

export const useAIChatStore = create<AIChatState>((set, get) => ({
  // Initial state
  selectedProvider: 'google',
  selectedModel: 'gemini-2.5-flash',
  availableModels: [],
  ollamaModels: [],
  isModelLoading: false,

  // Actions
  setSelectedProvider: (provider) => set({ selectedProvider: provider }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setOllamaModels: (models) => set({ ollamaModels: models }),
  setIsModelLoading: (loading) => set({ isModelLoading: loading }),

  // Computed getters
  getCurrentModels: () => {
    const state = get();
    return state.getAllModelOptions().filter(model => model.provider === state.selectedProvider);
  },

  getAllModelOptions: () => {
    const state = get();
    const predefinedModels: ModelOption[] = [
      // Google Gemini Models
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'google', description: 'Most capable, advanced reasoning' },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'google', description: 'Fast and efficient' },
    ];

    // Add Ollama models
    const ollamaModelOptions = state.ollamaModels.map(model => ({
      id: model.name,
      name: model.name,
      provider: 'ollama' as const,
      description: `Local • ${(model.size / 1024 / 1024 / 1024).toFixed(1)}GB`
    }));

    return [...predefinedModels, ...ollamaModelOptions];
  },

  // Initialize store (fetch Ollama models)
  initialize: async () => {
    set({ isModelLoading: true });
    try {
      const { getOllamaModels } = await import('@/actions/getOllamaModels');
      const data = await getOllamaModels();
      if (data.available && data.models) {
        set({ ollamaModels: data.models });
      }
    } catch (error) {
      console.error('Failed to fetch Ollama models:', error);
    } finally {
      set({ isModelLoading: false });
    }
  },
}));