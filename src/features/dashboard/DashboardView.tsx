import { useNavigate } from 'react-router-dom'
import { Mic, ArrowRight, Sparkles, TrendingUp, Compass, Award, Activity } from 'lucide-react'
import { useAuthStore } from '@/features/auth/authStore'

export default function DashboardView() {
  const navigate = useNavigate()
  const profile = useAuthStore((state) => state.profile)

  const primaryGoal = profile?.goals?.[0] || 'public-speaking'
  const goalLabels: Record<string, string> = {
    'public-speaking': 'Public Speaking & Keynotes',
    'executive-presence': 'Executive Presence & Meetings',
    'social-confidence': 'Everyday Social Confidence',
    'clarity-articulation': 'Vocal Clarity & Articulation',
    'interviews-pitches': 'High-Stakes Interviews & Pitches'
  }

  return (
    <div className="px-4 sm:px-6 py-8 max-w-4xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-voca-tangerine-subtle/60 text-voca-primary text-[10px] font-bold uppercase tracking-wider font-display mb-2">
            <Sparkles className="w-3 h-3 text-voca-tangerine" />
            <span>Calibrated for {goalLabels[primaryGoal]}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-voca-ink tracking-tight">
            Your Speaking Practice
          </h1>
          <p className="text-sm text-voca-muted font-body mt-1">
            Consistent 15-second deliberate repetitions build lasting poise and resonance.
          </p>
        </div>

        <button
          onClick={() => navigate('/studio')}
          type="button"
          className="self-start sm:self-auto h-12 px-6 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-sm flex items-center gap-2 shadow-md shadow-voca-tangerine/20 cursor-pointer active:scale-95 transition-all"
        >
          <Mic className="w-4 h-4" />
          <span>Start Practising</span>
        </button>
      </div>

      {/* Main Practice Launcher Hero Card */}
      <div className="relative rounded-2xl bg-voca-surface border border-voca-border p-6 shadow-xs overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <div className="flex items-center gap-2 text-voca-tangerine text-xs font-bold font-display uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            <span>Today's Recommended Focus</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-voca-ink">
            Master the 1-Second Thoughtful Pause
          </h2>
          <p className="text-sm text-voca-muted font-body leading-relaxed">
            Eliminate filler words naturally. Whenever you transition between thoughts, close your lips and take one silent breath before continuing.
          </p>
        </div>

        <button
          onClick={() => navigate('/studio')}
          type="button"
          className="w-full sm:w-auto shrink-0 h-12 px-6 rounded-full bg-voca-surface-low hover:bg-voca-surface-high border border-voca-border text-voca-ink font-display font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <span>Launch 15s Drill</span>
          <ArrowRight className="w-4 h-4 text-voca-primary" />
        </button>
      </div>

      {/* Quick Metrics & Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Baseline Status Card */}
        <div className="p-5 rounded-2xl bg-voca-surface border border-voca-border shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-voca-muted mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider font-display">Baseline Status</span>
              <Award className="w-4 h-4 text-voca-gold" />
            </div>
            <p className="font-display text-xl font-bold text-voca-ink">Calibrated</p>
            <p className="text-xs text-voca-muted font-body mt-1">15s voice sample recorded and analyzed.</p>
          </div>
          <button
            onClick={() => navigate('/analysis?recId=demo')}
            className="mt-4 text-xs font-bold text-voca-primary hover:underline font-display flex items-center gap-1 self-start cursor-pointer"
          >
            <span>Review baseline results</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Cadence Range */}
        <div className="p-5 rounded-2xl bg-voca-surface border border-voca-border shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-voca-muted mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider font-display">Target Cadence</span>
              <TrendingUp className="w-4 h-4 text-voca-success" />
            </div>
            <p className="font-display text-xl font-bold text-voca-ink tabular-nums">135–155 WPM</p>
            <p className="text-xs text-voca-muted font-body mt-1">Ideal pocket for poise and audience retention.</p>
          </div>
          <span className="mt-4 text-[11px] text-voca-success font-semibold font-body">Pacing dialed in</span>
        </div>

        {/* Skill Map Shortcut */}
        <div className="p-5 rounded-2xl bg-voca-surface border border-voca-border shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-voca-muted mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider font-display">Skill Radar</span>
              <Compass className="w-4 h-4 text-voca-primary" />
            </div>
            <p className="font-display text-xl font-bold text-voca-ink">6 Dimensions</p>
            <p className="text-xs text-voca-muted font-body mt-1">Fluency, pace, structure, clarity, and conciseness.</p>
          </div>
          <button
            onClick={() => navigate('/skills')}
            className="mt-4 text-xs font-bold text-voca-primary hover:underline font-display flex items-center gap-1 self-start cursor-pointer"
          >
            <span>Explore Skill Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
