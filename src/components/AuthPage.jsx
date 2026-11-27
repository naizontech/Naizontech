'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  auth,
  signUpWithEmail,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  resetUserPassword,
  sendVerificationEmail,
  reloadUser,
  setupRecaptcha,
  sendPhoneOtp,
  onAuthStateChanged,
  isSuperAdmin,
  ADMIN_EMAIL,
  canAccessLeads,
  getUserRole,
  getTeamMembers,
  saveTeamMember,
  removeTeamMember,
  getStoredAuthUser,
  saveStoredAuthUser,
  updateUserAvatar,
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
  Smartphone,
  Send,
  RefreshCw,
  AlertTriangle,
  Copy,
  Search,
  Filter,
  Users,
  UserCheck,
  Trash2,
  Camera,
  Upload,
  Shield,
} from 'lucide-react'
import { supabase } from '../utils/supabase/client'

export default function AuthPage({ initialTab = 'login' }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const modeParam = searchParams.get('mode')

  const [tab, setTab] = useState(modeParam === 'signup' || initialTab === 'signup' ? 'signup' : 'login')
  const [authMethod, setAuthMethod] = useState('email') // 'email' | 'phone'
  const [currentUser, setCurrentUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authSuccess, setAuthSuccess] = useState('')

  // Avatar image fallback state
  const [avatarFailed, setAvatarFailed] = useState(false)

  // Copy to clipboard state
  const [copiedField, setCopiedField] = useState('')

  // Show/Hide Password states
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Verification post-signup modal state
  const [verificationPendingEmail, setVerificationPendingEmail] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  // Form State with double password confirmation
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  // Phone OTP State
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [confirmationResult, setConfirmationResult] = useState(null)
  const [otpSent, setOtpSent] = useState(false)

  // Admin Dashboard Enquiries State
  const [enquiries, setEnquiries] = useState([])
  const [loadingEnquiries, setLoadingEnquiries] = useState(false)
  const [enquiryFilter, setEnquiryFilter] = useState('All')
  const [enquirySearch, setEnquirySearch] = useState('')

  // Admin Dashboard View Tabs: 'leads' | 'team'
  const [dashboardTab, setDashboardTab] = useState('leads')

  // Team & Role Management State
  const [teamMembers, setTeamMembers] = useState([])
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberRole, setNewMemberRole] = useState('lead_manager') // 'lead_manager' | 'super_admin' | 'viewer'
  const [teamSuccess, setTeamSuccess] = useState('')
  const [teamError, setTeamError] = useState('')

  // Avatar upload
  const [avatarUploading, setAvatarUploading] = useState(false)
  const avatarFileRef = useRef(null)

  const loadEnquiries = async () => {
    setLoadingEnquiries(true)
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) {
        setEnquiries(data)
      }
    } catch (err) {
      console.warn('Enquiries load notice:', err)
    } finally {
      setLoadingEnquiries(false)
    }
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'Recently'
    try {
      return new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(dateStr))
    } catch {
      return String(dateStr)
    }
  }

  // Handle Team Member Addition
  const handleAddTeamMember = (e) => {
    e.preventDefault()
    setTeamError('')
    setTeamSuccess('')
    if (!newMemberEmail.trim()) {
      setTeamError('Please enter an email address.')
      return
    }
    try {
      const updated = saveTeamMember({
        email: newMemberEmail.trim(),
        name: newMemberName.trim() || newMemberEmail.split('@')[0],
        role: newMemberRole,
      })
      setTeamMembers(updated)
      const assignedRoleLabel = newMemberRole === 'super_admin' ? 'Super Admin' : (newMemberRole === 'viewer' ? 'Viewer' : 'Lead Manager')
      setTeamSuccess(`Role granted! ${newMemberEmail} is now assigned as ${assignedRoleLabel} and can view Contact Form leads.`)
      setNewMemberEmail('')
      setNewMemberName('')
      setTimeout(() => setTeamSuccess(''), 6000)
    } catch (err) {
      setTeamError(err.message || 'Failed to assign role.')
    }
  }

  // Handle Team Member Removal
  const handleRemoveTeamMember = (email) => {
    if (!window.confirm(`Revoke contact form access for ${email}?`)) return
    try {
      const updated = removeTeamMember(email)
      setTeamMembers(updated)
      setTeamSuccess(`Access revoked for ${email}.`)
      setTimeout(() => setTeamSuccess(''), 4000)
    } catch (err) {
      setTeamError(err.message || 'Failed to remove member.')
    }
  }

  // Handle Avatar Image File Upload
  const handleAvatarFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, or WEBP).')
      return
    }
    setAvatarUploading(true)
    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const base64 = event.target.result
        await updateUserAvatar(base64)
        setAvatarUploading(false)
        setAvatarFailed(false)
        setAuthSuccess('Profile picture updated successfully across all pages!')
        setTimeout(() => setAuthSuccess(''), 4000)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setAvatarUploading(false)
      setAuthError('Could not process avatar image.')
    }
  }

  useEffect(() => {
    if (modeParam === 'signup') setTab('signup')
    else if (modeParam === 'login') setTab('login')
    else if (modeParam === 'forgot') setTab('forgot')
  }, [modeParam])

  // Initial local cache hydrate + Firebase Auth listener
  useEffect(() => {
    // 1. Instant local storage hydrate
    const stored = getStoredAuthUser()
    if (stored) {
      setCurrentUser(stored)
      setLoadingUser(false)
      if (canAccessLeads(stored)) {
        loadEnquiries()
      }
    }
    setTeamMembers(getTeamMembers())

    // 2. Firebase Auth authoritative sync
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        saveStoredAuthUser(user)
        setCurrentUser(user)
        setLoadingUser(false)
        if (canAccessLeads(user)) {
          loadEnquiries()
        }
      } else {
        saveStoredAuthUser(null)
        setCurrentUser(null)
        setLoadingUser(false)
      }
    })

    const handleAuthEvent = () => {
      const u = getStoredAuthUser() || auth.currentUser
      setCurrentUser(u)
    }

    const handleTeamEvent = () => {
      setTeamMembers(getTeamMembers())
    }

    window.addEventListener('naizon_auth_change', handleAuthEvent)
    window.addEventListener('naizon_team_change', handleTeamEvent)

    return () => {
      unsubscribe()
      window.removeEventListener('naizon_auth_change', handleAuthEvent)
      window.removeEventListener('naizon_team_change', handleTeamEvent)
    }
  }, [])

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  // Password matching validation checks
  const passwordsMatch = form.password && form.confirmPassword && form.password === form.confirmPassword
  const passwordsMismatch = form.confirmPassword && form.password !== form.confirmPassword

  // Password Strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '' }
    let score = 0
    if (pass.length >= 6) score += 1
    if (pass.length >= 8) score += 1
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' }
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' }
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-blue-500' }
    return { score: 4, label: 'Strong', color: 'bg-emerald-500' }
  }

  const passStrength = getPasswordStrength(form.password)

  // Clipboard copy helper
  const copyToClipboard = (text, field) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(''), 2000)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthSuccess('')
    setAuthLoading(true)

    try {
      if (tab === 'signup') {
        if (!form.name.trim()) throw new Error('Please enter your full name.')
        if (!form.email.trim()) throw new Error('Please enter a valid work email.')
        if (!form.password) throw new Error('Please enter a password.')
        if (form.password.length < 6) throw new Error('Password must be at least 6 characters.')
        if (!form.confirmPassword) throw new Error('Please confirm your password.')
        if (form.password !== form.confirmPassword) {
          throw new Error('Passwords do not match. Please ensure both fields are identical.')
        }

        const newUser = await signUpWithEmail(form.email.trim(), form.password, form.name.trim())
        setVerificationPendingEmail(newUser.email || form.email.trim())
        setResendCooldown(60)
        setAuthSuccess('Account registered! A verification link has been sent to your email.')
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

  // Handle Phone SMS OTP
  const handleSendOtp = async (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthSuccess('')
    setAuthLoading(true)

    try {
      if (!phoneNumber || phoneNumber.trim().length < 10) {
        throw new Error('Please enter a valid phone number with country code (e.g. +91 9876543210).')
      }
      const appVerifier = setupRecaptcha('recaptcha-container')
      const confirmation = await sendPhoneOtp(phoneNumber.trim(), appVerifier)
      setConfirmationResult(confirmation)
      setOtpSent(true)
      setAuthSuccess('Verification code sent to ' + phoneNumber + '! Enter code below.')
    } catch (err) {
      setAuthError(err.message || 'Could not dispatch SMS verification code.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthSuccess('')
    setAuthLoading(true)

    try {
      if (!otpCode || otpCode.trim().length < 6) {
        throw new Error('Please enter the 6-digit verification code.')
      }
      if (!confirmationResult) {
        throw new Error('Please request an SMS code first.')
      }
      await confirmationResult.confirm(otpCode.trim())
      setAuthSuccess('Phone verification successful! Redirecting...')
      setTimeout(() => router.push('/'), 1000)
    } catch (err) {
      setAuthError(err.message || 'Invalid or expired verification code.')
    } finally {
      setAuthLoading(false)
    }
  }

  // Resend email verification
  const handleResendVerification = async () => {
    if (resendCooldown > 0) return
    setAuthError('')
    try {
      await sendVerificationEmail(currentUser || auth.currentUser)
      setResendCooldown(60)
      setAuthSuccess('Verification email resent! Please check your inbox.')
    } catch (err) {
      setAuthError(err.message || 'Failed to resend verification email.')
    }
  }

  // Reload user state to check if email was verified
  const handleCheckEmailVerified = async () => {
    setAuthLoading(true)
    try {
      const refreshed = await reloadUser()
      if (refreshed?.emailVerified) {
        setVerificationPendingEmail('')
        setAuthSuccess('Email verified successfully! Welcome to NAIZON.')
        router.push('/')
      } else {
        setAuthError('Email not yet marked as verified. Please click the link in your email first.')
      }
    } catch (err) {
      setAuthError(err.message || 'Error reloading verification status.')
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
  const hasLeadAccess = canAccessLeads(currentUser)
  const userRoleTitle = getUserRole(currentUser)

  const filteredEnquiries = enquiries.filter((item) => {
    const matchesFilter =
      enquiryFilter === 'All' ||
      (item.service && item.service.toLowerCase().includes(enquiryFilter.toLowerCase()))
    const q = enquirySearch.toLowerCase().trim()
    const matchesSearch =
      !q ||
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.email && item.email.toLowerCase().includes(q)) ||
      (item.phone && item.phone.toLowerCase().includes(q)) ||
      (item.service && item.service.toLowerCase().includes(q)) ||
      (item.details && item.details.toLowerCase().includes(q)) ||
      (item.budget && item.budget.toLowerCase().includes(q))
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#0e131f] text-slate-100 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 selection:bg-[#fd5001] selection:text-white">
      {/* Invisible Recaptcha Container for Phone Auth */}
      <div id="recaptcha-container"></div>

      {/* Top Bar with Navigation & Security Badge */}
      <header className={`mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-800/80 transition-all duration-200 ${
        currentUser && hasLeadAccess ? 'max-w-6xl' : 'max-w-xl'
      }`}>
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 transition hover:text-[#fd5001]"
        >
          <ArrowLeft size={16} />
          <span>Back to NAIZON</span>
        </a>

        <div className="flex items-center gap-2.5">
          {currentUser && hasLeadAccess && (
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-400">
              <Crown size={13} className="text-amber-400" />
              <span>{isAdmin ? 'Super Admin Console' : 'Lead Manager Portal'}</span>
            </span>
          )}
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>256-bit Encrypted Session</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`mx-auto w-full py-6 transition-all duration-200 ${
        currentUser && hasLeadAccess ? 'max-w-6xl' : 'max-w-xl'
      }`}>
        
        {/* Verification Pending Screen (Shown right after signup) */}
        {verificationPendingEmail ? (
          <div className="rounded-2xl border border-slate-800 bg-[#161c2d] p-7 shadow-2xl sm:p-9 text-center animate-in fade-in duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fd5001]/10 text-[#fd5001] ring-1 ring-[#fd5001]/30">
              <Mail size={32} />
            </div>

            <span className="mt-4 inline-block rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400 ring-1 ring-amber-500/30">
              Verification Required
            </span>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Verify Your Email Address
            </h1>

            <p className="mt-2 text-xs leading-relaxed text-slate-400 max-w-md mx-auto">
              We have dispatched a secure verification link to{' '}
              <strong className="text-white font-mono">{verificationPendingEmail}</strong>.
              Click the link in the email to activate your account.
            </p>

            {authError && (
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
                <AlertCircle size={15} />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
                <CheckCircle2 size={15} />
                <span>{authSuccess}</span>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={handleCheckEmailVerified}
                disabled={authLoading}
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#fd5001] px-5 text-xs font-bold text-white shadow-lg shadow-[#fd5001]/25 hover:bg-[#e04600] transition active:scale-[0.99] disabled:opacity-50"
              >
                {authLoading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
                <span>I Have Verified My Email</span>
              </button>

              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendCooldown > 0}
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-5 text-xs font-bold text-slate-300 hover:bg-slate-800 transition disabled:opacity-50"
              >
                <Send size={14} />
                <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Verification Link'}</span>
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setVerificationPendingEmail('')}
                className="text-xs text-slate-500 hover:text-slate-300 underline"
              >
                &larr; Back to Sign In
              </button>
            </div>
          </div>
        ) : currentUser ? (
          hasLeadAccess ? (
            /* ================================================================ */
            /* EXECUTIVE ADMIN & LEAD MANAGER DASHBOARD                         */
            /* ================================================================ */
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header Banner */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#161c2d] p-6 sm:p-8 shadow-2xl">
                <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-amber-500/10 to-[#fd5001]/10 blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                  <div className="flex items-center gap-4">
                    {/* Admin Avatar with Change Photo Trigger */}
                    <div className="relative shrink-0 group">
                      {currentUser.photoURL && !avatarFailed ? (
                        <img
                          src={currentUser.photoURL}
                          alt={currentUser.displayName || 'Profile'}
                          onError={() => setAvatarFailed(true)}
                          className="h-16 w-16 rounded-2xl border-2 border-slate-700 object-cover shadow-lg ring-2 ring-amber-400/40"
                        />
                      ) : (
                        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-tr from-amber-500 to-[#fd5001] text-2xl font-black text-white shadow-lg ring-2 ring-amber-400/40">
                          {(currentUser.displayName || currentUser.email || 'M')[0].toUpperCase()}
                        </div>
                      )}

                      {/* Photo Upload Overlay Button */}
                      <button
                        type="button"
                        onClick={() => avatarFileRef.current?.click()}
                        disabled={avatarUploading}
                        title="Click to change profile picture"
                        className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold backdrop-blur-xs"
                      >
                        {avatarUploading ? (
                          <Loader2 size={16} className="animate-spin text-amber-400" />
                        ) : (
                          <>
                            <Camera size={16} className="text-amber-300 mb-0.5" />
                            <span>Change</span>
                          </>
                        )}
                      </button>

                      <input
                        ref={avatarFileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileSelect}
                        className="hidden"
                      />

                      {isAdmin && (
                        <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-amber-500 text-slate-950 ring-2 ring-[#161c2d] pointer-events-none">
                          <Crown size={12} strokeWidth={3} />
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                          {currentUser.displayName || 'Muhammad Sufiyan'}
                        </h1>
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
                          <Crown size={12} className="text-amber-400" />
                          {userRoleTitle}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                        <span>{currentUser.email}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {isAdmin ? 'Full Root Control' : 'Contact Lead Access Granted'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Header Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => avatarFileRef.current?.click()}
                      className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 text-xs font-bold text-slate-200 transition hover:bg-slate-700 active:scale-95"
                      title="Upload custom profile photo"
                    >
                      <Upload size={14} className="text-amber-400" />
                      <span>Upload Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={loadEnquiries}
                      disabled={loadingEnquiries}
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 text-xs font-bold text-slate-200 transition hover:bg-slate-700 active:scale-95 disabled:opacity-50"
                      title="Reload customer enquiries"
                    >
                      <RefreshCw size={14} className={loadingEnquiries ? 'animate-spin text-amber-400' : ''} />
                      <span>{loadingEnquiries ? 'Loading...' : 'Refresh'}</span>
                    </button>

                    <a
                      href="/"
                      className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#fd5001] px-4 text-xs font-bold text-white transition hover:bg-[#e04600] shadow-md shadow-[#fd5001]/25 active:scale-95"
                    >
                      <Home size={14} />
                      <span>Website</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 text-xs font-bold text-red-300 transition hover:bg-red-500/20 active:scale-95"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Status & Feedback Notifications */}
              {authSuccess && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 animate-in fade-in">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                  <span>{authSuccess}</span>
                </div>
              )}

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-800 bg-[#161c2d] p-5 shadow-lg">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Enquiries</span>
                    <FileText size={18} className="text-amber-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">{enquiries.length}</span>
                    <span className="text-xs text-slate-400">prospects received</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">Live contact inquiries across all services</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#161c2d] p-5 shadow-lg">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent 7 Days</span>
                    <Sparkles size={18} className="text-[#fd5001]" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">
                      {enquiries.filter((e) => {
                        if (!e.created_at) return false
                        return Date.now() - new Date(e.created_at).getTime() < 7 * 86400000
                      }).length}
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold">Active leads</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">Fresh customer requests requiring follow-up</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-[#161c2d] p-5 shadow-lg">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Team & Roles</span>
                    <Users size={18} className="text-emerald-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">{teamMembers.length}</span>
                    <span className="text-xs text-emerald-400 font-semibold">Authorized members</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">Users with permission to view Contact Form</p>
                </div>
              </div>

              {/* Navigation View Switcher (Leads vs User Management) */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
                <button
                  type="button"
                  onClick={() => setDashboardTab('leads')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                    dashboardTab === 'leads'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <FileText size={15} />
                  <span>Contact Form Leads</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                    dashboardTab === 'leads' ? 'bg-black/20 text-slate-950' : 'bg-slate-800 text-amber-400'
                  }`}>
                    {enquiries.length}
                  </span>
                </button>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setDashboardTab('team')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                      dashboardTab === 'team'
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Users size={15} />
                    <span>User Management & Roles</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                      dashboardTab === 'team' ? 'bg-black/20 text-slate-950' : 'bg-slate-800 text-amber-400'
                    }`}>
                      {teamMembers.length}
                    </span>
                  </button>
                )}
              </div>

              {/* VIEW 1: USER MANAGEMENT & ROLE PERMISSION SYSTEM */}
              {dashboardTab === 'team' && isAdmin ? (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Team Notification Alerts */}
                  {teamSuccess && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
                      <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                      <span>{teamSuccess}</span>
                    </div>
                  )}

                  {teamError && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300">
                      <AlertCircle size={16} className="shrink-0 text-red-400" />
                      <span>{teamError}</span>
                    </div>
                  )}

                  {/* Form: Add New Member & Assign Role */}
                  <div className="rounded-2xl border border-slate-800 bg-[#161c2d] p-6 sm:p-7 shadow-2xl">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/15 text-amber-400">
                        <UserCheck size={18} />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-white">
                          Grant User Access & Assign Role
                        </h2>
                        <p className="text-xs text-slate-400">
                          Authorized members can sign in at <strong className="text-white">/login</strong> with their email and view submitted Contact forms.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleAddTeamMember} className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Member Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={newMemberEmail}
                          onChange={(e) => setNewMemberEmail(e.target.value)}
                          placeholder="e.g. member@naizon.com"
                          className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Member Name (Optional)
                        </label>
                        <input
                          type="text"
                          value={newMemberName}
                          onChange={(e) => setNewMemberName(e.target.value)}
                          placeholder="e.g. Team Lead / Partner"
                          className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Role & Permission *
                        </label>
                        <select
                          value={newMemberRole}
                          onChange={(e) => setNewMemberRole(e.target.value)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-white outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                        >
                          <option value="lead_manager">Lead Manager (Can View & Call/Email Leads)</option>
                          <option value="super_admin">Super Admin (Full Root System Access)</option>
                          <option value="viewer">Viewer (Read-Only Contact Forms)</option>
                        </select>
                      </div>

                      <div className="md:col-span-3 flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-amber-400 shadow-md shadow-amber-500/20 active:scale-95"
                        >
                          <UserPlus size={15} />
                          <span>Assign Role & Grant Access</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Team Members List */}
                  <div className="rounded-2xl border border-slate-800 bg-[#161c2d] p-6 sm:p-7 shadow-2xl">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                      Active Authorized Members ({teamMembers.length})
                    </h3>

                    <div className="space-y-3">
                      {teamMembers.map((member) => (
                        <div
                          key={member.email}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-slate-700"
                        >
                          <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-800 text-sm font-black uppercase text-amber-400 ring-1 ring-slate-700">
                              {(member.name || member.email || 'T')[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white">
                                  {member.name || member.email.split('@')[0]}
                                </span>
                                {member.isOwner && (
                                  <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-black uppercase text-amber-400 ring-1 ring-amber-500/30">
                                    Owner
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-mono text-slate-400">
                                {member.email}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                              member.role === 'super_admin'
                                ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                                : 'bg-blue-500/15 border border-blue-500/30 text-blue-300'
                            }`}>
                              <Shield size={12} />
                              <span>{member.roleLabel || member.role}</span>
                            </span>

                            <span className="text-[11px] text-emerald-400 font-semibold hidden md:inline">
                              ✓ Contact Form Access
                            </span>

                            {!member.isOwner && (
                              <button
                                type="button"
                                onClick={() => handleRemoveTeamMember(member.email)}
                                title="Revoke access"
                                className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-bold text-red-300 hover:bg-red-500/20 transition"
                              >
                                <Trash2 size={13} />
                                <span>Revoke</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* VIEW 2: CONTACT FORM ENQUIRIES FEED */
                <div className="rounded-2xl border border-slate-800 bg-[#161c2d] p-6 sm:p-7 shadow-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>Customer Enquiries & Project Leads</span>
                        <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-amber-400">
                          {filteredEnquiries.length}
                        </span>
                      </h2>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Real-time customer enquiries submitted through the NAIZON contact portal.
                      </p>
                    </div>

                    {/* Search Input */}
                    <div className="relative min-w-[240px] sm:w-72">
                      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={enquirySearch}
                        onChange={(e) => setEnquirySearch(e.target.value)}
                        placeholder="Search name, phone, service..."
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/90 pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                      />
                      {enquirySearch && (
                        <button
                          type="button"
                          onClick={() => setEnquirySearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Service Filter Tabs */}
                  <div className="flex flex-wrap items-center gap-2 pt-4 pb-2">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
                      <Filter size={12} />
                      Filter:
                    </span>
                    {['All', 'Web', 'Mobile', 'Ecommerce', 'Website'].map((filterName) => (
                      <button
                        key={filterName}
                        type="button"
                        onClick={() => setEnquiryFilter(filterName)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                          enquiryFilter === filterName
                            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                            : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {filterName === 'All' ? 'All Services' : filterName}
                      </button>
                    ))}
                  </div>

                  {/* Inquiries Cards */}
                  <div className="mt-4 space-y-4">
                    {loadingEnquiries ? (
                      <div className="space-y-3 py-4">
                        <div className="h-28 rounded-xl bg-slate-800/50 animate-pulse" />
                        <div className="h-28 rounded-xl bg-slate-800/50 animate-pulse" />
                      </div>
                    ) : filteredEnquiries.length > 0 ? (
                      filteredEnquiries.map((enquiry) => (
                        <div
                          key={enquiry.id || enquiry.created_at}
                          className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-slate-700 hover:bg-slate-900/90"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-2.5">
                                <h3 className="text-base font-bold text-white">
                                  {enquiry.name || 'Anonymous Prospect'}
                                </h3>
                                {enquiry.service && (
                                  <span className="rounded-md bg-[#fd5001]/15 border border-[#fd5001]/30 px-2 py-0.5 text-[11px] font-bold text-[#fd7030]">
                                    {enquiry.service}
                                  </span>
                                )}
                                {enquiry.budget && (
                                  <span className="rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
                                    {enquiry.budget}
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-xs text-slate-500">
                                Received on {formatDateTime(enquiry.created_at)}
                              </p>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex flex-wrap items-center gap-2">
                              {enquiry.email && (
                                <a
                                  href={`mailto:${enquiry.email}?subject=Regarding your enquiry with NAIZON`}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-bold text-slate-200 transition hover:bg-slate-700 hover:text-white"
                                >
                                  <Mail size={13} className="text-[#fd5001]" />
                                  <span>Email</span>
                                </a>
                              )}
                              {enquiry.phone && (
                                <a
                                  href={`tel:${enquiry.phone}`}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-bold text-slate-200 transition hover:bg-slate-700 hover:text-white"
                                >
                                  <Smartphone size={13} className="text-emerald-400" />
                                  <span>Call</span>
                                </a>
                              )}
                              {enquiry.phone && (
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(enquiry.phone, `phone_${enquiry.id}`)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
                                  title="Copy Phone Number"
                                >
                                  {copiedField === `phone_${enquiry.id}` ? (
                                    <Check size={13} className="text-emerald-400" />
                                  ) : (
                                    <Copy size={13} />
                                  )}
                                  <span>{copiedField === `phone_${enquiry.id}` ? 'Copied' : enquiry.phone}</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Details text */}
                          {enquiry.details && (
                            <div className="mt-3.5 rounded-lg border border-slate-800/80 bg-slate-950/60 p-3.5 text-xs leading-relaxed text-slate-300 whitespace-pre-wrap font-sans">
                              {enquiry.details}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 py-12 px-6 text-center">
                        <FileText size={32} className="mx-auto text-slate-600 mb-3" />
                        <p className="text-sm font-bold text-slate-300">
                          {enquirySearch ? 'No enquiries match your search' : 'No enquiries submitted yet'}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                          {enquirySearch
                            ? 'Try searching with a different term or clear the filter.'
                            : 'When visitors submit the contact form on your website, their leads will show up here live.'}
                        </p>
                        <div className="mt-4 flex justify-center gap-3">
                          <button
                            type="button"
                            onClick={loadEnquiries}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 px-3.5 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/25 transition"
                          >
                            <RefreshCw size={13} />
                            <span>Check Again</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ================================================================ */
            /* LIGHTWEIGHT CLIENT ACCOUNT VIEW                                  */
            /* ================================================================ */
            <div className="rounded-2xl border border-slate-800 bg-[#161c2d] p-7 shadow-2xl sm:p-8 animate-in fade-in duration-200 text-center">
              {/* Avatar with Online Indicator */}
              <div className="relative mx-auto w-fit">
                {currentUser.photoURL && !avatarFailed ? (
                  <img
                    src={currentUser.photoURL}
                    alt="User Avatar"
                    onError={() => setAvatarFailed(true)}
                    className="h-16 w-16 rounded-full border-2 border-slate-700 object-cover shadow-md mx-auto"
                  />
                ) : (
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-[#fd5001] text-2xl font-black uppercase text-white shadow-md mx-auto">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 flex h-3.5 w-3.5">
                  <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-[#161c2d] bg-emerald-500" />
                </span>
              </div>

              {/* Name & Role Badge */}
              <div className="mt-4 flex items-center justify-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  {currentUser.displayName || 'Authorized User'}
                </h1>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 ring-1 ring-emerald-500/30">
                  Client
                </span>
              </div>

              {/* Email with Copy */}
              <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-slate-400 font-mono">
                <span>{currentUser.email || currentUser.phoneNumber || 'User'}</span>
                {currentUser.email && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(currentUser.email, 'email')}
                    title="Copy email"
                    className="text-slate-500 hover:text-slate-300 transition"
                  >
                    {copiedField === 'email' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                )}
                {copiedField === 'email' && (
                  <span className="text-[10px] text-emerald-400 font-bold">Copied!</span>
                )}
              </div>

              {/* Unverified Email Warning (Only if pending) */}
              {currentUser.email && !currentUser.emailVerified && (
                <div className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-left">
                  <div className="flex items-center gap-2 text-xs text-amber-300">
                    <AlertTriangle size={15} className="shrink-0 text-amber-400" />
                    <span>Email verification pending</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendCooldown > 0}
                    className="shrink-0 text-xs font-bold text-amber-400 hover:underline disabled:opacity-50"
                  >
                    {resendCooldown > 0 ? `${resendCooldown}s` : 'Verify'}
                  </button>
                </div>
              )}

              {authSuccess && (
                <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-300">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>{authSuccess}</span>
                </div>
              )}

              {/* Clean Actions */}
              <div className="mt-6 flex gap-2.5 pt-3 border-t border-slate-800">
                <a
                  href="/"
                  className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#fd5001] text-xs font-bold text-white hover:bg-[#e04600] transition shadow-md shadow-[#fd5001]/20 active:scale-[0.99]"
                >
                  <Home size={15} />
                  <span>Return to Website</span>
                </a>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-red-500/10 hover:border-red-500/30 px-5 text-xs font-bold text-slate-300 hover:text-red-400 transition active:scale-[0.99]"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )
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

            {/* Tab Switcher (Sign In vs Create Account) */}
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

            {/* Method Switcher: Email vs Phone SMS (for Sign In) */}
            {tab === 'login' && (
              <div className="mt-4 flex justify-center gap-4 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAuthMethod('email')}
                  className={`inline-flex items-center gap-1.5 pb-1 border-b-2 transition ${
                    authMethod === 'email' ? 'border-[#fd5001] text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Mail size={14} />
                  <span>Email & Password</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('phone')}
                  className={`inline-flex items-center gap-1.5 pb-1 border-b-2 transition ${
                    authMethod === 'phone' ? 'border-[#fd5001] text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Smartphone size={14} />
                  <span>Phone SMS OTP</span>
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
            {tab !== 'forgot' && authMethod === 'email' && (
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

            {/* Phone SMS OTP Mode Form */}
            {tab === 'login' && authMethod === 'phone' ? (
              <div className="mt-5 space-y-4">
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Mobile Phone Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+91 9876543210"
                          className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3.5 py-2.5 pl-10 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#fd5001] focus:ring-1 focus:ring-[#fd5001]"
                        />
                        <Smartphone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Include country code (e.g. +91 for India). Firebase will send a one-time passcode.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#fd5001] px-5 text-sm font-bold text-white shadow-lg shadow-[#fd5001]/20 transition hover:bg-[#e04600] active:scale-[0.99] disabled:opacity-50"
                    >
                      {authLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      <span>Send Verification Code (SMS)</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Enter 6-Digit SMS Code
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="123456"
                          className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3.5 py-2.5 pl-10 text-center tracking-widest text-lg font-bold text-white placeholder-slate-500 outline-none transition focus:border-[#fd5001] focus:ring-1 focus:ring-[#fd5001]"
                        />
                        <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#fd5001] px-5 text-sm font-bold text-white shadow-lg shadow-[#fd5001]/20 transition hover:bg-[#e04600] active:scale-[0.99] disabled:opacity-50"
                    >
                      {authLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      <span>Verify & Sign In</span>
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Change phone number
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* Email Form (Standard Sign In / Sign Up) */
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

                    {/* Live Password Strength Meter */}
                    {tab === 'signup' && form.password && (
                      <div className="mt-2 space-y-1 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Password Strength:</span>
                          <span className={`font-bold ${
                            passStrength.score === 1 ? 'text-red-400' :
                            passStrength.score === 2 ? 'text-amber-400' :
                            passStrength.score === 3 ? 'text-blue-400' : 'text-emerald-400'
                          }`}>
                            {passStrength.label}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 h-1">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className={`rounded-full transition-all duration-300 ${
                                step <= passStrength.score ? passStrength.color : 'bg-slate-800'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* CONFIRM PASSWORD FIELD (Sign Up: Double Password Confirmation) */}
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
                        <span>Create Account & Verify</span>
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
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-xl pt-6 border-t border-slate-800/80 text-center">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} NAIZON · Enterprise Security & Identity Management
        </p>
      </footer>
    </div>
  )
}
