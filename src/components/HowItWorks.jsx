'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ArrowRight } from 'lucide-react'

const steps = [
  {
    n: '01',
    badge: 'Phase 01',
    t: 'Discuss',
    d: 'We listen to what you need, who it is for and what success looks like.',
    highlights: [
      'Understand project goals & audience',
      'Clarify feature requirements & constraints',
      'Define clear measurable success criteria',
    ],
  },
  {
    n: '02',
    badge: 'Phase 02',
    t: 'Plan',
    d: 'We define the scope, approach, timeline and commercial terms.',
    highlights: [
      'Detailed scope & architecture planning',
      'Realistic delivery timeline & milestones',
      'Transparent pricing & commercial terms',
    ],
  },
  {
    n: '03',
    badge: 'Phase 03',
    t: 'Design & Build',
    d: 'We work through the interface and development with practical reviews.',
    highlights: [
      'Responsive UI/UX design & wireframes',
      'Clean, maintainable frontend & backend code',
      'Regular progress reviews & feedback loops',
    ],
  },
  {
    n: '04',
    badge: 'Phase 04',
    t: 'Launch',
    d: 'We test, release and provide the agreed support after launch.',
    highlights: [
      'Thorough cross-device & QA testing',
      'Smooth production deployment & domain setup',
      'Agreed post-launch support & updates',
    ],
  },
]

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const cardRefs = useRef([])

  useEffect(() => {
    const handleScroll = () => {
      const stickyThreshold = window.innerHeight * 0.38
      let current = 0

      cardRefs.current.forEach((el, index) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        if (rect.top <= stickyThreshold) {
          current = index
        }
      })

      setActiveStep(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToStep = (index) => {
    const el = cardRefs.current[index]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <section id="how-it-works" className="section bg-white scroll-mt-24">
      <div className="shell grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">

        {/* Left Column: Sticky Header & Progress Indicator */}
        <div className="lg:sticky lg:top-28 lg:self-start lg:py-2">
          <div className="max-w-3xl">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[.18em] text-[#fd5001]">
              How we work
            </span>
            <h2 className="title">A clear process from start to finish.</h2>
            <p className="copy mt-4 text-slate-600">
              We keep the process understandable and the work focused on what your business actually needs.
            </p>
          </div>

          {/* Step Progress Stepper (Desktop) */}
          <div className="mt-10 hidden lg:block">
            <div className="flex flex-col">
              {steps.map((step, index) => {
                const isActive = activeStep === index
                const isPassed = activeStep > index
                const isLast = index === steps.length - 1

                return (
                  <button
                    key={step.n}
                    type="button"
                    suppressHydrationWarning
                    onClick={() => scrollToStep(index)}
                    className="group flex w-full items-stretch gap-4 text-left transition-all duration-200 focus:outline-none"
                  >
                    {/* Centered Stepper Track (Circle Node + Connecting Line) */}
                    <div className="flex flex-col items-center">
                      {/* Circle Node */}
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${isActive
                            ? 'bg-[#fd5001] text-white shadow-md ring-4 ring-[#fd5001]/20'
                            : isPassed
                              ? 'bg-[#fd5001]/10 text-[#fd5001] border border-[#fd5001]/30'
                              : 'bg-white border-2 border-slate-300 text-slate-500 group-hover:border-slate-400'
                          }`}
                      >
                        {step.n}
                      </span>

                      {/* Connecting Line (Only between circles, perfectly centered, starts strictly after Circle 01) */}
                      {!isLast && (
                        <div
                          className={`w-[2px] flex-1 my-1 transition-colors duration-300 ${isPassed ? 'bg-[#fd5001]' : 'bg-slate-200'
                            }`}
                        />
                      )}
                    </div>

                    {/* Step Title & Status */}
                    <div className={`pt-1 text-left ${!isLast ? 'pb-7' : 'pb-1'}`}>
                      <p
                        className={`text-sm font-bold tracking-tight transition-colors ${isActive
                            ? 'text-[#fd5001]'
                            : 'text-slate-800 group-hover:text-slate-950'
                          }`}
                      >
                        {step.t}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {step.d}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#fd5001] hover:text-[#e04600] transition-colors"
              >
                Start your project <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Scrolling Step Cards */}
        <div className="relative">
          {steps.map((step, index) => {
            const isActive = activeStep === index
            const isPrevious = index < activeStep

            return (
              <div
                key={step.n}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`sticky top-[5.5rem] lg:top-[7rem] transition-all duration-300 rounded-xl sm:rounded-2xl border bg-white p-6 sm:p-8 overflow-hidden ${isActive
                    ? 'border-[#fd5001] shadow-[0_18px_44px_rgba(253,80,1,0.12)] ring-1 ring-[#fd5001]/30 opacity-100'
                    : isPrevious
                      ? 'border-transparent shadow-none opacity-0 pointer-events-none'
                      : 'border-slate-200/90 shadow-[0_6px_24px_rgba(0,0,0,0.04)] opacity-100'
                  }`}
                style={{
                  zIndex: (index + 1) * 10,
                  marginBottom: index < steps.length - 1 ? '9rem' : '0rem',
                }}
              >
                {/* Card Header Strip */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fd5001]/10 text-[11px] font-bold text-[#fd5001] border border-[#fd5001]/25">
                      {step.n}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {step.badge}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#fd5001]">
                    Step {step.n} of 04
                  </span>
                </div>

                {/* Card Main Content */}
                <div className="mt-5">
                  <h3 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                    {step.t}
                  </h3>
                  <p className="mt-3 text-[15px] sm:text-base leading-7 text-slate-600">
                    {step.d}
                  </p>

                  {/* Highlights Checklist */}
                  <ul className="mt-6 space-y-2.5 border-t border-slate-100 pt-5">
                    {step.highlights.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                        <Check size={16} className="shrink-0 text-[#fd5001]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
