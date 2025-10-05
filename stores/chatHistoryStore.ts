import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage } from '@/actions/chatWithAI';

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}

interface ChatHistoryState {
  // Current session
  currentChatId: string | null;
  
  // All chat sessions
  chatSessions: Record<string, ChatSession>;
  
  // UI state
  isCreatingNewChat: boolean;
  
  // Actions
  createNewChat: (title?: string) => string;
  saveCurrentChat: (messages: ChatMessage[]) => void;
  loadChat: (chatId: string) => ChatSession | null;
  deleteChat: (chatId: string) => void;
  renameChat: (chatId: string, newTitle: string) => void;
  
  // Current chat actions
  setCurrentChatId: (chatId: string | null) => void;
  getCurrentChat: () => ChatSession | null;
  updateCurrentChatMessages: (messages: ChatMessage[]) => void;
  
  // Helper methods
  getAllChats: () => ChatSession[];
  getRecentChats: (limit?: number) => ChatSession[];
  searchChats: (query: string) => ChatSession[];
  getChatCount: () => number;
  
  // Utilities
  generateChatTitle: (messages: ChatMessage[]) => string;
  clearAllChats: () => void;
}

export const useChatHistoryStore = create<ChatHistoryState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentChatId: null,
      chatSessions: {},
      isCreatingNewChat: false,

      // Actions
      createNewChat: (title) => {
        const newChatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date();
        
        const newChat: ChatSession = {
          id: newChatId,
          title: title || 'New Chat',
          messages: [],
          createdAt: now,
          updatedAt: now,
          messageCount: 0,
        };

        set((state) => ({
          chatSessions: {
            ...state.chatSessions,
            [newChatId]: newChat,
          },
          currentChatId: newChatId,
          isCreatingNewChat: false,
        }));

        return newChatId;
      },

      saveCurrentChat: (messages) => {
        const state = get();
        if (!state.currentChatId) return;

        const currentChat = state.chatSessions[state.currentChatId];
        if (!currentChat) return;

        const updatedChat: ChatSession = {
          ...currentChat,
          messages,
          updatedAt: new Date(),
          messageCount: messages.length,
          title: currentChat.title === 'New Chat' ? state.generateChatTitle(messages) : currentChat.title,
        };

        set((state) => ({
          chatSessions: {
            ...state.chatSessions,
            [state.currentChatId!]: updatedChat,
          },
        }));
      },

      loadChat: (chatId) => {
        const state = get();
        return state.chatSessions[chatId] || null;
      },

      deleteChat: (chatId) => {
        set((state) => {
          const newSessions = { ...state.chatSessions };
          delete newSessions[chatId];
          
          return {
            chatSessions: newSessions,
            currentChatId: state.currentChatId === chatId ? null : state.currentChatId,
          };
        });
      },

      renameChat: (chatId, newTitle) => {
        set((state) => {
          const chat = state.chatSessions[chatId];
          if (!chat) return state;

          return {
            chatSessions: {
              ...state.chatSessions,
              [chatId]: {
                ...chat,
                title: newTitle,
                updatedAt: new Date(),
              },
            },
          };
        });
      },

      // Current chat actions
      setCurrentChatId: (chatId) => set({ currentChatId: chatId }),

      getCurrentChat: () => {
        const state = get();
        return state.currentChatId ? state.chatSessions[state.currentChatId] || null : null;
      },

      updateCurrentChatMessages: (messages) => {
        const state = get();
        if (state.currentChatId) {
          state.saveCurrentChat(messages);
        }
      },

      // Helper methods
      getAllChats: () => {
        const state = get();
        return Object.values(state.chatSessions).sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      },

      getRecentChats: (limit = 10) => {
        const state = get();
        return state.getAllChats().slice(0, limit);
      },

      searchChats: (query) => {
        const state = get();
        const lowercaseQuery = query.toLowerCase();
        
        return state.getAllChats().filter((chat) =>
          chat.title.toLowerCase().includes(lowercaseQuery) ||
          chat.messages.some((message) =>
            message.content.toLowerCase().includes(lowercaseQuery)
          )
        );
      },

      getChatCount: () => {
        const state = get();
        return Object.keys(state.chatSessions).length;
      },

      // Utilities
      generateChatTitle: (messages) => {
        const userMessages = messages.filter(m => m.role === 'user' && m.content.trim());
        
        if (userMessages.length === 0) return 'New Chat';
        
        const firstMessage = userMessages[0].content.trim();
        
        // Extract the first meaningful sentence or phrase
        const sentences = firstMessage.split(/[.!?]+/);
        const firstSentence = sentences[0].trim();
        
        // Limit to 50 characters and add ellipsis if needed
        if (firstSentence.length > 50) {
          return firstSentence.substring(0, 47) + '...';
        }
        
        return firstSentence || 'New Chat';
      },

      clearAllChats: () => {
        set({
          chatSessions: {},
          currentChatId: null,
        });
      },
    }),
    {
      name: 'chat-history-storage',
      version: 1,
      // Only persist the chat sessions and current chat ID
      partialize: (state) => ({
        chatSessions: state.chatSessions,
        currentChatId: state.currentChatId,
      }),
    }
  )
);