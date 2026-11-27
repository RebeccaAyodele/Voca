import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Flame,
  Compass,
  BookOpen,
  Volume2,
  Lock,
  Sparkles,
  Zap
} from 'lucide-react'
import { useAuthStore } from '@/features/auth/authStore'
import { getLatestSessionResult, getAllSessionResults, type SessionResult } from '@/services/persistence/indexed-db'
import { getAdaptiveRecommendation, type AdaptiveChallengeRecommendation } from '@/domain/challenges/recommendation-engine'
import VocalWarmupModal from '@/features/speaking-studio/VocalWarmupModal'

export default function DashboardView() {
  const navigate = useNavigate()
  const profile = useAuthStore((state) => state.profile)

  const [latestSession, setLatestSession] = useState<SessionResult | null>(null)
  const [streakDays, setStreakDays] = useState(0)
  const [isWarmupOpen, setIsWarmupOpen] = useState(false)

  const displayName = profile?.displayName || (profile?.isAnonymous ? 'Guest' : 'Speaker')
  const primaryGoal = profile?.goals?.[0]

  useEffect(() => {
    async function loadData() {
      const [latest, all] = await Promise.all([
        getLatestSessionResult(),
        getAllSessionResults()
      ])
      setLatestSession(latest)
      if (all.length > 0) {
        const days = new Set(all.map((s) => new Date(s.createdAt).toISOString().split('T')[0]))
        setStreakDays(days.size)
      } else {
        setStreakDays(0)
      }
    }
    loadData()
  }, [])

  const rec: AdaptiveChallengeRecommendation = getAdaptiveRecommendation(latestSession, primaryGoal)
  const todayChallenge = rec.challenge

  return (
    <div className="px-4 sm:px-8 py-8 max-w-3xl mx-auto space-y-6">
      {/* Welcome & Streak Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs sm:text-sm font-semibold text-voca-muted font-display block">Welcome back,</span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-voca-ink tracking-tight">
            {displayName}
          </h1>
        </div>

        {/* Practice Streak Badge */}
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-voca-surface border border-voca-border shadow-2xs">
          <Flame className="w-4 h-4 text-voca-tangerine" />
          <span className="text-xs sm:text-sm font-bold text-voca-ink font-display">{streakDays} {streakDays === 1 ? 'day' : 'days'}</span>
        </div>
      </div>

      {/* Hero: ADAPTIVE DAILY CHALLENGE (LEARNED FROM HABITS) */}
      <div className="relative rounded-3xl bg-voca-surface border border-voca-border p-6 sm:p-8 shadow-xs overflow-hidden flex flex-col justify-between gap-5">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {rec.isBasedOnHabits ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-voca-primary font-display bg-voca-tangerine-subtle px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Learned from your speech habits</span>
              </span>
            ) : (
              <span className="text-xs font-bold uppercase tracking-wider text-voca-primary font-display bg-voca-tangerine-subtle px-3 py-1 rounded-full">
                Today's Recommended Practice
              </span>
            )}
            <span className="text-xs sm:text-sm text-voca-muted font-body font-medium">{todayChallenge.estimatedMinutes}</span>
          </div>

          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-voca-ink tracking-tight">
              {todayChallenge.title}
            </h2>
            <p className="text-sm text-voca-muted font-body mt-1 leading-relaxed">
              {todayChallenge.tagline}
            </p>
          </div>

          {/* Adaptive Rationale Banner */}
          <div className="rounded-2xl bg-voca-surface-low p-4 border border-voca-border/80 space-y-2">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-voca-ink font-display">
              <Zap className="w-4 h-4 text-voca-tangerine shrink-0" />
              <span>Why this exercise:</span>
            </div>
            <p className="text-sm text-voca-muted font-body leading-relaxed">
              {rec.recommendationReason}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-voca-primary font-body pt-1 border-t border-voca-border/50">
              Focus: {rec.focusTip}
            </p>
          </div>
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

      {/* Real-Time Guided Vocal Warm-Up Trigger Card */}
      <div className="rounded-2xl bg-gradient-to-r from-voca-surface via-voca-surface to-voca-tangerine-subtle/30 border border-voca-tangerine/30 p-4 sm:p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-voca-tangerine-subtle text-voca-primary flex items-center justify-center shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm sm:text-base text-voca-ink">
              60-Second Vocal Warm-Up
            </h3>
            <p className="text-xs text-voca-muted font-body mt-0.5">
              Diaphragm hum, consonant articulation &amp; breath pause calibration.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsWarmupOpen(true)}
          className="px-4 py-2 rounded-full bg-voca-surface border border-voca-border hover:bg-voca-surface-high text-xs sm:text-sm font-bold font-display text-voca-ink shrink-0 cursor-pointer transition-colors shadow-2xs"
        >
          Warm Up
        </button>
      </div>

      {/* Secondary Quick Links (All Challenges & Skill Radar) */}
      <div className="pt-1 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-voca-muted font-display block">
          Practice &amp; Growth
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

      {/* Offline-First Privacy Guarantee Badge */}
      <div className="rounded-xl bg-voca-surface-low p-3.5 border border-voca-border flex items-center justify-between text-xs text-voca-muted font-body">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-voca-primary shrink-0" />
          <span>
            <strong>Private &amp; Offline-Ready:</strong> Audio is processed locally in your browser. Zero recordings are silently uploaded.
          </span>
        </div>
      </div>

      {/* Guided Vocal Warmup Modal */}
      <VocalWarmupModal
        isOpen={isWarmupOpen}
        onClose={() => setIsWarmupOpen(false)}
        onCompleteToPractice={() => navigate(`/studio?challengeId=${todayChallenge.id}`)}
      />
    </div>
  )
}
