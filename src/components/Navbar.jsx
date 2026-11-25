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
} from 'lucide-react'

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
            href: '/#services',
            description: 'High-performance desktop apps & automated business tooling.',
            icon: Layers,
          },
          {
            label: 'Web Games & Interactive',
            href: '/#services',
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
  const [signUpModal, setSignUpModal] = useState(false)
  const [signUpSubmitted, setSignUpSubmitted] = useState(false)
  const [signUpData, setSignUpData] = useState({ name: '', email: '', projectType: 'SaaS Platform' })
  const timeoutRef = useRef(null)
  const navRef = useRef(null)

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
            {/* [Sign Up] */}
            <button
              type="button"
              onClick={() => {
                setSignUpSubmitted(false)
                setSignUpModal(true)
              }}
              aria-label="Client Sign Up"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-neutral-300 px-4 text-[14px] font-bold text-neutral-800 transition-colors hover:border-[#fd5001]/50 hover:bg-[#fd5001]/5 hover:text-[#fd5001]"
            >
              <UserPlus size={17} className="text-[#fd5001]" />
              <span>Sign Up</span>
            </button>

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

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            className="grid h-10 w-10 place-items-center rounded-lg border border-neutral-300 text-neutral-900 transition-colors hover:bg-neutral-50 lg:hidden"
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
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
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false)
                setSignUpSubmitted(false)
                setSignUpModal(true)
              }}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-neutral-300 px-5 text-[14.5px] font-bold text-neutral-800 transition hover:bg-neutral-50"
            >
              <UserPlus size={18} className="text-[#fd5001]" />
              <span>Sign Up</span>
            </button>

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

      {/* Sign Up Modal (Client Project & Engineering Access) */}
      {signUpModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setSignUpModal(false)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <span className="inline-block rounded-full bg-[#fd5001]/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#fd5001]">
              Client Access
            </span>

            <h3 className="mt-3 text-2xl font-bold tracking-tight text-neutral-950">
              Create Client Account
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Sign up to track project sprint milestones, collaborate with your engineering team, and access architectural deliverables.
            </p>

            {signUpSubmitted ? (
              <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white font-bold mb-2">
                  ✓
                </div>
                <h4 className="text-base font-bold text-emerald-950">Account Request Received!</h4>
                <p className="mt-1 text-xs text-emerald-800">
                  Our engineering leads will provision your staging environment and email confirmation to <strong>{signUpData.email}</strong> shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSignUpModal(false)}
                  className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-emerald-600 px-5 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (signUpData.name && signUpData.email) {
                    setSignUpSubmitted(true)
                  }
                }}
                className="mt-5 space-y-3.5"
              >
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={signUpData.name}
                    onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-[#fd5001] focus:ring-1 focus:ring-[#fd5001]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-[#fd5001] focus:ring-1 focus:ring-[#fd5001]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Primary Interest</label>
                  <select
                    value={signUpData.projectType}
                    onChange={(e) => setSignUpData({ ...signUpData, projectType: e.target.value })}
                    className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-[#fd5001] focus:ring-1 focus:ring-[#fd5001] bg-white"
                  >
                    <option value="SaaS Platform">Custom SaaS Platform</option>
                    <option value="Web Application">Modern Web Application</option>
                    <option value="Windows Desktop">Windows Desktop Software</option>
                    <option value="Mobile App">Mobile Application (iOS/Android)</option>
                    <option value="Interactive Web Game">Interactive Web Game & 2D</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#fd5001] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#e04600] active:scale-[0.98]"
                  >
                    <UserPlus size={16} />
                    <span>Create Client Account</span>
                  </button>
                </div>

                <p className="text-center text-[11px] text-neutral-500">
                  By signing up, you agree to our terms of technical service and NDAs.
                </p>
              </form>
            )}
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
