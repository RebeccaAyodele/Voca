import { useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronRight, Mic, Lock, Activity } from 'lucide-react'

export default function WelcomeView() {
  const navigate = useNavigate()

  return (
    <div className="bg-voca-canvas text-voca-ink h-screen h-[100dvh] max-h-[100dvh] flex flex-col justify-between px-4 sm:px-6 py-4 sm:py-6 max-w-lg mx-auto overflow-hidden select-none">
      <div className="flex-1 flex flex-col items-center justify-center w-full relative min-h-0">
        {/* Ambient Halo Glow */}
        <div className="absolute top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-voca-tangerine-subtle/40 blur-3xl pointer-events-none"></div>

        {/* Tactile Acoustic Soundform Sculpture (Sphere Icon) */}
        <div className="relative w-36 h-36 sm:w-52 sm:h-52 max-h-[26dvh] aspect-square my-auto flex items-center justify-center shrink-0">
          {/* Outer Soft Harmonic Resonance Rings */}
          <div className="absolute inset-0 rounded-full bg-voca-tangerine-subtle/50 scale-110 blur-xl animate-pulse"></div>

          {/* Primary Acoustic Sphere Icon */}
          <img
            src="/icon.svg"
            alt="Voca Soundform"
            className="relative w-32 h-32 sm:w-44 sm:h-44 object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105 cursor-pointer rounded-full"
          />

          {/* Orbiting Micro Badges */}
          <div className="absolute -top-1 right-1 sm:right-3 bg-voca-surface/95 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md flex items-center gap-1.5 transform rotate-6 border border-voca-border">
            <span className="w-1.5 h-1.5 rounded-full bg-voca-tangerine animate-ping"></span>
            <span className="text-[10px] font-bold text-voca-muted uppercase tracking-widest font-display">Resonant</span>
          </div>
          <div className="absolute bottom-1 left-1 sm:left-2 bg-voca-surface/95 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md flex items-center gap-1.5 transform -rotate-3 border border-voca-border">
            <Activity className="w-3 h-3 text-voca-primary" />
            <span className="text-[10px] font-semibold text-voca-muted tracking-wider tabular-nums">432 Hz</span>
          </div>
        </div>

        {/* Editorial Hierarchy & Brand Wordmark */}
        <div className="flex flex-col items-center text-center px-4 max-w-sm shrink-0 my-auto">
          {/* Micro Category Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-voca-tangerine-subtle/50 mb-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-voca-tangerine"></span>
            <span className="text-[10px] font-bold text-voca-primary tracking-wider uppercase font-display">Speech &amp; Resonance</span>
          </div>

          {/* Master Brand Wordmark */}
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-voca-ink mb-0.5">
            Voca
          </h1>

          {/* Playful Tagline */}
          <p className="font-display text-lg sm:text-2xl font-bold text-voca-tangerine mb-1.5">
            Find your voice. Express yourself.
          </p>

          {/* Purpose & Value Proposition */}
          <p className="text-xs sm:text-sm text-voca-muted leading-relaxed font-body max-w-xs">
            Deliberate communication development. Speak with natural cadence, harmonic warmth, and unshakeable poise.
          </p>
        </div>
      </div>

      {/* Lower Action Zone - Fixed to Bottom */}
      <div className="flex flex-col items-center w-full mt-auto space-y-2 sm:space-y-3 pb-1 shrink-0">
        {/* Step Indicator (Cadence Dots) */}
        <div aria-label="Onboarding step 1 of 5" className="flex items-center justify-center gap-2 mb-0.5">
          <span className="w-6 h-1.5 rounded-full bg-voca-tangerine transition-all duration-300"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-voca-border-subtle"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-voca-border-subtle"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-voca-border-subtle"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-voca-border-subtle"></span>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => navigate('/auth')}
          className="w-full max-w-sm h-12 sm:h-14 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-voca-tangerine/30 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          type="button"
        >
          <span>Get started</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Secondary Sign-in Button */}
        <button
          onClick={() => navigate('/auth?mode=signin')}
          className="py-1 px-4 rounded-full text-voca-muted hover:text-voca-ink text-xs font-semibold transition-colors duration-150 flex items-center gap-1 group cursor-pointer"
          type="button"
        >
          <span>I already have an account</span>
          <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Acoustic Micro-Footer */}
        <div className="pt-0.5 flex items-center justify-center gap-3 text-[11px] text-voca-muted-subtle">
          <div className="flex items-center gap-1">
            <Mic className="w-3 h-3" />
            <span>Studio Analysis</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Private &amp; On-device</span>
          </div>
        </div>
      </div>
    </div>
  )
}
