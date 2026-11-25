import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Mic,
  Square,
  Timer,
  Lock,
  Volume2,
  RotateCcw,
  Play,
  Pause,
  AlertCircle,
  Shuffle,
  Target,
  CheckCircle2,
  Hourglass
} from 'lucide-react'
import { AudioRecorderEngine } from '@/services/audio/recorder'
import { saveAudioRecording } from '@/services/persistence/indexed-db'
import { getChallengeById } from '@/domain/challenges'
import type { AudioRecording, RecorderStatus } from '@/services/audio/audio-types'

const BASELINE_PROMPT_OPTIONS = [
  'Think of an idea or project you genuinely care about. In 15 seconds, explain why it matters to someone hearing it for the first time.',
  'Share an unexpected lesson you learned from a recent challenge, and how it shifted your perspective.',
  'Describe what authentic communication means to you, and the vocal presence you want to embody.',
  'Introduce yourself and the core passion driving your work in three clear, resonant sentences.'
]

export default function SpeakingStudioView() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const challengeId = searchParams.get('challengeId')
  const challenge = challengeId ? getChallengeById(challengeId) : null

  const isChallengeMode = Boolean(challenge)
  const targetDurationSeconds = challenge ? challenge.speakingDurationSeconds : 15

  const [promptIndex, setPromptIndex] = useState(0)
  const [status, setStatus] = useState<RecorderStatus>('idle')
  const [isPreparing, setIsPreparing] = useState(false)
  const [prepSecondsLeft, setPrepSecondsLeft] = useState(challenge ? challenge.prepDurationSeconds : 0)
  const [secondsElapsed, setSecondsElapsed] = useState(0)
  const [recording, setRecording] = useState<AudioRecording | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [waveHeights, setWaveHeights] = useState<number[]>([
    10, 14, 12, 18, 16, 24, 30, 36, 22, 28, 34, 38, 26, 20, 14, 18, 12, 16, 10
  ])

  const recorderRef = useRef<AudioRecorderEngine | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const prepTimerRef = useRef<NodeJS.Timeout | null>(null)
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    recorderRef.current = new AudioRecorderEngine()

    return () => {
      if (recorderRef.current) {
        recorderRef.current.dispose()
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (prepTimerRef.current) {
        clearInterval(prepTimerRef.current)
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const startPreparation = () => {
    if (!challenge) {
      startRecording()
      return
    }

    setIsPreparing(true)
    setPrepSecondsLeft(challenge.prepDurationSeconds)

    prepTimerRef.current = setInterval(() => {
      setPrepSecondsLeft((prev) => {
        if (prev <= 1) {
          if (prepTimerRef.current) clearInterval(prepTimerRef.current)
          setIsPreparing(false)
          startRecording()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const skipPreparationAndRecord = () => {
    if (prepTimerRef.current) {
      clearInterval(prepTimerRef.current)
    }
    setIsPreparing(false)
    startRecording()
  }

  const startRecording = async () => {
    try {
      setErrorMessage(null)
      setStatus('requesting')

      if (!recorderRef.current) {
        recorderRef.current = new AudioRecorderEngine()
      }

      await recorderRef.current.start((amplitudes) => {
        setWaveHeights(amplitudes)
      })

      setStatus('recording')
      setSecondsElapsed(0)

      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => {
          if (prev >= targetDurationSeconds - 1) {
            stopRecording()
            return targetDurationSeconds
          }
          return prev + 1
        })
      }, 1000)
    } catch (err: unknown) {
      setStatus('error')
      const msg = err instanceof Error ? err.message : 'Microphone permission was denied or is unavailable.'
      setErrorMessage(msg)
    }
  }

  const stopRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (!recorderRef.current) return

    try {
      const rec = await recorderRef.current.stop()
      setRecording(rec)
      await saveAudioRecording(rec)

      const url = URL.createObjectURL(rec.blob)
      setAudioUrl(url)
      setStatus('stopped')
      setWaveHeights([10, 14, 12, 18, 16, 24, 30, 36, 22, 28, 34, 38, 26, 20, 14, 18, 12, 16, 10])
    } catch (err: unknown) {
      setStatus('error')
      const msg = err instanceof Error ? err.message : 'Failed to finalize recording.'
      setErrorMessage(msg)
    }
  }

  const handleDiscard = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause()
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }
    setRecording(null)
    setSecondsElapsed(0)
    setIsPlaying(false)
    setStatus('idle')
  }

  const toggleAudioPlayback = () => {
    if (!audioPlayerRef.current) return

    if (isPlaying) {
      audioPlayerRef.current.pause()
      setIsPlaying(false)
    } else {
      audioPlayerRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleAnalyze = () => {
    if (!recording) return
    const query = new URLSearchParams({
      recId: recording.id,
      ...(challenge ? { challengeId: challenge.id } : {})
    })
    navigate(`/analysis?${query.toString()}`)
  }

  const formatMinSec = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
  }

  const formattedTimer = `${formatMinSec(secondsElapsed)} / ${formatMinSec(targetDurationSeconds)}`

  return (
    <div className="bg-voca-canvas text-voca-ink min-h-screen flex flex-col justify-between px-4 sm:px-6 py-6 max-w-lg mx-auto">
      <div className="flex flex-col w-full pb-4 select-none">
        {/* Top Navigation */}
        <header className="flex items-center justify-between w-full mb-4">
          <button
            onClick={() => navigate(isChallengeMode ? '/challenges' : '/onboarding/goals')}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-voca-subtle hover:bg-voca-surface-high transition-colors shadow-xs active:scale-95 cursor-pointer"
            type="button"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-voca-ink" />
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-voca-primary font-display bg-voca-tangerine-subtle px-3 py-1 rounded-full">
            {challenge ? challenge.title : 'Baseline Setup'}
          </span>
        </header>

        {/* Editorial Headline & Guidance */}
        <div className="flex flex-col mb-4">
          <h1 className="font-display text-3xl font-extrabold text-voca-ink leading-tight">
            {challenge ? (
              <>
                {challenge.title}
              </>
            ) : (
              <>
                Capture your <span className="text-voca-tangerine">vocal baseline</span>
              </>
            )}
          </h1>
          <p className="text-sm text-voca-muted mt-1 leading-relaxed font-body">
            {challenge
              ? challenge.tagline
              : 'Speak naturally for 15 seconds to analyze cadence, pitch variance, and pacing.'}
          </p>
        </div>

        {/* Challenge Mission / Focus Points Box (if in challenge mode) */}
        {challenge && (
          <div className="mb-4 rounded-2xl bg-voca-surface border border-voca-border p-4 shadow-xs space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-voca-primary font-display uppercase tracking-wider">
              <Target className="w-4 h-4" />
              <span>Your Mission</span>
            </div>
            <p className="text-xs text-voca-ink font-body leading-relaxed">{challenge.mission}</p>
            <div className="pt-2 border-t border-voca-surface-low">
              <span className="text-[10px] font-bold uppercase tracking-wider text-voca-muted font-display block mb-1">
                Focus on:
              </span>
              <ul className="space-y-1">
                {challenge.focusPoints.map((pt, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-xs text-voca-muted font-body">
                    <CheckCircle2 className="w-3.5 h-3.5 text-voca-success shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-voca-danger/20 text-voca-danger text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Prompt Card */}
        <div className="relative w-full rounded-2xl bg-voca-surface p-5 border border-voca-border shadow-xs mb-4">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-voca-surface-low">
            <div className="flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-voca-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-voca-primary font-display">
                Speaking Prompt
              </span>
            </div>
            <div className="flex items-center gap-2">
              {!isChallengeMode && (
                <button
                  type="button"
                  onClick={() => setPromptIndex((prev) => (prev + 1) % BASELINE_PROMPT_OPTIONS.length)}
                  className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-voca-subtle hover:bg-voca-surface-high text-[10px] font-semibold text-voca-muted hover:text-voca-ink transition-colors cursor-pointer"
                  title="Shuffle prompt"
                >
                  <Shuffle className="w-3 h-3 text-voca-tangerine" />
                  <span>Shuffle</span>
                </button>
              )}
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-voca-subtle text-[10px] font-semibold text-voca-muted tabular-nums">
                <Timer className="w-3 h-3 text-voca-gold" />
                {targetDurationSeconds}s
              </span>
            </div>
          </div>
          <p className="font-display text-lg text-voca-ink leading-relaxed font-semibold text-center sm:text-left py-2">
            “{challenge ? challenge.speakingPrompt : BASELINE_PROMPT_OPTIONS[promptIndex]}”
          </p>
        </div>

        {/* Preparation Countdown Box (Active during challenge preparation phase) */}
        {isPreparing && (
          <div className="mb-4 p-4 rounded-2xl bg-voca-tangerine-subtle/50 border border-voca-tangerine/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hourglass className="w-5 h-5 text-voca-primary animate-spin" />
              <div>
                <p className="font-display font-bold text-sm text-voca-ink">
                  Preparation time: <span className="tabular-nums text-voca-primary">{prepSecondsLeft}s</span>
                </p>
                <p className="text-xs text-voca-muted font-body">Gather your thoughts before recording begins.</p>
              </div>
            </div>
            <button
              onClick={skipPreparationAndRecord}
              type="button"
              className="px-3 py-1.5 rounded-full bg-voca-surface border border-voca-border text-xs font-bold text-voca-ink font-display hover:bg-voca-surface-high transition-colors cursor-pointer"
            >
              Skip to speak
            </button>
          </div>
        )}

        {/* Waveform Visualization & Controller */}
        <div className="flex flex-col items-center justify-center w-full rounded-2xl bg-voca-surface-low p-5 border border-voca-border shadow-xs mb-4 relative overflow-hidden">
          <div className="absolute w-44 h-44 rounded-full bg-voca-tangerine/10 blur-2xl pointer-events-none"></div>

          {/* Live timer badge */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`flex h-2 w-2 rounded-full ${
                status === 'recording' ? 'bg-voca-tangerine animate-ping' : 'bg-voca-muted'
              }`}
            ></span>
            <span className="font-bold text-sm text-voca-ink tracking-wider tabular-nums font-display">
              {formattedTimer}
            </span>
          </div>

          {/* Dynamic Waveform Frequency Bars */}
          <div className="flex items-center justify-center gap-1.5 w-full h-14 mb-5 px-2">
            {waveHeights.map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}px` }}
                className={`w-1 rounded-full transition-all duration-100 ${
                  status === 'recording'
                    ? i % 3 === 0
                      ? 'bg-voca-tangerine'
                      : i % 2 === 0
                      ? 'bg-voca-primary'
                      : 'bg-voca-gold'
                    : 'bg-voca-border-subtle'
                }`}
              />
            ))}
          </div>

          {/* Controller Actions */}
          {status !== 'stopped' ? (
            <div className="relative flex items-center justify-center">
              {status === 'recording' && (
                <div className="absolute w-20 h-20 rounded-full bg-voca-tangerine/20 animate-ping opacity-60"></div>
              )}
              <button
                onClick={
                  status === 'recording'
                    ? stopRecording
                    : isChallengeMode && !isPreparing
                    ? startPreparation
                    : startRecording
                }
                aria-label={status === 'recording' ? 'Stop recording' : 'Start speaking'}
                type="button"
                className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full text-voca-surface shadow-lg active:scale-95 transition-transform cursor-pointer ${
                  status === 'recording'
                    ? 'bg-voca-primary hover:bg-voca-tangerine-hover'
                    : 'bg-voca-tangerine hover:bg-voca-tangerine-hover'
                }`}
              >
                {status === 'recording' ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-7 h-7" />}
              </button>
            </div>
          ) : (
            /* Review & Playback Controller */
            <div className="flex items-center gap-4 z-10">
              <button
                onClick={handleDiscard}
                type="button"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-voca-surface border border-voca-border text-voca-muted hover:text-voca-ink text-xs font-semibold cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-record</span>
              </button>

              <button
                onClick={toggleAudioPlayback}
                type="button"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-voca-tangerine text-voca-surface shadow-md hover:bg-voca-tangerine-hover cursor-pointer"
                aria-label={isPlaying ? 'Pause playback' : 'Play recording'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
            </div>
          )}

          {/* Hidden HTML5 Audio Element for Local Playback */}
          {audioUrl && (
            <audio
              ref={audioPlayerRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          )}

          {/* Status Subtitle */}
          <div className="flex items-center gap-1.5 mt-3 text-voca-muted">
            <Volume2 className="w-3.5 h-3.5 text-voca-tangerine" />
            <span className="text-xs font-medium font-body">
              {status === 'recording'
                ? 'Recording in progress... speak naturally'
                : status === 'stopped'
                ? 'Recording ready • Listen to review or submit for analysis'
                : isPreparing
                ? 'Thinking phase... prepare your points'
                : 'Tap microphone to begin'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <footer className="flex flex-col items-center w-full mt-auto pb-2">
        {/* Step dots (only on baseline) */}
        {!isChallengeMode && (
          <div aria-label="Step 4 of 5" className="flex items-center justify-center gap-1.5 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-voca-border-subtle"></span>
            <span className="h-1.5 w-1.5 rounded-full bg-voca-border-subtle"></span>
            <span className="h-1.5 w-1.5 rounded-full bg-voca-border-subtle"></span>
            <span className="h-1.5 w-6 rounded-full bg-voca-tangerine transition-all"></span>
            <span className="h-1.5 w-1.5 rounded-full bg-voca-border-subtle"></span>
          </div>
        )}

        {/* Primary Action Button */}
        {status === 'stopped' ? (
          <button
            onClick={handleAnalyze}
            type="button"
            className="w-full flex items-center justify-center gap-2 h-14 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-base shadow-md active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Analyze {isChallengeMode ? 'Challenge Response' : 'Voice Baseline'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={
              status === 'recording'
                ? stopRecording
                : isChallengeMode && !isPreparing
                ? startPreparation
                : startRecording
            }
            type="button"
            className="w-full flex items-center justify-center gap-2 h-14 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-base shadow-md active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>
              {status === 'recording'
                ? 'Finish Recording'
                : isPreparing
                ? 'Skip Prep & Speak'
                : isChallengeMode
                ? 'Start Challenge'
                : 'Start Baseline Recording'}
            </span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        {/* Privacy Assurance */}
        <div className="flex items-center justify-center gap-1.5 mt-3 text-voca-muted">
          <Lock className="w-3.5 h-3.5 text-voca-muted-subtle" />
          <p className="text-[11px] text-voca-muted-subtle text-center font-body">
            Your recording stays local in IndexedDB until you submit it for analysis.
          </p>
        </div>
      </footer>
    </div>
  )
}
