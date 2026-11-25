import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  Clock,
  Flame,
  Award,
  ChevronRight
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
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategoryId | 'all'>('all')
  const [previewChallenge, setPreviewChallenge] = useState<Challenge | null>(null)

  const filteredChallenges =
    selectedCategory === 'all'
      ? CHALLENGES
      : CHALLENGES.filter((c) => c.categoryId === selectedCategory)

  const handleStartChallenge = (challenge: Challenge) => {
    setPreviewChallenge(null)
    navigate(`/studio?challengeId=${challenge.id}`)
  }

  return (
    <div className="px-4 sm:px-6 py-8 max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-voca-tangerine-subtle text-voca-primary text-[10px] font-bold uppercase tracking-wider font-display mb-2">
          <Sparkles className="w-3 h-3 text-voca-tangerine" />
          <span>Daily Practice</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-voca-ink tracking-tight">
          Challenges
        </h1>
        <p className="text-sm text-voca-muted font-body mt-1">
          Small speaking exercises. Real communication growth.
        </p>
      </div>

      {/* Today's Challenge Hero Card */}
      <div className="relative rounded-3xl bg-voca-surface border border-voca-border p-6 sm:p-7 shadow-xs overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
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

          <div className="pt-2 flex items-center gap-2">
            <span className="text-xs font-semibold text-voca-muted">
              Focus: <span className="text-voca-ink">Spontaneous speaking</span>
            </span>
          </div>
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
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-voca-surface border border-voca-border shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-voca-tangerine-subtle text-voca-primary flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="font-display text-2xl font-extrabold text-voca-ink tabular-nums">4/12</p>
            <p className="text-xs text-voca-muted font-body">Challenges completed</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-voca-surface border border-voca-border shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-voca-gold/15 text-voca-gold flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-voca-tangerine" />
          </div>
          <div>
            <p className="font-display text-2xl font-extrabold text-voca-ink tabular-nums">3 days</p>
            <p className="text-xs text-voca-muted font-body">Practice streak</p>
          </div>
        </div>
      </div>

      {/* Explore Challenges Section */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-voca-border pb-3">
          <div>
            <h2 className="font-display text-2xl font-bold text-voca-ink">Explore challenges</h2>
            <p className="text-xs text-voca-muted font-body">All 12 exercises across 8 core communication categories</p>
          </div>
          <span className="text-xs font-semibold text-voca-muted font-display bg-voca-subtle px-3 py-1 rounded-full self-start sm:self-auto">
            12 exercises
          </span>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            type="button"
            className={`px-3.5 py-1.5 rounded-full text-xs font-display font-bold transition-colors cursor-pointer shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-voca-tangerine text-voca-surface'
                : 'bg-voca-subtle text-voca-muted hover:text-voca-ink hover:bg-voca-surface-high'
            }`}
          >
            All Challenges (12)
          </button>
          {CHALLENGE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              type="button"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-display font-bold transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-voca-tangerine text-voca-surface'
                  : 'bg-voca-subtle text-voca-muted hover:text-voca-ink hover:bg-voca-surface-high'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.title}</span>
              <span className="opacity-60 text-[10px]">({cat.challengeCount})</span>
            </button>
          ))}
        </div>

        {/* Category Cards Overview (when 'all' is selected) */}
        {selectedCategory === 'all' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {CHALLENGE_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="p-4 rounded-2xl bg-voca-surface border border-voca-border hover:border-voca-tangerine hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="text-2xl mb-2">{cat.icon}</div>
                  <h3 className="font-display font-bold text-sm text-voca-ink group-hover:text-voca-primary transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-voca-muted font-body mt-1 leading-snug">{cat.tagline}</p>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-voca-muted pt-2 border-t border-voca-surface-low">
                  <span>{cat.challengeCount} {cat.challengeCount === 1 ? 'challenge' : 'challenges'}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-voca-tangerine group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Active Challenges List */}
        <div className="space-y-3 pt-2">
          {selectedCategory !== 'all' && (
            <div className="flex items-center justify-between py-1">
              <span className="text-xs font-bold uppercase tracking-wider text-voca-muted font-display">
                Showing {filteredChallenges.length} {filteredChallenges.length === 1 ? 'exercise' : 'exercises'}
              </span>
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs text-voca-primary font-bold hover:underline font-display cursor-pointer"
              >
                Show all categories
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredChallenges.map((challenge) => (
              <div
                key={challenge.id}
                onClick={() => setPreviewChallenge(challenge)}
                className="p-5 rounded-2xl bg-voca-surface border border-voca-border hover:border-voca-tangerine hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-display ${
                        challenge.difficulty === 'Beginner'
                          ? 'bg-emerald-50 text-emerald-700'
                          : challenge.difficulty === 'Intermediate'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {challenge.difficulty}
                    </span>
                    <span className="text-[11px] text-voca-muted font-body flex items-center gap-1">
                      <Clock className="w-3 h-3 text-voca-gold" />
                      {challenge.estimatedMinutes}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-base text-voca-ink group-hover:text-voca-primary transition-colors">
                    {challenge.title}
                  </h3>
                  <p className="text-xs text-voca-muted font-body mt-1 leading-relaxed">
                    {challenge.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-voca-surface-low flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-voca-muted">
                    <span>{challenge.skillsAssessed.slice(0, 2).join(' · ')}</span>
                  </div>
                  <span className="text-xs font-bold text-voca-primary font-display flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Preview</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
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
