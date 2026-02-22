import { Sprout, StickyNote, CalendarCheck, NotebookPen } from 'lucide-react';
import { useAISettingsStore } from '@/stores/aiSettingsStore';

export default function WelcomeScreen() {
  const { dataAccess, getEnabledDataSources } = useAISettingsStore();
  const enabledSources = getEnabledDataSources();

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-emerald-100/40 to-teal-100/40 blur-[120px] mix-blend-multiply animate-pulse-slow pointer-events-none"></div>
      
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        <div className="mb-8 p-4 bg-white/80 rounded-2xl shadow-sm ring-1 ring-emerald-900/5">
          <Sprout className="h-10 w-10 text-emerald-600" strokeWidth={1.5} />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4 text-stone-800 tracking-tight">
          How can I help you <span className="text-emerald-600 italic">thrive</span> today?
        </h2>
        
        <p className="text-stone-500 mb-10 text-lg leading-relaxed font-light max-w-md mx-auto">
          I'm connected to your personal data to provide tailored insights.
        </p>

        {/* Data access indicator */}
        <div className="inline-flex flex-wrap justify-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
            dataAccess.notes 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' 
              : 'bg-stone-50 text-stone-400 border-stone-200 dashed'
          }`}>
            <StickyNote className="h-3.5 w-3.5" strokeWidth={1.5} />
            Notes
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
            dataAccess.habits 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' 
              : 'bg-stone-50 text-stone-400 border-stone-200 dashed'
          }`}>
            <CalendarCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
            Habits
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
            dataAccess.journal 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' 
              : 'bg-stone-50 text-stone-400 border-stone-200 dashed'
          }`}>
            <NotebookPen className="h-3.5 w-3.5" strokeWidth={1.5} />
            Journal
          </div>
        </div>
        
        {enabledSources.length === 0 && (
          <p className="text-center text-xs text-amber-600 mt-4 bg-amber-50 px-3 py-1 rounded-full border border-amber-100/50">
            Enable data access in settings for personalized help
          </p>
        )}
      </div>
    </div>
  );
}