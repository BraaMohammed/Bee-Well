import { MessageSquarePlus, Settings2, PanelLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useChatHistoryStore } from '@/stores/chatHistoryStore';
import SettingsButton from './SettingsButton';

import { Button } from '@/components/ui/button';

export default function ChatHeader() {
  const router = useRouter();
  const { createNewChat } = useChatHistoryStore();

  const handleNewChat = () => {
    const newChatId = createNewChat();
    router.push(`/ai-chat?chatId=${newChatId}`);
  };

  return (
    <div className="px-6 py-4 flex-shrink-0 z-250">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
           {/* Mobile menu trigger could go here */}
          <h1 className="text-xl font-serif font-semibold text-stone-900 tracking-tight">
            Bee-Well <span className="text-emerald-600 font-bold italic ml-0.5">AI</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={handleNewChat}
            variant="ghost"
            className="text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl h-10 px-3 transition-all"
            title="New Chat"
          >
            <MessageSquarePlus className="w-5 h-5" strokeWidth={1.5} />
          </Button>
          <SettingsButton />
        </div>
      </div>
    </div>
  );
}