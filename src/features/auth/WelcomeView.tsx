import { useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronRight, Mic, Lock, Activity } from 'lucide-react'

export default function WelcomeView() {
  const navigate = useNavigate()

  return (
    <div className="bg-voca-canvas text-voca-ink min-h-screen flex flex-col justify-between px-4 sm:px-6 py-6 max-w-lg mx-auto">
      <div className="flex flex-col items-center w-full relative pt-2">
        {/* Ambient Halo Glow */}
        <div className="absolute -top-6 w-72 h-72 rounded-full bg-voca-tangerine-subtle/40 blur-3xl pointer-events-none transform -translate-y-4"></div>

        {/* Tactile Acoustic Soundform Sculpture (Sphere Icon) */}
        <div className="relative w-60 h-60 sm:w-68 sm:h-68 my-6 flex items-center justify-center">
          {/* Outer Soft Harmonic Resonance Rings */}
          <div className="absolute inset-0 rounded-full bg-voca-tangerine-subtle/50 scale-110 blur-xl animate-pulse"></div>

          {/* Primary Acoustic Sphere Icon */}
          <img
            src="/icon.png"
            alt="Voca Soundform"
            className="relative w-52 h-52 sm:w-60 sm:h-60 object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105 cursor-pointer"
          />

          {/* Orbiting Micro Badges */}
          <div className="absolute -top-1 right-4 bg-voca-surface/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 transform rotate-6 border border-voca-border">
            <span className="w-1.5 h-1.5 rounded-full bg-voca-tangerine animate-ping"></span>
            <span className="text-[10px] font-bold text-voca-muted uppercase tracking-widest font-display">Resonant</span>
          </div>
          <div className="absolute bottom-3 left-2 bg-voca-surface/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 transform -rotate-3 border border-voca-border">
            <Activity className="w-3 h-3 text-voca-primary" />
            <span className="text-[10px] font-semibold text-voca-muted tracking-wider tabular-nums">432 Hz</span>
          </div>
        </div>

        {/* Editorial Hierarchy & Brand Wordmark */}
        <div className="flex flex-col items-center text-center mt-2 px-4 max-w-sm">
          {/* Micro Category Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-voca-tangerine-subtle/50 mb-3 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-voca-tangerine"></span>
            <span className="text-[10px] font-bold text-voca-primary tracking-wider uppercase font-display">Speech &amp; Resonance</span>
          </div>

          {/* Master Brand Wordmark */}
          <h1 className="font-display text-5xl sm:text-6xl font-extrabold tracking-tight text-voca-ink mb-1">
            Voca
          </h1>

          {/* Playful Tagline */}
          <p className="font-display text-2xl font-bold text-voca-tangerine mb-3">
            Find your voice. Express yourself.
          </p>

          {/* Purpose & Value Proposition */}
          <p className="text-sm text-voca-muted leading-relaxed font-body">
            Deliberate communication development. Speak with natural cadence, harmonic warmth, and unshakeable poise.
          </p>
        </div>
      </div>

      {/* Lower Action Zone */}
      <div className="flex flex-col items-center w-full mt-8 space-y-4 pb-2">
        {/* Step Indicator (Cadence Dots) */}
        <div aria-label="Onboarding step 1 of 5" className="flex items-center justify-center gap-2 mb-1">
          <span className="w-6 h-1.5 rounded-full bg-voca-tangerine transition-all duration-300"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-voca-border-subtle"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-voca-border-subtle"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-voca-border-subtle"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-voca-border-subtle"></span>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => navigate('/auth')}
          className="w-full max-w-sm h-14 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-voca-tangerine/30 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          type="button"
        >
          <span>Get started</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Secondary Sign-in Button */}
        <button
          onClick={() => navigate('/auth?mode=signin')}
          className="py-2 px-4 rounded-full text-voca-muted hover:text-voca-ink text-xs font-semibold transition-colors duration-150 flex items-center gap-1 group cursor-pointer"
          type="button"
        >
          <span>I already have an account</span>
          <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Acoustic Micro-Footer */}
        <div className="pt-2 flex items-center justify-center gap-3 text-xs text-voca-muted-subtle">
          <div className="flex items-center gap-1">
            <Mic className="w-3.5 h-3.5" />
            <span>Studio Analysis</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Private &amp; On-device</span>
          </div>
        </div>
      </div>
    </div>
  )
}
