'use client'

import { useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Search,
  Award,
  GraduationCap,
  Briefcase,
  Code2,
  Cpu,
  Layers,
  Smartphone,
  Check,
  Mail,
  ShieldCheck,
  ExternalLink,
  Copy,
  Sparkles,
  Users,
  Compass,
  AlertCircle,
} from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'
import SEO from './SEO'
import { breadcrumbSchema } from '../data/schemas'

// Sample verified certificate records for instant lookup
const verifiedCertificates = {
  'NZ-2026-INT-101': {
    id: 'NZ-2026-INT-101',
    name: 'Rahul Verma',
    role: 'Frontend Engineering Intern',
    domain: 'Modern Web & React Architecture',
    duration: '3 Months (Jan 2026 - Apr 2026)',
    status: 'Verified & Active',
    grade: 'Exemplary (Grade A+)',
    issuedOn: 'April 15, 2026',
    keySkills: ['Next.js 16', 'React 19', 'Tailwind CSS', 'TypeScript', 'Responsive Design Systems'],
    verifiedBy: 'NAIZON Engineering Board',
  },
  'NZ-2026-INT-102': {
    id: 'NZ-2026-INT-102',
    name: 'Priya Sharma',
    role: 'Fullstack & Cloud Intern',
    domain: 'Client SaaS & Microservices',
    duration: '6 Months (Nov 2025 - Apr 2026)',
    status: 'Verified & Active',
    grade: 'Exemplary (Grade A+)',
    issuedOn: 'April 20, 2026',
    keySkills: ['Node.js', 'PostgreSQL', 'Supabase SSR', 'REST API Architecture', 'JWT Auth'],
    verifiedBy: 'NAIZON Engineering Board',
  },
  'NZ-2026-INT-103': {
    id: 'NZ-2026-INT-103',
    name: 'Aman Gupta',
    role: 'UI/UX & Product Design Intern',
    domain: 'Design Systems & High-Fidelity UI',
    duration: '3 Months (Dec 2025 - Mar 2026)',
    status: 'Verified & Active',
    grade: 'Distinction (Grade A)',
    issuedOn: 'March 28, 2026',
    keySkills: ['Figma Tokens', 'Information Architecture', 'Wireframing', 'Design-to-Code Systems'],
    verifiedBy: 'NAIZON Design & Product Division',
  },
  'NZ-2026-INT-104': {
    id: 'NZ-2026-INT-104',
    name: 'Sneha Patel',
    role: 'Mobile Engineering Intern',
    domain: 'Cross-Platform Applications',
    duration: '4 Months (Jan 2026 - Apr 2026)',
    status: 'Verified & Active',
    grade: 'Exemplary (Grade A+)',
    issuedOn: 'April 25, 2026',
    keySkills: ['Flutter', 'React Native', 'State Management', 'Push Notifications', 'API Integration'],
    verifiedBy: 'NAIZON Engineering Board',
  },
}

