'use client';

import { useEffect, type ChangeEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChatHeader, WelcomeScreen, MessageList, ChatInput } from '@/components/new-ai-chat';
import { useAIChatStore } from '@/stores/aiChatStore';
import { useChatHistoryStore } from '@/stores/chatHistoryStore';
import { useClientChat } from '@/hooks/useClientChat';

export default function AIChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chatIdFromUrl = searchParams.get('chatId');

  const { selectedProvider, selectedModel, initialize } = useAIChatStore();
  const {
    currentChatId,
    setCurrentChatId,
    loadChat,
    createNewChat,
    getCurrentChat,
    updateCurrentChatMessages
  } = useChatHistoryStore();

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useClientChat({
    provider: selectedProvider,
    model: selectedModel,
  });

  // Initialize the store on component mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Handle chat loading from URL or creating new chat
  useEffect(() => {
    if (chatIdFromUrl && chatIdFromUrl !== currentChatId) {
      // Load existing chat from URL
      const chat = loadChat(chatIdFromUrl);
      if (chat) {
        setCurrentChatId(chatIdFromUrl);
        setMessages(chat.messages);
      } else {
        // Chat not found, redirect to clean AI chat page
        router.replace('/ai-chat');
      }
    } else if (!chatIdFromUrl && !currentChatId) {
      // No chat specified and no current chat, create new one
      const newChatId = createNewChat();
      router.replace(`/ai-chat?chatId=${newChatId}`);
    } else if (!chatIdFromUrl && currentChatId) {
      // No chat in URL but we have a current chat, update URL
      router.replace(`/ai-chat?chatId=${currentChatId}`);
    }
  }, [chatIdFromUrl, currentChatId, loadChat, setCurrentChatId, createNewChat, setMessages, router]);

  // Save messages to chat history whenever messages change
  useEffect(() => {
    if (messages.length > 0 && currentChatId) {
      updateCurrentChatMessages(messages as any);
    }
  }, [messages, currentChatId, updateCurrentChatMessages]);

  return (
    <div className="h-screen bg-[#FAFAF9] text-stone-900 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] pointer-events-none mix-blend-multiply z-0"></div>

      {/* Main chat area - full width */}
      <div className="flex-1 flex flex-col min-h-0 z-10 relative">
        <ChatHeader />

        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto scroll-smooth relative">
          {/* Top gradient inside the scroll area so header stays crisp */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#FAFAF9] to-transparent pointer-events-none z-10"></div>

          {messages.length === 0 ? (
            <WelcomeScreen />
          ) : (
            <MessageList messages={messages} isLoading={isLoading} />
          )}
        </div>

        <ChatInput
          input={input}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
