'use client';

import { GiBee } from 'react-icons/gi';

export default function LoadingIndicator() {
  return (
    <div className="w-full py-5">
      <div className="max-w-4xl mx-auto px-6 flex gap-4">
        {/* Avatar matching AI messages */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-emerald-600 ring-1 ring-inset ring-emerald-700/30 shadow-sm mt-0.5">
          <GiBee className="h-4.5 w-4.5 text-white" />
        </div>

        <div className="flex-1 space-y-2 pt-1.5">
          {/* Sender label */}
          <div className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
            BEE-WELL AI
          </div>

          {/* DeepSeek-style thinking block placeholder */}
          <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/40 px-4 py-2.5 flex items-center gap-2.5">
            {/* Pulsing dot */}
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-emerald-700">Thinking…</span>
            {/* Animated dots */}
            <span className="inline-flex gap-1 ml-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-bounce [animation-delay:300ms]" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}