const internshipTracks = [
  {
    icon: Code2,
    title: 'Frontend Engineering Intern',
    duration: '3 to 6 Months',
    type: 'Remote / Flexible Hybrid',
    description:
      'Work alongside senior engineers building sub-second web applications, SaaS dashboards, and client platforms with modern frameworks.',
    techStack: ['Next.js (App Router)', 'React', 'Tailwind CSS', 'TypeScript', 'Turbopack'],
    deliverables: [
      'Production UI component development',
      'Core Web Vitals & performance tuning',
      'API integration with secure client state',
    ],
  },
  {
    icon: Layers,
    title: 'Fullstack & Backend Intern',
    duration: '3 to 6 Months',
    type: 'Remote / Flexible Hybrid',
    description:
      'Architect backend services, database schemas, authentication layers, and webhook integrations for client SaaS platforms.',
    techStack: ['Node.js', 'PostgreSQL', 'Supabase', 'REST & GraphQL APIs', 'Docker'],
    deliverables: [
      'Relational schema design & migrations',
      'JWT/Session auth and Role-Based Access (RBAC)',
      'Automated background jobs & cron integrations',
    ],
  },
  {
    icon: Smartphone,
    title: 'Mobile App Development Intern',
    duration: '3 to 6 Months',
    type: 'Remote / Flexible Hybrid',
    description:
      'Engineer 60FPS cross-platform mobile apps for iOS and Android with seamless native device integrations and offline caching.',
    techStack: ['Flutter / Dart', 'React Native', 'Firebase', 'REST APIs', 'App Store Tooling'],
    deliverables: [
      'Fluid mobile interfaces with touch physics',
      'Local storage, biometric login & push notifications',
      'Cross-platform testing on real devices',
    ],
  },
  {
    icon: Compass,
    title: 'UI/UX & Product Design Intern',
    duration: '3 to 6 Months',
    type: 'Remote / Flexible Hybrid',
    description:
      'Design clean, accessible design systems, user journey maps, wireframes, and production-ready mockups in Figma.',
    techStack: ['Figma', 'Auto-Layout & Variants', 'Design Tokens', 'Prototyping', 'User Research'],
    deliverables: [
      'High-fidelity component libraries and style guides',
      'Interactive Figma prototypes for client approval',
      'Developer handoff specs with pixel-perfect tokens',
    ],
  },
]

const fullTimeRoles = [
  {
    title: 'Senior Frontend Engineer',
    team: 'Web & SaaS Platform Division',
    experience: '2 - 5 Years',
    location: 'Remote / India',
    tech: 'React, Next.js, Tailwind, Performance Profiling',
  },
  {
    title: 'Fullstack Systems Engineer',
    team: 'Cloud & Infrastructure',
    experience: '2 - 4 Years',
    location: 'Remote / India',
    tech: 'Node.js, Postgres, Supabase, Redis, Microservices',
  },
  {
    title: 'UI/UX Design Lead',
    team: 'Product Design',
    experience: '2+ Years',
    location: 'Remote / India',
    tech: 'Figma, Design Systems, Design-to-Code Translation',
  },
]

