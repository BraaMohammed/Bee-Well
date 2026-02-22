import { Zap, HardDrive, ChevronDown } from 'lucide-react';
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
      case 'google': return <Zap className="h-3.5 w-3.5" strokeWidth={2.5} />;
      case 'ollama': return <HardDrive className="h-3.5 w-3.5" strokeWidth={2.5} />;
      default: return <Zap className="h-3.5 w-3.5" strokeWidth={2.5} />;
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
        <SelectTrigger className="h-9 border-0 bg-stone-100 hover:bg-stone-200/60 focus:ring-0 focus:ring-offset-0 px-3 pl-3.5 text-stone-600 rounded-full transition-all gap-2 w-auto shadow-sm ring-1 ring-stone-200/50">
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] ${selectedProvider === 'google' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
              {getProviderIcon(selectedProvider)}
            </div>
            <span className="font-semibold text-xs truncate max-w-[120px] tracking-tight">
              {currentModels.find(m => m.id === selectedModel)?.name || selectedModel}
            </span>
            <ChevronDown className="h-3 w-3 text-stone-400 opacity-50" strokeWidth={2.5} />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white/95 backdrop-blur-xl border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl p-2 min-w-[260px] ml-2" align="start">
          
          <div className="px-3 py-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
            Cloud (Gemini)
          </div>
          {allModelOptions.filter(m => m.provider === 'google').map((model) => (
            <SelectItem 
              key={`google:${model.id}`} 
              value={`google:${model.id}`} 
              className="rounded-xl text-stone-700 focus:bg-stone-50 focus:text-stone-900 cursor-pointer p-2 mb-1 last:mb-0"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg ring-1 ring-blue-100">
                  <Zap className="h-3.5 w-3.5" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-xs">{model.name}</span>
                  {model.description && <span className="text-[10px] text-stone-400 font-medium">{model.description}</span>}
                </div>
              </div>
            </SelectItem>
          ))}
          
          {ollamaModels.length > 0 && (
            <>
              <div className="px-3 py-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1 mt-2 border-t border-stone-100 pt-3">
                Local (Ollama)
              </div>
              {allModelOptions.filter(m => m.provider === 'ollama').map((model) => (
                <SelectItem 
                  key={`ollama:${model.id}`} 
                  value={`ollama:${model.id}`} 
                  className="rounded-xl text-stone-700 focus:bg-stone-50 focus:text-stone-900 cursor-pointer p-2 mb-1 last:mb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg ring-1 ring-orange-100">
                      <HardDrive className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-semibold text-xs">{model.name}</span>
                      {model.description && <span className="text-[10px] text-stone-400 font-medium">{model.description}</span>}
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