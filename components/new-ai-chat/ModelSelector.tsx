import { Brain, Cpu, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAIChatStore } from '@/stores/aiChatStore';

export default function ModelSelector() {
  const {
    selectedProvider,
    selectedModel,
    setSelectedProvider,
    setSelectedModel,
    getCurrentModels,
    getAllModelOptions,
    ollamaModels
  } = useAIChatStore();

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google': return <Sparkles className="h-4 w-4 round" />;
      case 'ollama': return <Cpu className="h-4 w-4 round" />;
      default: return <Sparkles className="h-4 w-4 round" />;
    }
  };

  const handleModelChange = (value: string) => {
    const [provider, model] = value.split(':');
    setSelectedProvider(provider as 'google' | 'ollama');
    setSelectedModel(model);
  };

  const currentModels = getCurrentModels();
  const allModelOptions = getAllModelOptions();

  return (
    <div className="relative">
      <Select 
        value={`${selectedProvider}:${selectedModel}`} 
        onValueChange={handleModelChange}
      >
        <SelectTrigger className="h-8 border-0 bg-stone-100/50 hover:bg-stone-100 focus:ring-0 focus:ring-offset-0 px-3 text-stone-600 rounded-lg transition-colors gap-2 w-auto">
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-4 h-4 rounded text-xs ${selectedProvider === 'google' ? 'text-blue-600' : 'text-emerald-600'}`}>
              {getProviderIcon(selectedProvider)}
            </div>
            <span className="font-medium text-xs truncate max-w-[100px]">
              {currentModels.find(m => m.id === selectedModel)?.name || selectedModel}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white/95 backdrop-blur-xl border-stone-100 shadow-xl rounded-xl p-1 min-w-[240px]" align="start">
          
          <div className="px-3 py-2 text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">
            Google Gemini
          </div>
          {allModelOptions.filter(m => m.provider === 'google').map((model) => (
            <SelectItem 
              key={`google:${model.id}`} 
              value={`google:${model.id}`} 
              className="rounded-xl text-stone-700 focus:bg-stone-50 focus:text-stone-900 cursor-pointer p-2 mb-1 last:mb-0"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-medium text-sm">{model.name}</span>
                  {model.description && <span className="text-[10px] text-stone-400">{model.description}</span>}
                </div>
              </div>
            </SelectItem>
          ))}
          
          {ollamaModels.length > 0 && (
            <>
              <div className="px-3 py-2 text-xs font-bold text-stone-400 uppercase tracking-wider mb-1 mt-2 border-t border-stone-100 pt-3">
                Ollama (Local)
              </div>
              {allModelOptions.filter(m => m.provider === 'ollama').map((model) => (
                <SelectItem 
                  key={`ollama:${model.id}`} 
                  value={`ollama:${model.id}`} 
                  className="rounded-xl text-stone-700 focus:bg-stone-50 focus:text-stone-900 cursor-pointer p-2 mb-1 last:mb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                      <Cpu className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-medium text-sm">{model.name}</span>
                      {model.description && <span className="text-[10px] text-stone-400">{model.description}</span>}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}