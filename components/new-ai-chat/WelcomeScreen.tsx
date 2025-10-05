import { BrainCog, FileText, Calendar, BookOpen } from 'lucide-react';
import { useAISettingsStore } from '@/stores/aiSettingsStore';

export default function WelcomeScreen() {
  const { dataAccess, getEnabledDataSources } = useAISettingsStore();
  const enabledSources = getEnabledDataSources();

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <div className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl mb-8 shadow-2xl shadow-green-500/25">
        <BrainCog className="h-16 w-16 text-white" />
      </div>
      <h2 className="text-4xl font-bold mb-4 text-neutral-950">
        Unlock Your Potential with Bee-Well AI
      </h2>
      <p className="text-neutral-600 mb-10 max-w-2xl text-lg leading-relaxed">
        This is more than a chatbot. It's your personal data analyst, wellness coach, and creative partner. By tapping into your notes, habits, and journal entries, Bee-Well AI uncovers deep insights and provides actionable guidance to help you thrive.
      </p>

      {/* Data access indicator */}
      <div className="mb-12 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-neutral-200/60 shadow-lg">
        <div className="flex items-center justify-center gap-6">
          <span className="text-sm font-medium text-neutral-700">Data Access:</span>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              dataAccess.notes 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
            }`}>
              <FileText className="h-3 w-3" />
              Notes
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              dataAccess.habits 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
            }`}>
              <Calendar className="h-3 w-3" />
              Habits
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              dataAccess.journal 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
            }`}>
              <BookOpen className="h-3 w-3" />
              Journal
            </div>
          </div>
        </div>
        {enabledSources.length === 0 && (
          <p className="text-center text-xs text-amber-600 mt-2">
            ⚠️ No data access enabled - I can only provide general assistance
          </p>
        )}
      </div>
      
      <p className="text-neutral-500 text-sm">
        Ask anything—from analyzing your productivity to getting a personalized wellness check. <br/> The power to transform your life is just a message away.
      </p>
    </div>
  );
}