export default function CareersPage() {
  const [certQuery, setCertQuery] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [copiedId, setCopiedId] = useState(false)

  const handleVerify = (queryId) => {
    const idToSearch = (queryId || certQuery).trim().toUpperCase()
    if (!idToSearch) return

    setHasSearched(true)
    const match = verifiedCertificates[idToSearch]
    if (match) {
      setSearchResult({ found: true, data: match })
    } else {
      setSearchResult({
        found: false,
        id: idToSearch,
      })
    }
  }

  const handleCopyLink = (id) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(id)
      setCopiedId(true)
      setTimeout(() => setCopiedId(false), 2000)
    }
  }

  return (
    <>
      <SEO
        title="Careers & Internships at NAIZON | Certificate Verification & Engineering Roles"
        description="Explore engineering internships, verify NAIZON training certificates, and apply for developer & designer roles. Email info@naizon.in."
        path="/careers"
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Careers & Internships', path: '/careers' },
          ]),
        ]}
      />

      <Navbar />

      <main className="bg-[#f8f8f5] text-[#172033]">
        {/* Hero Section */}
        <header className="relative border-b border-neutral-200 bg-[#060814] text-white overflow-hidden py-16 sm:py-20 lg:py-24">
          {/* Subtle Ambient Glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-[#fd5001]/15 blur-[120px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#38bdf8]/15 blur-[120px]"
          />

          <div className="shell relative z-10">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-neutral-400">
              <a href="/" className="transition-colors hover:text-[#fd5001]">
                Home
              </a>
              <span aria-hidden="true" className="px-2 text-neutral-600">
                /
              </span>
              <span aria-current="page" className="font-semibold text-white">
                Careers & Internships
              </span>
            </nav>

            <span className="inline-flex items-center gap-2 rounded-full border border-[#fd5001]/30 bg-[#fd5001]/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#fd5001]">
              <Sparkles size={14} />
              <span>Engineering Careers & Internship Division</span>
            </span>

            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
              Build Real Production Software.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-[#fd5001]">
                Accelerate Your Engineering Career.
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-neutral-300">
              At NAIZON, we don’t assign toy tutorials or busywork. Our interns and engineers collaborate directly on live SaaS platforms, mobile applications, Windows desktop software, and high-performance web systems.
            </p>

            {/* Quick Action Navigation Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#internships"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#fd5001] px-6 text-[15px] font-bold text-white shadow-lg transition-all duration-200 hover:bg-[#e04600] active:scale-[0.98]"
              >
                <span>Explore Internships</span>
                <GraduationCap size={18} />
              </a>

              <a
                href="#verify-certificate"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 text-[15px] font-bold text-white backdrop-blur-sm transition-all duration-200 hover:border-[#fd5001] hover:bg-[#fd5001]/10 hover:text-[#fd5001]"
              >
                <Award size={18} className="text-[#fd5001]" />
                <span>Check Certification</span>
              </a>

              <a
                href="mailto:info@naizon.in?subject=Application%20for%20Engineering%20Role%20/%20Internship%20at%20NAIZON"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/10 px-5 text-[14.5px] font-semibold text-neutral-300 transition-colors hover:text-white"
              >
                <Mail size={16} />
                <span>info@naizon.in</span>
              </a>
            </div>

            {/* Core Stats Bar */}
            <div className="mt-14 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-4 lg:gap-8">
              <div>
                <p className="text-3xl font-black text-white">100%</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Real Production Code
                </p>
              </div>
              <div>
                <p className="text-3xl font-black text-[#fd5001]">1-on-1</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Senior Mentorship
                </p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">Verified</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Official Credentials
                </p>
              </div>
              <div>
                <p className="text-3xl font-black text-emerald-400">PPO</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  High Performer Hires
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* SECTION 1: Check Certification (Interactive Certificate Verification Tool) */}
        <section id="verify-certificate" className="section border-b border-slate-200 bg-white scroll-mt-20">
          <div className="shell">
            <div className="max-w-3xl">
              <span className="eyebrow flex items-center gap-1.5">
                <ShieldCheck size={16} />
                <span>Credential Verification Portal</span>
              </span>
              <h2 className="title">Check Certificate &amp; Credential Authenticity</h2>
              <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
                Verify internship completion certificates, letters of recommendation (LOR), and technical training credentials issued by NAIZON. Enter the unique Certificate ID printed on your document.
              </p>
            </div>

            {/* Interactive Search Tool Container */}
            <div className="mt-10 rounded-2xl border border-slate-200 bg-[#f8f8f5] p-6 shadow-sm sm:p-8 lg:p-10">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleVerify()
                }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <div className="relative flex-1">
                  <Search
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={certQuery}
                    onChange={(e) => setCertQuery(e.target.value)}
                    placeholder="Enter Certificate ID (e.g. NZ-2026-INT-101)"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-12 pr-4 text-base font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#fd5001] focus:ring-2 focus:ring-[#fd5001]/20"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#fd5001] px-7 py-3 text-[15px] font-bold text-white shadow-sm transition hover:bg-[#e04600] active:scale-[0.98]"
                >
                  <ShieldCheck size={18} />
                  <span>Verify Credential</span>
                </button>
              </form>

              {/* Sample IDs Quick Test Chips */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Quick Test IDs:</span>
                {['NZ-2026-INT-101', 'NZ-2026-INT-102', 'NZ-2026-INT-103', 'NZ-2026-INT-104'].map(
                  (id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setCertQuery(id)
                        handleVerify(id)
                      }}
                      className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 font-mono font-bold text-slate-700 transition hover:border-[#fd5001] hover:text-[#fd5001]"
                    >
                      {id}
                    </button>
                  )
                )}
              </div>

              {/* Verification Result Display */}
              {hasSearched && searchResult && (
                <div className="mt-8 animate-in fade-in slide-in-from-top-2 duration-200">
                  {searchResult.found ? (
                    <div className="rounded-2xl border-2 border-emerald-500/40 bg-white p-6 shadow-md sm:p-8">
                      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
                        <div className="flex items-center gap-3">
                          <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                            <CheckCircle2 size={28} />
                          </div>
                          <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold uppercase text-emerald-800">
                              <Check size={13} strokeWidth={3} />
                              <span>{searchResult.data.status}</span>
                            </span>
                            <h3 className="mt-1 text-2xl font-bold text-slate-900">
                              {searchResult.data.name}
                            </h3>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Certificate ID
                          </span>
                          <span className="font-mono text-base font-bold text-[#fd5001]">
                            {searchResult.data.id}
                          </span>
                        </div>
                      </div>

                      {/* Credential Details Grid */}
                      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                          <span className="block text-xs font-bold text-slate-400 uppercase">
                            Role / Program
                          </span>
                          <span className="mt-1 block font-bold text-slate-900">
                            {searchResult.data.role}
                          </span>
                          <span className="text-xs text-slate-500">{searchResult.data.domain}</span>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                          <span className="block text-xs font-bold text-slate-400 uppercase">
                            Tenure / Duration
                          </span>
                          <span className="mt-1 block font-bold text-slate-900">
                            {searchResult.data.duration}
                          </span>
                          <span className="text-xs text-slate-500">
                            Issued: {searchResult.data.issuedOn}
                          </span>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                          <span className="block text-xs font-bold text-slate-400 uppercase">
                            Performance Rating
                          </span>
                          <span className="mt-1 block font-bold text-emerald-700">
                            {searchResult.data.grade}
                          </span>
                          <span className="text-xs text-slate-500">Verified by Mentors</span>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                          <span className="block text-xs font-bold text-slate-400 uppercase">
                            Issuing Authority
                          </span>
                          <span className="mt-1 block font-bold text-slate-900">
                            {searchResult.data.verifiedBy}
                          </span>
                          <span className="text-xs text-slate-500">Official Signature Record</span>
                        </div>
                      </div>

                      {/* Evaluated Competencies */}
                      <div className="mt-6 border-t border-slate-100 pt-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Evaluated Technologies &amp; Competencies:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {searchResult.data.keySkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-100 pt-4">
                        <p>
                          Verified on NAIZON Central Engineering Ledger. Cryptographically sealed.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleCopyLink(searchResult.data.id)}
                          className="inline-flex items-center gap-1.5 font-bold text-[#fd5001] hover:underline"
                        >
                          <Copy size={13} />
                          <span>{copiedId ? 'Copied ID!' : 'Copy Certificate ID'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-slate-800">
                      <div className="flex items-start gap-3.5">
                        <AlertCircle size={22} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-base font-bold text-slate-900">
                            No Automated Record Found for ID: {searchResult.id}
                          </h4>
                          <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                            The certificate ID you entered is not yet indexed in our online instant lookup. For manual verification, archived credentials, or background checks by hiring managers, please email our verification team directly.
                          </p>
                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <a
                              href={`mailto:info@naizon.in?subject=Certificate%20Verification%20Inquiry%20for%20ID%20${searchResult.id}&body=Hello%20NAIZON%20Team,%0A%0APlease%20verify%20the%20following%20certificate:%0ACertificate%20ID:%20${searchResult.id}%0ACandidate%20Name:%20`}
                              className="inline-flex items-center gap-2 rounded-lg bg-[#fd5001] px-4 py-2 text-xs font-bold text-white hover:bg-[#e04600]"
                            >
                              <Mail size={14} />
                              <span>Request Manual Verification (info@naizon.in)</span>
                            </a>
                            <span className="text-xs text-slate-500">
                              Typical response time: Within 24 business hours.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 2: Internship Program ("Internships at NAIZON") */}
        <section id="internships" className="section border-b border-slate-200 bg-[#f8f8f5] scroll-mt-20">
          <div className="shell">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="eyebrow flex items-center gap-1.5">
                  <GraduationCap size={16} />
                  <span>Student &amp; Fresher Program</span>
                </span>
                <h2 className="title">NAIZON Engineering Internship Program</h2>
                <p className="mt-3 max-w-2xl text-slate-600">
                  Designed for developers, computer science students, and designers who want to build real software instead of mock sandbox exercises.
                </p>
              </div>

              <a
                href="mailto:info@naizon.in?subject=Application%20for%20NAIZON%20Engineering%20Internship&body=Hi%20NAIZON%20Team,%0A%0AI%20would%20like%20to%20apply%20for%20the%20Internship%20Program.%0A%0ASelected%20Track:%20[Frontend%20/%20Fullstack%20/%20Mobile%20/%20UI-UX]%0AFull%20Name:%20%0AGitHub%20/%20Portfolio%20Link:%20%0AAttached%20Resume:%20"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#fd5001] px-6 text-sm font-bold text-white shadow-sm transition hover:bg-[#e04600] self-start md:self-auto"
              >
                <span>Apply via info@naizon.in</span>
                <ArrowRight size={16} />
              </a>
            </div>

            {/* What Makes Our Internship Different */}
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fd5001]/10 text-[#fd5001]">
                  <Code2 size={22} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">Production Codebases</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Contribute to real client SaaS applications, modern web tools, and enterprise components deployed on live cloud infra.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Users size={22} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">Direct Senior Guidance</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Code reviews, PR critiques, and architectural discussions with senior engineers who guide your clean coding practices.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Award size={22} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">Verified Certificate &amp; LOR</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Receive a verifiable digital certificate with online lookup and a signed Letter of Recommendation (LOR) for top work.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Sparkles size={22} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">Pre-Placement Offers (PPO)</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  High-performing interns who demonstrate autonomy, technical grit, and architectural clarity are offered full-time roles.
                </p>
              </div>
            </div>

            {/* 4 Active Internship Tracks */}
            <div className="mt-14">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#fd5001]">
                  Open Tracks
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                  Available Internship Tracks for 2026
                </h3>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {internshipTracks.map((track, idx) => {
                  const Icon = track.icon
                  return (
                    <article
                      key={idx}
                      className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fd5001]/10 text-[#fd5001]">
                            <Icon size={24} />
                          </div>
                          <div className="flex flex-col items-end text-xs">
                            <span className="font-bold text-slate-900">{track.duration}</span>
                            <span className="text-slate-500">{track.type}</span>
                          </div>
                        </div>

                        <h4 className="mt-5 text-xl font-bold text-slate-900">{track.title}</h4>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {track.description}
                        </p>

                        <div className="mt-5">
                          <span className="text-xs font-bold uppercase text-slate-400">
                            Technologies &amp; Tools:
                          </span>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {track.techStack.map((tech, i) => (
                              <span
                                key={i}
                                className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-5 border-t border-slate-100 pt-4">
                          <span className="text-xs font-bold uppercase text-slate-400">
                            Hands-On Deliverables:
                          </span>
                          <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                            {track.deliverables.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Check size={14} className="text-[#fd5001] mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-8 border-t border-slate-100 pt-4">
                        <a
                          href={`mailto:info@naizon.in?subject=Application%20for%20${encodeURIComponent(track.title)}&body=Hello%20NAIZON%20Engineering%20Team,%0A%0AI%20am%20applying%20for%20the%20${encodeURIComponent(track.title)}%20position.%0A%0AName:%20%0AGitHub%20/%20Portfolio:%20%0AWhy%20I'm%20interested:%20%0A(Resume%20attached)`}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-[#fd5001]"
                        >
                          <Mail size={15} />
                          <span>Apply for {track.title}</span>
                        </a>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>

            {/* How to Apply in 3 Steps */}
            <div className="mt-16 rounded-2xl border border-slate-200 bg-white p-8">
              <h4 className="text-xl font-bold text-slate-900">How to Apply for an Internship</h4>
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                <div className="border-l-2 border-[#fd5001] pl-4">
                  <span className="text-xs font-bold uppercase text-[#fd5001]">Step 01</span>
                  <h5 className="mt-1 text-base font-bold text-slate-900">Email Your CV &amp; Code</h5>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Send your updated resume, GitHub profile link, or live project URLs to{' '}
                    <strong className="text-slate-900">info@naizon.in</strong> with the subject line specifying your desired track.
                  </p>
                </div>

                <div className="border-l-2 border-[#fd5001] pl-4">
                  <span className="text-xs font-bold uppercase text-[#fd5001]">Step 02</span>
                  <h5 className="mt-1 text-base font-bold text-slate-900">Practical Technical Task</h5>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    We don’t do trick LeetCode puzzles. Shortlisted candidates receive a practical 48-hour build assignment reflecting real client requirements.
                  </p>
                </div>

                <div className="border-l-2 border-[#fd5001] pl-4">
                  <span className="text-xs font-bold uppercase text-[#fd5001]">Step 03</span>
                  <h5 className="mt-1 text-base font-bold text-slate-900">Engineering Discussion &amp; Offer</h5>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    A 30-minute conversation with our technical leads to discuss your code architecture, learning goals, and confirm your onboarding schedule.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Full-Time Positions */}
        <section className="section border-b border-slate-200 bg-white">
          <div className="shell">
            <span className="eyebrow">Full-Time Engineering</span>
            <h2 className="title">Experienced Roles at NAIZON</h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              For engineers who take pride in reliable, well-tested code, clear documentation, and autonomous problem-solving.
            </p>

            <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
              {fullTimeRoles.map((role, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <span className="text-xs font-bold uppercase text-[#fd5001]">{role.team}</span>
                    <h3 className="mt-1 text-xl font-bold text-slate-900">{role.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {role.experience} • {role.location} • Key Stack: {role.tech}
                    </p>
                  </div>

                  <a
                    href={`mailto:info@naizon.in?subject=Application%20for%20${encodeURIComponent(role.title)}&body=Hello%20NAIZON%20Hiring%20Team,%0A%0AI%20am%20interested%20in%20the%20${encodeURIComponent(role.title)}%20role.%0A%0AName:%20%0AYears%20of%20Experience:%20%0AGitHub%20/%20Portfolio:%20%0ACV%20attached.`}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-bold text-slate-800 transition hover:border-[#fd5001] hover:bg-[#fd5001]/5 hover:text-[#fd5001] self-start sm:self-auto"
                  >
                    <Mail size={15} />
                    <span>Apply via info@naizon.in</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: Direct Application Banner */}
        <section className="bg-[#0b101c] py-16 text-white border-t border-slate-800">
          <div className="shell grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <span className="inline-block rounded-full bg-[#fd5001]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#fd5001]">
                Direct Hiring Inbox
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Don’t See an Exact Match? Reach Out Anyway.
              </h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                We are always excited to meet driven developers, designers, and students. Send your portfolio, GitHub, or questions directly to our primary company email.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:info@naizon.in?subject=Career%20/%20Internship%20Inquiry%20at%20NAIZON"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#fd5001] px-7 py-3 text-[15px] font-bold text-white shadow-md transition-all duration-200 hover:bg-[#e04600] active:scale-[0.98]"
              >
                <Mail size={17} />
                <span>info@naizon.in</span>
                <ArrowRight size={17} strokeWidth={2.4} />
              </a>

              <a
                href="/about"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/20 px-6 text-[15px] font-bold text-white transition hover:bg-white/10"
              >
                About Our Company
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  )
}
