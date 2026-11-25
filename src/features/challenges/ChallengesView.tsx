import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  Clock,
  Flame,
  Award,
  ChevronRight,
  ArrowLeft
} from 'lucide-react'
import {
  CHALLENGE_CATEGORIES,
  CHALLENGES,
  TODAY_DAILY_CHALLENGE,
  type Challenge,
  type ChallengeCategoryId
} from '@/domain/challenges'
import ChallengePreviewModal from './ChallengePreviewModal'

export default function ChallengesView() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategoryId | null>(null)
  const [previewChallenge, setPreviewChallenge] = useState<Challenge | null>(null)

  const activeCategory = CHALLENGE_CATEGORIES.find((c) => c.id === selectedCategory)
  const categoryExercises = selectedCategory
    ? CHALLENGES.filter((c) => c.categoryId === selectedCategory)
    : []

  const handleStartChallenge = (challenge: Challenge) => {
    setPreviewChallenge(null)
    navigate(`/studio?challengeId=${challenge.id}`)
  }

  return (
    <div className="px-4 sm:px-6 py-8 max-w-xl sm:max-w-4xl mx-auto space-y-6">
      {/* View Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-voca-tangerine-subtle text-voca-primary text-[10px] font-bold uppercase tracking-wider font-display mb-2">
          <Sparkles className="w-3 h-3 text-voca-tangerine" />
          <span>Daily Practice</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-voca-ink tracking-tight">
          Challenges
        </h1>
        <p className="text-sm text-voca-muted font-body mt-1">
          Small speaking exercises. Real communication growth.
        </p>
      </div>

      {/* Today's Single Challenge Hero Card */}
      <div className="relative rounded-3xl bg-voca-surface border border-voca-border p-6 shadow-xs overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-voca-primary font-display bg-voca-tangerine-subtle px-2.5 py-0.5 rounded-full">
              Today's Challenge
            </span>
            <span className="flex items-center gap-1 text-xs text-voca-muted font-body">
              <Clock className="w-3.5 h-3.5 text-voca-gold" />
              <span>5–10 min</span>
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-voca-ink tracking-tight">
            {TODAY_DAILY_CHALLENGE.title}
          </h2>

          <p className="text-sm text-voca-muted font-body leading-relaxed">
            Can you express a complete thought in just one minute? Practice spontaneous speaking with poise and flow.
          </p>

          <p className="text-xs font-semibold text-voca-muted">
            Focus: <span className="text-voca-ink">Spontaneous speaking</span>
          </p>
        </div>

        <button
          onClick={() => setPreviewChallenge(TODAY_DAILY_CHALLENGE)}
          type="button"
          className="w-full md:w-auto shrink-0 h-13 px-7 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-voca-tangerine/20 cursor-pointer active:scale-95 transition-all"
        >
          <span>Start today's challenge</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Progress & Streak Stats Row */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-voca-surface border border-voca-border shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-voca-tangerine-subtle text-voca-primary flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="font-display text-xl font-extrabold text-voca-ink tabular-nums">4/12</p>
            <p className="text-[11px] text-voca-muted font-body">Completed</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-voca-surface border border-voca-border shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-voca-gold/15 text-voca-gold flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-voca-tangerine" />
          </div>
          <div>
            <p className="font-display text-xl font-extrabold text-voca-ink tabular-nums">3 days</p>
            <p className="text-[11px] text-voca-muted font-body">Practice streak</p>
          </div>
        </div>
      </div>

      {/* 2-Tier Exploration: Categories vs Exercises */}
      <div className="space-y-4 pt-2">
        {!selectedCategory ? (
          /* Tier 1: Just 8 Clean Category Cards */
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-voca-border mb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-voca-ink">Explore Categories</h2>
                <p className="text-xs text-voca-muted font-body">Choose a specific speaking skill to develop</p>
              </div>
              <span className="text-xs text-voca-muted font-semibold bg-voca-subtle px-3 py-1 rounded-full">
                8 categories
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CHALLENGE_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="p-4 rounded-2xl bg-voca-surface border border-voca-border hover:border-voca-tangerine hover:shadow-xs transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="pr-4">
                    <h3 className="font-display font-bold text-base text-voca-ink group-hover:text-voca-primary transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-voca-muted font-body mt-0.5 leading-snug">{cat.tagline}</p>
                    <span className="inline-block mt-2 text-[10px] font-bold text-voca-muted uppercase tracking-wider font-display">
                      {cat.challengeCount} {cat.challengeCount === 1 ? 'exercise' : 'exercises'}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-voca-surface-low group-hover:bg-voca-tangerine group-hover:text-voca-surface text-voca-muted flex items-center justify-center transition-colors shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Tier 2: Selected Category's Exercises with clean Back button */
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-voca-border">
              <button
                onClick={() => setSelectedCategory(null)}
                type="button"
                className="flex items-center gap-1.5 text-xs font-bold text-voca-primary hover:underline font-display cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to all categories</span>
              </button>
              <span className="text-xs font-semibold text-voca-muted font-display bg-voca-subtle px-3 py-1 rounded-full">
                {activeCategory?.title}
              </span>
            </div>

            <div className="space-y-3">
              {categoryExercises.map((challenge) => (
                <div
                  key={challenge.id}
                  onClick={() => setPreviewChallenge(challenge)}
                  className="p-5 rounded-2xl bg-voca-surface border border-voca-border hover:border-voca-tangerine hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-display bg-voca-tangerine-subtle text-voca-primary">
                        {challenge.difficulty}
                      </span>
                      <span className="text-xs text-voca-muted font-body flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-voca-gold" />
                        {challenge.estimatedMinutes}
                      </span>
                    </div>

                    <h3 className="font-display font-extrabold text-lg text-voca-ink group-hover:text-voca-primary transition-colors">
                      {challenge.title}
                    </h3>
                    <p className="text-xs text-voca-muted font-body mt-1 leading-relaxed">
                      {challenge.tagline}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-voca-surface-low flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-voca-muted">
                      {challenge.skillsAssessed.join(' · ')}
                    </span>
                    <span className="text-xs font-bold text-voca-primary font-display flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>View challenge</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Challenge Preview Modal */}
      <ChallengePreviewModal
        challenge={previewChallenge}
        isOpen={Boolean(previewChallenge)}
        onClose={() => setPreviewChallenge(null)}
        onStart={handleStartChallenge}
      />
    </div>
  )
}
