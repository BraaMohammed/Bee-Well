import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AISettings from './AISettings';

export default function SettingsButton() {
  return (
    <AISettings>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-all"
        title="Settings"
      >
        <SlidersHorizontal className="h-5 w-5" strokeWidth={1.5} />
      </Button>
    </AISettings>
  );
}