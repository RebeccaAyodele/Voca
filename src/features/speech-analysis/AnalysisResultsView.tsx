import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Cpu,
  RefreshCw,
  RotateCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import HybridDiagnosticsDrawer from '@/components/diagnostics/HybridDiagnosticsDrawer'
import { getAudioRecording, saveSessionResult } from '@/services/persistence/indexed-db'
import { analyzeAudioSignal, type AudioSignalMetrics } from '@/services/audio/signal-analysis'
import { calculateTranscriptMetrics, type TranscriptMetrics } from '@/domain/metrics/transcript-metrics'
import { transcribeAudio } from '@/services/ai/transcription'
import { generateCoachingFeedback, type CoachingFeedback } from '@/services/ai/coaching'
import { getChallengeById } from '@/domain/challenges'
import { useAuthStore } from '@/features/auth/authStore'
import type { AudioRecording } from '@/services/audio/audio-types'

export default function AnalysisResultsView() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const recId = searchParams.get('recId')
  const challengeId = searchParams.get('challengeId')
  const challenge = challengeId ? getChallengeById(challengeId) : null
  const profile = useAuthStore((state) => state.profile)

  const [loading, setLoading] = useState(true)
  const [loadingStage, setLoadingStage] = useState('Decoding acoustic audio signal...')
  const [recording, setRecording] = useState<AudioRecording | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false)

  const [transcript, setTranscript] = useState('')
  const [signalMetrics, setSignalMetrics] = useState<AudioSignalMetrics | null>(null)
  const [transcriptMetrics, setTranscriptMetrics] = useState<TranscriptMetrics | null>(null)
  const [feedback, setFeedback] = useState<CoachingFeedback | null>(null)
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(true)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    let active = true

    async function processSpeech() {
      if (!recId) {
        navigate('/studio')
        return
      }

      const rec = await getAudioRecording(recId)
      if (!rec) {
        navigate('/studio')
        return
      }

      if (!active) return
      setRecording(rec)
      const url = URL.createObjectURL(rec.blob)
      setAudioUrl(url)

      try {
        // Stage 1: Decode physical audio signal
        setLoadingStage('Analyzing physical speech cadence & pauses...')
        const sig = await analyzeAudioSignal(rec.blob)
        if (!active) return
        setSignalMetrics(sig)

        // Stage 2: Transcribe via cloud AI
        setLoadingStage('Transcribing speech verbatim via Firebase AI...')
        const text = await transcribeAudio(rec.blob)
        if (!active) return
        setTranscript(text)

        // Stage 3: Calculate pure token metrics
        setLoadingStage('Calculating speaking rate & filler boundaries...')
        const tMetrics = calculateTranscriptMetrics(
          text,
          sig.durationSeconds,
          sig.speakingDurationSeconds
        )
        if (!active) return
        setTranscriptMetrics(tMetrics)

        // Stage 4: Generate hybrid AI coaching
        setLoadingStage('Synthesizing evidence-grounded AI coaching...')
        const goals = profile?.goals || ['public-speaking']
        const challengeContext = challenge
          ? {
              id: challenge.id,
              title: challenge.title,
              mission: challenge.mission,
              skillsAssessed: challenge.skillsAssessed
            }
          : undefined
        const coach = await generateCoachingFeedback(text, tMetrics, sig, goals, challengeContext)
        if (!active) return
        setFeedback(coach)

        // Save session result to drive adaptive habit-learning recommendation engine
        await saveSessionResult({
          id: 'session-' + Date.now().toString(36),
          recId: rec.id,
          challengeId: challenge?.id,
          challengeTitle: challenge?.title || 'Vocal Baseline',
          createdAt: new Date().toISOString(),
          transcript: text,
          wordsPerMinute: tMetrics.wordsPerMinute,
          wordCount: tMetrics.wordCount,
          fillerCount: tMetrics.fillerWordCount,
          fillerPercentage: tMetrics.fillerPercentage,
          pauseCount: sig.pauseCount,
          overallSummary: coach.overallSummary,
          priorityArea: coach.improvements[0]?.area || 'Pacing',
          priorityRecommendation: coach.improvements[0]?.recommendation || ''
        })
      } finally {
        if (active) setLoading(false)
      }
    }

    processSpeech()

    return () => {
      active = false
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [recId])

  const togglePlayAudio = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  // Seek and play specific moment in the recording
  const seekAndPlay = (seconds: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(0, Math.min(seconds, signalMetrics?.durationSeconds || 60))
    audioRef.current.play()
    setIsPlaying(true)
  }

  // Interactive Transcript with Word-Level Seeking & Filler Highlighting
  const renderInteractiveTranscript = () => {
    if (!transcript) return null

    const words = transcript.split(/\s+/).filter(Boolean)
    const totalWords = words.length
    const duration = signalMetrics?.durationSeconds || 15
    const fillerKeys = transcriptMetrics ? Object.keys(transcriptMetrics.fillerBreakdown).map(k => k.toLowerCase()) : []

    return (
      <div className="flex flex-wrap gap-x-1.5 gap-y-1 text-sm leading-relaxed">
        {words.map((word, index) => {
          const cleanWord = word.replace(/[^a-zA-Z']/g, '').toLowerCase()
          const isFiller = fillerKeys.includes(cleanWord)
          const estimatedTimestamp = (index / Math.max(1, totalWords)) * duration
          const isCurrentlyPlaying =
            currentTime >= estimatedTimestamp &&
            currentTime < estimatedTimestamp + duration / Math.max(1, totalWords) + 0.3

          return (
            <button
              key={index}
              type="button"
              onClick={() => seekAndPlay(estimatedTimestamp)}
              title={`Jump to ${estimatedTimestamp.toFixed(1)}s: "${word}"`}
              className={`px-1 py-0.5 rounded transition-all cursor-pointer text-left ${
                isCurrentlyPlaying
                  ? 'bg-voca-tangerine text-voca-surface font-bold scale-105 shadow-xs'
                  : isFiller
                  ? 'bg-voca-tangerine-subtle text-voca-primary font-bold border border-voca-tangerine/30 hover:bg-voca-tangerine/20'
                  : 'hover:bg-voca-surface-high text-voca-ink'
              }`}
            >
              {word}
            </button>
          )
        })}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-voca-canvas text-voca-ink min-h-screen flex flex-col items-center justify-center px-6 max-w-lg mx-auto text-center">
        <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-voca-tangerine/20 animate-ping"></div>
          <div className="relative w-16 h-16 rounded-full bg-voca-tangerine text-voca-surface flex items-center justify-center shadow-lg">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>
        </div>

        <h2 className="font-display text-2xl font-bold text-voca-ink mb-2">Analyzing Delivery</h2>
        <p className="text-sm text-voca-muted max-w-xs font-body animate-pulse">{loadingStage}</p>

        {/* 4 Stage Pills */}
        <div className="flex items-center gap-2 mt-8">
          <div className="w-2 h-2 rounded-full bg-voca-tangerine"></div>
          <div className="w-2 h-2 rounded-full bg-voca-tangerine"></div>
          <div className="w-2 h-2 rounded-full bg-voca-tangerine animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-voca-border"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-voca-canvas text-voca-ink min-h-screen flex flex-col justify-between px-4 sm:px-6 py-6 max-w-lg mx-auto">
      <div className="flex flex-col w-full pb-6">
        {/* Top Navigation */}
        <header className="flex items-center justify-between w-full mb-4">
          <button
            onClick={() => navigate('/studio')}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-voca-subtle hover:bg-voca-surface-high transition-colors shadow-xs active:scale-95 cursor-pointer"
            type="button"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-voca-ink" />
          </button>
          <span className="font-display font-bold text-xs uppercase tracking-wider text-voca-primary bg-voca-tangerine-subtle/60 px-3 py-1 rounded-full">
            {challenge ? challenge.title : 'Baseline Assessment Complete'}
          </span>
        </header>

        {/* Editorial Headline */}
        <div className="flex flex-col mb-5">
          <h1 className="font-display text-3xl font-extrabold text-voca-ink leading-tight">
            Speech Analysis &amp; <span className="text-voca-tangerine">Results</span>
          </h1>
          <p className="text-sm text-voca-muted mt-1 leading-relaxed font-body">
            Deterministic measurements from your voice sample paired with private AI feedback.
          </p>
        </div>

        {/* AI Coach Executive Summary Card */}
        {feedback && (
          <div className="relative rounded-2xl bg-voca-surface p-5 border border-voca-border shadow-xs mb-5">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-voca-surface-low">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-voca-tangerine" />
                <span className="font-display font-bold text-xs uppercase tracking-wider text-voca-ink">
                  Coach Assessment
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsDiagnosticsOpen(true)}
                title="Tap to inspect hybrid AI routing telemetry"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-voca-tangerine-subtle text-voca-primary border border-voca-tangerine/30 hover:bg-voca-tangerine/20 transition-colors cursor-pointer"
              >
                <Cpu className="w-3 h-3 text-voca-tangerine" />
                <span>{feedback.inferenceMetadata.actualSource === 'ON_DEVICE' ? 'On-Device (Nano)' : 'Cloud Gemini'} • Telemetry</span>
              </button>
            </div>
            <p className="text-sm text-voca-ink leading-relaxed font-body mb-3">{feedback.overallSummary}</p>
            <p className="text-xs text-voca-muted font-body italic bg-voca-surface-low p-2.5 rounded-xl border border-voca-border/50">
              {feedback.pacingReview}
            </p>
          </div>
        )}

        {/* Plain Everyday Delivery Scorecard */}
        {transcriptMetrics && (
          <div className="rounded-2xl bg-voca-surface p-5 border border-voca-border shadow-xs mb-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-voca-surface-low">
              <span className="text-[10px] font-bold uppercase tracking-wider text-voca-primary font-display">
                Delivery Breakdown
              </span>
              <span className="text-xs text-voca-muted font-body">
                Clear, everyday speech metrics
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Talking Speed */}
              <div className="p-3 rounded-xl bg-voca-surface-low border border-voca-border/80">
                <span className="text-[10px] uppercase font-bold tracking-wider text-voca-muted font-display block">
                  Talking Speed
                </span>
                <span className="font-display font-bold text-base text-voca-ink block mt-0.5">
                  {transcriptMetrics.wordsPerMinute} <span className="text-xs font-normal text-voca-muted">words/min</span>
                </span>
                <span className="text-[11px] text-voca-muted font-body block mt-0.5">
                  {transcriptMetrics.wordsPerMinute < 115
                    ? 'Deliberate & slow'
                    : transcriptMetrics.wordsPerMinute > 165
                    ? 'A bit fast / rushed'
                    : 'Natural conversational pace'}
                </span>
              </div>

              {/* Natural Pauses */}
              <div className="p-3 rounded-xl bg-voca-surface-low border border-voca-border/80">
                <span className="text-[10px] uppercase font-bold tracking-wider text-voca-muted font-display block">
                  Natural Pauses
                </span>
                <span className="font-display font-bold text-base text-voca-ink block mt-0.5">
                  {signalMetrics?.pauseCount || 0} <span className="text-xs font-normal text-voca-muted">breath pauses</span>
                </span>
                <span className="text-[11px] text-voca-muted font-body block mt-0.5">
                  {(signalMetrics?.pauseCount || 0) >= 2
                    ? 'Giving ideas room to breathe'
                    : 'Try taking a breath between points'}
                </span>
              </div>

              {/* Word Fillers */}
              <div className="p-3 rounded-xl bg-voca-surface-low border border-voca-border/80">
                <span className="text-[10px] uppercase font-bold tracking-wider text-voca-muted font-display block">
                  Word Fillers
                </span>
                <span className="font-display font-bold text-base text-voca-ink block mt-0.5">
                  {transcriptMetrics.fillerWordCount} <span className="text-xs font-normal text-voca-muted">detected</span>
                </span>
                <span className="text-[11px] text-voca-muted font-body block mt-0.5">
                  {transcriptMetrics.fillerWordCount === 0
                    ? 'Clean, fluent transitions'
                    : `${transcriptMetrics.fillerPercentage}% of spoken words`}
                </span>
              </div>

              {/* Directness / Words Spoken */}
              <div className="p-3 rounded-xl bg-voca-surface-low border border-voca-border/80">
                <span className="text-[10px] uppercase font-bold tracking-wider text-voca-muted font-display block">
                  Total Words
                </span>
                <span className="font-display font-bold text-base text-voca-ink block mt-0.5">
                  {transcriptMetrics.wordCount} <span className="text-xs font-normal text-voca-muted">words spoken</span>
                </span>
                <span className="text-[11px] text-voca-muted font-body block mt-0.5">
                  {signalMetrics ? `${signalMetrics.durationSeconds}s total duration` : 'Complete response'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Audio Player & Collapsible Transcript */}
        <div className="rounded-2xl bg-voca-surface p-4 border border-voca-border shadow-xs mb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlayAudio}
                type="button"
                className="w-10 h-10 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface flex items-center justify-center shadow-xs cursor-pointer active:scale-95 transition-all"
                aria-label={isPlaying ? 'Pause sample' : 'Play audio sample'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
              <div>
                <p className="font-display font-bold text-sm text-voca-ink">Listen to Your Attempt</p>
                <p className="text-xs text-voca-muted font-body tabular-nums">{recording?.durationSeconds}s recording</p>
              </div>
            </div>

            <button
              onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
              type="button"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-voca-subtle hover:bg-voca-surface-high text-xs font-display font-semibold text-voca-ink transition-colors cursor-pointer"
            >
              <span>{isTranscriptOpen ? 'Hide words' : 'Show words'}</span>
              {isTranscriptOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Collapsible Transcript Content with Interactive Word Seeking */}
          {isTranscriptOpen && (
            <div className="mt-4 pt-4 border-t border-voca-surface-low animate-in fade-in duration-150 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-voca-muted font-body">
                <span className="font-display font-semibold uppercase tracking-wider text-[10px]">
                  Interactive Transcript
                </span>
                <span>Tap any word to listen to that exact moment</span>
              </div>
              <div className="bg-voca-surface-low p-3.5 rounded-xl border border-voca-border">
                {renderInteractiveTranscript()}
              </div>
            </div>
          )}

          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          )}
        </div>

        {/* Strengths & Priority Technique */}
        {feedback && (
          <div className="space-y-3 mb-5">
            {/* Strengths */}
            <div className="rounded-2xl bg-voca-surface p-5 border border-voca-border shadow-xs">
              <div className="flex items-center gap-2 text-voca-success mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-display font-bold text-xs uppercase tracking-wider">
                  What Resonated
                </span>
              </div>
              <div className="space-y-2">
                {feedback.strengths.slice(0, 2).map((s, i) => (
                  <div key={i} className="text-xs">
                    <p className="font-bold text-voca-ink font-display text-sm">{s.title}</p>
                    <p className="text-voca-muted font-body mt-0.5">{s.observation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvement Area */}
            {feedback.improvements[0] && (
              <div className="rounded-2xl bg-voca-surface p-5 border border-voca-border shadow-xs">
                <div className="flex items-center gap-2 text-voca-primary mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-display font-bold text-xs uppercase tracking-wider">
                    One Micro-Adjustment
                  </span>
                </div>
                <div className="text-xs font-body space-y-2">
                  <p className="font-display font-bold text-sm text-voca-ink">
                    {feedback.improvements[0].area}
                  </p>
                  <p className="text-voca-muted">{feedback.improvements[0].observation}</p>
                  <p className="text-voca-primary font-semibold bg-voca-surface-low p-3 rounded-xl border border-voca-border">
                    Technique: {feedback.improvements[0].recommendation}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recommended Next Practice Drill */}
        {feedback?.nextExercise && (
          <div className="rounded-2xl bg-voca-surface-low border border-voca-border p-5 shadow-xs mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-voca-primary font-display">
              Recommended Next Drill
            </span>
            <h3 className="font-display text-base font-bold text-voca-ink mt-1 mb-1">
              {feedback.nextExercise.title}
            </h3>
            <p className="text-xs text-voca-muted font-body leading-relaxed mb-4">
              {feedback.nextExercise.instruction}
            </p>

            {challenge ? (
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => navigate(`/studio?challengeId=${challenge.id}`)}
                  type="button"
                  className="w-full h-12 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-[0.98]"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retry This Challenge</span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigate('/challenges')}
                    type="button"
                    className="h-11 rounded-full bg-voca-surface hover:bg-voca-surface-high border border-voca-border text-voca-ink font-display font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>All Challenges</span>
                    <ArrowRight className="w-3.5 h-3.5 text-voca-primary" />
                  </button>
                  <button
                    onClick={() => navigate('/skills')}
                    type="button"
                    className="h-11 rounded-full bg-voca-surface hover:bg-voca-surface-high border border-voca-border text-voca-ink font-display font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-voca-primary" />
                    <span>Skill Map</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/challenges')}
                type="button"
                className="w-full h-12 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-[0.98]"
              >
                <span>Explore Daily Challenges</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <footer className="w-full flex items-center justify-between pt-2 border-t border-voca-border text-xs text-voca-muted">
        <span>Voca • Deliberate Speech Calibration</span>
        <button
          onClick={() => navigate('/studio')}
          className="font-bold text-voca-primary hover:underline cursor-pointer font-display"
        >
          Return to Studio
        </button>
      </footer>

      {/* Hybrid Diagnostics Inspector Modal */}
      <HybridDiagnosticsDrawer
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
      />
    </div>
  )
}
