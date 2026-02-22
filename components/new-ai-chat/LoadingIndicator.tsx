import { Sparkles, Loader2 } from 'lucide-react';

export default function LoadingIndicator() {
  return (
    <div className="w-full py-6 bg-stone-50/50">
      <div className="max-w-4xl mx-auto px-6 flex gap-6 md:gap-8">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ring-1 ring-inset bg-emerald-600 text-emerald-50 ring-emerald-600/20">
          <Sparkles className="h-4 w-4 animate-pulse" strokeWidth={1.5} />
        </div>
        
        <div className="flex items-center gap-3 pt-1">
          <span className="text-stone-400 text-xs font-medium uppercase tracking-wider animate-pulse flex items-center gap-2">
            Thinking
            <Loader2 className="h-3 w-3 animate-spin" />
          </span>
        </div>
      </div>
    </div>
  );
}