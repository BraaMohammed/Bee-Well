import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type ChangeEvent, type KeyboardEvent, type FormEvent } from 'react';

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
    <div className="border-t border-neutral-400/60 p-6 bg-neutral-300 flex-shrink-0">
      <div className="max-w-5xl mx-auto">
        <form onSubmit={onSubmit} className="relative">
          <div className="relative bg-white rounded-2xl shadow-lg border border-neutral-200/60 overflow-hidden">
            <textarea
              value={input}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Message Bee-Well AI..."
              className="w-full bg-transparent border-0 px-6 py-4 pr-20 text-neutral-900 placeholder-neutral-500 resize-none max-h-32 focus:outline-none text-base leading-relaxed"
              rows={1}
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:bg-neutral-400 disabled:cursor-not-allowed rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:scale-100"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}