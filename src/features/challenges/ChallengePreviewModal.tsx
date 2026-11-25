import { X, ArrowRight, Clock, Target, CheckCircle2 } from 'lucide-react'
import type { Challenge } from '@/domain/challenges/types'

interface ChallengePreviewModalProps {
  challenge: Challenge | null
  isOpen: boolean
  onClose: () => void
  onStart: (challenge: Challenge) => void
}

export default function ChallengePreviewModal({
  challenge,
  isOpen,
  onClose,
  onStart
}: ChallengePreviewModalProps) {
  if (!isOpen || !challenge) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-voca-ink/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-voca-surface border border-voca-border p-6 sm:p-7 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-voca-subtle flex items-center justify-center text-voca-muted hover:text-voca-ink hover:bg-voca-surface-high transition-colors cursor-pointer"
          type="button"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Category & Timing Pill */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-voca-tangerine-subtle text-voca-primary text-[10px] font-bold uppercase tracking-wider font-display">
            {challenge.difficulty}
          </span>
          <span className="flex items-center gap-1 text-xs text-voca-muted font-body">
            <Clock className="w-3.5 h-3.5 text-voca-gold" />
            <span>{challenge.estimatedMinutes}</span>
          </span>
        </div>

        {/* Challenge Title */}
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-voca-ink tracking-tight mb-2">
          {challenge.title}
        </h2>
        <p className="text-sm text-voca-muted font-body mb-5">{challenge.tagline}</p>

        {/* Your Mission */}
        <div className="rounded-2xl bg-voca-surface-low p-4 border border-voca-border mb-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-voca-ink font-display uppercase tracking-wider mb-1.5">
            <Target className="w-4 h-4 text-voca-primary" />
            <span>Your mission</span>
          </div>
          <p className="text-xs text-voca-ink font-body leading-relaxed">{challenge.mission}</p>
        </div>

        {/* Speaking Prompt Card */}
        <div className="rounded-2xl bg-voca-tangerine-subtle/30 p-4 border border-voca-tangerine/20 mb-4">
          <span className="text-[10px] font-bold text-voca-primary font-display uppercase tracking-wider block mb-1">
            Your Speaking Prompt
          </span>
          <p className="font-display text-base font-bold text-voca-ink leading-snug">
            “{challenge.speakingPrompt}”
          </p>
        </div>

        {/* What to Focus On */}
        <div className="mb-5">
          <span className="text-xs font-bold text-voca-ink font-display uppercase tracking-wider block mb-2">
            What to focus on
          </span>
          <ul className="space-y-1.5">
            {challenge.focusPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-voca-muted font-body">
                <CheckCircle2 className="w-3.5 h-3.5 text-voca-success shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Skills Assessed */}
        <div className="mb-6">
          <span className="text-[10px] font-bold text-voca-muted font-display uppercase tracking-wider block mb-2">
            Skills Assessed
          </span>
          <div className="flex flex-wrap gap-1.5">
            {challenge.skillsAssessed.map((skill, index) => (
              <span
                key={index}
                className="px-2.5 py-1 rounded-full bg-voca-subtle text-xs font-semibold text-voca-ink border border-voca-border"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Time parameters & Start CTA */}
        <div className="pt-3 border-t border-voca-border flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
          <div className="flex items-center gap-4 text-xs text-voca-muted font-body w-full sm:w-auto justify-around sm:justify-start">
            <div>
              <span className="block text-[10px] uppercase font-bold text-voca-muted">Preparation</span>
              <span className="font-bold text-voca-ink tabular-nums">{challenge.prepDurationSeconds}s</span>
            </div>
            <div className="h-6 w-px bg-voca-border"></div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-voca-muted">Speaking</span>
              <span className="font-bold text-voca-ink tabular-nums">{challenge.speakingDurationSeconds}s</span>
            </div>
          </div>

          <button
            onClick={() => onStart(challenge)}
            type="button"
            className="w-full sm:w-auto h-12 px-6 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-voca-tangerine/20 cursor-pointer active:scale-95 transition-all"
          >
            <span>Start speaking</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
