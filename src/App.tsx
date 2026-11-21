import { Sparkles, Mic, BarChart2, ShieldCheck } from 'lucide-react'

export default function App() {
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1B1C1A] flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-[#EAE5DF] bg-[#FBF9F5]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Voca" className="h-8 w-auto" />
            <span className="font-serif font-bold text-2xl tracking-tight text-[#1B1C1A]">Voca</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F47B45]/10 text-[#A23F0A]">
              <span className="w-2 h-2 rounded-full bg-[#F47B45] animate-pulse"></span>
              Hybrid AI Engine Ready
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F47B45]/10 border border-[#F47B45]/20 text-[#A23F0A] text-xs font-semibold uppercase tracking-wider mb-8">
          <Sparkles className="w-3.5 h-3.5 text-[#F47B45]" />
          Deliberate Communication Development
        </div>

        <h1 className="font-serif text-5xl sm:text-6xl font-bold tracking-tight text-[#1B1C1A] max-w-2xl leading-[1.15] mb-6">
          Find your voice. <br />
          <span className="italic font-normal text-[#F47B45]">Express yourself.</span>
        </h1>

        <p className="text-lg text-[#6A6966] max-w-xl mb-10 leading-relaxed">
          Voca pairs physical audio signal measurements with private, on-device AI coaching to help you speak with clarity, resonance, and conviction.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
          <button className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#F47B45] text-white font-semibold shadow-md shadow-[#F47B45]/20 hover:bg-[#A23F0A] transition-all cursor-pointer">
            <Mic className="w-4 h-4" />
            Start Baseline Practice
          </button>
          <button className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-[#EAE5DF] text-[#1B1C1A] font-semibold hover:bg-[#EFEEEA] transition-all cursor-pointer">
            <BarChart2 className="w-4 h-4 text-[#6A6966]" />
            View Skill Radar
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 rounded-2xl bg-white border border-[#EAE5DF] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F47B45]/10 flex items-center justify-center mb-4 text-[#F47B45]">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-[#1B1C1A] text-base mb-1">Physical Signal Metrics</h3>
            <p className="text-sm text-[#6A6966]">Deterministic WPM, pause cadence, and loudness dynamic range via Web Audio API.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#EAE5DF] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F47B45]/10 flex items-center justify-center mb-4 text-[#F47B45]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-[#1B1C1A] text-base mb-1">Hybrid AI Coaching</h3>
            <p className="text-sm text-[#6A6966]">Private on-device Gemini Nano with seamless cloud fallback via Firebase AI Logic.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#EAE5DF] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F47B45]/10 flex items-center justify-center mb-4 text-[#F47B45]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-[#1B1C1A] text-base mb-1">Private & Grounded</h3>
            <p className="text-sm text-[#6A6966]">Evidence-grounded feedback without fabricated scores or unsolicited audio uploads.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EAE5DF] py-6 text-center text-xs text-[#6A6966]">
        Voca • Built with Firebase AI Logic & Google Stitch Design System
      </footer>
    </div>
  )
}
