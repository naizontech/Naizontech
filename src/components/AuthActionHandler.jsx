'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  verifyEmailAction,
  verifyResetCode,
  confirmPasswordResetAction,
} from '../utils/firebase'
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react'

export default function AuthActionHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const mode = searchParams.get('mode') // 'verifyEmail' | 'resetPassword' | 'recoverEmail'
  const oobCode = searchParams.get('oobCode')

  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('processing') // 'processing' | 'success' | 'ready' | 'error'
  const [message, setMessage] = useState('')
  const [accountEmail, setAccountEmail] = useState('')

  // New Password state for resetPassword mode
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword
  const passwordsMismatch = confirmPassword && newPassword !== confirmPassword

  useEffect(() => {
    if (!oobCode || !mode) {
      setStatus('error')
      setMessage('Invalid or missing authentication security token.')
      setLoading(false)
      return
    }

    if (mode === 'verifyEmail') {
      verifyEmailAction(oobCode)
        .then(() => {
          setStatus('success')
          setMessage('Your email address has been verified successfully. Your NAIZON account is now active.')
        })
        .catch((err) => {
          setStatus('error')
          setMessage(err.message || 'This verification link is invalid or has already expired.')
        })
        .finally(() => setLoading(false))
    } else if (mode === 'resetPassword') {
      verifyResetCode(oobCode)
        .then((email) => {
          setAccountEmail(email)
          setStatus('ready')
        })
        .catch((err) => {
          setStatus('error')
          setMessage(err.message || 'This password reset link is invalid or has expired. Please request a new one.')
        })
        .finally(() => setLoading(false))
    } else if (mode === 'recoverEmail') {
      setStatus('success')
      setMessage('Your account recovery request has been acknowledged. Please sign in to verify your credentials.')
      setLoading(false)
    } else {
      setStatus('error')
      setMessage('Unrecognized authentication action.')
      setLoading(false)
    }
  }, [mode, oobCode])

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) {
      setMessage('Password must contain at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match. Please ensure both fields are identical.')
      return
    }

    setSubmitting(true)
    setMessage('')

    try {
      await confirmPasswordResetAction(oobCode, newPassword)
      setStatus('success')
      setMessage('Your password has been updated successfully! You can now log in with your new credentials.')
    } catch (err) {
      setMessage(err.message || 'Failed to update password. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0e131f] text-slate-100 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Brand Bar */}
      <div className="mx-auto w-full max-w-md flex items-center justify-between pb-6 border-b border-slate-800">
        <a href="/" className="flex items-center gap-2">
          <img
            src="/favicon/favicon-192.png"
            alt="NAIZON"
            className="h-8 w-8 rounded-lg object-contain p-1 bg-[#fd5001]/10 ring-1 ring-[#fd5001]/30"
          />
          <span className="text-sm font-black tracking-wider uppercase text-white">NAIZON Auth</span>
        </a>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
          <ShieldCheck size={14} />
          <span>Security Verified</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="mx-auto w-full max-w-md py-6">
        <div className="rounded-2xl border border-slate-800 bg-[#161c2d] p-7 shadow-2xl sm:p-9">
          
          {/* Loading State */}
          {loading && (
            <div className="py-12 text-center">
              <Loader2 size={36} className="mx-auto animate-spin text-[#fd5001]" />
              <h2 className="mt-4 text-lg font-bold text-white">Verifying Security Token...</h2>
              <p className="mt-1 text-xs text-slate-400">Communicating with Firebase authentication servers.</p>
            </div>
          )}

          {/* Error State */}
          {!loading && status === 'error' && (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 ring-1 ring-red-500/30">
                <AlertCircle size={28} />
              </div>
              <h1 className="mt-4 text-xl font-bold text-white">Authentication Link Invalid</h1>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">{message}</p>
              <div className="mt-6 flex flex-col gap-2.5">
                <a
                  href="/login"
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#fd5001] px-5 text-sm font-bold text-white shadow-lg shadow-[#fd5001]/20 hover:bg-[#e04600] transition"
                >
                  <span>Return to Sign In</span>
                </a>
                <a
                  href="/"
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-5 text-xs font-bold text-slate-300 hover:bg-slate-800 transition"
                >
                  <span>Go to Website Home</span>
                </a>
              </div>
            </div>
          )}

          {/* Success State */}
          {!loading && status === 'success' && (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
                <CheckCircle2 size={28} />
              </div>
              <h1 className="mt-4 text-xl font-bold text-white">
                {mode === 'verifyEmail' ? 'Email Verified Successfully!' : 'Action Completed'}
              </h1>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">{message}</p>
              <div className="mt-6">
                <a
                  href="/login"
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#fd5001] px-5 text-sm font-bold text-white shadow-lg shadow-[#fd5001]/20 hover:bg-[#e04600] transition"
                >
                  <span>Continue to Client Portal</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          )}

          {/* Reset Password Form (status === 'ready') */}
          {!loading && status === 'ready' && mode === 'resetPassword' && (
            <div>
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30">
                  <KeyRound size={26} />
                </div>
                <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">Set New Password</h1>
                <p className="mt-1 text-xs text-slate-400">
                  Enter your new password for <span className="font-mono text-white">{accountEmail}</span>.
                </p>
              </div>

              {message && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                  <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-400" />
                  <span>{message}</span>
                </div>
              )}

              <form onSubmit={handlePasswordResetSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3.5 py-2.5 pl-10 pr-11 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#fd5001] focus:ring-1 focus:ring-[#fd5001]"
                    />
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300">Confirm New Password</label>
                    {confirmPassword && (
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${passwordsMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                        {passwordsMatch ? <Check size={13} /> : <X size={13} />}
                        <span>{passwordsMatch ? 'Passwords match' : 'Passwords do not match'}</span>
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3.5 py-2.5 pl-10 pr-11 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#fd5001] focus:ring-1 focus:ring-[#fd5001]"
                    />
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting || passwordsMismatch}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#fd5001] px-5 text-sm font-bold text-white shadow-lg shadow-[#fd5001]/25 hover:bg-[#e04600] transition active:scale-[0.99] disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <span>Save New Password & Sign In</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="mx-auto w-full max-w-md pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} NAIZON · Enterprise Security & Identity Management
      </div>
    </div>
  )
}
