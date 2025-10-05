import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AISettingsState {
  // Data Access Permissions
  dataAccess: {
    notes: boolean;
    habits: boolean;
    journal: boolean;
  };
  
  // Custom Context Prompt
  customPrompt: string;
  
  // Model Selection (inherited from aiChatStore but can be overridden here)
  useCustomModelSettings: boolean;
  
  // Actions
  setDataAccess: (type: 'notes' | 'habits' | 'journal', enabled: boolean) => void;
  setCustomPrompt: (prompt: string) => void;
  setUseCustomModelSettings: (enabled: boolean) => void;
  resetToDefaults: () => void;
  
  // Helper methods
  getEnabledDataSources: () => string[];
  hasAnyDataAccess: () => boolean;
}

const defaultSettings = {
  dataAccess: {
    notes: true,
    habits: true,
    journal: true,
  },
  customPrompt: '',
  useCustomModelSettings: false,
};

export const useAISettingsStore = create<AISettingsState>()(
  persist(
    (set, get) => ({
      // Initial state
      ...defaultSettings,

      // Actions
      setDataAccess: (type, enabled) =>
        set((state) => ({
          dataAccess: {
            ...state.dataAccess,
            [type]: enabled,
          },
        })),

      setCustomPrompt: (prompt) => set({ customPrompt: prompt }),

      setUseCustomModelSettings: (enabled) => set({ useCustomModelSettings: enabled }),

      resetToDefaults: () => set(defaultSettings),

      // Helper methods
      getEnabledDataSources: () => {
        const state = get();
        const sources: string[] = [];
        if (state.dataAccess.notes) sources.push('notes');
        if (state.dataAccess.habits) sources.push('habits');
        if (state.dataAccess.journal) sources.push('journal');
        return sources;
      },

      hasAnyDataAccess: () => {
        const state = get();
        return state.dataAccess.notes || state.dataAccess.habits || state.dataAccess.journal;
      },
    }),
    {
      name: 'ai-settings-storage',
      version: 1,
    }
  )
);