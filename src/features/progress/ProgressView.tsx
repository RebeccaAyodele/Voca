import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Mic,
  Play,
  Pause,
  CheckCircle2,
  Sparkles,
  Award,
  Volume2
} from 'lucide-react'
import { useAuthStore } from '@/features/auth/authStore'
import { getAllAudioRecordings } from '@/services/persistence/indexed-db'
import type { AudioRecording } from '@/services/audio/audio-types'

export default function ProgressView() {
  const navigate = useNavigate()
  const profile = useAuthStore((state) => state.profile)

  const [recordings, setRecordings] = useState<AudioRecording[]>([])
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null)
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)
  const [activeAudioSrc, setActiveAudioSrc] = useState<string | null>(null)

  useEffect(() => {
    async function loadRecordings() {
      const all = await getAllAudioRecordings()
      setRecordings(all)
    }
    loadRecordings()
  }, [])

  const handlePlayRecording = (recordingId: string, blob: Blob) => {
    if (activePlayingId === recordingId) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause()
      }
      setActivePlayingId(null)
      return
    }

    if (activeAudioSrc) {
      URL.revokeObjectURL(activeAudioSrc)
    }

    const url = URL.createObjectURL(blob)
    setActiveAudioSrc(url)
    setActivePlayingId(recordingId)

    if (audioPlayerRef.current) {
      audioPlayerRef.current.src = url
      audioPlayerRef.current.play()
    }
  }

  // Target goal labels mapping
  const goalLabels: Record<string, string> = {
    'public-speaking': 'Public Speaking & Presentations',
    'social-confidence': 'Social Confidence & Casual Conversations',
    'interview-pitch': 'Interview Answers & Elevator Pitches',
    'clarity-articulation': 'Clarity, Pacing & Clear Articulation'
  }

  const primaryGoal = profile?.goals?.[0] || 'public-speaking'
  const primaryGoalLabel = goalLabels[primaryGoal] || 'Speaking Confidence'

  return (
    <div className="px-4 sm:px-6 py-6 max-w-xl mx-auto space-y-7 pb-20">
      {/* Top Header */}
      <div>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-xs font-bold text-voca-muted hover:text-voca-ink font-display mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-voca-tangerine-subtle text-voca-primary text-xs font-semibold tracking-wide mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-voca-tangerine" />
          <span>VOICE TRANSFORMATION</span>
          <span className="text-voca-muted font-normal ml-1">• 4-Day Streak</span>
        </div>

        <h1 className="font-display text-3xl font-extrabold text-voca-ink tracking-tight">
          Your Voice in Motion
        </h1>
        <p className="text-xs sm:text-sm text-voca-muted font-body mt-1 leading-relaxed">
          Tangible, evidence-backed proof of how your speaking is evolving over time.
        </p>
      </div>

      {/* Hidden Global Audio Element */}
      <audio
        ref={audioPlayerRef}
        onEnded={() => setActivePlayingId(null)}
        className="hidden"
      />

      {/* ========================================================= */}
      {/* ANCHOR A: HEAR YOURSELF TRANSFORM (BEFORE & AFTER AUDIO) */}
      {/* ========================================================= */}
      <section className="bg-voca-surface rounded-2xl p-5 border border-voca-border shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-voca-primary font-display block">
              Anchor A • Auditory Evidence
            </span>
            <h2 className="font-display text-lg font-bold text-voca-ink">
              Hear the Difference
            </h2>
          </div>
          <div className="w-9 h-9 rounded-full bg-voca-tangerine-subtle text-voca-primary flex items-center justify-center">
            <Volume2 className="w-4 h-4" />
          </div>
        </div>
        <p className="text-xs text-voca-muted font-body leading-relaxed">
          Listen to your speech from when you started compared to your latest session. Notice the calmer breathing, fewer rushed sentences, and steady presence.
        </p>

        {/* Side-by-side Takes */}
        <div className="space-y-3 pt-1">
          {/* Day 1 Baseline Take */}
          <div className="rounded-xl bg-voca-surface-low p-4 border border-voca-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const first = recordings[0]
                  if (first) {
                    handlePlayRecording('baseline', first.blob)
                  }
                }}
                className="w-10 h-10 rounded-full bg-voca-surface border border-voca-border hover:bg-voca-surface-high text-voca-ink flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-all"
                aria-label="Play Day 1 Baseline sample"
              >
                {activePlayingId === 'baseline' ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-voca-ink">Day 1 • Baseline Take</span>
                  <span className="text-[10px] font-semibold text-voca-muted bg-voca-surface px-1.5 py-0.5 rounded border border-voca-border">
                    15s
                  </span>
                </div>
                <p className="text-[11px] text-voca-muted font-body mt-0.5">
                  168 words/min • Rushed transitions • Rapid breaths
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-voca-muted tabular-nums">
              Initial
            </span>
          </div>

          {/* Today's Latest Practice Take */}
          <div className="rounded-xl bg-gradient-to-r from-voca-surface via-voca-surface to-voca-tangerine-subtle/30 p-4 border border-voca-tangerine/30 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const latest = recordings.length > 1 ? recordings[recordings.length - 1] : recordings[0]
                  if (latest) {
                    handlePlayRecording('latest', latest.blob)
                  }
                }}
                className="w-10 h-10 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface flex items-center justify-center shadow-sm cursor-pointer active:scale-95 transition-all"
                aria-label="Play Today's Latest Take"
              >
                {activePlayingId === 'latest' ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-voca-ink">Today • Latest Practice</span>
                  <span className="text-[10px] font-bold text-voca-primary bg-voca-tangerine-subtle px-1.5 py-0.5 rounded">
                    Latest
                  </span>
                </div>
                <p className="text-[11px] text-voca-primary font-medium font-body mt-0.5">
                  138 words/min • Thoughtful pauses • Grounded cadence
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-voca-primary tabular-nums">
              Grounded
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* ANCHOR B: RELATABLE METRIC SHIFTS (PLAIN EVERYDAY TERMS) */}
      {/* ========================================================= */}
      <section className="bg-voca-surface rounded-2xl p-5 border border-voca-border shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-voca-primary font-display block">
              Anchor B • Real Delivery Shifts
            </span>
            <h2 className="font-display text-lg font-bold text-voca-ink">
              Progress You Can Measure
            </h2>
          </div>
          <span className="text-xs font-semibold text-voca-muted font-body">
            Baseline vs. Today
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Shift 1: Talking Speed */}
          <div className="p-4 rounded-xl bg-voca-surface-low border border-voca-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-voca-ink font-display">Talking Speed</span>
              <span className="text-[10px] font-bold text-voca-success bg-emerald-50 px-2 py-0.5 rounded-full">
                -30 WPM (Calmer)
              </span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-semibold text-voca-muted">Day 1</span>
                <span className="font-display text-base font-bold text-voca-muted line-through">168 WPM</span>
              </div>
              <ArrowRight className="w-4 h-4 text-voca-primary" />
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold text-voca-primary">Today</span>
                <span className="font-display text-lg font-extrabold text-voca-ink">138 WPM</span>
              </div>
            </div>
            <p className="text-[11px] text-voca-muted font-body pt-1 border-t border-voca-border/60">
              Optimal conversational sweet spot (130–160 WPM).
            </p>
          </div>

          {/* Shift 2: Natural Breath Pauses */}
          <div className="p-4 rounded-xl bg-voca-surface-low border border-voca-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-voca-ink font-display">Natural Pauses</span>
              <span className="text-[10px] font-bold text-voca-primary bg-voca-tangerine-subtle px-2 py-0.5 rounded-full">
                Room to Breathe
              </span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-semibold text-voca-muted">Day 1</span>
                <span className="font-display text-xs font-semibold text-voca-muted">Rushed through</span>
              </div>
              <ArrowRight className="w-4 h-4 text-voca-primary" />
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold text-voca-primary">Today</span>
                <span className="font-display text-sm font-bold text-voca-ink">1.4s breath breaks</span>
              </div>
            </div>
            <p className="text-[11px] text-voca-muted font-body pt-1 border-t border-voca-border/60">
              Allowing each thought to land cleanly with your listener.
            </p>
          </div>

          {/* Shift 3: Word Fillers */}
          <div className="p-4 rounded-xl bg-voca-surface-low border border-voca-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-voca-ink font-display">Word Fillers</span>
              <span className="text-[10px] font-bold text-voca-success bg-emerald-50 px-2 py-0.5 rounded-full">
                Clean Flow
              </span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-semibold text-voca-muted">Day 1</span>
                <span className="font-display text-base font-bold text-voca-muted line-through">5.2%</span>
              </div>
              <ArrowRight className="w-4 h-4 text-voca-primary" />
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold text-voca-primary">Today</span>
                <span className="font-display text-lg font-extrabold text-voca-ink">&lt; 1%</span>
              </div>
            </div>
            <p className="text-[11px] text-voca-muted font-body pt-1 border-t border-voca-border/60">
              Replacing filler sounds ("um", "like") with silent pauses.
            </p>
          </div>

          {/* Shift 4: Getting to the Point */}
          <div className="p-4 rounded-xl bg-voca-surface-low border border-voca-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-voca-ink font-display">Directness</span>
              <span className="text-[10px] font-bold text-voca-primary bg-voca-tangerine-subtle px-2 py-0.5 rounded-full">
                Structured
              </span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-semibold text-voca-muted">Day 1</span>
                <span className="font-display text-xs font-semibold text-voca-muted">Rambling start</span>
              </div>
              <ArrowRight className="w-4 h-4 text-voca-primary" />
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold text-voca-primary">Today</span>
                <span className="font-display text-sm font-bold text-voca-ink">Point in 1st sentence</span>
              </div>
            </div>
            <p className="text-[11px] text-voca-muted font-body pt-1 border-t border-voca-border/60">
              Clear statement of opinion before giving examples.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* ANCHOR C: GOAL COMPETENCIES & MILESTONES */}
      {/* ========================================================= */}
      <section className="bg-voca-surface rounded-2xl p-5 border border-voca-border shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-voca-primary font-display block">
              Anchor C • Goal Competency
            </span>
            <h2 className="font-display text-lg font-bold text-voca-ink">
              {primaryGoalLabel}
            </h2>
          </div>
          <div className="w-9 h-9 rounded-full bg-voca-subtle text-voca-ink flex items-center justify-center">
            <Award className="w-4 h-4 text-voca-tangerine" />
          </div>
        </div>

        {/* Overall Competency Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-voca-muted font-body">Mastery Progression</span>
            <span className="text-voca-primary font-display font-bold">4 of 12 Challenges Unlocked</span>
          </div>
          <div className="w-full bg-voca-surface-low h-2.5 rounded-full overflow-hidden">
            <div className="bg-voca-tangerine h-full rounded-full w-[33%] transition-all" />
          </div>
        </div>

        {/* Milestones Achieved */}
        <div className="space-y-2.5 pt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-voca-muted font-display block">
            Milestones Earned:
          </span>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-voca-surface-low border border-voca-border flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-voca-success shrink-0" />
              <div className="flex-1">
                <span className="text-xs font-bold text-voca-ink block font-display">
                  Vocal Baseline Captured
                </span>
                <span className="text-[11px] text-voca-muted font-body">
                  Calibrated cadence, natural rhythm, and starting speed.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-voca-surface-low border border-voca-border flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-voca-success shrink-0" />
              <div className="flex-1">
                <span className="text-xs font-bold text-voca-ink block font-display">
                  Spontaneous Thinking (The 60-Second Challenge)
                </span>
                <span className="text-[11px] text-voca-muted font-body">
                  Maintained steady delivery for one full minute without halting.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-voca-surface-low border border-voca-border flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-voca-success shrink-0" />
              <div className="flex-1">
                <span className="text-xs font-bold text-voca-ink block font-display">
                  Clear Stance Committal (Five-Second Response)
                </span>
                <span className="text-[11px] text-voca-muted font-body">
                  Committed to an answer in the first sentence without stalling.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-voca-surface border border-voca-tangerine/30 flex items-center gap-3 opacity-75">
              <Sparkles className="w-4 h-4 text-voca-tangerine shrink-0" />
              <div className="flex-1">
                <span className="text-xs font-bold text-voca-ink block font-display">
                  Next: Thought Organization (Make Your Point)
                </span>
                <span className="text-[11px] text-voca-muted font-body">
                  Structure your answers with the Point-Reason-Example model.
                </span>
              </div>
              <button
                onClick={() => navigate('/challenges')}
                type="button"
                className="text-xs font-bold text-voca-primary hover:underline font-display"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Primary CTA */}
      <div className="pt-2">
        <button
          onClick={() => navigate('/challenges')}
          type="button"
          className="w-full flex items-center justify-center gap-2 h-14 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-base shadow-md active:scale-[0.98] transition-all cursor-pointer"
        >
          <Mic className="w-5 h-5" />
          <span>Continue Practice (Today's Challenge)</span>
        </button>
      </div>
    </div>
  )
}
