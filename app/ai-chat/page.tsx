'use client';

import { useEffect, useState, type ChangeEvent, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChatHeader, WelcomeScreen, MessageList, ChatInput } from '@/components/new-ai-chat';
import { useAIChatStore } from '@/stores/aiChatStore';
import { useChatHistoryStore } from '@/stores/chatHistoryStore';
import { useClientChat } from '@/hooks/useClientChat';

function AIChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chatIdFromUrl = searchParams.get('chatId');
  const [isHydrated, setIsHydrated] = useState(false);
  const [loadedChatId, setLoadedChatId] = useState<string | null>(null);

  const { selectedProvider, selectedModel, initialize } = useAIChatStore();
  const {
    currentChatId,
    setCurrentChatId,
    loadChat,
    createNewChat,
    getCurrentChat,
    updateCurrentChatMessages,
  } = useChatHistoryStore();

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useClientChat({
    provider: selectedProvider,
    model: selectedModel,
  });

  // Initialize the store on component mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Check hydration using Zustand's persist API
  useEffect(() => {
    // If it's already hydrated, set it to true immediately
    if (useChatHistoryStore.persist.hasHydrated()) {
      setIsHydrated(true);
      return;
    }

    // Otherwise, listen for when hydration finishes
    const unsubFinishHydration = useChatHistoryStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    return () => {
      unsubFinishHydration();
    };
  }, []);

  // Handle chat loading from URL or creating new chat
  useEffect(() => {
    // Wait until store is hydrated from localStorage
    if (!isHydrated) return;

    if (chatIdFromUrl) {
      if (loadedChatId !== chatIdFromUrl) {
        // Load existing chat from URL
        const chat = loadChat(chatIdFromUrl);
        if (chat) {
          setCurrentChatId(chatIdFromUrl);
          setMessages(chat.messages);
          setLoadedChatId(chatIdFromUrl);
        } else {
          // Chat not found, redirect to clean AI chat page
          router.replace('/ai-chat');
        }
      }
    } else if (!currentChatId) {
      // No chat specified and no current chat, create new one
      const newChatId = createNewChat();
      router.replace(`/ai-chat?chatId=${newChatId}`);
    } else if (currentChatId) {
      // No chat in URL but we have a current chat, check if it's valid
      const chat = loadChat(currentChatId);
      if (chat) {
        router.replace(`/ai-chat?chatId=${currentChatId}`);
      } else {
        // currentChatId points to a non-existent chat, create a new one instead
        const newChatId = createNewChat();
        router.replace(`/ai-chat?chatId=${newChatId}`);
      }
    }
  }, [chatIdFromUrl, currentChatId, isHydrated, loadChat, setCurrentChatId, createNewChat, setMessages, router, loadedChatId]);

  // Emergency fallback: if nothing loads after 5 seconds, create a new chat
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!messages.length && !chatIdFromUrl) {
        const newChatId = createNewChat();
        router.replace(`/ai-chat?chatId=${newChatId}`);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [messages.length, chatIdFromUrl, createNewChat, router]);

  // Save messages to chat history whenever messages change
  useEffect(() => {
    // Only save if messages are not empty AND they belong to the correctly loaded chat
    if (messages.length > 0 && currentChatId && currentChatId === loadedChatId) {
      updateCurrentChatMessages(messages as any);
    }
  }, [messages, currentChatId, updateCurrentChatMessages, loadedChatId]);

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

export default function AIChatPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#FAFAF9] flex items-center justify-center text-stone-500 font-medium">Loading chat...</div>}>
      <AIChatContent />
    </Suspense>
  );
}
