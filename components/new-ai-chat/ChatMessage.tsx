import { User, BrainCog, Zap } from 'lucide-react';
import { type ChatMessage } from '@/actions/chatWithAI';

interface ChatMessageProps {
  message: ChatMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`px-6 py-8 ${isUser ? '' : 'bg-white/20'}`}>
      <div className="max-w-5xl mx-auto flex gap-6">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
          isUser 
            ? 'bg-gradient-to-br from-neutral-700 to-neutral-600 text-white shadow-neutral-500/25' 
            : 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-green-500/25'
        }`}>
          {isUser ? <User className="h-5 w-5" /> : <BrainCog className="h-5 w-5" />}
        </div>
        <div className="flex-1 space-y-3 pt-1">
          <div className={`prose prose-neutral dark:prose-invert max-w-none text-neutral-950 text-base leading-relaxed ${isUser ? 'font-medium' : ''}`}>
            {message.content}
          </div>
          {message.toolInvocations && message.toolInvocations.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {message.toolInvocations.map((tool, index) => (
                <span key={index} className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-xl text-sm font-medium border border-green-200/60 shadow-sm">
                  <Zap className="h-4 w-4" />
                  {tool.toolName}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}