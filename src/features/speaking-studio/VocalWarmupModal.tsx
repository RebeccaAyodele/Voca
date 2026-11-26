import { useState, useEffect, useRef } from 'react'
import {
  X,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Volume2
} from 'lucide-react'
import { AudioRecorderEngine } from '@/services/audio/recorder'
import { SoundformBlob } from './SoundformBlob'

interface VocalWarmupModalProps {
  isOpen: boolean
  onClose: () => void
  onCompleteToPractice?: () => void
}

interface WarmupStep {
  title: string
  subtitle: string
  instruction: string
  phrase?: string
  tip: string
  durationSeconds: number
}

const WARMUP_STEPS: WarmupStep[] = [
  {
    title: 'Step 1 • Diaphragm Breath & Hum',
    subtitle: 'Waking up vocal resonance & releasing throat tension',
    instruction: 'Inhale slowly into your belly for 4 seconds, then gently hum "mmmm" on a long exhale. Feel the vibration in your chest and lips.',
    tip: 'Keep your shoulders dropped and jaw completely relaxed.',
    durationSeconds: 20
  },
  {
    title: 'Step 2 • Crisp Consonant Articulation',
    subtitle: 'Warming up lip and tongue muscles for clarity',
    instruction: 'Repeat this phrase out loud with exaggerated clarity. Make every single consonant distinct:',
    phrase: '“Red leather, yellow leather. Crisp consonants deliver clear thoughts.”',
    tip: 'Do not rush; emphasize the "d", "th", "p", and "ts" sounds.',
    durationSeconds: 20
  },
  {
    title: 'Step 3 • The Grounded Breath Pause',
    subtitle: 'Calibrating silence and authoritative cadence',
    instruction: 'Speak the opening line below, hold a calm 2-second silent pause while breathing, then finish with a confident downward pitch:',
    phrase: '“When we speak with deliberate composure, [pause 2s] people listen with full attention.”',
    tip: 'Drop your pitch slightly on the final word "attention" to signal authority.',
    durationSeconds: 20
  }
]

const DEFAULT_STEP: WarmupStep = WARMUP_STEPS[0] as WarmupStep

