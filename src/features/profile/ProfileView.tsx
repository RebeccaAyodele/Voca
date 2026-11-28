import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, LogOut, Trash2, Cpu, Check, Shield } from 'lucide-react'
import { useAuthStore } from '@/features/auth/authStore'
import type { SpeakingGoal } from '@/domain/user/types'

interface GoalOption {
  id: SpeakingGoal
  title: string
  description: string
}

const ALL_GOALS: GoalOption[] = [
  {
    id: 'public-speaking',
    title: 'Public Speaking & Keynotes',
    description: 'Command rooms with poise and clear projection.'
  },
  {
    id: 'social-confidence',
    title: 'Everyday Social Confidence',
    description: 'Express yourself freely with warmth and ease.'
  },
  {
    id: 'clarity-articulation',
    title: 'Vocal Clarity & Articulation',
    description: 'Refine resonance and sharpen enunciation.'
  },
  {
    id: 'interviews-pitches',
    title: 'High-Stakes Interviews & Pitches',
    description: 'Deliver structured, persuasive answers under pressure.'
  }
]

export default function ProfileView() {
  const navigate = useNavigate()
  const { profile, signOut, updateGoals } = useAuthStore()

  const [selectedGoals, setSelectedGoals] = useState<SpeakingGoal[]>(
    profile?.goals && profile.goals.length > 0 ? profile.goals : ['public-speaking']
  )
  const [isSaved, setIsSaved] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  const toggleGoal = async (id: SpeakingGoal) => {
    const updated = selectedGoals.includes(id)
      ? selectedGoals.length > 1
        ? selectedGoals.filter((g) => g !== id)
        : selectedGoals
      : [...selectedGoals, id]

    setSelectedGoals(updated)
    await updateGoals(updated)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleClearLocalData = async () => {
    if (confirm('Clear all locally saved audio recordings from this browser?')) {
      setIsClearing(true)
      try {
        const dbs = await window.indexedDB.databases?.()
        if (dbs) {
          for (const db of dbs) {
            if (db.name) window.indexedDB.deleteDatabase(db.name)
          }
        }
        alert('Local audio cache cleared successfully.')
      } catch {
        alert('Local cache reset.')
      } finally {
        setIsClearing(false)
      }
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <div className="px-4 sm:px-6 py-8 max-w-xl mx-auto space-y-6 pb-28 md:pb-12">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-extrabold text-voca-ink tracking-tight">
          Profile &amp; Settings
        </h1>
        <p className="text-sm text-voca-muted font-body mt-1">
          Manage your speaking focus, privacy, and account preferences.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="rounded-2xl bg-voca-surface border border-voca-border p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-voca-tangerine-subtle text-voca-primary flex items-center justify-center font-display font-extrabold text-lg">
            {profile?.displayName?.[0]?.toUpperCase() || <User className="w-6 h-6" />}
          </div>
          <div>
            <p className="font-display font-bold text-base text-voca-ink">
              {profile?.displayName || (profile?.isAnonymous ? 'Guest Speaker' : 'Voca Member')}
            </p>
            <p className="text-xs text-voca-muted font-body">
              {profile?.email || (profile?.isAnonymous ? 'Demo session (Judges)' : 'Personal account')}
            </p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-voca-subtle hover:bg-voca-surface-high border border-voca-border text-xs font-semibold text-voca-muted hover:text-voca-ink transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign out</span>
        </button>
      </div>

      {/* Speaking Goals Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-voca-muted font-display">
            Your Active Speaking Goals
          </span>
          {isSaved && (
            <span className="text-xs text-voca-success font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Saved</span>
            </span>
          )}
        </div>

        <div className="space-y-2">
          {ALL_GOALS.map((goal) => {
            const isSelected = selectedGoals.includes(goal.id)
            return (
              <div
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-voca-surface border-voca-tangerine shadow-xs'
                    : 'bg-voca-surface-low border-voca-border hover:border-voca-border-subtle'
                }`}
              >
                <div>
                  <p className="font-display font-bold text-sm text-voca-ink">{goal.title}</p>
                  <p className="text-xs text-voca-muted font-body mt-0.5">{goal.description}</p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-voca-tangerine text-voca-surface flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Privacy & Storage Section */}
      <div className="rounded-2xl bg-voca-surface border border-voca-border p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-voca-ink font-display">
          <Shield className="w-4 h-4 text-voca-primary" />
          <span>Privacy &amp; Local Storage</span>
        </div>
        <p className="text-xs text-voca-muted font-body leading-relaxed">
          Your audio recordings are stored locally in your browser’s IndexedDB. Recordings are only transmitted to Firebase AI Logic when you explicitly request transcription and coaching feedback.
        </p>

        <div className="pt-2 border-t border-voca-surface-low flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-voca-ink">Clear Cached Audio</p>
            <p className="text-[11px] text-voca-muted">Remove local recordings from this device.</p>
          </div>
          <button
            onClick={handleClearLocalData}
            disabled={isClearing}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isClearing ? 'Clearing...' : 'Clear cache'}</span>
          </button>
        </div>
      </div>

      {/* Developer / Hackathon Diagnostics Entry */}
      <div className="p-4 rounded-xl bg-voca-surface-low border border-voca-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-voca-primary" />
          <div>
            <p className="text-xs font-bold text-voca-ink font-display">Hybrid AI Telemetry</p>
            <p className="text-[11px] text-voca-muted font-body">Inspect on-device Chrome Gemini Nano vs Cloud routing.</p>
          </div>
        </div>
        <button
          onClick={() => {
            const btn = document.getElementById('trigger-hybrid-diagnostics')
            if (btn) btn.click()
          }}
          type="button"
          className="text-xs font-bold text-voca-primary hover:underline font-display cursor-pointer"
        >
          Open Diagnostics
        </button>
      </div>
    </div>
  )
}
