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
  Volume2,
  CircleDashed
} from 'lucide-react'
import { useAuthStore } from '@/features/auth/authStore'
import { getAllAudioRecordings, getAllSessionResults, type SessionResult } from '@/services/persistence/indexed-db'
import type { AudioRecording } from '@/services/audio/audio-types'

export default function ProgressView() {
  const navigate = useNavigate()
  const profile = useAuthStore((state) => state.profile)

  const [recordings, setRecordings] = useState<AudioRecording[]>([])
  const [sessions, setSessions] = useState<SessionResult[]>([])
  const [streakDays, setStreakDays] = useState(0)
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null)
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)
  const [activeAudioSrc, setActiveAudioSrc] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      const [allRecs, allSessions] = await Promise.all([
        getAllAudioRecordings(),
        getAllSessionResults()
      ])
      setRecordings(allRecs)
      setSessions(allSessions)

      if (allSessions.length > 0) {
        const days = new Set(allSessions.map((s) => new Date(s.createdAt).toISOString().split('T')[0]))
        setStreakDays(days.size)
      } else {
        setStreakDays(0)
      }
    }
    loadData()
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

  // Sort sessions chronologically (oldest first for baseline comparison)
  const chronologicalSessions = [...sessions].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

  const baselineSession = chronologicalSessions.length > 0 ? chronologicalSessions[0] : null
  const latestSession = chronologicalSessions.length > 0 ? chronologicalSessions[chronologicalSessions.length - 1] : null

  // Metric delta computations
  const baselineWpm = baselineSession ? Math.round(baselineSession.wordsPerMinute) : 0
  const latestWpm = latestSession ? Math.round(latestSession.wordsPerMinute) : 0
  const deltaWpm = latestWpm - baselineWpm

  const baselinePauses = baselineSession ? baselineSession.pauseCount : 0
  const latestPauses = latestSession ? latestSession.pauseCount : 0

  const baselineFillerPct = baselineSession ? baselineSession.fillerPercentage : 0
  const latestFillerPct = latestSession ? latestSession.fillerPercentage : 0

  const uniqueCompletedChallenges = new Set(
    sessions.filter((s) => s.challengeId).map((s) => s.challengeId)
  ).size
  const totalChallenges = 12
  const progressPercent = Math.min(100, Math.round((uniqueCompletedChallenges / totalChallenges) * 100))

  // Dynamic milestone checks
  const hasBaselineMilestone = sessions.length >= 1
  const hasSpontaneousMilestone = sessions.some((s) => s.wordCount >= 40)
  const hasPacingMilestone = sessions.some((s) => s.wordsPerMinute >= 120 && s.wordsPerMinute <= 165)
  const hasClarityMilestone = sessions.some((s) => s.fillerCount === 0 || s.fillerPercentage < 2)

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
          <span className="text-voca-muted font-normal ml-1">• {streakDays} {streakDays === 1 ? 'Day' : 'Days'} Streak</span>
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
        {recordings.length === 0 ? (
          <div className="rounded-xl bg-voca-surface-low p-6 border border-dashed border-voca-border text-center space-y-2">
            <p className="text-xs font-semibold text-voca-ink font-display">No practice takes recorded yet</p>
            <p className="text-xs text-voca-muted font-body">
              Complete your first exercise in the Speaking Studio or Challenges to hear your baseline audio take here.
            </p>
            <button
              onClick={() => navigate('/challenges')}
              type="button"
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-voca-tangerine text-voca-surface text-xs font-bold font-display shadow-xs hover:bg-voca-tangerine-hover transition-all cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Record your first take</span>
            </button>
          </div>
        ) : (
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
                    <span className="text-xs font-bold text-voca-ink">Initial Baseline Take</span>
                    {recordings[0] && (
                      <span className="text-[10px] font-semibold text-voca-muted bg-voca-surface px-1.5 py-0.5 rounded border border-voca-border">
                        {Math.round(recordings[0].durationSeconds)}s
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-voca-muted font-body mt-0.5">
                    {baselineSession
                      ? `${Math.round(baselineSession.wordsPerMinute)} words/min • ${baselineSession.pauseCount} pauses • ${baselineSession.fillerCount} fillers`
                      : 'Recorded baseline take'}
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
                    <span className="text-xs font-bold text-voca-ink">Latest Practice Take</span>
                    <span className="text-[10px] font-bold text-voca-primary bg-voca-tangerine-subtle px-1.5 py-0.5 rounded">
                      Latest
                    </span>
                  </div>
                  <p className="text-[11px] text-voca-primary font-medium font-body mt-0.5">
                    {latestSession
                      ? `${Math.round(latestSession.wordsPerMinute)} words/min • ${latestSession.pauseCount} pauses • ${latestSession.fillerCount} fillers`
                      : 'Latest recorded take'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-voca-primary tabular-nums">
                {recordings.length > 1 ? 'Evolving' : 'First Take'}
              </span>
            </div>
          </div>
        )}
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

        {sessions.length === 0 ? (
          <div className="rounded-xl bg-voca-surface-low p-6 border border-dashed border-voca-border text-center space-y-2">
            <p className="text-xs font-semibold text-voca-ink font-display">No session measurements yet</p>
            <p className="text-xs text-voca-muted font-body">
              As you practice, Voca computes deterministic metrics including talking speed, pauses, and filler frequency.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Shift 1: Talking Speed */}
            <div className="p-4 rounded-xl bg-voca-surface-low border border-voca-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-voca-ink font-display">Talking Speed</span>
                <span className="text-[10px] font-bold text-voca-primary bg-voca-tangerine-subtle px-2 py-0.5 rounded-full">
                  {sessions.length > 1 ? `${deltaWpm >= 0 ? '+' : ''}${deltaWpm} WPM shift` : 'Initial Baseline'}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-semibold text-voca-muted">Day 1</span>
                  <span className="font-display text-base font-bold text-voca-muted">
                    {baselineWpm} WPM
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-voca-primary" />
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase font-bold text-voca-primary">Today</span>
                  <span className="font-display text-lg font-extrabold text-voca-ink">
                    {latestWpm} WPM
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-voca-muted font-body pt-1 border-t border-voca-border/60">
                Optimal conversational sweet spot: 130–160 WPM.
              </p>
            </div>

            {/* Shift 2: Natural Breath Pauses */}
            <div className="p-4 rounded-xl bg-voca-surface-low border border-voca-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-voca-ink font-display">Natural Pauses</span>
                <span className="text-[10px] font-bold text-voca-primary bg-voca-tangerine-subtle px-2 py-0.5 rounded-full">
                  Thought Breaks
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-semibold text-voca-muted">Day 1</span>
                  <span className="font-display text-sm font-semibold text-voca-muted">
                    {baselinePauses} {baselinePauses === 1 ? 'pause' : 'pauses'}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-voca-primary" />
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase font-bold text-voca-primary">Today</span>
                  <span className="font-display text-base font-bold text-voca-ink">
                    {latestPauses} {latestPauses === 1 ? 'pause' : 'pauses'}
                  </span>
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
                <span className="text-[10px] font-bold text-voca-primary bg-voca-tangerine-subtle px-2 py-0.5 rounded-full">
                  Clean Flow
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-semibold text-voca-muted">Day 1</span>
                  <span className="font-display text-base font-bold text-voca-muted">
                    {baselineFillerPct.toFixed(1)}%
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-voca-primary" />
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase font-bold text-voca-primary">Today</span>
                  <span className="font-display text-lg font-extrabold text-voca-ink">
                    {latestFillerPct.toFixed(1)}%
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-voca-muted font-body pt-1 border-t border-voca-border/60">
                Replacing filler sounds ("um", "like") with silent pauses.
              </p>
            </div>

            {/* Shift 4: Getting to the Point */}
            <div className="p-4 rounded-xl bg-voca-surface-low border border-voca-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-voca-ink font-display">Focus Area</span>
                <span className="text-[10px] font-bold text-voca-primary bg-voca-tangerine-subtle px-2 py-0.5 rounded-full">
                  {latestSession ? latestSession.priorityArea : 'Clarity'}
                </span>
              </div>
              <div className="pt-1">
                <p className="text-xs font-semibold text-voca-ink font-body line-clamp-2">
                  {latestSession ? latestSession.priorityRecommendation : 'Practice opening with your main point directly.'}
                </p>
              </div>
              <p className="text-[11px] text-voca-muted font-body pt-1 border-t border-voca-border/60">
                Actionable coaching derived from your speaking samples.
              </p>
            </div>
          </div>
        )}
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
            <span className="text-voca-primary font-display font-bold">
              {uniqueCompletedChallenges} of {totalChallenges} Challenges Completed
            </span>
          </div>
          <div className="w-full bg-voca-surface-low h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-voca-tangerine h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Milestones Achieved */}
        <div className="space-y-2.5 pt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-voca-muted font-display block">
            Milestones Earned:
          </span>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-voca-surface-low border border-voca-border flex items-center gap-3">
              {hasBaselineMilestone ? (
                <CheckCircle2 className="w-4 h-4 text-voca-success shrink-0" />
              ) : (
                <CircleDashed className="w-4 h-4 text-voca-muted shrink-0" />
              )}
              <div className="flex-1">
                <span className="text-xs font-bold text-voca-ink block font-display">
                  Vocal Baseline Captured
                </span>
                <span className="text-[11px] text-voca-muted font-body">
                  {hasBaselineMilestone
                    ? 'Calibrated cadence, natural rhythm, and starting speed.'
                    : 'Record your first practice take to capture your baseline.'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-voca-surface-low border border-voca-border flex items-center gap-3">
              {hasSpontaneousMilestone ? (
                <CheckCircle2 className="w-4 h-4 text-voca-success shrink-0" />
              ) : (
                <CircleDashed className="w-4 h-4 text-voca-muted shrink-0" />
              )}
              <div className="flex-1">
                <span className="text-xs font-bold text-voca-ink block font-display">
                  Spontaneous Flow (40+ Words Delivered)
                </span>
                <span className="text-[11px] text-voca-muted font-body">
                  {hasSpontaneousMilestone
                    ? 'Maintained steady delivery through a complete thought.'
                    : 'Complete a speaking take with 40 or more words without halting.'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-voca-surface-low border border-voca-border flex items-center gap-3">
              {hasPacingMilestone ? (
                <CheckCircle2 className="w-4 h-4 text-voca-success shrink-0" />
              ) : (
                <CircleDashed className="w-4 h-4 text-voca-muted shrink-0" />
              )}
              <div className="flex-1">
                <span className="text-xs font-bold text-voca-ink block font-display">
                  Pacing Control (120–165 WPM)
                </span>
                <span className="text-[11px] text-voca-muted font-body">
                  {hasPacingMilestone
                    ? 'Achieved conversational pacing in the optimal comprehension zone.'
                    : 'Deliver a take in the sweet-spot rate of 120–165 words per minute.'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-voca-surface-low border border-voca-border flex items-center gap-3">
              {hasClarityMilestone ? (
                <CheckCircle2 className="w-4 h-4 text-voca-success shrink-0" />
              ) : (
                <CircleDashed className="w-4 h-4 text-voca-muted shrink-0" />
              )}
              <div className="flex-1">
                <span className="text-xs font-bold text-voca-ink block font-display">
                  Clean Articulation (Low Fillers)
                </span>
                <span className="text-[11px] text-voca-muted font-body">
                  {hasClarityMilestone
                    ? 'Delivered with under 2% filler word frequency.'
                    : 'Practice pausing silently rather than using filler words.'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-voca-surface border border-voca-tangerine/30 flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-voca-tangerine shrink-0" />
              <div className="flex-1">
                <span className="text-xs font-bold text-voca-ink block font-display">
                  Next Challenge: Explore Practice Topics
                </span>
                <span className="text-[11px] text-voca-muted font-body">
                  Pick an exercise from our catalog to target your next breakthrough.
                </span>
              </div>
              <button
                onClick={() => navigate('/challenges')}
                type="button"
                className="text-xs font-bold text-voca-primary hover:underline font-display cursor-pointer"
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
