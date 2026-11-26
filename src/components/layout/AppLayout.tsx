import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Home, Mic, TrendingUp, User, Cpu } from 'lucide-react'
import HybridDiagnosticsDrawer from '@/components/diagnostics/HybridDiagnosticsDrawer'

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false)

  // In active studio session, hide surrounding layout bars for full-focus immersion matching Stitch
  const isStudio = location.pathname === '/studio'

  if (isStudio) {
    return (
      <div className="bg-voca-canvas text-voca-ink min-h-screen">
        <Outlet />
      </div>
    )
  }

  const navLinks = [
    { to: '/dashboard', label: 'Home', icon: Home },
    { to: '/challenges', label: 'Practice', icon: Mic },
    { to: '/progress', label: 'Progress', icon: TrendingUp },
    { to: '/profile', label: 'Profile', icon: User }
  ]

  return (
    <div className="bg-voca-canvas text-voca-ink min-h-screen flex flex-col">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-voca-canvas/90 backdrop-blur-md border-b border-voca-border">
        <div className="max-w-xl sm:max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
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

          {/* Desktop Navigation Links (Center / Right) */}
          <nav className="hidden sm:flex items-center gap-1 font-display font-bold text-xs">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-4 py-2 rounded-full transition-colors ${
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

          {/* Hidden diagnostic trigger button for programmatic trigger */}
          <button
            id="trigger-hybrid-diagnostics"
            onClick={() => setIsDiagnosticsOpen(true)}
            type="button"
            className="hidden"
            aria-hidden="true"
          />

          {/* Quick Profile / Diagnostics Indicator on Mobile */}
          <div className="sm:hidden flex items-center gap-2">
            <button
              onClick={() => setIsDiagnosticsOpen(true)}
              type="button"
              className="w-8 h-8 rounded-full bg-voca-subtle flex items-center justify-center text-voca-primary cursor-pointer"
              title="Hybrid AI Telemetry"
            >
              <Cpu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Outlet */}
      <main className="flex-1 pb-24 sm:pb-12">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar (Home, Practice, Progress, Profile) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-voca-surface/95 backdrop-blur-md border-t border-voca-border flex items-center justify-around py-2.5 px-3 shadow-lg">
        {navLinks.map((link) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
                  isActive ? 'text-voca-primary font-bold' : 'text-voca-muted'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] font-display font-semibold">{link.label}</span>
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
