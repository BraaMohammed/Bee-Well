import { User, Zap, CheckCircle2 } from 'lucide-react';
import { GiBee } from "react-icons/gi";
import { type ChatMessage } from '@/actions/chatWithAI';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface ChatMessageProps {
  message: ChatMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  const {data} = useSession()
  const user  = data?.user
  return (
    <div className="group w-full py-6">
      <div className={`max-w-4xl mx-auto px-6 ${isUser ? 'flex justify-end' : 'flex justify-start'}`}>
        <div className="pt-1">
          <div className={`p-3 rounded-lg ${isUser ? 'bg-stone-100' : 'bg-stone-50'} flex gap-3 ${isUser ? 'flex-row-reverse' : ''} inline-flex`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ring-1 ring-inset ${
              isUser 
                ? 'bg-white text-stone-500 ring-stone-200' 
                : 'bg-emerald-600 text-emerald-600/20'
            }`}>
              {isUser ? <Image width={100} height={100} className=' rounded-lg' src={user?.image || ''} alt={user?.name || ''} /> : <GiBee className="h-4 w-4 text-white" />}
            </div>

            <div>
              <div className={`flex items-center gap-2 mb-1.5 opacity-100 transition-opacity duration-200 ${isUser ? 'justify-end' : 'justify-start'}`}>
                <span className={`text-xs font-medium tracking-wide ${isUser ? 'text-stone-400' : 'text-emerald-600/80'}`}>
                  {isUser ? `${user?.name}` : 'BEE-WELL AI'}
                </span>
              </div>
              
              <div className={`prose prose-stone max-w-none text-[0.98rem] leading-7 ${isUser ? 'text-right' : 'text-left'} ${
                isUser ? 'text-stone-700' : 'text-stone-800'
              }`}>
                {message.content}
              </div>

              {message.toolInvocations && message.toolInvocations.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {message.toolInvocations.map((tool, index) => (
                      <div key={index} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-md text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        <span>Used {tool.toolName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}