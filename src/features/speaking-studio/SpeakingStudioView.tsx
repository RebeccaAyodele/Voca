import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Mic, Pause, Timer, Lock, Volume2 } from 'lucide-react'

export default function SpeakingStudioView() {
  const navigate = useNavigate()
  const [isRecording, setIsRecording] = useState(false)
  const [secondsElapsed, setSecondsElapsed] = useState(0)
  const [waveHeights, setWaveHeights] = useState<number[]>([
    12, 16, 14, 20, 18, 28, 34, 40, 26, 30, 36, 42, 28, 22, 16, 20, 14, 18, 12
  ])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const waveRef = useRef<NodeJS.Timeout | null>(null)

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    setSecondsElapsed(0)

    waveRef.current = setInterval(() => {
      setWaveHeights((prev) =>
        prev.map(() => Math.floor(Math.random() * 40) + 10)
      )
    }, 120)

    timerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => {
        if (prev >= 14) {
          stopRecording()
          return 15
        }
        return prev + 1
      })
    }, 1000)
  }

  const stopRecording = () => {
    setIsRecording(false)
    if (timerRef.current) clearInterval(timerRef.current)
    if (waveRef.current) clearInterval(waveRef.current)
    setWaveHeights([12, 16, 14, 20, 18, 28, 34, 40, 26, 30, 36, 42, 28, 22, 16, 20, 14, 18, 12])
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (waveRef.current) clearInterval(waveRef.current)
    }
  }, [])

  const formattedTimer = `00:${secondsElapsed < 10 ? '0' + secondsElapsed : secondsElapsed} / 00:15`

  return (
    <div className="bg-[#FBF9F5] text-[#1B1C1A] min-h-screen flex flex-col justify-between px-4 sm:px-6 py-6 max-w-lg mx-auto">
      <div className="flex flex-col w-full pb-4 select-none">
        {/* Top Navigation */}
        <header className="flex items-center justify-between w-full mb-4">
          <button
            onClick={() => navigate('/onboarding/goals')}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#EFEEEA] hover:bg-[#EAE8E4] transition-colors shadow-xs active:scale-95 cursor-pointer"
            type="button"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-[#1B1C1A]" />
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-[#695B58] hover:text-[#1B1C1A] transition-colors py-1 px-2 cursor-pointer"
            type="button"
          >
            Skip
          </button>
        </header>

        {/* Editorial Headline & Guidance */}
        <div className="flex flex-col mb-4">
          <h1 className="font-serif text-3xl font-bold text-[#1B1C1A] leading-tight">
            Capture your <span className="italic text-[#F47B45] font-normal">vocal baseline</span>
          </h1>
          <p className="text-sm text-[#695B58] mt-1.5 leading-relaxed">
            Speak naturally for 15 seconds to analyze cadence, pitch variance, and pacing.
          </p>
        </div>

        {/* Prompt Passage Card */}
        <div className="relative w-full rounded-2xl bg-white p-5 border border-[#EAE5DF] shadow-xs mb-4">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#F5F3EF]">
            <div className="flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-[#A23F0A]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A23F0A]">
                Speaking Prompt
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EFEEEA] text-[10px] font-semibold text-[#695B58]">
                <Timer className="w-3 h-3 text-[#805521]" />
                0:15s
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EEDCD7]/60 text-[10px] font-semibold text-[#6D605C]">
                Natural pace
              </span>
            </div>
          </div>
          <p className="font-serif text-lg text-[#1B1C1A] leading-relaxed italic text-center sm:text-left py-2">
            “Tell us about yourself, or share a story about a memorable day in your life.”
          </p>
        </div>

        {/* Waveform Visualization & Controller */}
        <div className="flex flex-col items-center justify-center w-full rounded-2xl bg-[#F5F3EF] p-5 border border-[#EAE5DF] shadow-xs mb-4 relative overflow-hidden">
          <div className="absolute w-44 h-44 rounded-full bg-[#F47B45]/10 blur-2xl pointer-events-none"></div>

          {/* Live timer badge */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`flex h-2 w-2 rounded-full ${
                isRecording ? 'bg-[#F47B45] animate-ping' : 'bg-[#695B58]'
              }`}
            ></span>
            <span className="font-bold text-sm text-[#1B1C1A] tracking-wider tabular-nums">
              {formattedTimer}
            </span>
          </div>

          {/* Dynamic Waveform Frequency Bars */}
          <div className="flex items-center justify-center gap-1.5 w-full h-14 mb-5 px-2">
            {waveHeights.map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}px` }}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isRecording
                    ? i % 3 === 0
                      ? 'bg-[#F47B45]'
                      : i % 2 === 0
                      ? 'bg-[#A23F0A]'
                      : 'bg-[#C79359]'
                    : 'bg-[#DEC0B5]'
                }`}
              />
            ))}
          </div>

          {/* Interactive Record Trigger */}
          <div className="relative flex items-center justify-center">
            {isRecording && (
              <div className="absolute w-20 h-20 rounded-full bg-[#F47B45]/20 animate-ping opacity-60"></div>
            )}
            <button
              onClick={toggleRecording}
              aria-label={isRecording ? 'Pause recording' : 'Start recording'}
              type="button"
              className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full text-white shadow-lg active:scale-95 transition-transform cursor-pointer ${
                isRecording ? 'bg-[#A23F0A]' : 'bg-[#F47B45] hover:bg-[#A23F0A]'
              }`}
            >
              {isRecording ? <Pause className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            </button>
          </div>

          {/* Status Subtitle */}
          <div className="flex items-center gap-1.5 mt-3 text-[#695B58]">
            <Volume2 className="w-3.5 h-3.5 text-[#F47B45]" />
            <span className="text-xs font-medium">
              {isRecording
                ? 'Recording in progress... speak naturally'
                : secondsElapsed >= 15
                ? 'Recording complete • Ready for analysis'
                : 'Tap microphone to begin baseline capture'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <footer className="flex flex-col items-center w-full mt-auto pb-2">
        {/* Step 4 of 5 (Elongated Pill) */}
        <div aria-label="Step 4 of 5" className="flex items-center justify-center gap-1.5 mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-[#DEC0B5]"></span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#DEC0B5]"></span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#DEC0B5]"></span>
          <span className="h-1.5 w-6 rounded-full bg-[#F47B45] transition-all"></span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#DEC0B5]"></span>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => {
            if (secondsElapsed === 0 && !isRecording) {
              startRecording()
            } else {
              alert('Baseline captured! Phase 3 will now connect audio analysis & transcription.')
            }
          }}
          type="button"
          className="w-full flex items-center justify-center gap-2 h-14 rounded-full bg-[#F47B45] hover:bg-[#A23F0A] text-white font-semibold text-base shadow-md active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>{secondsElapsed >= 15 ? 'Analyze Voice Baseline' : 'Start Baseline Recording'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Privacy Assurance */}
        <div className="flex items-center justify-center gap-1.5 mt-3 text-[#695B58]">
          <Lock className="w-3.5 h-3.5 text-[#8A7268]" />
          <p className="text-[11px] text-[#8A7268] text-center">
            Your voice recording is processed securely on-device and kept strictly private.
          </p>
        </div>
      </footer>
    </div>
  )
}
