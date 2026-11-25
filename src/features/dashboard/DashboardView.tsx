import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, TrendingUp, Award, Flame, Compass } from 'lucide-react'
import { useAuthStore } from '@/features/auth/authStore'
import { TODAY_DAILY_CHALLENGE } from '@/domain/challenges'

export default function DashboardView() {
  const navigate = useNavigate()
  const profile = useAuthStore((state) => state.profile)

  const primaryGoal = profile?.goals?.[0] || 'public-speaking'
  const goalLabels: Record<string, string> = {
    'public-speaking': 'Public Speaking & Keynotes',
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
            Deliberate speaking exercises and daily challenges build lasting poise and resonance.
          </p>
        </div>

        <button
          onClick={() => navigate('/challenges')}
          type="button"
          className="self-start sm:self-auto h-12 px-6 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-sm flex items-center gap-2 shadow-md shadow-voca-tangerine/20 cursor-pointer active:scale-95 transition-all"
        >
          <Flame className="w-4 h-4" />
          <span>Explore Challenges</span>
        </button>
      </div>

      {/* Main Practice Launcher Hero Card: Today's Daily Challenge */}
      <div className="relative rounded-3xl bg-voca-surface border border-voca-border p-6 sm:p-7 shadow-xs overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <div className="flex items-center gap-2 text-voca-primary text-xs font-bold font-display uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-voca-tangerine animate-ping"></span>
            <span>Today's Daily Challenge</span>
            <span className="text-voca-muted font-normal">• 5–10 min</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-voca-ink">
            {TODAY_DAILY_CHALLENGE.title}
          </h2>
          <p className="text-sm text-voca-muted font-body leading-relaxed">
            {TODAY_DAILY_CHALLENGE.mission}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-voca-muted">
              Skills: <span className="text-voca-ink">{TODAY_DAILY_CHALLENGE.skillsAssessed.join(' · ')}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto shrink-0">
          <button
            onClick={() => navigate(`/studio?challengeId=${TODAY_DAILY_CHALLENGE.id}`)}
            type="button"
            className="w-full sm:w-auto h-12 px-6 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
          >
            <span>Start Today's Challenge</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/challenges')}
            type="button"
            className="w-full sm:w-auto h-12 px-5 rounded-full bg-voca-surface-low hover:bg-voca-surface-high border border-voca-border text-voca-ink font-display font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <span>View Library (12)</span>
          </button>
        </div>
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
