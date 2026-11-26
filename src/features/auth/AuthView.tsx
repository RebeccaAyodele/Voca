import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Mail, Key, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react'
import { useAuthStore } from './authStore'

export default function AuthView() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isSignInDefault = searchParams.get('mode') === 'signin'

  const [isSignIn, setIsSignIn] = useState(isSignInDefault)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const { signUpWithEmail, signInWithEmail, signInAsGuest, loading, error, clearError } = useAuthStore()

  // Password strength calculation
  const strength = useMemo(() => {
    const len = password.length
    if (len === 0) return { level: 0, label: '8+ Characters', color: 'text-voca-muted' }
    if (len < 6) return { level: 1, label: 'Fragile', color: 'text-voca-danger' }
    if (len < 8) return { level: 2, label: 'Developing', color: 'text-voca-warning' }
    if (len < 12) return { level: 3, label: 'Resonant', color: 'text-voca-primary' }
    return { level: 4, label: 'Mastery level', color: 'text-voca-primary font-bold' }
  }, [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    clearError()

    if (!email || !password) {
      setLocalError('Please enter both email and password.')
      return
    }

    if (!isSignIn && password.length < 6) {
      setLocalError('Password should be at least 6 characters.')
      return
    }

    try {
      if (isSignIn) {
        await signInWithEmail(email, password)
      } else {
        await signUpWithEmail(email, password)
      }
      navigate('/onboarding/goals')
    } catch {
      // Error handled by store
    }
  }

  const handleGuestDemo = async () => {
    setLocalError(null)
    clearError()
    try {
      await signInAsGuest()
    } catch {
      // Fallback seamlessly to guest demo flow
    } finally {
      navigate('/onboarding/goals')
    }
  }

  return (
    <div className="bg-voca-canvas text-voca-ink h-screen h-[100dvh] max-h-[100dvh] flex flex-col justify-between px-4 sm:px-6 py-3 sm:py-5 max-w-lg mx-auto overflow-y-auto sm:overflow-hidden select-none">
      <div className="flex-1 flex flex-col justify-between min-h-0">
        <div>
          {/* Top Navigation */}
          <div className="flex items-center justify-between py-1">
            <button
              onClick={() => navigate('/')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-voca-subtle hover:bg-voca-surface-high transition-colors active:scale-95 text-voca-ink cursor-pointer"
              type="button"
              aria-label="Return to previous screen"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 sm:w-10 sm:h-10"></div>
          </div>

          {/* Editorial Header */}
          <div className="mt-2 sm:mt-3 flex flex-col gap-0.5">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-voca-ink tracking-tight leading-tight">
              {isSignIn ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-xs sm:text-sm text-voca-muted font-body">
              {isSignIn ? 'Continue your deliberate vocal practice.' : 'Step into your deliberate vocal practice.'}
            </p>
          </div>

          {/* Error Notification */}
          {(localError || error) && (
            <div className="mt-2 p-2 rounded-xl bg-red-50 border border-voca-danger/20 text-voca-danger text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{localError || error}</span>
            </div>
          )}

          {/* Primary Account Form */}
          <form onSubmit={handleSubmit} className="mt-3 sm:mt-4 flex flex-col gap-2.5 sm:gap-3">
            {/* Email Input */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-voca-ink" htmlFor="email-field">
                Email address
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-voca-muted pointer-events-none flex items-center">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="email-field"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="speaker@domain.com"
                  className="w-full h-11 sm:h-12 pl-11 pr-4 rounded-xl bg-voca-surface text-voca-ink text-sm border border-voca-border placeholder:text-voca-muted-subtle/60 outline-none transition-all focus:border-voca-tangerine focus:shadow-[0_0_0_3px_rgba(244,123,69,0.2)] shadow-xs"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-voca-ink" htmlFor="password-field">
                  Password
                </label>
                {!isSignIn && (
                  <span className={`text-[10px] uppercase tracking-wider font-display ${strength.color}`}>
                    {strength.label}
                  </span>
                )}
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-voca-muted pointer-events-none flex items-center">
                  <Key className="w-4 h-4" />
                </span>
                <input
                  id="password-field"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 sm:h-12 pl-11 pr-11 rounded-xl bg-voca-surface text-voca-ink text-sm border border-voca-border placeholder:text-voca-muted-subtle/60 outline-none transition-all focus:border-voca-tangerine focus:shadow-[0_0_0_3px_rgba(244,123,69,0.2)] shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 w-8 h-8 flex items-center justify-center text-voca-muted hover:text-voca-ink cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter (Sign-up only) */}
              {!isSignIn && (
                <div className="flex items-center gap-1.5 pt-0.5 px-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        strength.level >= step ? 'bg-voca-tangerine' : 'bg-voca-surface-high'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 sm:h-13 mt-1 rounded-full bg-voca-tangerine hover:bg-voca-tangerine-hover text-voca-surface font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-voca-tangerine/30 active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-60"
            >
              <span>{loading ? 'Please wait...' : isSignIn ? 'Sign in' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Or Continue Divider */}
          <div className="relative flex items-center justify-center my-2.5 sm:my-3.5">
            <div className="w-full h-[1px] bg-voca-border"></div>
            <span className="absolute px-3 bg-voca-canvas text-[10px] font-bold text-voca-muted uppercase tracking-widest font-display">
              or try instantly
            </span>
          </div>

          {/* Demo / Guest Access Button */}
          <button
            onClick={handleGuestDemo}
            disabled={loading}
            type="button"
            className="w-full h-11 sm:h-12 rounded-xl bg-voca-surface hover:bg-voca-subtle border border-voca-border text-voca-ink font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-voca-tangerine" />
            <span>Enter as Guest / Judge Demo</span>
          </button>

          {/* Switch Sign-in / Sign-up Mode */}
          <div className="mt-2.5 sm:mt-3 flex items-center justify-center gap-1.5 text-center text-xs sm:text-sm">
            <span className="text-voca-muted">
              {isSignIn ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsSignIn(!isSignIn)
                setLocalError(null)
                clearError()
              }}
              className="font-bold text-voca-primary hover:underline cursor-pointer font-display"
            >
              {isSignIn ? 'Create account' : 'Sign in'}
            </button>
          </div>
        </div>

        {/* Compliance / Privacy Footnote */}
        <div className="mt-2 text-center pb-1">
          <p className="text-[10px] text-voca-muted-subtle leading-relaxed max-w-xs mx-auto">
            By continuing, you agree to Voca's Terms of Service and Privacy Policy. Audio recordings stay private on your device by default.
          </p>
        </div>
      </div>
    </div>
  )
}
