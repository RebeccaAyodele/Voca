import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Mic, LayoutDashboard, Compass, LineChart, Cpu } from 'lucide-react'
import HybridDiagnosticsDrawer from '@/components/diagnostics/HybridDiagnosticsDrawer'

export default function AppLayout() {
  const navigate = useNavigate()
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false)

  const navLinks = [
    { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/studio', label: 'Studio', icon: Mic },
    { to: '/skills', label: 'Skills', icon: Compass },
    { to: '/progress', label: 'Progress', icon: LineChart }
  ]

  return (
    <div className="bg-voca-canvas text-voca-ink min-h-screen flex flex-col">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-voca-canvas/90 backdrop-blur-md border-b border-voca-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <img src="/icon.png" alt="Voca" className="w-8 h-8 object-contain transition-transform group-hover:scale-105" />
            <span className="font-display font-extrabold text-2xl tracking-tight text-voca-ink">
              Voca
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden sm:flex items-center gap-1 font-display font-bold text-xs">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-colors ${
                      isActive
                        ? 'bg-voca-tangerine-subtle text-voca-primary'
                        : 'text-voca-muted hover:text-voca-ink hover:bg-voca-subtle'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </NavLink>
              )
            })}
          </nav>

          {/* Hybrid AI Diagnostics Pill Button */}
          <button
            onClick={() => setIsDiagnosticsOpen(true)}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-voca-subtle hover:bg-voca-surface-high border border-voca-border text-voca-ink text-xs font-display font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Inspect on-device Gemini Nano & hybrid inference routing"
          >
            <span className="w-2 h-2 rounded-full bg-voca-tangerine animate-pulse"></span>
            <Cpu className="w-3.5 h-3.5 text-voca-primary" />
            <span className="hidden sm:inline">Hybrid AI</span>
          </button>
        </div>
      </header>

      {/* Main Outlet */}
      <main className="flex-1 pb-20 sm:pb-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-voca-surface/95 backdrop-blur-md border-t border-voca-border flex items-center justify-around py-2 px-4 shadow-lg">
        {navLinks.map((link) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                  isActive ? 'text-voca-primary font-bold' : 'text-voca-muted'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-display">{link.label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Slide-over Hybrid Diagnostics Drawer */}
      <HybridDiagnosticsDrawer
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
      />
    </div>
  )
}