export default function VocalWarmupModal({
  isOpen,
  onClose,
  onCompleteToPractice
}: VocalWarmupModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_STEP.durationSeconds)
  const [currentVolume, setCurrentVolume] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const recorderRef = useRef<AudioRecorderEngine | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const currentStep: WarmupStep = WARMUP_STEPS[currentStepIndex] ?? DEFAULT_STEP

  // Cleanup on unmount or close
  useEffect(() => {
    return () => {
      if (recorderRef.current) recorderRef.current.dispose()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  if (!isOpen) return null

  const startWarmupStep = async () => {
    setIsActive(true)
    setSecondsLeft(currentStep.durationSeconds)

    try {
      if (!recorderRef.current) {
        recorderRef.current = new AudioRecorderEngine()
      }

      await recorderRef.current.start((amplitudes) => {
        const avg = amplitudes.reduce((a, b) => a + b, 0) / amplitudes.length
        const norm = Math.min(1, Math.max(0, (avg - 8) / 36))
        setCurrentVolume(norm)
      })

      if (timerRef.current) clearInterval(timerRef.current)

      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            handleStepComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch {
      // Fallback if mic is unavailable
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            handleStepComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  const handleStepComplete = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (recorderRef.current) recorderRef.current.dispose()
    setIsActive(false)
    setCurrentVolume(0)

    if (currentStepIndex < WARMUP_STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1
      const nextStep = WARMUP_STEPS[nextIndex]
      setCurrentStepIndex(nextIndex)
      if (nextStep) {
        setSecondsLeft(nextStep.durationSeconds)
      }
    } else {
      setIsCompleted(true)
    }
  }

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (recorderRef.current) recorderRef.current.dispose()
    setCurrentStepIndex(0)
    setIsActive(false)
    setIsCompleted(false)
    setCurrentVolume(0)
    setSecondsLeft(DEFAULT_STEP.durationSeconds)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-voca-canvas border border-voca-border shadow-2xl p-6 flex flex-col justify-between max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-voca-surface-low">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-voca-tangerine animate-pulse" />
            <span className="font-display font-extrabold text-sm uppercase tracking-wider text-voca-ink">
              60-Second Vocal Warm-Up
            </span>
          </div>
          <button
            onClick={() => {
              handleReset()
              onClose()
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-voca-muted hover:text-voca-ink hover:bg-voca-surface-high cursor-pointer transition-colors"
            type="button"
            aria-label="Close warm-up"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-3 gap-2 py-3">
          {WARMUP_STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentStepIndex
                  ? 'bg-voca-tangerine shadow-xs'
                  : idx < currentStepIndex || isCompleted
                  ? 'bg-voca-success'
                  : 'bg-voca-border'
              }`}
            />
          ))}
        </div>

        {/* Main Content Stage */}
        {!isCompleted ? (
          <div className="flex flex-col items-center text-center my-3 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-voca-primary font-display block mb-1">
                {currentStep.title}
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-voca-ink">
                {currentStep.subtitle}
              </h2>
            </div>

            {/* Soundform Blob in Warm-up scale */}
            <div className="py-1">
              <SoundformBlob
                isRecording={isActive}
                isPaused={!isActive}
                volume={currentVolume}
              />
            </div>

            {/* Instruction Card */}
            <div className="w-full rounded-2xl bg-voca-surface p-4 border border-voca-border shadow-xs text-left space-y-2">
              <p className="font-body text-xs text-voca-ink leading-relaxed">
                {currentStep.instruction}
              </p>
              {currentStep.phrase && (
                <p className="font-display text-sm font-semibold text-voca-primary italic bg-voca-tangerine-subtle/50 p-2.5 rounded-xl border border-voca-tangerine/20">
                  {currentStep.phrase}
                </p>
              )}
              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-voca-muted font-body">
                <Volume2 className="w-3.5 h-3.5 text-voca-tangerine shrink-0" />
                <span>{currentStep.tip}</span>
              </div>
            </div>

            {/* Timer & Controls */}
            <div className="flex items-center justify-between w-full pt-1 px-2">
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-2xl text-voca-ink tabular-nums">
                  {secondsLeft}s
                </span>
                <span className="text-xs text-voca-muted font-body">remaining</span>
              </div>

              {!isActive ? (
                <button
                  type="button"
                  onClick={startWarmupStep}
                  className="px-6 py-3 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Step ({currentStep.durationSeconds}s)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStepComplete}
                  className="px-4 py-2 rounded-full bg-voca-surface border border-voca-border hover:bg-voca-surface-high text-xs font-bold font-display text-voca-ink cursor-pointer transition-colors"
                >
                  Next Step
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Completion State */
          <div className="flex flex-col items-center text-center my-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-voca-tangerine-subtle text-voca-primary flex items-center justify-center shadow-sm">
              <Sparkles className="w-8 h-8" />
            </div>

            <div>
              <h2 className="font-display text-2xl font-extrabold text-voca-ink">
                Vocal System Warmed Up
              </h2>
              <p className="text-xs text-voca-muted font-body max-w-sm mt-1 leading-relaxed">
                Your diaphragm resonance is engaged, facial muscles are alert, and breath pauses are calibrated. You are ready to speak.
              </p>
            </div>

            <div className="w-full pt-4 space-y-2">
              {onCompleteToPractice && (
                <button
                  type="button"
                  onClick={() => {
                    handleReset()
                    onClose()
                    onCompleteToPractice()
                  }}
                  className="w-full h-14 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-base shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                >
                  <span>Begin Today's Practice</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}

              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2.5 text-xs font-semibold text-voca-muted hover:text-voca-ink flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Repeat Warm-Up</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
