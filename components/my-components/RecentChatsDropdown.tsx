import React, { useState } from 'react';
import { MessageCircle, Plus, Trash2, Edit2, ChevronDown } from 'lucide-react';
import { useChatHistoryStore } from '@/stores/chatHistoryStore';
import { usePathname, useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';

interface RecentChatsDropdownProps {
  onNavigateToChat: (chatId: string) => void;
}

export default function RecentChatsDropdown({ onNavigateToChat }: RecentChatsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [newChatName, setNewChatName] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  const {
    getAllChats,
    searchChats,
    createNewChat,
    deleteChat,
    renameChat,
    currentChatId,
    getChatCount,
  } = useChatHistoryStore();

  const chats = searchQuery ? searchChats(searchQuery) : getAllChats();
  const recentChats = chats.slice(0, 20); // Show max 20 recent chats

  const handleCreateNewChat = () => {
    const newChatId = createNewChat();
    onNavigateToChat(newChatId);
    setIsOpen(false);
  };

  const handleChatClick = (chatId: string) => {
    onNavigateToChat(chatId);
    setIsOpen(false);
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this chat?')) {
      deleteChat(chatId);
    }
  };

  const handleOpenRenameDialog = (chatId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingChatId(chatId);
    setNewChatName(currentTitle);
    setIsRenameDialogOpen(true);
  };

  const handleConfirmRename = () => {
    if (renamingChatId && newChatName.trim()) {
      renameChat(renamingChatId, newChatName.trim());
      setIsRenameDialogOpen(false);
      setRenamingChatId(null);
      setNewChatName('');
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return new Date(date).toLocaleDateString();
  };

  const isAIChatActive = pathname.startsWith('/ai-chat');

  return (
    <div className="relative ">
      {/* AI Agent Button */}
      <div
        className={`flex items-center justify-between w-full p-2 h-auto rounded-xl gap-3 transition-all duration-200 cursor-pointer ${isAIChatActive
          ? 'bg-neutral-600/50 text-white'
          : 'text-white/90 hover:text-white hover:bg-neutral-600/50'
          }`}
      >
        <div
          onClick={() => router.push('/ai-chat')}
          className="flex items-center gap-3 flex-1"
        >
          <MessageCircle size={18} />
          <span className="text-sm font-medium">AI Agent</span>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="flex items-center justify-center p-0.5 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ChevronDown
            className={`transform transition-transform hover:rounded-full duration-200 ${isOpen ? 'rotate-180' : ''}`}
            size={18}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="mt-1 flex flex-col gap-1">
          {recentChats.length === 0 ? (
            <div className="text-sm text-center w-full rounded-xl px-3 py-2 text-white/60 font-medium">
              No chat history yet
            </div>
          ) : (
            recentChats.map((chat) => (
              <div
                key={chat.id}
                className={`group relative text-sm w-full rounded-xl px-3 py-2 cursor-pointer transition-all duration-200 font-medium flex items-center justify-between ${currentChatId === chat.id
                  ? 'bg-neutral-600/50 text-white'
                  : 'text-white/80 hover:bg-neutral-600/50 hover:text-white'
                  }`}
              >
                <div
                  onClick={() => handleChatClick(chat.id)}
                  className="flex-1 text-left truncate pr-2"
                >
                  {chat.title}
                </div>

                {/* Edit and Delete Buttons - Show on hover */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => handleOpenRenameDialog(chat.id, chat.title, e)}
                    className="p-1 hover:bg-green-500/20 rounded-full flex-shrink-0"
                    title="Rename chat"
                  >
                    <Edit2 size={14} className="text-green-400 hover:text-green-300" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="p-1 hover:bg-red-500/20 rounded-full flex-shrink-0"
                    title="Delete chat"
                  >
                    <Trash2 size={14} className="text-red-400 hover:text-red-300" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Rename Chat Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="bg-neutral-800 border border-neutral-700 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-white">Rename Chat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              placeholder="Enter new chat name"
              className="bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 rounded-xl"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConfirmRename();
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setIsRenameDialogOpen(false);
                setRenamingChatId(null);
                setNewChatName('');
              }}
              className="px-4 py-2 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRename}
              disabled={!newChatName.trim()}
              className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}