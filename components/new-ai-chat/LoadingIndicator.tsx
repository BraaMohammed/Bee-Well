import { BrainCog } from 'lucide-react';

export default function LoadingIndicator() {
  return (
    <div className="px-6 py-8 bg-gradient-to-r from-gray-50/80 to-slate-50/80">
      <div className="max-w-5xl mx-auto flex gap-6">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25">
          <BrainCog className="h-5 w-5" />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-500 border-t-transparent"></div>
          <span className="text-gray-700 font-medium">Thinking...</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}