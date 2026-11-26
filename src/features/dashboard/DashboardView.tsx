import { useNavigate } from 'react-router-dom'
import { ArrowRight, Flame, Compass, BookOpen } from 'lucide-react'
import { useAuthStore } from '@/features/auth/authStore'
import { getRecommendedDailyChallenge } from '@/domain/challenges'

export default function DashboardView() {
  const navigate = useNavigate()
  const profile = useAuthStore((state) => state.profile)

  const displayName = profile?.displayName || (profile?.isAnonymous ? 'Guest' : 'Speaker')
  const primaryGoal = profile?.goals?.[0]
  const todayChallenge = getRecommendedDailyChallenge(primaryGoal)

  return (
    <div className="px-4 sm:px-6 py-8 max-w-xl mx-auto space-y-6">
      {/* Welcome & Streak Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-voca-muted font-display block">Welcome back,</span>
          <h1 className="font-display text-3xl font-extrabold text-voca-ink tracking-tight">
            {displayName}
          </h1>
        </div>

        {/* Practice Streak Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-voca-surface border border-voca-border shadow-2xs">
          <Flame className="w-4 h-4 text-voca-tangerine" />
          <span className="text-xs font-bold text-voca-ink font-display">4 days</span>
        </div>
      </div>

      {/* Hero: ONE THING TO DO TODAY */}
      <div className="relative rounded-3xl bg-voca-surface border border-voca-border p-6 sm:p-7 shadow-xs overflow-hidden flex flex-col justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-voca-primary font-display bg-voca-tangerine-subtle px-2.5 py-0.5 rounded-full">
              Today's Recommended Practice
            </span>
            <span className="text-xs text-voca-muted font-body">{todayChallenge.estimatedMinutes}</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-voca-ink tracking-tight pt-1">
            {todayChallenge.title}
          </h2>

          <p className="text-sm text-voca-muted font-body leading-relaxed">
            {todayChallenge.tagline}
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => navigate(`/studio?challengeId=${todayChallenge.id}`)}
          type="button"
          className="w-full h-14 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-voca-tangerine/20 cursor-pointer active:scale-[0.98] transition-all"
        >
          <span>Start Today's Practice ({todayChallenge.estimatedMinutes})</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Quiet Below-the-Fold Secondary Links */}
      <div className="pt-2 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-voca-muted font-display block">
          More Practice &amp; Growth
        </span>

        <div className="grid grid-cols-2 gap-3">
          {/* Library Link */}
          <div
            onClick={() => navigate('/challenges')}
            className="p-4 rounded-2xl bg-voca-surface border border-voca-border hover:border-voca-tangerine hover:shadow-2xs transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-voca-tangerine-subtle text-voca-primary flex items-center justify-center mb-2">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm text-voca-ink group-hover:text-voca-primary transition-colors">
                All Challenges
              </h3>
              <p className="text-[11px] text-voca-muted font-body mt-0.5">12 speaking exercises</p>
            </div>
            <span className="mt-3 text-xs font-bold text-voca-primary font-display flex items-center gap-1 self-start">
              <span>Browse</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* Skill Map Link */}
          <div
            onClick={() => navigate('/skills')}
            className="p-4 rounded-2xl bg-voca-surface border border-voca-border hover:border-voca-tangerine hover:shadow-2xs transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-voca-surface-low text-voca-muted flex items-center justify-center mb-2">
                <Compass className="w-4 h-4 text-voca-primary" />
              </div>
              <h3 className="font-display font-bold text-sm text-voca-ink group-hover:text-voca-primary transition-colors">
                Skill Radar
              </h3>
              <p className="text-[11px] text-voca-muted font-body mt-0.5">6 communication dimensions</p>
            </div>
            <span className="mt-3 text-xs font-bold text-voca-primary font-display flex items-center gap-1 self-start">
              <span>View Map</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
