import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type ChangeEvent, type KeyboardEvent, type FormEvent } from 'react';
import ModelSelector from './ModelSelector';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function ChatInput({ input, isLoading, onInputChange, onSubmit }: ChatInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as any as FormEvent<HTMLFormElement>);
    }
  };

  return (
    <div className="p-6 md:pb-12 flex-shrink-0 z-20">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={onSubmit} className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-[28px] blur opacity-0 group-hover:opacity-100 transition duration-1000 group-focus-within:opacity-100"></div>
          <div className="relative bg-white/90 backdrop-blur-xl rounded-[26px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 overflow-hidden ring-1 ring-black/5 flex flex-col">
            <textarea
              value={input}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="w-full bg-transparent border-0 px-6 py-5 pr-16 text-stone-800 placeholder-stone-400 resize-none max-h-48 focus:outline-none focus:ring-0 text-[1.05rem] leading-relaxed font-light font-sans tracking-wide min-h-[64px]"
              rows={1}
              disabled={isLoading}
            />
            
            <div className="flex justify-between items-center px-4 pb-3 pt-1">
              <div className="flex items-center gap-2">
                 <ModelSelector />
              </div>

              <div className="flex items-center gap-2">
                 {/* Right side actions could go here (attach, etc) */}
              </div>
            </div>

            <div className="absolute right-3 bottom-3">
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="h-9 w-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:bg-stone-200 disabled:text-stone-400 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
                )}
              </Button>
            </div>
          </div>
          <div className="text-center mt-3 text-xs text-stone-400 font-medium tracking-wide">
            Bee-Well AI can make mistakes. Check important info.
          </div>
        </form>
      </div>
    </div>
  );
}