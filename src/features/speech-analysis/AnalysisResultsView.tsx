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
  Compass,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { getAudioRecording } from '@/services/persistence/indexed-db'
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

  const [transcript, setTranscript] = useState('')
  const [signalMetrics, setSignalMetrics] = useState<AudioSignalMetrics | null>(null)
  const [transcriptMetrics, setTranscriptMetrics] = useState<TranscriptMetrics | null>(null)
  const [feedback, setFeedback] = useState<CoachingFeedback | null>(null)
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false)

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
              title: challenge.title,
              mission: challenge.mission,
              skillsAssessed: challenge.skillsAssessed
            }
          : undefined
        const coach = await generateCoachingFeedback(text, tMetrics, sig, goals, challengeContext)
        if (!active) return
        setFeedback(coach)
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

  // Highlight filler words inside the transcript
  const renderHighlightedTranscript = () => {
    if (!transcript) return null
    if (!transcriptMetrics || transcriptMetrics.fillerWordCount === 0) {
      return <span>{transcript}</span>
    }

    const fillerKeys = Object.keys(transcriptMetrics.fillerBreakdown)
    if (fillerKeys.length === 0) return <span>{transcript}</span>

    const regex = new RegExp(`\\b(${fillerKeys.join('|')})\\b`, 'gi')
    const parts = transcript.split(regex)

    return parts.map((part, index) => {
      const isFiller = fillerKeys.some((f) => f.toLowerCase() === part.toLowerCase())
      if (isFiller) {
        return (
          <span
            key={index}
            className="px-1.5 py-0.5 mx-0.5 rounded-md bg-voca-tangerine-subtle font-bold text-voca-primary text-xs"
            title="Filler word detected"
          >
            {part}
          </span>
        )
      }
      return <span key={index}>{part}</span>
    })
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
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-voca-subtle text-voca-muted">
                <Cpu className="w-3 h-3 text-voca-tangerine" />
                <span>{feedback.inferenceMetadata.actualSource === 'ON_DEVICE' ? 'On-Device (Nano)' : 'Cloud Gemini'}</span>
              </span>
            </div>
            <p className="text-sm text-voca-ink leading-relaxed font-body mb-3">{feedback.overallSummary}</p>
            <p className="text-xs text-voca-muted font-body italic bg-voca-surface-low p-2.5 rounded-xl border border-voca-border/50">
              {feedback.pacingReview}
            </p>
          </div>
        )}

        {/* Human Delivery Rhythm & Pacing */}
        {transcriptMetrics && (
          <div className="rounded-2xl bg-voca-surface p-5 border border-voca-border shadow-xs mb-5 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-voca-primary font-display">
              Delivery Rhythm
            </span>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-body">
                <span className="text-voca-muted">Pacing</span>
                <span className="font-bold text-voca-ink">
                  {transcriptMetrics.wordsPerMinute < 115
                    ? 'Deliberate & Measured'
                    : transcriptMetrics.wordsPerMinute > 170
                    ? 'Energetic & Fast'
                    : 'Natural & Balanced'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-body">
                <span className="text-voca-muted">Flow & Continuity</span>
                <span className="font-bold text-voca-ink">
                  {transcriptMetrics.fillerPercentage <= 4 ? 'Smooth & Composed' : 'Natural conversational flow'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-body">
                <span className="text-voca-muted">Pausing</span>
                <span className="font-bold text-voca-ink">
                  {signalMetrics && signalMetrics.pauseCount > 0
                    ? `${signalMetrics.pauseCount} thoughtful breath pauses`
                    : 'Continuous delivery'}
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

          {/* Collapsible Transcript Content */}
          {isTranscriptOpen && (
            <div className="mt-4 pt-4 border-t border-voca-surface-low animate-in fade-in duration-150">
              <p className="text-sm text-voca-ink leading-relaxed font-body">
                {renderHighlightedTranscript()}
              </p>
            </div>
          )}

          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
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
                    <Compass className="w-3.5 h-3.5 text-voca-primary" />
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
    </div>
  )
}
