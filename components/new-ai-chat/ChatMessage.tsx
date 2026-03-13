'use client';

import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { GiBee } from 'react-icons/gi';
import { type ChatMessage } from '@/hooks/useClientChat';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface ChatMessageProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

/**
 * Parses thinking blocks from various LLM formats:
 *   <think>, <thinking>, <reason>, <reasoning>, <reflect>, <reflection>
 * Handles both closed blocks and unclosed (mid-stream) blocks.
 * Returns { thinkContent, displayContent, isThinkingInProgress }
 */
const THINK_TAGS = ['thinking', 'think', 'reasoning', 'reason', 'reflection', 'reflect'];
const CLOSED_THINK_RE = new RegExp(
  `<(${THINK_TAGS.join('|')})>([\\s\\S]*?)<\\/\\1>`,
  'i'
);
// FIX: removed ^ anchor — streamed content may have leading whitespace/newlines
// before the opening tag, which caused silently missed matches.
const OPEN_THINK_RE = new RegExp(
  `^\\s*<(${THINK_TAGS.join('|')})>([\\s\\S]*)$`,
  'i'
);

function parseThinkBlocks(raw: string) {
  // Closed thinking block: <think>...</think> (and variants)
  const closedMatch = raw.match(CLOSED_THINK_RE);
  if (closedMatch) {
    const result = {
      thinkContent: closedMatch[2].trim(),
      displayContent: raw.replace(CLOSED_THINK_RE, '').trim(),
      isThinkingInProgress: false,
    };
    console.log(`[Thinking] ✅ Closed think block detected | thinkLen=${result.thinkContent.length} | displayLen=${result.displayContent.length}`);
    return result;
  }

  // Open block (still streaming inside a thinking tag)
  const openMatch = raw.match(OPEN_THINK_RE);
  if (openMatch) {
    console.log(`[Thinking] 🔄 Open (in-progress) think block detected | contentLen=${openMatch[2].length}`);
    return {
      thinkContent: openMatch[2], // don't trim — still coming in
      displayContent: '',
      isThinkingInProgress: true,
    };
  }

  // No think block at all — log once when content is non-trivial
  if (raw.length > 20) {
    console.log(`[Thinking] ℹ️ No think block in content (len=${raw.length}) | starts with: ${JSON.stringify(raw.substring(0, 60))}`);
  }

  return { thinkContent: '', displayContent: raw, isThinkingInProgress: false };
}


export default function ChatMessage({ message, isStreaming = false }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [isThinkingExpanded, setIsThinkingExpanded] = useState(true); // open by default while streaming

  const { data } = useSession();
  const user = data?.user;

  const { thinkContent, displayContent, isThinkingInProgress } = parseThinkBlocks(message.content);
  const hasThinking = !!thinkContent;

  return (
    <div className="group w-full py-5">
      <div className={`max-w-4xl mx-auto px-6 ${isUser ? 'flex justify-end' : 'flex justify-start'}`}>
        <div className={`pt-1 ${isUser ? 'max-w-[80%]' : 'w-full'}`}>
          <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>

            {/* Avatar */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ring-1 ring-inset mt-0.5 ${
              isUser
                ? 'bg-white ring-stone-200 p-0 overflow-hidden'
                : 'bg-emerald-600 ring-emerald-700/30'
            }`}>
              {isUser
                ? <Image width={100} height={100} className='rounded-xl w-full h-full object-cover' src={user?.image || ''} alt={user?.name || ''} />
                : <GiBee className="h-4.5 w-4.5 text-white" />
              }
            </div>

            {/* Message body */}
            <div className="flex-1 min-w-0 space-y-2">

              {/* Sender name */}
              <div className={`flex items-center gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                <span className={`text-xs font-semibold uppercase tracking-widest ${isUser ? 'text-stone-400' : 'text-emerald-700'}`}>
                  {isUser ? (user?.name || 'You') : 'BEE-WELL AI'}
                </span>
              </div>

              {/* Thinking Block — DeepSeek style */}
              {hasThinking && !isUser && (
                <div className={`rounded-xl border overflow-hidden transition-all duration-300 ${
                  isThinkingInProgress
                    ? 'border-emerald-200/60 bg-emerald-50/40'
                    : 'border-stone-200/80 bg-stone-50/60'
                }`}>
                  {/* Header row with toggle */}
                  <button
                    onClick={() => setIsThinkingExpanded(prev => !prev)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left hover:bg-black/[0.03] transition-colors"
                  >
                    {/* Pulsing dot — DeepSeek style */}
                    <span className="relative flex h-2 w-2 flex-shrink-0">
                      {isThinkingInProgress && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      )}
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${isThinkingInProgress ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                    </span>

                    <span className={`text-xs font-medium flex-1 ${isThinkingInProgress ? 'text-emerald-700' : 'text-stone-400'}`}>
                      {isThinkingInProgress ? 'Thinking…' : 'Thought process'}
                    </span>

                    {isThinkingExpanded
                      ? <ChevronUp className="w-3.5 h-3.5 text-stone-300" />
                      : <ChevronDown className="w-3.5 h-3.5 text-stone-300" />
                    }
                  </button>

                  {/* Collapsible content */}
                  {isThinkingExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-stone-100">
                      <p className="text-[0.82rem] leading-6 text-stone-400 whitespace-pre-wrap font-mono">
                        {thinkContent}
                        {isThinkingInProgress && (
                          <span className="inline-flex gap-0.5 ml-1 align-middle">
                            <span className="w-1 h-1 rounded-full bg-stone-300 animate-bounce [animation-delay:0ms]" />
                            <span className="w-1 h-1 rounded-full bg-stone-300 animate-bounce [animation-delay:150ms]" />
                            <span className="w-1 h-1 rounded-full bg-stone-300 animate-bounce [animation-delay:300ms]" />
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Main response text */}
              {displayContent && (
                <div className={`text-[0.97rem] leading-7 ${isUser ? 'text-right' : 'text-left'} ${
                  isUser
                    ? 'bg-stone-100 rounded-2xl px-5 py-3 text-stone-700 inline-block'
                    : 'text-stone-800'
                } whitespace-pre-wrap`}>
                  {displayContent}
                  {/* Blinking cursor while streaming main text */}
                  {isStreaming && !isThinkingInProgress && (
                    <span className="inline-block w-[2px] h-[1.1em] bg-emerald-500 ml-0.5 align-middle animate-pulse rounded-sm" />
                  )}
                </div>
              )}

              {/* Tool invocations */}
              {message.toolInvocations && message.toolInvocations.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {message.toolInvocations.map((tool, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[11px] font-medium text-emerald-700"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{tool.toolName.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}