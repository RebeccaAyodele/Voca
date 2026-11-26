import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  Home,
  Mic,
  TrendingUp,
  User,
  Cpu,
  ShieldCheck,
  ChevronRight
} from 'lucide-react'
import HybridDiagnosticsDrawer from '@/components/diagnostics/HybridDiagnosticsDrawer'
import { useAuthStore } from '@/features/auth/authStore'

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false)
  const profile = useAuthStore((state) => state.profile)

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

  const displayName = profile?.displayName || 'Speaker'
  const userInitial = displayName.charAt(0).toUpperCase()

  return (
    <div className="bg-voca-canvas text-voca-ink min-h-screen flex">
      {/* ========================================================= */}
      {/* DESKTOP LEFT SIDEBAR NAVIGATION (md: and up)               */}
      {/* ========================================================= */}
      <aside className="hidden md:flex md:w-64 lg:w-72 fixed inset-y-0 left-0 z-40 flex-col justify-between bg-voca-surface border-r border-voca-border p-6 shadow-xs select-none">
        <div className="space-y-6">
          {/* Brand Logo & Wordmark */}
          <div
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src="/icon.svg"
              alt="Voca Soundform"
              className="w-9 h-9 object-contain transition-transform group-hover:scale-105"
            />
            <div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-voca-ink block leading-none">
                Voca
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-voca-primary font-display block mt-1">
                Acoustic Coach
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-voca-muted font-display px-3 mb-2 block">
              Menu
            </span>
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-2xl font-display font-bold text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-voca-tangerine text-voca-surface shadow-md shadow-voca-tangerine/20'
                        : 'text-voca-muted hover:text-voca-ink hover:bg-voca-surface-low'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              )
            })}
          </nav>

          {/* Offline Privacy Guarantee Badge */}
          <div className="rounded-2xl bg-voca-surface-low p-3.5 border border-voca-border/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-voca-success font-display">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Offline &amp; Private</span>
            </div>
            <p className="text-[11px] text-voca-muted font-body leading-relaxed">
              Audio stays in local IndexedDB. Zero silent cloud audio uploads.
            </p>
          </div>
        </div>

        {/* Sidebar Footer Zone */}
        <div className="space-y-3 pt-4 border-t border-voca-surface-low">
          {/* Hybrid AI Telemetry Trigger */}
          <button
            onClick={() => setIsDiagnosticsOpen(true)}
            type="button"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-voca-surface-low hover:bg-voca-surface-high border border-voca-border text-xs font-bold text-voca-ink font-display cursor-pointer transition-colors"
            title="Inspect Hybrid AI Telemetry"
          >
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-voca-tangerine" />
              <span>Hybrid AI Inspector</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-voca-success animate-pulse" />
          </button>

          {/* User Profile Mini Bar */}
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-voca-surface-low transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-voca-tangerine-subtle text-voca-primary font-display font-extrabold text-sm flex items-center justify-center border border-voca-tangerine/30">
                {userInitial}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-voca-ink font-display truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-voca-muted font-body">My Account</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-voca-muted group-hover:text-voca-ink group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA                                         */}
      {/* ========================================================= */}
      <div className="flex-1 md:pl-64 lg:pl-72 flex flex-col min-h-screen">
        {/* Mobile-Only Top Header (< md) */}
        <header className="md:hidden sticky top-0 z-40 bg-voca-canvas/90 backdrop-blur-md border-b border-voca-border">
          <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
            <div
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <img
                src="/icon.svg"
                alt="Voca"
                className="w-8 h-8 object-contain"
              />
              <span className="font-display font-extrabold text-2xl tracking-tight text-voca-ink">
                Voca
              </span>
            </div>

            <button
              onClick={() => setIsDiagnosticsOpen(true)}
              type="button"
              className="w-9 h-9 rounded-full bg-voca-subtle flex items-center justify-center text-voca-primary cursor-pointer active:scale-95 transition-all"
              title="Hybrid AI Telemetry"
              aria-label="Open Hybrid AI Telemetry"
            >
              <Cpu className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 pb-24 md:pb-12 pt-2 md:pt-6 w-full max-w-5xl mx-auto">
          <Outlet />
        </main>
      </div>

      {/* ========================================================= */}
      {/* MOBILE BOTTOM NAVIGATION BAR (< md)                       */}
      {/* ========================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-voca-surface/95 backdrop-blur-md border-t border-voca-border flex items-center justify-around py-2.5 px-3 shadow-lg">
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
