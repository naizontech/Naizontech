'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  auth,
  signUpWithEmail,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  resetUserPassword,
  onAuthStateChanged,
} from '../utils/firebase'
import {
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  LogOut,
  ShieldCheck,
} from 'lucide-react'

export default function AuthPage({ initialTab = 'login' }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const modeParam = searchParams.get('mode')

  const [tab, setTab] = useState(modeParam === 'signup' || initialTab === 'signup' ? 'signup' : 'login')
  const [currentUser, setCurrentUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authSuccess, setAuthSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  useEffect(() => {
    if (modeParam === 'signup') setTab('signup')
    else if (modeParam === 'login') setTab('login')
    else if (modeParam === 'forgot') setTab('forgot')
  }, [modeParam])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoadingUser(false)
    })
    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthSuccess('')
    setAuthLoading(true)

    try {
      if (tab === 'signup') {
        if (!form.email || !form.password) {
          throw new Error('Please enter both email and password.')
        }
        if (form.password.length < 6) {
          throw new Error('Password must be at least 6 characters.')
        }
        await signUpWithEmail(form.email, form.password, form.name)
        setAuthSuccess('Account created successfully! Redirecting...')
        setTimeout(() => router.push('/'), 1200)
      } else if (tab === 'login') {
        if (!form.email || !form.password) {
          throw new Error('Please enter both email and password.')
        }
        await loginWithEmail(form.email, form.password)
        setAuthSuccess('Logged in successfully! Redirecting...')
        setTimeout(() => router.push('/'), 1000)
      } else if (tab === 'forgot') {
        if (!form.email) {
          throw new Error('Please enter your email address.')
        }
        await resetUserPassword(form.email)
        setAuthSuccess('Password reset link sent to your email! Please check your inbox.')
      }
    } catch (err) {
      let msg = err.message || 'Authentication failed.'
      if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please sign in.'
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. Please try again.'
      } else if (err.code === 'auth/user-not-found') {
        msg = 'No account found with this email. Please sign up.'
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.'
      } else if (err.code === 'auth/popup-closed-by-user') {
        msg = 'Sign-in cancelled.'
      }
      setAuthError(msg)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setAuthError('')
    setAuthSuccess('')
    setAuthLoading(true)
    try {
      await loginWithGoogle()
      setAuthSuccess('Google sign-in successful! Redirecting...')
      setTimeout(() => router.push('/'), 1000)
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError(err.message || 'Google sign-in failed.')
      }
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
      setAuthSuccess('Logged out successfully.')
    } catch (err) {
      setAuthError('Failed to logout.')
    }
  }

  return (
    <div className="min-h-screen bg-[#fbfbfa] flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8">
      {/* Top Bar with Logo & Back to Home */}
      <div className="mx-auto w-full max-w-md flex items-center justify-between pb-6">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 transition hover:text-[#fd5001]"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </a>

        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span className="text-xs font-medium text-neutral-500">Secure 256-bit Auth</span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-xl shadow-neutral-100 sm:p-9">
          
          {/* Branded Favicon Logo Header */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#fd5001]/10 via-[#fd5001]/5 to-transparent p-2.5 ring-1 ring-[#fd5001]/20">
              <img
                src="/favicon/favicon-192.png"
                alt="NAIZON Logo"
                className="h-full w-full object-contain"
              />
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
              {currentUser
                ? 'Welcome Back'
                : tab === 'signup'
                ? 'Create Your Account'
                : tab === 'login'
                ? 'Sign In to NAIZON'
                : 'Reset Password'}
            </h1>

            <p className="mt-1.5 text-xs text-neutral-500 font-medium">
              {currentUser
                ? 'You are currently signed in.'
                : tab === 'signup'
                ? 'Join to collaborate on sprints and access engineering deliverables.'
                : tab === 'login'
                ? 'Access your client workspace, deliverables, and project updates.'
                : 'Enter your email to receive a secure password recovery link.'}
            </p>
          </div>

          {/* If already logged in */}
          {currentUser ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="flex items-center gap-3">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="h-11 w-11 rounded-full border border-[#fd5001]/30 object-cover"
                    />
                  ) : (
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-[#fd5001] text-base font-bold text-white shadow-sm">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-neutral-900">
                      {currentUser.displayName || 'Authenticated Client'}
                    </p>
                    <p className="truncate text-xs text-neutral-500 font-mono">{currentUser.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <a
                  href="/"
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#fd5001] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#e04600]"
                >
                  <span>Go to Website</span>
                </a>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-5 text-xs font-bold text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={16} />
                  <span>Sign Out (Logout)</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Tab Switcher */}
              {tab !== 'forgot' && (
                <div className="mt-6 flex rounded-xl border border-neutral-200 bg-neutral-100/80 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setTab('login')
                      setAuthError('')
                      setAuthSuccess('')
                    }}
                    className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                      tab === 'login'
                        ? 'bg-white text-neutral-950 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-950'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTab('signup')
                      setAuthError('')
                      setAuthSuccess('')
                    }}
                    className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                      tab === 'signup'
                        ? 'bg-white text-neutral-950 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-950'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Status Alert Messages */}
              {authError && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/90 p-3.5 text-xs text-red-700">
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
                  <span className="flex-1 font-medium leading-relaxed">{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/90 p-3.5 text-xs text-emerald-800">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span className="flex-1 font-medium leading-relaxed">{authSuccess}</span>
                </div>
              )}

              {/* 1-Click Google Sign In */}
              {tab !== 'forgot' && (
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={authLoading}
                    className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-neutral-300 bg-white px-4 text-xs font-bold text-neutral-800 shadow-xs transition hover:bg-neutral-50 hover:border-neutral-400 active:scale-[0.99] disabled:opacity-50"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-neutral-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-3 font-medium text-neutral-400">or with email</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {tab === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Alex Morgan"
                      className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-[#fd5001] focus:ring-2 focus:ring-[#fd5001]/20"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    {tab === 'signup' ? 'Work Email' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-[#fd5001] focus:ring-2 focus:ring-[#fd5001]/20"
                  />
                </div>

                {tab !== 'forgot' && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-neutral-700">Password</label>
                      {tab === 'login' && (
                        <button
                          type="button"
                          onClick={() => {
                            setTab('forgot')
                            setAuthError('')
                            setAuthSuccess('')
                          }}
                          className="text-[11px] font-bold text-[#fd5001] hover:underline"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="••••••••"
                        minLength={6}
                        className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 pr-11 text-sm text-neutral-900 outline-none transition focus:border-[#fd5001] focus:ring-2 focus:ring-[#fd5001]/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#fd5001] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#e04600] active:scale-[0.99] disabled:opacity-50"
                  >
                    {authLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : tab === 'signup' ? (
                      <>
                        <UserPlus size={16} />
                        <span>Create Account</span>
                      </>
                    ) : tab === 'login' ? (
                      <>
                        <LogIn size={16} />
                        <span>Sign In</span>
                      </>
                    ) : (
                      <span>Send Recovery Link</span>
                    )}
                  </button>
                </div>

                {tab === 'forgot' && (
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTab('login')
                        setAuthError('')
                        setAuthSuccess('')
                      }}
                      className="text-xs font-bold text-neutral-600 hover:text-[#fd5001]"
                    >
                      &larr; Back to Sign In
                    </button>
                  </div>
                )}

                <div className="pt-2 text-center text-xs text-neutral-500">
                  {tab === 'signup' && (
                    <p>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setTab('login')
                          setAuthError('')
                          setAuthSuccess('')
                        }}
                        className="font-bold text-[#fd5001] hover:underline"
                      >
                        Sign In
                      </button>
                    </p>
                  )}
                  {tab === 'login' && (
                    <p>
                      Don&apos;t have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setTab('signup')
                          setAuthError('')
                          setAuthSuccess('')
                        }}
                        className="font-bold text-[#fd5001] hover:underline"
                      >
                        Create an account
                      </button>
                    </p>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mx-auto w-full max-w-md pt-8 text-center">
        <p className="text-xs text-neutral-400">
          © {new Date().getFullYear()} NAIZON · Digital Solutions & Software Engineering
        </p>
      </div>
    </div>
  )
}
