import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AISettings from './AISettings';

export default function SettingsButton() {
  return (
    <AISettings>
      <Button
        variant="outline"
        size="sm"
        className="bg-gradient-to-r from-neutral-700 rounded-xl px-4 py-6 to-neutral-600 border-0 text-white hover:from-neutral-600 hover:to-neutral-500 shadow-lg transition-all duration-200"
      >
        <Settings className="h-4 w-4" />
      </Button>
    </AISettings>
  );
}