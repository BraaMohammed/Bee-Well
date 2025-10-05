import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useChatHistoryStore } from '@/stores/chatHistoryStore';
import ModelSelector from './ModelSelector';
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
    <div className="px-6 py-4 flex-shrink-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Button
          onClick={handleNewChat}
          variant="outline"
          className="border-neutral-400 bg-white/50 rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
        <div className="flex items-center gap-2">
          <ModelSelector />
          <SettingsButton />
        </div>
      </div>
    </div>
  );
}