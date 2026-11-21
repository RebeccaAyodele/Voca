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
    if (len === 0) return { level: 0, label: '8+ Characters', color: 'text-secondary' }
    if (len < 6) return { level: 1, label: 'Fragile', color: 'text-red-600' }
    if (len < 8) return { level: 2, label: 'Developing', color: 'text-amber-600' }
    if (len < 12) return { level: 3, label: 'Resonant', color: 'text-[#A23F0A]' }
    return { level: 4, label: 'Mastery level', color: 'text-[#A23F0A] font-bold' }
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
      navigate('/onboarding/goals')
    } catch {
      // Error handled by store
    }
  }

  return (
    <div className="bg-[#FBF9F5] text-[#1B1C1A] min-h-screen flex flex-col justify-between px-4 sm:px-6 py-6 max-w-lg mx-auto">
      <div>
        {/* Top Navigation */}
        <div className="flex items-center justify-between py-2">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#EFEEEA] hover:bg-[#EAE8E4] transition-colors active:scale-95 text-[#1B1C1A] cursor-pointer"
            type="button"
            aria-label="Return to previous screen"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10"></div>
        </div>

        {/* Editorial Header */}
        <div className="mt-6 flex flex-col gap-1">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B1C1A] tracking-tight leading-tight">
            {isSignIn ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm text-[#695B58] mt-1">
            {isSignIn ? 'Continue your deliberate vocal practice.' : 'Step into your deliberate vocal practice.'}
          </p>
        </div>

        {/* Error Notification */}
        {(localError || error) && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{localError || error}</span>
          </div>
        )}

        {/* Primary Account Form */}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {/* Email Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#1B1C1A]" htmlFor="email-field">
              Email address
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#695B58] pointer-events-none flex items-center">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="email-field"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="speaker@domain.com"
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-white text-[#1B1C1A] text-sm border border-[#EAE5DF] placeholder:text-[#8A7268]/60 outline-none transition-all focus:border-[#F47B45] focus:shadow-[0_0_0_3px_rgba(244,123,69,0.2)] shadow-xs"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#1B1C1A]" htmlFor="password-field">
                Password
              </label>
              {!isSignIn && (
                <span className={`text-[10px] uppercase tracking-wider ${strength.color}`}>
                  {strength.label}
                </span>
              )}
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#695B58] pointer-events-none flex items-center">
                <Key className="w-4 h-4" />
              </span>
              <input
                id="password-field"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-14 pl-12 pr-12 rounded-xl bg-white text-[#1B1C1A] text-sm border border-[#EAE5DF] placeholder:text-[#8A7268]/60 outline-none transition-all focus:border-[#F47B45] focus:shadow-[0_0_0_3px_rgba(244,123,69,0.2)] shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 w-8 h-8 flex items-center justify-center text-[#695B58] hover:text-[#1B1C1A] cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Meter (Sign-up only) */}
            {!isSignIn && (
              <div className="flex items-center gap-1.5 pt-1 px-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      strength.level >= step ? 'bg-[#F47B45]' : 'bg-[#EAE8E4]'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Cadence Dots */}
          <div className="flex items-center justify-center gap-1.5 py-1 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E4E2DE]"></span>
            <span className="w-6 h-1.5 rounded-full bg-[#F47B45] transition-all duration-300"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E4E2DE]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E4E2DE]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E4E2DE]"></span>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-full bg-[#F47B45] hover:bg-[#A23F0A] text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#F47B45]/30 active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-60"
          >
            <span>{loading ? 'Please wait...' : isSignIn ? 'Sign in' : 'Continue'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Or Continue Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="w-full h-[1px] bg-[#E4E2DE]"></div>
          <span className="absolute px-3 bg-[#FBF9F5] text-[10px] font-bold text-[#695B58] uppercase tracking-widest">
            or try instantly
          </span>
        </div>

        {/* Demo / Guest Access Button (Zero Friction for Judges) */}
        <button
          onClick={handleGuestDemo}
          disabled={loading}
          type="button"
          className="w-full h-14 rounded-xl bg-white hover:bg-[#EFEEEA] border border-[#EAE5DF] text-[#1B1C1A] font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#F47B45]" />
          <span>Enter as Guest / Judge Demo</span>
        </button>

        {/* Switch Sign-in / Sign-up Mode */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-center text-sm">
          <span className="text-[#57423A]">
            {isSignIn ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <button
            type="button"
            onClick={() => {
              setIsSignIn(!isSignIn)
              setLocalError(null)
              clearError()
            }}
            className="font-semibold text-[#A23F0A] hover:underline cursor-pointer"
          >
            {isSignIn ? 'Create account' : 'Sign in'}
          </button>
        </div>
      </div>

      {/* Compliance / Privacy Footnote */}
      <div className="mt-8 text-center pb-2">
        <p className="text-[11px] text-[#8A7268]/80 leading-relaxed max-w-xs mx-auto">
          By continuing, you agree to Voca's Terms of Service and Privacy Policy. Audio recordings stay private on your device by default.
        </p>
      </div>
    </div>
  )
}
