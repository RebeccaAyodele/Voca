import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Play,
  Pause,
  AlertCircle,
  Target,
  CheckCircle2,
  X,
  Check,
  Volume2,
  VolumeX,
  ChevronUp,
  Info,
  Lock,
  Sparkles
} from 'lucide-react'
import { AudioRecorderEngine } from '@/services/audio/recorder'
import { saveAudioRecording } from '@/services/persistence/indexed-db'
import { getChallengeById } from '@/domain/challenges'
import { useAuthStore } from '@/features/auth/authStore'
import { generateDynamicScenario, type GeneratedScenario } from '@/services/ai/scenario-generator'
import { SoundformBlob } from './SoundformBlob'
import type { AudioRecording, RecorderStatus } from '@/services/audio/audio-types'

const BASELINE_PROMPT_OPTIONS = [
  'Think of an idea or project you genuinely care about. Explain why it matters to someone hearing it for the first time.',
  'Share an unexpected lesson you learned from a recent challenge, and how it shifted your perspective.',
  'Describe what authentic communication means to you, and the vocal presence you want to embody.',
  'Introduce yourself and the core passion driving your work in three clear, resonant sentences.'
]

type StudioStep = 'prompt' | 'prep' | 'recording' | 'review'

export default function SpeakingStudioView() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const challengeId = searchParams.get('challengeId')
  const challenge = challengeId ? getChallengeById(challengeId) : null

  const isChallengeMode = Boolean(challenge)
  const targetDurationSeconds = challenge ? challenge.speakingDurationSeconds : 15
  const initialPrepSeconds = challenge ? challenge.prepDurationSeconds : 15

  const [promptIndex] = useState(0)
  const [step, setStep] = useState<StudioStep>('prompt')
  const [prepSecondsLeft, setPrepSecondsLeft] = useState(initialPrepSeconds)
  const [status, setStatus] = useState<RecorderStatus>('idle')
  const [isPaused, setIsPaused] = useState(false)
  const [secondsElapsed, setSecondsElapsed] = useState(0)
  const [currentVolume, setCurrentVolume] = useState(0)
  const [recording, setRecording] = useState<AudioRecording | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPromptExpanded, setIsPromptExpanded] = useState(false)
  const [hasDetectedVoice, setHasDetectedVoice] = useState(false)
  const [showTooShortWarning, setShowTooShortWarning] = useState(false)

  const recorderRef = useRef<AudioRecorderEngine | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const prepTimerRef = useRef<NodeJS.Timeout | null>(null)
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)

  const profile = useAuthStore((state) => state.profile)
  const [scenario, setScenario] = useState<GeneratedScenario | null>(null)
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false)
  const [usedPrompts, setUsedPrompts] = useState<string[]>([])

  const activePrompt = scenario
    ? scenario.prompt
    : challenge
    ? challenge.speakingPrompt
    : BASELINE_PROMPT_OPTIONS[promptIndex]

  // Automatically load a dynamic AI scenario on mount / when challengeId changes
  useEffect(() => {
    let isMounted = true

    async function loadInitialScenario() {
      setIsGeneratingScenario(true)
      try {
        const id = challengeId || 'baseline-speaking'
        const goals = profile?.goals || []
        const result = await generateDynamicScenario(id, goals, [])
        if (isMounted) {
          setScenario(result)
          setUsedPrompts([result.prompt])
        }
      } catch (err) {
        console.warn('Could not load AI scenario:', err)
      } finally {
        if (isMounted) {
          setIsGeneratingScenario(false)
        }
      }
    }

    loadInitialScenario()

    return () => {
      isMounted = false
    }
  }, [challengeId, profile?.goals])

  const handleGenerateNewScenario = async () => {
    if (isGeneratingScenario) return
    setIsGeneratingScenario(true)
    try {
      const id = challengeId || 'baseline-speaking'
      const goals = profile?.goals || []
      const result = await generateDynamicScenario(id, goals, usedPrompts)
      setScenario(result)
      setUsedPrompts((prev) => [...prev, result.prompt])
    } catch (err) {
      console.warn('Error generating AI scenario:', err)
    } finally {
      setIsGeneratingScenario(false)
    }
  }

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

  // Step 2: Start 15s preparation countdown
  const handleStartPrep = () => {
    setStep('prep')
    setPrepSecondsLeft(initialPrepSeconds)

    if (prepTimerRef.current) {
      clearInterval(prepTimerRef.current)
    }

    prepTimerRef.current = setInterval(() => {
      setPrepSecondsLeft((prev) => {
        if (prev <= 1) {
          if (prepTimerRef.current) clearInterval(prepTimerRef.current)
          handleStartRecording()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Skip preparation countdown directly into recording
  const handleSkipPrepToSpeak = () => {
    if (prepTimerRef.current) {
      clearInterval(prepTimerRef.current)
      prepTimerRef.current = null
    }
    handleStartRecording()
  }

  // Step 3: Start active recording
  const handleStartRecording = async () => {
    try {
      setErrorMessage(null)
      setStatus('requesting')
      setStep('recording')
      setIsPaused(false)
      setSecondsElapsed(0)
      setHasDetectedVoice(false)
      setShowTooShortWarning(false)

      if (!recorderRef.current) {
        recorderRef.current = new AudioRecorderEngine()
      }

      await recorderRef.current.start((amplitudes) => {
        // Average amplitude normalized to 0..1
        const avg = amplitudes.reduce((a, b) => a + b, 0) / amplitudes.length
        const normalized = Math.min(1, Math.max(0, (avg - 8) / 36))
        setCurrentVolume(normalized)
        if (normalized > 0.08) {
          setHasDetectedVoice(true)
        }
      })

      setStatus('recording')

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => {
          if (prev >= targetDurationSeconds - 1) {
            handleStopRecording()
            return targetDurationSeconds
          }
          return prev + 1
        })
      }, 1000)
    } catch (err: unknown) {
      setStatus('error')
      setStep('prompt')
      const msg = err instanceof Error ? err.message : 'Microphone permission was denied or is unavailable.'
      setErrorMessage(msg)
    }
  }

  // Pause / Resume recording toggle
  const handleTogglePause = () => {
    if (!recorderRef.current) return

    if (isPaused) {
      recorderRef.current.resume()
      setIsPaused(false)
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => {
          if (prev >= targetDurationSeconds - 1) {
            handleStopRecording()
            return targetDurationSeconds
          }
          return prev + 1
        })
      }, 1000)
    } else {
      recorderRef.current.pause()
      setIsPaused(true)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  // Ergonomic stop check (Nielsen Heuristic #5: Error Prevention for brief recordings)
  const handleAttemptStop = () => {
    if (secondsElapsed < 5) {
      if (!isPaused) {
        handleTogglePause()
      }
      setShowTooShortWarning(true)
      return
    }
    handleStopRecording()
  }

  const handleResumeFromTooShort = () => {
    setShowTooShortWarning(false)
    if (isPaused) {
      handleTogglePause()
    }
  }

  const handleForceFinish = () => {
    setShowTooShortWarning(false)
    handleStopRecording()
  }

  // Stop recording and move to review step
  const handleStopRecording = async () => {
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
      setStep('review')
      setCurrentVolume(0)
    } catch (err: unknown) {
      setStatus('error')
      const msg = err instanceof Error ? err.message : 'Failed to finalize audio recording.'
      setErrorMessage(msg)
    }
  }

  // Restart current session
  const handleRestartSession = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (recorderRef.current) {
      recorderRef.current.dispose()
      recorderRef.current = new AudioRecorderEngine()
    }
    setSecondsElapsed(0)
    setIsPaused(false)
    setCurrentVolume(0)
    handleStartRecording()
  }

  // Discard and re-record
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
    setStep('prompt')
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
      ...(challenge ? { challengeId: challenge.id } : {}),
      ...(activePrompt ? { prompt: activePrompt } : {})
    })
    navigate(`/analysis?${query.toString()}`)
  }

  const formatMinSec = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
  }

  // ==========================================
  // STAGE 3: ACTIVE RECORDING (STITCH FOCUSED)
  // Matches Stitch screen fd6bf7ee58994227bcbcf0c24d238198
  // ==========================================
  if (step === 'recording') {
    return (
      <div className="bg-voca-canvas text-voca-ink min-h-screen flex flex-col justify-between overflow-hidden select-none relative">
        {/* Minimal Top Bar (Exit action + live timer pill + prompt info toggle) */}
        <header className="w-full z-50 pt-safe px-6 flex items-center justify-between">
          <div className="h-16 flex items-center justify-between w-full max-w-md mx-auto">
            <button
              aria-label="Exit Session"
              onClick={() => {
                if (timerRef.current) clearInterval(timerRef.current)
                if (recorderRef.current) recorderRef.current.dispose()
                setStep('prompt')
              }}
              className="min-w-[44px] min-h-[44px] -ml-2 rounded-full flex items-center justify-center text-voca-muted hover:text-voca-ink hover:bg-voca-surface-low transition-colors active:scale-95 cursor-pointer"
              type="button"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Live Timer Pill */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-voca-surface border border-voca-border shadow-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  isPaused ? 'bg-voca-muted' : 'bg-voca-primary animate-pulse'
                }`}
              />
              <span className="font-display font-semibold text-xs tracking-wider text-voca-ink tabular-nums">
                {formatMinSec(secondsElapsed)} / {formatMinSec(targetDurationSeconds)}
              </span>
            </div>

            {/* Toggle Full Prompt Button */}
            <button
              type="button"
              onClick={() => setIsPromptExpanded(!isPromptExpanded)}
              aria-label="Toggle full prompt details"
              className="min-w-[44px] min-h-[44px] -mr-2 rounded-full flex items-center justify-center text-voca-muted hover:text-voca-ink hover:bg-voca-surface-low transition-colors cursor-pointer"
              title={isPromptExpanded ? 'Hide prompt details' : 'View full prompt details'}
            >
              {isPromptExpanded ? <ChevronUp className="w-5 h-5" /> : <Info className="w-5 h-5 text-voca-primary" />}
            </button>
          </div>
        </header>

        {/* Microphone Silence Warning (Nielsen Heuristic #1) */}
        {secondsElapsed >= 3 && !hasDetectedVoice && !isPaused && (
          <div className="absolute top-16 left-0 right-0 mx-auto w-fit z-40 px-3.5 py-1.5 rounded-full bg-voca-surface border border-voca-warning/40 text-voca-ink text-xs font-body flex items-center gap-1.5 shadow-md animate-in fade-in">
            <VolumeX className="w-3.5 h-3.5 text-voca-warning shrink-0" />
            <span>No audio detected yet — check if your mic is muted</span>
          </div>
        )}

        {/* Central Focal Point: Breathing Voca Acoustic Soundform from Stitch */}
        <main className="flex-1 flex flex-col items-center justify-center relative w-full px-6 my-auto">
          <SoundformBlob
            isRecording={status === 'recording'}
            isPaused={isPaused}
            volume={currentVolume}
          />

          {/* Legible Prompt Reminder (HCI: Recognition Over Recall) */}
          <div
            onClick={() => setIsPromptExpanded(!isPromptExpanded)}
            className="relative z-10 mt-3 max-w-sm text-center px-4 py-2.5 rounded-2xl bg-voca-surface/90 backdrop-blur-md border border-voca-border shadow-xs cursor-pointer hover:bg-voca-surface transition-all duration-200"
          >
            <p className="font-display font-semibold text-xs sm:text-sm text-voca-ink leading-relaxed">
              “{activePrompt}”
            </p>

            {isPromptExpanded && challenge && (
              <div className="mt-2.5 pt-2 border-t border-voca-surface-low text-left space-y-1.5 animate-in fade-in">
                <span className="text-[10px] font-bold uppercase tracking-wider text-voca-primary font-display block">
                  Focus Anchors:
                </span>
                <p className="text-[11px] text-voca-muted font-body leading-relaxed">
                  {challenge.mission}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {challenge.skillsAssessed.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-voca-surface-low px-2 py-0.5 rounded-md text-voca-muted"
                    >
                      • {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Serene Bottom Controls (Fitts's Law Ergonomic Primary Action) */}
        <footer className="w-full pb-safe px-6 mb-8 flex flex-col items-center justify-center z-50">
          <div className="w-full max-w-sm flex items-center justify-between gap-3 px-2">
            {/* Secondary Action: Restart */}
            <button
              onClick={handleRestartSession}
              type="button"
              aria-label="Restart Session"
              className="w-12 h-12 rounded-full bg-voca-surface hover:bg-voca-surface-high border border-voca-border shadow-xs flex items-center justify-center text-voca-muted hover:text-voca-ink active:scale-95 transition-all cursor-pointer shrink-0"
              title="Restart session"
            >
              <RotateCcw className="w-5 h-5 text-voca-ink" />
            </button>

            {/* Primary Action: Done Speaking (Large Fitts's Target) */}
            <button
              onClick={handleAttemptStop}
              type="button"
              className="flex-1 h-14 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-sm shadow-lg shadow-voca-tangerine/25 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>Done Speaking</span>
            </button>

            {/* Secondary Action: Pause / Resume */}
            <button
              onClick={handleTogglePause}
              type="button"
              aria-label={isPaused ? 'Resume recording' : 'Pause recording'}
              className="w-12 h-12 rounded-full bg-voca-surface hover:bg-voca-surface-high border border-voca-border shadow-xs flex items-center justify-center text-voca-ink active:scale-95 transition-all cursor-pointer shrink-0"
              title={isPaused ? 'Resume recording' : 'Pause recording'}
            >
              {isPaused ? (
                <Play className="w-5 h-5 fill-current ml-0.5 text-voca-primary" />
              ) : (
                <Pause className="w-5 h-5 fill-current text-voca-muted" />
              )}
            </button>
          </div>
        </footer>

        {/* Accidental Brief Recording Guard Modal (Nielsen Heuristic #5) */}
        {showTooShortWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-voca-canvas border border-voca-border p-6 shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-voca-tangerine-subtle text-voca-primary flex items-center justify-center mx-auto border border-voca-tangerine/30">
                <Info className="w-6 h-6 text-voca-tangerine" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-voca-ink">
                  Only {secondsElapsed} Seconds Spoken
                </h3>
                <p className="font-body text-xs text-voca-muted mt-1 leading-relaxed">
                  Speaking for at least 15 seconds allows Voca to accurately measure your talking speed, natural pauses, and thought progression.
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleResumeFromTooShort}
                  className="w-full h-12 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-sm shadow-xs cursor-pointer transition-all active:scale-95"
                >
                  Keep Speaking
                </button>
                <button
                  type="button"
                  onClick={handleRestartSession}
                  className="w-full h-11 rounded-full bg-voca-surface hover:bg-voca-surface-high border border-voca-border text-voca-ink font-display font-bold text-xs cursor-pointer transition-colors"
                >
                  Start Over
                </button>
                <button
                  type="button"
                  onClick={handleForceFinish}
                  className="text-[11px] font-body text-voca-muted hover:text-voca-ink hover:underline pt-1 cursor-pointer"
                >
                  Finish anyway with {secondsElapsed}s
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ==========================================
  // STAGE 2: PREPARATION PHASE (15 SECONDS)
  // Shows the topic with the countdown timer
  // ==========================================
  if (step === 'prep') {
    const prepProgress = ((initialPrepSeconds - prepSecondsLeft) / initialPrepSeconds) * 100

    return (
      <div className="bg-voca-canvas text-voca-ink min-h-screen flex flex-col justify-between px-4 sm:px-6 py-6 max-w-lg mx-auto">
        <header className="flex items-center justify-between w-full mb-4">
          <button
            onClick={() => {
              if (prepTimerRef.current) clearInterval(prepTimerRef.current)
              setStep('prompt')
            }}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-voca-subtle hover:bg-voca-surface-high transition-colors shadow-xs active:scale-95 cursor-pointer"
            type="button"
            aria-label="Cancel preparation"
          >
            <ArrowLeft className="w-5 h-5 text-voca-ink" />
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-voca-primary font-display bg-voca-tangerine-subtle px-3 py-1 rounded-full">
            Preparation Phase
          </span>
        </header>

        <main className="flex-1 flex flex-col justify-center my-auto w-full">
          {/* Active Speaking Prompt Card - Read and gather thoughts */}
          <div className="w-full rounded-2xl bg-voca-surface p-5 border border-voca-border shadow-xs mb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-voca-muted font-display block mb-2">
              Your Speaking Prompt
            </span>
            <p className="font-display text-xl sm:text-2xl font-semibold text-voca-ink leading-relaxed">
              “{activePrompt}”
            </p>
          </div>

          {/* Central Serene Countdown Ring */}
          <div className="flex flex-col items-center justify-center text-center my-6">
            <div className="relative w-36 h-36 flex items-center justify-center mb-4">
              {/* Circular SVG Ring */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-voca-border-subtle"
                  strokeWidth="5"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-voca-tangerine transition-all duration-1000 ease-linear"
                  strokeWidth="5"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * prepProgress) / 100}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-display text-4xl font-extrabold text-voca-ink tabular-nums">
                  {prepSecondsLeft}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-voca-muted font-display">
                  Seconds
                </span>
              </div>
            </div>

            <p className="font-display text-base font-bold text-voca-ink mb-1">
              Take a calm breath. Gather your thoughts.
            </p>
            <p className="font-body text-xs text-voca-muted max-w-xs leading-relaxed">
              Recording starts automatically when the timer reaches zero, or tap below when ready.
            </p>
          </div>
        </main>

        <footer className="w-full flex flex-col items-center mt-auto pb-4">
          <button
            onClick={handleSkipPrepToSpeak}
            type="button"
            className="w-full flex items-center justify-center gap-2 h-14 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-base shadow-md active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>I'm Ready to Speak</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </footer>
      </div>
    )
  }

  // ==========================================
  // STAGE 4: REVIEW & PLAYBACK
  // ==========================================
  if (step === 'review') {
    return (
      <div className="bg-voca-canvas text-voca-ink min-h-screen flex flex-col justify-between px-4 sm:px-6 py-6 max-w-lg mx-auto">
        <header className="flex items-center justify-between w-full mb-4">
          <button
            onClick={handleDiscard}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-voca-subtle hover:bg-voca-surface-high transition-colors shadow-xs active:scale-95 cursor-pointer"
            type="button"
            aria-label="Discard and return"
          >
            <ArrowLeft className="w-5 h-5 text-voca-ink" />
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-voca-primary font-display bg-voca-tangerine-subtle px-3 py-1 rounded-full">
            Session Take Ready
          </span>
        </header>

        <main className="flex-1 flex flex-col justify-center w-full my-auto">
          {/* Celebratory Tag */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-voca-tangerine-subtle text-voca-primary flex items-center justify-center mb-3 shadow-xs">
              <Sparkles className="w-7 h-7" />
            </div>
            <h1 className="font-display text-2xl font-bold text-voca-ink">
              Take captured
            </h1>
            <p className="font-body text-xs text-voca-muted mt-1">
              Duration: {formatMinSec(secondsElapsed)} • Review playback or submit for coaching analysis
            </p>
          </div>

          {/* Audio Player Card */}
          <div className="w-full rounded-2xl bg-voca-surface p-5 border border-voca-border shadow-xs flex flex-col items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleAudioPlayback}
                type="button"
                className="flex items-center justify-center w-14 h-14 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface shadow-md cursor-pointer transition-transform active:scale-95"
                aria-label={isPlaying ? 'Pause playback' : 'Play take'}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
              </button>

              <div className="flex flex-col">
                <span className="font-display font-bold text-sm text-voca-ink">
                  {isPlaying ? 'Playing back take' : 'Listen to your voice'}
                </span>
                <span className="font-body text-xs text-voca-muted">
                  Recorded in local IndexedDB
                </span>
              </div>
            </div>

            {/* Hidden HTML5 Audio Element */}
            {audioUrl && (
              <audio
                ref={audioPlayerRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            )}

            <button
              onClick={handleDiscard}
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-voca-surface-low border border-voca-border text-xs font-semibold text-voca-muted hover:text-voca-ink transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard & Re-record</span>
            </button>
          </div>
        </main>

        <footer className="w-full flex flex-col items-center mt-auto pb-4 gap-3">
          <button
            onClick={handleAnalyze}
            type="button"
            className="w-full flex items-center justify-center gap-2 h-14 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-base shadow-md active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Analyze Take & Get Feedback</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 text-voca-muted">
            <Lock className="w-3.5 h-3.5 text-voca-muted-subtle" />
            <span className="text-[11px] text-voca-muted font-body">
              Speech analysis runs via Firebase Hybrid AI
            </span>
          </div>
        </footer>
      </div>
    )
  }

  // ==========================================
  // STAGE 1: TOPIC FIRST (PROMPT INTRODUCTION)
  // Shows topic/prompt BEFORE the 15-second countdown begins!
  // ==========================================
  return (
    <div className="bg-voca-canvas text-voca-ink min-h-screen flex flex-col justify-between px-4 sm:px-6 py-6 max-w-lg mx-auto">
      <div className="flex flex-col w-full pb-4 select-none">
        {/* Top Header */}
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

        {/* Editorial Headline */}
        <div className="flex flex-col mb-4">
          <h1 className="font-display text-3xl font-extrabold text-voca-ink leading-tight">
            {challenge ? challenge.title : 'Capture your vocal baseline'}
          </h1>
          <p className="text-sm text-voca-muted mt-1 leading-relaxed font-body">
            {challenge
              ? challenge.tagline
              : 'Speak naturally to capture cadence, pitch variance, and speech rhythm.'}
          </p>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-voca-danger/20 text-voca-danger text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Speaking Prompt Card (Dynamically Generated with Firebase AI) */}
        <div className="relative w-full rounded-2xl bg-voca-surface p-5 border border-voca-border shadow-xs mb-4">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-voca-surface-low">
            <div className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-voca-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-voca-primary font-display">
                Speaking Scenario
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGenerateNewScenario}
                disabled={isGeneratingScenario}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-voca-tangerine-subtle hover:bg-voca-tangerine/20 text-xs font-semibold text-voca-primary transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                title="Generate a fresh speaking scenario with AI"
              >
                <Sparkles className={`w-3.5 h-3.5 text-voca-tangerine ${isGeneratingScenario ? 'animate-spin' : ''}`} />
                <span>{isGeneratingScenario ? 'Generating...' : 'New AI Topic'}</span>
              </button>
              <span className="px-2.5 py-1 rounded-full bg-voca-subtle text-xs font-semibold text-voca-muted tabular-nums">
                {targetDurationSeconds}s speaking
              </span>
            </div>
          </div>

          {/* AI Theme & Source Badges */}
          {scenario && !isGeneratingScenario && (
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {scenario.context && (
                <span className="text-xs font-semibold text-voca-ink px-2.5 py-0.5 rounded-md bg-voca-surface-low border border-voca-border">
                  {scenario.context}
                </span>
              )}
              <span className="text-[10px] uppercase font-bold tracking-wider text-voca-primary bg-voca-tangerine-subtle px-2 py-0.5 rounded-md">
                {scenario.source === 'ON_DEVICE_AI' ? 'On-Device AI' : scenario.source === 'CLOUD_AI' ? 'Cloud Gemini' : 'Adaptive Bank'}
              </span>
            </div>
          )}

          {/* Prompt Content */}
          {isGeneratingScenario ? (
            <div className="py-4 space-y-2.5 animate-pulse">
              <div className="h-5 bg-voca-surface-low rounded-md w-4/5" />
              <div className="h-5 bg-voca-surface-low rounded-md w-3/5" />
            </div>
          ) : (
            <p className="font-display text-xl sm:text-2xl text-voca-ink leading-relaxed font-semibold py-2">
              “{activePrompt}”
            </p>
          )}

          {/* AI Focus Tip */}
          {scenario?.focusTip && !isGeneratingScenario && (
            <div className="mt-3 pt-3 border-t border-voca-surface-low flex items-start gap-2 text-xs text-voca-muted font-body">
              <span className="font-bold text-voca-ink shrink-0">Focus tip:</span>
              <span className="leading-relaxed">{scenario.focusTip}</span>
            </div>
          )}
        </div>

        {/* 2. Challenge Mission & Focus Points (if challenge mode) */}
        {challenge && (
          <div className="mb-4 rounded-2xl bg-voca-surface border border-voca-border p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-voca-primary font-display uppercase tracking-wider">
              <Target className="w-4 h-4" />
              <span>Your Mission</span>
            </div>
            <p className="text-xs text-voca-ink font-body leading-relaxed">{challenge.mission}</p>
            <div className="pt-2 border-t border-voca-surface-low">
              <span className="text-[10px] font-bold uppercase tracking-wider text-voca-muted font-display block mb-1.5">
                What to focus on:
              </span>
              <ul className="space-y-1.5">
                {challenge.focusPoints.map((pt, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-voca-muted font-body">
                    <CheckCircle2 className="w-3.5 h-3.5 text-voca-success shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Time Structure Breakdown Banner */}
        <div className="rounded-xl bg-voca-surface-low p-3.5 border border-voca-border/80 flex items-center justify-between text-xs text-voca-muted font-body mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-voca-tangerine" />
            <span>Preparation: <strong>{initialPrepSeconds}s</strong></span>
          </div>
          <span className="text-voca-border">•</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-voca-primary" />
            <span>Speaking: <strong>{targetDurationSeconds}s</strong></span>
          </div>
        </div>
      </div>

      {/* Primary Bottom Actions */}
      <footer className="flex flex-col items-center w-full mt-auto pb-2 gap-3">
        {/* Primary CTA: Start 15s Preparation */}
        <button
          onClick={handleStartPrep}
          type="button"
          className="w-full flex items-center justify-center gap-2 h-14 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-base shadow-md active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>Start {initialPrepSeconds}s Preparation</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Skip Prep Direct Option */}
        <button
          onClick={handleStartRecording}
          type="button"
          className="text-xs font-semibold text-voca-muted hover:text-voca-ink py-1 transition-colors cursor-pointer"
        >
          Skip preparation and speak immediately
        </button>

        {/* Privacy Note */}
        <div className="flex items-center justify-center gap-1.5 mt-1 text-voca-muted">
          <Lock className="w-3.5 h-3.5 text-voca-muted-subtle" />
          <p className="text-[11px] text-voca-muted-subtle text-center font-body">
            Your recording stays local in IndexedDB until you submit it for analysis.
          </p>
        </div>
      </footer>
    </div>
  )
}
