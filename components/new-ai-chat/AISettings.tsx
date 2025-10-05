'use client';

import { useState } from 'react';
import { Settings, Database, FileText, Calendar, BookOpen, RotateCcw, Sparkles, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAISettingsStore } from '@/stores/aiSettingsStore';
import { useAIChatStore } from '@/stores/aiChatStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AISettingsProps {
  children: React.ReactNode;
}

export default function AISettings({ children }: AISettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    dataAccess,
    customPrompt,
    setDataAccess,
    setCustomPrompt,
    resetToDefaults,
    getEnabledDataSources,
    hasAnyDataAccess,
  } = useAISettingsStore();

  const {
    selectedProvider,
    selectedModel,
    setSelectedProvider,
    setSelectedModel,
    getCurrentModels,
    getAllModelOptions,
  } = useAIChatStore();

  const handleReset = () => {
    resetToDefaults();
  };

  const handleModelChange = (value: string) => {
    const [provider, model] = value.split(':');
    setSelectedProvider(provider as 'google' | 'ollama');
    setSelectedModel(model);
  };

  const dataSourcesConfig = [
    {
      key: 'notes' as const,
      label: 'Notes',
      description: 'Access your notes and labels for context and suggestions',
      icon: FileText,
      color: 'text-blue-500',
    },
    {
      key: 'habits' as const,
      label: 'Habit Tracker',
      description: 'Access habit data for personalized recommendations',
      icon: Calendar,
      color: 'text-green-500',
    },
    {
      key: 'journal' as const,
      label: 'Journal Entries',
      description: 'Access journal entries for deeper insights and patterns',
      icon: BookOpen,
      color: 'text-purple-500',
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl scrollbar-webkit !rounded-xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-neutral-800 to-neutral-900 text-white border-neutral-600">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-white">
            <div className="p-2 bg-gradient-to-r from-green-600 to-green-700 rounded-xl">
              <Settings className="h-6 w-6 text-white" />
            </div>
            AI Agent Settings
          </DialogTitle>
          <DialogDescription className="text-neutral-300 text-base">
            Configure how your AI agent behaves and what data it can access.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* Model Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-neutral-600 to-neutral-700 rounded-xl">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Model Selection</h3>
            </div>
            <p className="text-neutral-300">
              Choose your preferred AI model and provider.
            </p>
            
            <div className="bg-neutral-700/50 p-4 rounded-xl border border-neutral-600">
              <div className="space-y-3">
                <Label className="text-white font-medium">AI Provider & Model</Label>
                <Select 
                  value={`${selectedProvider}:${selectedModel}`} 
                  onValueChange={handleModelChange}
                >
                  <SelectTrigger className="bg-neutral-600 border-neutral-500 rounded-xl text-white">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-white/20 rounded-xl">
                        {selectedProvider === 'google' && <Sparkles className="h-4 w-4" />}
                        {selectedProvider === 'ollama' && <Cpu className="h-4 w-4" />}
                      </div>
                      <span>{getCurrentModels().find(m => m.id === selectedModel)?.name || selectedModel}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-700 border-neutral-600  rounded-xl">
                    {getAllModelOptions().map((model) => (
                      <SelectItem 
                        key={`${model.provider}:${model.id}`} 
                        value={`${model.provider}:${model.id}`}
                        className="text-white hover:bg-neutral-600"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-white/20 rounded-xl">
                            {model.provider === 'google' && <Sparkles className="h-4 w-4" />}
                            {model.provider === 'ollama' && <Cpu className="h-4 w-4" />}
                          </div>
                          <div>
                            <div className="font-medium">{model.name}</div>
                            <div className="text-xs text-neutral-400">{model.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator className="bg-neutral-600" />

          {/* Data Access Permissions */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-neutral-600 to-neutral-700 rounded-xl">
                <Database className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Data Access Permissions</h3>
            </div>
            <p className="text-neutral-300">
              Control which data sources the AI can access for personalized assistance.
            </p>
            
            <div className="space-y-3">
              {dataSourcesConfig.map((source) => (
                <div key={source.key} className="bg-neutral-700/50 border border-neutral-600 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-gradient-to-r from-neutral-600 to-neutral-700 rounded-xl">
                        <source.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={source.key} className="text-white font-medium text-base cursor-pointer">
                          {source.label}
                        </Label>
                        <p className="text-neutral-300 text-sm">{source.description}</p>
                      </div>
                    </div>
                    <Switch
                      id={source.key}
                      checked={dataAccess[source.key]}
                      onCheckedChange={(checked: boolean) => setDataAccess(source.key, checked)}
                      className="mt-2"
                    />
                  </div>
                </div>
              ))}
            </div>

            {!hasAnyDataAccess() && (
              <div className="p-4 rounded-xl bg-neutral-800/60 border border-amber-700/50">
                <p className="text-amber-300 text-sm">
                  ⚠️ No data sources are enabled. The AI will have limited ability to provide personalized assistance.
                </p>
              </div>
            )}

            {hasAnyDataAccess() && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-700/50">
                <p className="text-green-200 text-sm">
                  ✅ AI can access: <span className="font-medium">{getEnabledDataSources().join(', ')}</span>
                </p>
              </div>
            )}
          </div>

          <Separator className="bg-neutral-600" />

          {/* Custom Instructions */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-neutral-600 to-neutral-700 rounded-xl">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Custom Instructions</h3>
            </div>
            
            <div className="bg-neutral-700/50 border border-neutral-600 rounded-xl p-4 space-y-4">
              <div>
                <p className="text-neutral-300 text-sm mb-3">
                  Add custom instructions to personalize how the AI responds to you.
                </p>
                <Label htmlFor="custom-prompt" className="text-white font-medium">Your Instructions</Label>
              </div>
              
              <Textarea
                id="custom-prompt"
                placeholder="e.g., Be direct and concise, focus on actionable advice, be encouraging but honest..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[120px] resize-none rounded-xl bg-neutral-600 border-neutral-500 text-white placeholder:text-neutral-400 focus:border-green-500"
                maxLength={500}
              />
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">These instructions will be added to the AI's system prompt</span>
                <span className="text-neutral-400">{customPrompt.length}/500</span>
              </div>

              {customPrompt.trim() && (
                <div className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-600">
                  <p className="text-neutral-300 text-sm">
                    <strong>Preview:</strong> The AI will receive these instructions along with your messages.
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-neutral-600" />

          {/* Reset Options */}
          <div className="flex items-center justify-between bg-neutral-700/50 border border-neutral-600 rounded-xl p-4">
            <div>
              <h4 className="font-semibold text-white text-lg">Reset Settings</h4>
              <p className="text-neutral-300 text-sm">Restore all settings to their default values</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center rounded-xl gap-2 border-neutral-500 text-white hover:bg-neutral-600"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Defaults
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-600">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="border-neutral-500 text-white rounded-xl hover:bg-neutral-600"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => setIsOpen(false)} 
            className="bg-gradient-to-r rounded-xl from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white shadow-lg"
          >
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}