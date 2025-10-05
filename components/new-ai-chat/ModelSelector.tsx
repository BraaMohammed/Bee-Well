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
    <div className="relative !ease-in-out !duration-300">
      <Select 
        value={`${selectedProvider}:${selectedModel}`} 
        onValueChange={handleModelChange}     
        
        >
        <SelectTrigger className="w-72 h-12 bg-gradient-to-r !ease-in-out  from-neutral-700 to-neutral-600 border-0 text-white hover:from-neutral-600 hover:to-neutral-500 focus:ring-2 focus:ring-green-500/50 shadow-lg rounded-xl transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white/20 rounded-xl">
              {getProviderIcon(selectedProvider)}
            </div>
            <span className="font-semibold">
              {currentModels.find(m => m.id === selectedModel)?.name || selectedModel}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200/60 w-72 shadow-2xl rounded-2xl p-2">
          {/* Google Gemini Models */}
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50/80 rounded-lg mb-1">
            Google Gemini
          </div>
          {allModelOptions.filter(m => m.provider === 'google').map((model) => (
            <SelectItem key={`google:${model.id}`} value={`google:${model.id}`} className="text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl p-3 cursor-pointer transition-all duration-200">
              <div className="flex items-center gap-3 w-full">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{model.name}</div>
                  <div className="text-xs text-gray-500">{model.description}</div>
                </div>
              </div>
            </SelectItem>
          ))}
          
          {/* Ollama Models */}
          {ollamaModels.length > 0 && (
            <>
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50/80 rounded-lg mb-1 mt-2">
                Ollama (Local)
              </div>
              {allModelOptions.filter(m => m.provider === 'ollama').map((model) => (
                <SelectItem key={`ollama:${model.id}`} value={`ollama:${model.id}`} className="text-gray-900 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-xl p-3 cursor-pointer transition-all duration-200">
                  <div className="flex items-center gap-3 w-full">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Cpu className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{model.name}</div>
                      <div className="text-xs text-gray-500">{model.description}</div>
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