'use client'

import { useState, useEffect, useRef } from 'react'
import {
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Code2,
  Globe,
  Sparkles,
  Smartphone,
  Layers,
  FileText,
  Users,
  Briefcase,
  ExternalLink,
  UserPlus,
  LogIn,
  LogOut,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Crown,
} from 'lucide-react'
import {
  auth,
  signUpWithEmail,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  resetUserPassword,
  onAuthStateChanged,
  isSuperAdmin,
  ADMIN_EMAIL,
  getStoredAuthUser,
  saveStoredAuthUser,
  canAccessLeads,
  getUserRole,
} from '../utils/firebase'

const navigationData = [
  {
    title: 'What We Do',
    id: 'what-we-do',
    featured: {
      tag: 'Engineering Excellence',
      heading: 'Full-Cycle Software & Digital Solutions',
      description:
        'Transforming ideas into resilient digital systems — custom SaaS platforms, web applications, mobile apps, Windows desktop software, and interactive web games.',
      link: '/#services',
      linkText: 'Explore all capabilities',
    },
    sections: [
      {
        title: 'Core Capabilities',
        items: [
          {
            label: 'Web & SaaS Applications',
            href: '/web-development',
            description: 'Scalable web apps, client SaaS platforms & API integrations.',
            icon: Code2,
          },
          {
            label: 'Website & Webpage Development',
            href: '/website-development',
            description: 'Fast, secure, responsive websites built for business growth.',
            icon: Globe,
          },
          {
            label: 'Mobile App Development',
            href: '/mobile-app-development',
            description: 'Cross-platform iOS and Android apps with robust backends.',
            icon: Smartphone,
          },
          {
            label: 'Windows & Desktop Software',
            href: '/#work',
            description: 'High-performance desktop apps & automated business tooling.',
            icon: Layers,
          },
          {
            label: 'Web Games & Interactive',
            href: '/#work',
            description: 'Engaging HTML5 2D games, physics & interactive experiences.',
            icon: Sparkles,
          },
          {
            label: 'Ecommerce & UI/UX Design',
            href: '/ecommerce-development',
            description: 'High-converting digital storefronts & interface design systems.',
            icon: Sparkles,
          },
        ],
      },
    ],
  },
  {
    title: 'What We Think',
    id: 'what-we-think',
    featured: {
      tag: 'Insights & Research',
      heading: 'Engineering & Strategy Perspectives',
      description:
        'Practical guides and deep-dives on technical architecture, performance, technical SEO, and digital transformation.',
      link: '/guides',
      linkText: 'View all publications',
    },
    sections: [
      {
        title: 'Guides & Case Studies',
        items: [
          {
            label: 'Website Development Guide',
            href: '/guides/website-development-guide',
            description: 'Planning, budgeting, technology selection, and roadmap delivery.',
            icon: FileText,
          },
          {
            label: 'Professional Web Design Standards',
            href: '/guides/professional-website-design',
            description: 'Design principles that establish trust and drive conversions.',
            icon: Layers,
          },
          {
            label: 'SEO-Friendly Web Architecture',
            href: '/guides/seo-friendly-websites',
            description: 'Core Web Vitals, crawlability, speed, and indexing essentials.',
            icon: Globe,
          },
          {
            label: 'Featured Work & Projects',
            href: '/#work',
            description: 'Selected customer platforms, business applications, and outcomes.',
            icon: Sparkles,
          },
        ],
      },
    ],
  },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [mobileExpanded, setMobileExpanded] = useState(null)
  const [careerModal, setCareerModal] = useState(false)

  // Firebase Auth State (Instant Sync from Local Cache)
  const [currentUser, setCurrentUser] = useState(null)
  const [avatarError, setAvatarError] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authTab, setAuthTab] = useState('signup') // 'signup' | 'login' | 'forgot'
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authSuccess, setAuthSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const timeoutRef = useRef(null)
  const navRef = useRef(null)
  const userMenuRef = useRef(null)

  // Listen to Firebase Auth state + instant local storage sync
  useEffect(() => {
    // 1. Immediately hydrate from stored user cache (0ms delay)
    const stored = getStoredAuthUser()
    if (stored) {
      setCurrentUser(stored)
    }

    // 2. Subscribe to Firebase Auth for authoritative updates
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        saveStoredAuthUser(user)
        setCurrentUser(user)
      } else {
        saveStoredAuthUser(null)
        setCurrentUser(null)
      }
    })

    // 3. Listen to avatar / auth changes across windows & tabs
    const handleAuthEvent = () => {
      const u = getStoredAuthUser() || auth.currentUser
      setCurrentUser(u)
      setAvatarError(false)
    }

    window.addEventListener('naizon_auth_change', handleAuthEvent)
    window.addEventListener('storage', handleAuthEvent)

    return () => {
      unsubscribe()
      window.removeEventListener('naizon_auth_change', handleAuthEvent)
      window.removeEventListener('storage', handleAuthEvent)
    }
  }, [])

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthSuccess('')
    setAuthLoading(true)

    try {
      if (authTab === 'signup') {
        if (!authForm.name.trim()) {
          throw new Error('Please enter your full name.')
        }
        if (!authForm.email.trim() || !authForm.password) {
          throw new Error('Please enter both email and password.')
        }
        if (authForm.password.length < 6) {
          throw new Error('Password must be at least 6 characters.')
        }
        if (authForm.password !== authForm.confirmPassword) {
          throw new Error('Passwords do not match. Please verify both fields.')
        }
        await signUpWithEmail(authForm.email.trim(), authForm.password, authForm.name.trim())
        setAuthModalOpen(false)
        setAuthForm({ name: '', email: '', password: '', confirmPassword: '' })
      } else if (authTab === 'login') {
        if (!authForm.email.trim() || !authForm.password) {
          throw new Error('Please enter both email and password.')
        }
        await loginWithEmail(authForm.email.trim(), authForm.password)
        setAuthModalOpen(false)
        setAuthForm({ name: '', email: '', password: '', confirmPassword: '' })
      } else if (authTab === 'forgot') {
        if (!authForm.email.trim()) {
          throw new Error('Please enter your email address.')
        }
        await resetUserPassword(authForm.email.trim())
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
      setAuthModalOpen(false)
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
      saveStoredAuthUser(null)
      setCurrentUser(null)
      setUserMenuOpen(false)
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null)
      }
    }
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null)
        setMobileOpen(false)
        setCareerModal(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  // Lock body scroll when mobile drawer or career modal is active
  useEffect(() => {
    if (mobileOpen || careerModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [mobileOpen, careerModal])

  const handleMouseEnter = (id) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveDropdown(id)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  const toggleMobileAccordion = (id) => {
    setMobileExpanded((prev) => (prev === id ? null : id))
  }

  return (
    <>
      {/* Wipro Exact Style Header: 88px Height on Desktop, Clean 1px Border, Pure White */}
      <header
        ref={navRef}
        className="sticky top-0 z-50 h-[72px] lg:h-[88px] border-b border-neutral-200/90 bg-white transition-all duration-200"
      >
        <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12 xl:px-14">
          
          {/* Left Block: Logo + Desktop Nav Links */}
          <div className="flex h-full items-center">
            {/* Brand Logo */}
            <a
              href="/"
              className="flex shrink-0 items-center transition-opacity hover:opacity-90 py-2"
              aria-label="NAIZON Home"
            >
              <img
                src="/logo/logo.png"
                alt="NAIZON"
                width="2013"
                height="549"
                className="h-10 w-auto max-w-[190px] object-contain sm:h-11 sm:max-w-[215px]"
              />
            </a>

            {/* Desktop Navigation (Exact Wipro Style: 16px Bold, Generous Spacing, Clean Bottom Underline) */}
            <nav
              className="hidden h-full items-center gap-7 lg:flex ml-9 xl:ml-12"
              aria-label="Primary Navigation"
            >
              {navigationData.map((item) => {
                const isOpen = activeDropdown === item.id
                return (
                  <div
                    key={item.id}
                    className="relative h-full"
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(isOpen ? null : item.id)}
                      aria-expanded={isOpen}
                      className={`group relative flex h-full items-center gap-1.5 px-1 text-[16px] font-bold tracking-[-0.015em] transition-colors duration-150 ${
                        isOpen ? 'text-[#fd5001]' : 'text-[#111827] hover:text-[#fd5001]'
                      }`}
                    >
                      <span>{item.title}</span>
                      <ChevronDown
                        size={15}
                        strokeWidth={2.4}
                        className={`text-neutral-500 transition-transform duration-200 group-hover:text-[#fd5001] ${
                          isOpen ? 'rotate-180 text-[#fd5001]' : ''
                        }`}
                      />
                      {/* Wipro-style bottom underline attached to header bottom edge */}
                      <span
                        className={`absolute inset-x-0 bottom-0 h-[3.5px] bg-[#fd5001] transition-transform duration-200 ${
                          isOpen ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`}
                      />
                    </button>

                    {/* Wipro-style Mega Dropdown Attached directly to bottom edge (top-[88px]) */}
                    {isOpen && (
                      <div
                        className="fixed left-0 right-0 top-[88px] z-50 border-b border-t border-neutral-200/90 bg-white shadow-[0_28px_56px_rgba(0,0,0,0.12)] animate-in fade-in slide-in-from-top-1 duration-150"
                        onMouseEnter={() => handleMouseEnter(item.id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-14 py-8">
                          <div className="grid grid-cols-[1.6fr_1fr] gap-12">
                            {/* Left Column: Submenu items */}
                            <div>
                              <p className="mb-4 text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-[#fd5001]">
                                {item.sections[0].title}
                              </p>
                              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                {item.sections[0].items.map((sub) => {
                                  const IconComponent = sub.icon
                                  return (
                                    <a
                                      key={sub.label}
                                      href={sub.href}
                                      onClick={() => setActiveDropdown(null)}
                                      className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-[#fd5001]/5"
                                    >
                                      <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700 transition-colors group-hover:border-[#fd5001]/40 group-hover:bg-[#fd5001]/10 group-hover:text-[#fd5001]">
                                        <IconComponent size={17} strokeWidth={2.2} />
                                      </div>
                                      <div>
                                        <span className="block text-[15px] font-bold text-neutral-900 transition-colors group-hover:text-[#fd5001]">
                                          {sub.label}
                                        </span>
                                        <span className="block text-[12.5px] leading-snug text-neutral-500 font-medium mt-0.5">
                                          {sub.description}
                                        </span>
                                      </div>
                                    </a>
                                  )
                                })}
                              </div>
                            </div>

                            {/* Right Column: Featured Callout Card */}
                            <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-neutral-50 via-white to-[#fd5001]/5 p-7 border border-neutral-200/80 shadow-sm">
                              <div>
                                <span className="inline-block rounded-full bg-[#fd5001]/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#fd5001]">
                                  {item.featured.tag}
                                </span>
                                <h4 className="mt-4 text-[18px] font-bold leading-snug text-neutral-950">
                                  {item.featured.heading}
                                </h4>
                                <p className="mt-2.5 text-[13.5px] leading-relaxed text-neutral-600 font-medium">
                                  {item.featured.description}
                                </p>
                              </div>
                              <a
                                href={item.featured.link}
                                onClick={() => setActiveDropdown(null)}
                                className="mt-6 inline-flex items-center gap-2 text-[14px] font-bold text-[#fd5001] transition-colors hover:text-[#e04600]"
                              >
                                <span>{item.featured.linkText}</span>
                                <ArrowRight size={15} strokeWidth={2.4} />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* About Naizon Direct Link (Single Dedicated Page) */}
              <a
                href="/about"
                className="group relative flex h-full items-center px-1 text-[16px] font-bold tracking-[-0.015em] text-[#111827] transition-colors hover:text-[#fd5001]"
              >
                <span>About Naizon</span>
                <span className="absolute inset-x-0 bottom-0 h-[3.5px] scale-x-0 bg-[#fd5001] transition-transform duration-200 group-hover:scale-x-100" />
              </a>

              {/* Careers Link (Direct Link to Dedicated Page) */}
              <a
                href="/careers"
                className="group relative flex h-full items-center px-1 text-[16px] font-bold tracking-[-0.015em] text-[#111827] transition-colors hover:text-[#fd5001]"
              >
                <span>Careers</span>
                <span className="absolute inset-x-0 bottom-0 h-[3.5px] scale-x-0 bg-[#fd5001] transition-transform duration-200 group-hover:scale-x-100" />
              </a>
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden items-center gap-3.5 lg:flex">
            {currentUser ? (
              <div ref={userMenuRef} className="relative">
                {/* Compact Profile Picture Only Button */}
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  aria-label="User account menu"
                  title={currentUser.displayName || currentUser.email}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#fd5001] focus:ring-offset-2 active:scale-95"
                >
                  {currentUser.photoURL && !avatarError ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Profile'}
                      onError={() => setAvatarError(true)}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-neutral-300 transition hover:ring-[#fd5001]"
                    />
                  ) : (
                    <div
                      className={`grid h-10 w-10 place-items-center rounded-full text-sm font-black uppercase text-white shadow-sm transition-shadow hover:shadow-md ${
                        isSuperAdmin(currentUser)
                          ? 'bg-gradient-to-tr from-amber-500 via-[#fd5001] to-amber-600 ring-2 ring-amber-400/50'
                          : 'bg-[#fd5001] ring-2 ring-neutral-200'
                      }`}
                    >
                      {(currentUser.displayName || currentUser.email || 'M')[0].toUpperCase()}
                    </div>
                  )}
                  {isSuperAdmin(currentUser) && (
                    <span className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-amber-500 text-[9px] text-slate-950 font-black ring-2 ring-white shadow-sm">
                      <Crown size={9} strokeWidth={3} />
                    </span>
                  )}
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-neutral-200 bg-white p-2 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="border-b border-neutral-100 p-3 text-left">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-neutral-900 truncate">
                            {currentUser.displayName || 'Authorized User'}
                          </p>
                          <p className="mt-0.5 text-xs text-neutral-500 font-mono truncate">
                            {currentUser.email}
                          </p>
                        </div>
                        {isSuperAdmin(currentUser) ? (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 ring-1 ring-amber-400/40 whitespace-nowrap">
                            <Crown size={12} className="text-amber-500" />
                            Admin
                          </span>
                        ) : canAccessLeads(currentUser) ? (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 ring-1 ring-blue-400/40 whitespace-nowrap">
                            Lead Manager
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 shrink-0">
                            Client
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="py-1">
                      {isSuperAdmin(currentUser) || canAccessLeads(currentUser) ? (
                        <a
                          href="/login"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-bold text-amber-900 bg-amber-50/80 transition hover:bg-amber-100/80 mb-1"
                        >
                          <span className="flex items-center gap-2">
                            <Crown size={14} className="text-amber-600" />
                            <span>{isSuperAdmin(currentUser) ? 'Admin Dashboard' : 'Leads & Enquiries Portal'}</span>
                          </span>
                          <span className="text-[10px] font-semibold text-amber-700 uppercase bg-amber-200/60 px-1.5 py-0.5 rounded">
                            {isSuperAdmin(currentUser) ? 'Owner' : 'Team'}
                          </span>
                        </a>
                      ) : (
                        <a
                          href="/login"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-neutral-700 transition hover:bg-neutral-50 hover:text-[#fd5001]"
                        >
                          <User size={15} />
                          <span>Account Profile</span>
                        </a>
                      )}
                    </div>

                    <div className="border-t border-neutral-100 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* [Contact Us] */}
            <a
              href="/#contact"
              className="group inline-flex h-11 items-center gap-2 rounded-lg bg-[#fd5001] px-5 text-[14.5px] font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#e04600] focus:outline-none focus:ring-2 focus:ring-[#fd5001] focus:ring-offset-2 active:scale-[0.98]"
            >
              <span>Contact Us</span>
              <ArrowRight
                size={16}
                strokeWidth={2.4}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2.5 lg:hidden">
            {currentUser && (
              <a
                href="/login"
                aria-label="Account Dashboard"
                className="relative grid h-9 w-9 place-items-center rounded-full transition-transform active:scale-95"
              >
                {currentUser.photoURL && !avatarError ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Profile'}
                    onError={() => setAvatarError(true)}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-neutral-300"
                  />
                ) : (
                  <div
                    className={`grid h-9 w-9 place-items-center rounded-full text-xs font-black uppercase text-white shadow-sm ${
                      isSuperAdmin(currentUser)
                        ? 'bg-gradient-to-tr from-amber-500 via-[#fd5001] to-amber-600 ring-2 ring-amber-400/50'
                        : 'bg-[#fd5001] ring-2 ring-neutral-200'
                    }`}
                  >
                    {(currentUser.displayName || currentUser.email || 'M')[0].toUpperCase()}
                  </div>
                )}
                {isSuperAdmin(currentUser) && (
                  <span className="absolute -bottom-0.5 -right-0.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-amber-500 text-[8px] text-slate-950 font-black ring-1 ring-white">
                    <Crown size={8} strokeWidth={3} />
                  </span>
                )}
              </a>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
              className="grid h-10 w-10 place-items-center rounded-lg border border-neutral-300 text-neutral-900 transition-colors hover:bg-neutral-50"
            >
              {mobileOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Collapsible Wipro-Style Accordion) */}
      <div
        id="mobile-navigation"
        className={`fixed inset-x-0 top-[72px] bottom-0 z-40 bg-white transition-all duration-200 lg:hidden overflow-y-auto ${
          mobileOpen ? 'visible opacity-100' : 'invisible pointer-events-none opacity-0'
        }`}
      >
        <div className="mx-auto flex h-full flex-col justify-between px-6 py-6">
          <div className="divide-y divide-neutral-100 border-y border-neutral-200">
            {navigationData.map((item) => {
              const isExpanded = mobileExpanded === item.id
              return (
                <div key={item.id} className="py-3">
                  <button
                    type="button"
                    onClick={() => toggleMobileAccordion(item.id)}
                    className="flex w-full items-center justify-between py-2.5 text-left text-[17px] font-bold text-neutral-950"
                  >
                    <span className={isExpanded ? 'text-[#fd5001]' : 'text-neutral-950'}>{item.title}</span>
                    <ChevronDown
                      size={20}
                      strokeWidth={2.4}
                      className={`text-neutral-500 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-[#fd5001]' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-2 space-y-1.5 pb-3 pl-3">
                      {item.sections[0].items.map((sub) => (
                        <a
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between rounded-lg py-2.5 text-[15px] font-semibold text-neutral-700 transition-colors hover:text-[#fd5001]"
                        >
                          <span>{sub.label}</span>
                          <ArrowRight size={14} className="text-neutral-400" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            {/* About Naizon Direct Link on Mobile */}
            <div className="py-3">
              <a
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-between py-2.5 text-left text-[17px] font-bold text-neutral-950 transition-colors hover:text-[#fd5001]"
              >
                <span>About Naizon</span>
                <ArrowRight size={18} className="text-neutral-400" />
              </a>
            </div>

            {/* Careers on Mobile */}
            <div className="py-3">
              <a
                href="/careers"
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-between py-2.5 text-left text-[17px] font-bold text-neutral-950 transition-colors hover:text-[#fd5001]"
              >
                <span>Careers & Internships</span>
                <Briefcase size={18} className="text-neutral-400" />
              </a>
            </div>

            {/* Direct Contact link on Mobile */}
            <div className="py-3">
              <a
                href="/#contact"
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-between py-2.5 text-left text-[17px] font-bold text-neutral-950"
              >
                <span>Contact Us</span>
                <ArrowRight size={18} className="text-[#fd5001]" />
              </a>
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="mt-8 space-y-3 pt-4">
            {currentUser ? (
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="flex items-center gap-3">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="h-10 w-10 rounded-full border border-[#fd5001]/30 object-cover"
                    />
                  ) : (
                    <div className={`grid h-10 w-10 place-items-center rounded-full text-white font-bold text-sm shadow-sm ${
                      isSuperAdmin(currentUser) ? 'bg-gradient-to-tr from-amber-500 to-[#fd5001]' : 'bg-[#fd5001]'
                    }`}>
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-bold text-neutral-900">
                        {currentUser.displayName || 'Authorized Account'}
                      </p>
                      {isSuperAdmin(currentUser) && (
                        <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-black text-amber-700">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-neutral-500 font-mono">{currentUser.email}</p>
                  </div>
                </div>

                {isSuperAdmin(currentUser) ? (
                  <a
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="mt-3 flex items-center justify-between rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900"
                  >
                    <span className="flex items-center gap-1.5">
                      <Crown size={14} className="text-amber-600" />
                      <span>Admin Dashboard</span>
                    </span>
                    <span className="text-[10px] font-semibold text-amber-700 uppercase bg-amber-200/60 px-1.5 py-0.5 rounded">Owner</span>
                  </a>
                ) : (
                  <a
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white py-2 text-xs font-bold text-neutral-800 transition hover:bg-neutral-50"
                  >
                    <User size={14} />
                    <span>Account Profile</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => {
                    handleLogout()
                    setMobileOpen(false)
                  }}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : null}

            <a
              href="/#contact"
              onClick={() => setMobileOpen(false)}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#fd5001] px-5 text-[14.5px] font-bold text-white shadow-sm transition hover:bg-[#e04600]"
            >
              <span>Contact Us</span>
              <ArrowRight size={16} strokeWidth={2.4} />
            </a>

            <p className="mt-3 text-center text-xs text-neutral-500 font-medium">
              NAIZON · Digital Solutions & Web Engineering
            </p>
          </div>
        </div>
      </div>

      {/* Firebase Authentication Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setAuthModalOpen(false)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Favicon Branded Header */}
            <div className="flex items-center gap-2.5">
              <img
                src="/favicon/favicon-192.png"
                alt="NAIZON Logo"
                className="h-8 w-8 rounded-lg object-contain p-1 bg-[#fd5001]/10 ring-1 ring-[#fd5001]/20"
              />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  NAIZON
                </span>
                <span className="ml-2 text-[11px] font-medium text-neutral-400">• Secure Access</span>
              </div>
            </div>

            <h3 className="mt-3 text-2xl font-bold tracking-tight text-neutral-950">
              {authTab === 'signup' && 'Create Your Account'}
              {authTab === 'login' && 'Welcome Back'}
              {authTab === 'forgot' && 'Reset Your Password'}
            </h3>

            <p className="mt-1 text-xs text-neutral-600">
              {authTab === 'signup' && 'Sign up to track project milestones, access client deliverables, and collaborate with engineering.'}
              {authTab === 'login' && 'Sign in to access your client dashboard, live preview environments, and sprint updates.'}
              {authTab === 'forgot' && 'Enter your email address and we will send you a link to reset your account password.'}
            </p>

            {/* Tab switchers if not forgot */}
            {authTab !== 'forgot' && (
              <div className="mt-4 flex rounded-lg border border-neutral-200 bg-neutral-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('signup')
                    setAuthError('')
                    setAuthSuccess('')
                  }}
                  className={`flex-1 rounded-md py-1.5 text-xs font-bold transition ${
                    authTab === 'signup'
                      ? 'bg-white text-neutral-950 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('login')
                    setAuthError('')
                    setAuthSuccess('')
                  }}
                  className={`flex-1 rounded-md py-1.5 text-xs font-bold transition ${
                    authTab === 'login'
                      ? 'bg-white text-neutral-950 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                >
                  Log In
                </button>
              </div>
            )}

            {/* Error & Success Messages */}
            {authError && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
                <span className="flex-1">{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                <span className="flex-1">{authSuccess}</span>
              </div>
            )}

            {/* Google Sign In Button */}
            {authTab !== 'forgot' && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={authLoading}
                  className="flex min-h-11 w-full items-center justify-center gap-3 rounded-lg border border-neutral-300 bg-white px-4 text-xs font-bold text-neutral-800 shadow-sm transition hover:bg-neutral-50 disabled:opacity-50"
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

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-neutral-400">or continue with email</span>
                  </div>
                </div>
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleAuthSubmit} className="mt-3 space-y-3">
              {authTab === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full rounded-lg border border-neutral-300 px-3.5 py-2 text-sm text-neutral-900 outline-none transition focus:border-[#fd5001] focus:ring-1 focus:ring-[#fd5001]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  {authTab === 'signup' ? 'Work Email' : 'Email Address'}
                </label>
                <input
                  type="email"
                  required
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  placeholder="you@company.com"
                  className="w-full rounded-lg border border-neutral-300 px-3.5 py-2 text-sm text-neutral-900 outline-none transition focus:border-[#fd5001] focus:ring-1 focus:ring-[#fd5001]"
                />
              </div>

              {authTab !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-neutral-700">Password</label>
                    {authTab === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setAuthTab('forgot')
                          setAuthError('')
                          setAuthSuccess('')
                        }}
                        className="text-[11px] font-semibold text-[#fd5001] hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={authForm.password}
                      onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                      placeholder="At least 6 characters"
                      minLength={6}
                      className="w-full rounded-lg border border-neutral-300 px-3.5 py-2 pr-10 text-sm text-neutral-900 outline-none transition focus:border-[#fd5001] focus:ring-1 focus:ring-[#fd5001]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password (Modal Signup) */}
              {authTab === 'signup' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-neutral-700">Confirm Password</label>
                    {authForm.confirmPassword && (
                      <span className={`text-[11px] font-bold ${authForm.password === authForm.confirmPassword ? 'text-emerald-600' : 'text-red-600'}`}>
                        {authForm.password === authForm.confirmPassword ? '✓ Match' : '✕ No match'}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={authForm.confirmPassword}
                      onChange={(e) => setAuthForm({ ...authForm, confirmPassword: e.target.value })}
                      placeholder="Re-enter password"
                      minLength={6}
                      className="w-full rounded-lg border border-neutral-300 px-3.5 py-2 pr-10 text-sm text-neutral-900 outline-none transition focus:border-[#fd5001] focus:ring-1 focus:ring-[#fd5001]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}


              <div className="pt-2">
                <button
                  type="submit"
                  disabled={authLoading}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#fd5001] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#e04600] active:scale-[0.98] disabled:opacity-50"
                >
                  {authLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : authTab === 'signup' ? (
                    <>
                      <UserPlus size={16} />
                      <span>Create Account</span>
                    </>
                  ) : authTab === 'login' ? (
                    <>
                      <LogIn size={16} />
                      <span>Sign In</span>
                    </>
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>
              </div>

              {authTab === 'forgot' && (
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('login')
                      setAuthError('')
                      setAuthSuccess('')
                    }}
                    className="text-xs font-semibold text-neutral-600 hover:text-[#fd5001]"
                  >
                    &larr; Back to Sign In
                  </button>
                </div>
              )}

              <p className="text-center text-[11px] text-neutral-500">
                {authTab === 'signup' && (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('login')
                        setAuthError('')
                        setAuthSuccess('')
                      }}
                      className="font-bold text-[#fd5001] hover:underline"
                    >
                      Sign In
                    </button>
                  </span>
                )}
                {authTab === 'login' && (
                  <span>
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('signup')
                        setAuthError('')
                        setAuthSuccess('')
                      }}
                      className="font-bold text-[#fd5001] hover:underline"
                    >
                      Sign Up
                    </button>
                  </span>
                )}
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Careers Modal (Corporate IT Style in Brand Orange) */}
      {careerModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setCareerModal(false)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <span className="inline-block rounded-full bg-[#fd5001]/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#fd5001]">
              Careers at NAIZON
            </span>

            <h3 className="mt-4 text-2xl font-bold tracking-tight text-neutral-950">
              Build the Future of Digital Systems
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-neutral-600 font-medium">
              We are constantly seeking talented Frontend Engineers, Fullstack Web Developers, UI/UX Designers, and AI Automation specialists to collaborate on high-impact customer projects.
            </p>

            <div className="mt-6 rounded-xl border border-neutral-100 bg-[#f8f8f5] p-4 text-sm">
              <p className="font-bold text-neutral-900">Open Roles & Inquiries:</p>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-neutral-700 text-xs font-medium">
                <li>Senior Frontend Developer (React / Next.js / Tailwind)</li>
                <li>Fullstack Engineer (Node.js, Postgres, Supabase)</li>
                <li>UI/UX & Product Designer (Figma, Design Systems)</li>
              </ul>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:info@naizon.in?subject=Application%20for%20Engineering%20Role%20/%20Internship%20at%20NAIZON"
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#fd5001] px-5 text-sm font-bold text-white transition hover:bg-[#e04600]"
              >
                <span>Send CV to info@naizon.in</span>
                <ExternalLink size={15} strokeWidth={2.2} />
              </a>
              <a
                href="/careers"
                onClick={() => setCareerModal(false)}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-neutral-300 px-5 text-sm font-bold text-neutral-700 hover:bg-neutral-50"
              >
                Explore Careers &rarr;
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
