import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Award, Briefcase, MessageSquare, Volume2, Mic } from 'lucide-react'
import { useAuthStore } from '@/features/auth/authStore'
import type { SpeakingGoal } from '@/domain/user/types'

interface GoalOption {
  id: SpeakingGoal
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    id: 'public-speaking',
    title: 'Public Speaking & Keynotes',
    description: 'Command rooms with poise, clear projection, and breath control.',
    icon: Award
  },
  {
    id: 'executive-presence',
    title: 'Executive Presence & Meetings',
    description: 'Speak with authority, eliminate filler words, and hold gravitas.',
    icon: Briefcase
  },
  {
    id: 'social-confidence',
    title: 'Everyday Social Confidence',
    description: 'Express yourself freely with warmth, vocal variety, and ease.',
    icon: MessageSquare
  },
  {
    id: 'clarity-articulation',
    title: 'Vocal Clarity & Articulation',
    description: 'Refine resonance, master pacing, and sharpen enunciation.',
    icon: Volume2
  },
  {
    id: 'interviews-pitches',
    title: 'High-Stakes Interviews & Pitches',
    description: 'Deliver structured, persuasive, and authentic answers under pressure.',
    icon: Mic
  }
]

export default function GoalAssessmentView() {
  const navigate = useNavigate()
  const { profile, updateGoals } = useAuthStore()

  // Pre-select goals from profile if existing, otherwise default to first goal
  const [selectedGoals, setSelectedGoals] = useState<SpeakingGoal[]>(
    profile?.goals && profile.goals.length > 0 ? profile.goals : ['public-speaking']
  )
  const [saving, setSaving] = useState(false)

  const toggleGoal = (id: SpeakingGoal) => {
    setSelectedGoals((prev) => {
      if (prev.includes(id)) {
        // Keep at least one goal selected
        if (prev.length === 1) return prev
        return prev.filter((g) => g !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const handleContinue = async () => {
    try {
      setSaving(true)
      await updateGoals(selectedGoals)
      navigate('/studio')
    } catch {
      // Proceed even if network sync has delay
      navigate('/studio')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-[#FBF9F5] text-[#1B1C1A] min-h-screen flex flex-col justify-between px-4 sm:px-6 py-6 max-w-lg mx-auto">
      <div>
        {/* Top Navigation */}
        <div className="flex items-center justify-between py-2 mb-4">
          <button
            onClick={() => navigate('/auth')}
            className="w-10 h-10 rounded-full bg-[#EFEEEA] flex items-center justify-center text-[#1B1C1A] hover:bg-[#EAE8E4] transition-transform active:scale-95 shadow-xs cursor-pointer"
            type="button"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10"></div>
        </div>

        {/* Editorial Headline Section */}
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1B1C1A] leading-tight tracking-tight">
            What is your primary <span className="italic font-normal text-[#F47B45]">communication</span> goal?
          </h1>
          <p className="text-sm text-[#57423A] max-w-xs">
            Select your main focus areas to calibrate your personalized practice cadence.
          </p>
        </div>

        {/* Interactive Assessment Goal Cards */}
        <div aria-label="Communication Goals" className="flex flex-col gap-3 mb-6" role="group">
          {GOAL_OPTIONS.map((goal) => {
            const isSelected = selectedGoals.includes(goal.id)
            const Icon = goal.icon

            return (
              <div
                key={goal.id}
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => toggleGoal(goal.id)}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault()
                    toggleGoal(goal.id)
                  }
                }}
                className={`relative flex items-start gap-3.5 p-4 rounded-xl transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-white border-[#F47B45] shadow-md shadow-[#F47B45]/10'
                    : 'bg-[#F5F3EF] border-transparent hover:bg-white hover:border-[#EAE5DF]'
                }`}
              >
                {/* Icon Container */}
                <div
                  className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-[#FFDBCE] text-[#A23F0A]'
                      : 'bg-[#EAE8E4] text-[#57423A]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 min-w-0 pr-6">
                  <span className="font-semibold text-sm text-[#1B1C1A]">{goal.title}</span>
                  <p className="text-xs text-[#57423A] mt-0.5 leading-snug">{goal.description}</p>
                </div>

                {/* Checkmark Indicator */}
                {isSelected && (
                  <div className="absolute right-4 top-4 w-6 h-6 rounded-full bg-[#F47B45] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="flex flex-col items-center gap-4 mt-auto pb-2">
        {/* Step Indicator Dots (Step 3 of 5) */}
        <div aria-label="Step 3 of 5" className="flex items-center justify-center gap-1.5 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E4E2DE]"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E4E2DE]"></span>
          <span className="w-6 h-1.5 rounded-full bg-[#F47B45] transition-all duration-300"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E4E2DE]"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E4E2DE]"></span>
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={handleContinue}
          disabled={saving}
          type="button"
          className="w-full h-14 rounded-full bg-[#F47B45] hover:bg-[#A23F0A] text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#F47B45]/25 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
        >
          <span>{saving ? 'Saving goals...' : 'Continue to baseline'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Helper Context Text */}
        <p className="text-xs text-[#57423A]/80 text-center max-w-xs">
          You can adjust or add goals anytime in your studio settings.
        </p>
      </div>
    </div>
  )
}
