import React, { useState } from 'react';
import { MessageCircle, Plus, Trash2, Edit2, Search, ChevronDown } from 'lucide-react';
import { useChatHistoryStore } from '@/stores/chatHistoryStore';
import { usePathname } from 'next/navigation';

interface RecentChatsDropdownProps {
  onNavigateToChat: (chatId: string) => void;
}

export default function RecentChatsDropdown({ onNavigateToChat }: RecentChatsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const pathname = usePathname();

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

  const handleStartEdit = (chatId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(chatId);
    setEditTitle(currentTitle);
  };

  const handleSaveEdit = (chatId: string) => {
    if (editTitle.trim()) {
      renameChat(chatId, editTitle.trim());
    }
    setEditingChatId(null);
    setEditTitle('');
  };

  const handleCancelEdit = () => {
    setEditingChatId(null);
    setEditTitle('');
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
    <div className="relative">
      {/* AI Agent Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full p-3 h-auto !rounded-xl gap-3 transition-all duration-200 cursor-pointer ${
          isAIChatActive
            ? 'bg-gradient-to-r from-neutral-800/50 to-neutral-700/50 text-white'
            : 'text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-neutral-800/50 hover:to-neutral-700/50'
        }`}
      >
        <div className="flex items-center gap-3">
          <MessageCircle size={20} />
          <span className="text-base font-medium">AI Agent</span>
        </div>
        <ChevronDown 
          className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          size={20} 
        />
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
                className={`group relative text-sm w-full rounded-xl px-3 py-2 cursor-pointer transition-all duration-200 font-medium flex items-center justify-between ${
                  currentChatId === chat.id
                    ? 'bg-gradient-to-r from-neutral-500/50 to-neutral-600/50 text-white'
                    : 'text-white/80 hover:bg-gradient-to-r hover:from-neutral-500/50 hover:to-neutral-600/50 hover:text-white'
                }`}
              >
                <div 
                  onClick={() => handleChatClick(chat.id)}
                  className="flex-1 text-left truncate pr-2"
                >
                  {chat.title}
                </div>
                
                {/* Delete Button - Shows on hover */}
                <button
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-500/20 rounded-lg flex-shrink-0"
                  title="Delete chat"
                >
                  <Trash2 size={14} className="text-red-400 hover:text-red-300" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}