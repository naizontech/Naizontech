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
  isSuperAdmin,
  getUserRole,
  ADMIN_EMAIL,
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
  Crown,
  Lock,
  Mail,
  User,
  KeyRound,
  ExternalLink,
  Sparkles,
  Check,
  X,
  FileText,
  Home,
  Briefcase,
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

  // Show/Hide Password states
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Form State with double password confirmation
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

  // Password matching validation checks
  const passwordsMatch = form.password && form.confirmPassword && form.password === form.confirmPassword
  const passwordsMismatch = form.confirmPassword && form.password !== form.confirmPassword
  const isPasswordValid = form.password.length >= 6

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthSuccess('')
    setAuthLoading(true)

    try {
      if (tab === 'signup') {
        if (!form.name.trim()) {
          throw new Error('Please enter your full name.')
        }
        if (!form.email.trim()) {
          throw new Error('Please enter a valid work email.')
        }
        if (!form.password) {
          throw new Error('Please enter a password.')
        }
        if (form.password.length < 6) {
          throw new Error('Password must be at least 6 characters.')
        }
        if (!form.confirmPassword) {
          throw new Error('Please confirm your password.')
        }
        if (form.password !== form.confirmPassword) {
          throw new Error('Passwords do not match. Please ensure both password fields are identical.')
        }

        await signUpWithEmail(form.email.trim(), form.password, form.name.trim())
        setAuthSuccess('Account registered successfully! Redirecting...')
        setTimeout(() => router.push('/'), 1200)
      } else if (tab === 'login') {
        if (!form.email.trim() || !form.password) {
          throw new Error('Please enter both email and password.')
        }
        await loginWithEmail(form.email.trim(), form.password)
        setAuthSuccess('Signed in successfully! Redirecting...')
        setTimeout(() => router.push('/'), 1000)
      } else if (tab === 'forgot') {
        if (!form.email.trim()) {
          throw new Error('Please enter your email address.')
        }
        await resetUserPassword(form.email.trim())
        setAuthSuccess('Password recovery link dispatched! Please check your inbox.')
      }
    } catch (err) {
      let msg = err.message || 'Authentication failed.'
      if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please sign in.'
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid credentials. Please verify your email and password.'
      } else if (err.code === 'auth/user-not-found') {
        msg = 'No account found with this email. Please create a new account.'
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should contain at least 6 characters.'
      } else if (err.code === 'auth/popup-closed-by-user') {
        msg = 'Google authentication was cancelled.'
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
      setAuthSuccess('Google authentication successful! Redirecting...')
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

  const isAdmin = isSuperAdmin(currentUser)

  return (
    <div className="min-h-screen bg-[#0e131f] text-slate-100 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 selection:bg-[#fd5001] selection:text-white">
      {/* Top Bar with Navigation & Security Badge */}
      <header className="mx-auto w-full max-w-xl flex items-center justify-between pb-6 border-b border-slate-800/80">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 transition hover:text-[#fd5001]"
        >
          <ArrowLeft size={16} />
          <span>Back to NAIZON</span>
        </a>

        <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>256-bit Encrypted Session</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-xl py-6">
        {currentUser ? (
          /* ================================================================ */
          /* EXECUTIVE LOGGED-IN DASHBOARD & PROFILE VIEW                      */
          /* ================================================================ */
          <div className="rounded-2xl border border-slate-800 bg-[#161c2d] shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in duration-200">
            {/* Header Banner with Subtle Brand Glow */}
            <div className={`p-6 sm:p-8 border-b ${isAdmin ? 'bg-gradient-to-r from-[#1e1e2f] via-[#241a27] to-[#1e151e] border-amber-500/30' : 'bg-gradient-to-r from-slate-900 to-slate-800 border-slate-800'}`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Avatar with Online Pulse */}
                  <div className="relative">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.displayName || 'User'}
                        className="h-16 w-16 rounded-2xl border-2 border-slate-700 object-cover shadow-lg"
                      />
                    ) : (
                      <div className={`grid h-16 w-16 place-items-center rounded-2xl text-xl font-black uppercase text-white shadow-lg ${isAdmin ? 'bg-gradient-to-br from-amber-500 to-[#fd5001] ring-2 ring-amber-400/50' : 'bg-[#fd5001]'}`}>
                        {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-[#161c2d] bg-emerald-500" />
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                        {currentUser.displayName || 'Authorized User'}
                      </h1>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400 font-mono">
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                {/* Role Badge */}
                {isAdmin ? (
                  <div className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-amber-300 ring-1 ring-amber-400/40 shadow-sm">
                    <Crown size={15} className="text-amber-400" />
                    <span>SUPER ADMIN</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 ring-1 ring-emerald-500/30">
                    <ShieldCheck size={15} />
                    <span>CLIENT PORTAL</span>
                  </div>
                )}
              </div>
            </div>

            {/* Account Details & Status Grid */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Account Role</span>
                  <div className="mt-1 flex items-center gap-2">
                    {isAdmin ? (
                      <>
                        <Crown size={16} className="text-amber-400" />
                        <span className="text-sm font-bold text-amber-300">Super Administrator (Owner)</span>
                      </>
                    ) : (
                      <>
                        <User size={16} className="text-slate-300" />
                        <span className="text-sm font-bold text-slate-200">Verified Client Member</span>
                      </>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {isAdmin ? 'Full root access to enquiries, configurations, and analytics.' : 'Access to client deliverables, sprint environments & tickets.'}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Security & Session</span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-sm font-bold text-emerald-400">Firebase Active</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 truncate font-mono">
                    UID: {currentUser.uid.slice(0, 16)}...
                  </p>
                </div>
              </div>

              {/* Admin Special Command Hub */}
              {isAdmin && (
                <div className="rounded-xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-amber-400" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      Super Admin Quick Actions
                    </h2>
                  </div>
                  <p className="text-xs text-slate-300 mb-4">
                    Privileged administrative controls enabled for <span className="font-mono text-amber-200">{ADMIN_EMAIL}</span>.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <a
                      href="/data"
                      className="flex items-center justify-between rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 p-3 text-xs font-bold text-amber-200 transition"
                    >
                      <span className="flex items-center gap-2">
                        <FileText size={16} />
                        <span>Enquiries & Leads Database</span>
                      </span>
                      <ExternalLink size={14} />
                    </a>

                    <a
                      href="/careers"
                      className="flex items-center justify-between rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 p-3 text-xs font-bold text-slate-200 transition"
                    >
                      <span className="flex items-center gap-2">
                        <Briefcase size={16} />
                        <span>Careers & Internships</span>
                      </span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href="/"
                  className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#fd5001] px-5 text-sm font-bold text-white shadow-lg shadow-[#fd5001]/25 transition hover:bg-[#e04600] active:scale-[0.99]"
                >
                  <Home size={16} />
                  <span>Return to Website</span>
                </a>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 text-xs font-bold text-red-400 transition hover:bg-red-500/20 active:scale-[0.99]"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ================================================================ */
          /* AUTHENTICATION FORM (SIGN IN / SIGN UP / FORGOT)                 */
          /* ================================================================ */
          <div className="rounded-2xl border border-slate-800 bg-[#161c2d] p-7 shadow-2xl shadow-black/50 sm:p-9">
            
            {/* Branded Favicon Logo Header */}
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#fd5001]/20 via-[#fd5001]/10 to-transparent p-2.5 ring-1 ring-[#fd5001]/30">
                <img
                  src="/favicon/favicon-192.png"
                  alt="NAIZON Logo"
                  className="h-full w-full object-contain"
                />
              </div>

              <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {tab === 'signup'
                  ? 'Create Your Account'
                  : tab === 'login'
                  ? 'Sign In to NAIZON'
                  : 'Reset Password'}
              </h1>

              <p className="mt-1.5 text-xs text-slate-400 font-medium">
                {tab === 'signup'
                  ? 'Join to access project sprints, architecture deliverables, and technical updates.'
                  : tab === 'login'
                  ? 'Access your authenticated client workspace, tickets, and milestones.'
                  : 'Enter your email to receive a secure password recovery link.'}
              </p>
            </div>

            {/* Tab Switcher */}
            {tab !== 'forgot' && (
              <div className="mt-6 flex rounded-xl border border-slate-800 bg-slate-900/80 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setTab('login')
                    setAuthError('')
                    setAuthSuccess('')
                  }}
                  className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                    tab === 'login'
                      ? 'bg-[#161c2d] text-white shadow-sm ring-1 ring-slate-700'
                      : 'text-slate-400 hover:text-white'
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
                      ? 'bg-[#161c2d] text-white shadow-sm ring-1 ring-slate-700'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Alert Messages */}
            {authError && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
                <span className="flex-1 font-medium leading-relaxed">{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400" />
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
                  className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-900/60 px-4 text-xs font-bold text-slate-200 shadow-sm transition hover:bg-slate-800 hover:border-slate-600 active:scale-[0.99] disabled:opacity-50"
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
                    <div className="w-full border-t border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-[#161c2d] px-3 font-medium text-slate-500">or with email</span>
                  </div>
                </div>
              </div>
            )}

            {/* Email Authentication Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name (Sign Up only) */}
              {tab === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Alex Morgan"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3.5 py-2.5 pl-10 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#fd5001] focus:ring-1 focus:ring-[#fd5001]"
                    />
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {tab === 'signup' ? 'Work Email Address' : 'Email Address'}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3.5 py-2.5 pl-10 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#fd5001] focus:ring-1 focus:ring-[#fd5001]"
                  />
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                </div>
              </div>

              {/* Password Field */}
              {tab !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      {tab === 'signup' ? 'Create Password' : 'Password'}
                    </label>
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
                      placeholder="At least 6 characters"
                      minLength={6}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3.5 py-2.5 pl-10 pr-11 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#fd5001] focus:ring-1 focus:ring-[#fd5001]"
                    />
                    <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* CONFIRM PASSWORD FIELD (Sign Up only: Double Password Confirmation) */}
              {tab === 'signup' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Confirm Password
                    </label>
                    {form.confirmPassword && (
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${passwordsMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                        {passwordsMatch ? (
                          <>
                            <Check size={13} strokeWidth={2.5} />
                            <span>Passwords match</span>
                          </>
                        ) : (
                          <>
                            <X size={13} strokeWidth={2.5} />
                            <span>Passwords do not match</span>
                          </>
                        )}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      placeholder="Re-enter your password"
                      minLength={6}
                      className={`w-full rounded-xl border bg-slate-900/60 px-3.5 py-2.5 pl-10 pr-11 text-sm text-white placeholder-slate-500 outline-none transition focus:ring-1 ${
                        passwordsMatch
                          ? 'border-emerald-500/80 focus:border-emerald-500 focus:ring-emerald-500/20'
                          : passwordsMismatch
                          ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-slate-700 focus:border-[#fd5001] focus:ring-[#fd5001]'
                      }`}
                    />
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={authLoading || (tab === 'signup' && passwordsMismatch)}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#fd5001] px-5 text-sm font-bold text-white shadow-lg shadow-[#fd5001]/20 transition hover:bg-[#e04600] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Authenticating...</span>
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
                    <span>Send Password Reset Link</span>
                  )}
                </button>
              </div>

              {/* Forgot password back link */}
              {tab === 'forgot' && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTab('login')
                      setAuthError('')
                      setAuthSuccess('')
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-[#fd5001]"
                  >
                    &larr; Back to Sign In
                  </button>
                </div>
              )}

              {/* Bottom Switcher */}
              <div className="pt-2 text-center text-xs text-slate-400">
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
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-xl pt-6 border-t border-slate-800/80 text-center">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} NAIZON · Enterprise Engineering & Digital Solutions
        </p>
      </footer>
    </div>
  )
}
