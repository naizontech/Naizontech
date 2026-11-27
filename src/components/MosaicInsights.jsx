'use client'

import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react'

const mosaicItems = [
  // --- ROW 1 ---
  {
    type: 'image',
    image: '/images/mosaic-open-data.png',
    alt: 'NAIZON Open API and Cloud Architecture Diagram',
    tag: 'ARCHITECTURE',
    title: 'Open API & Cloud Integrations',
    href: '/web-development',
  },
  {
    type: 'card',
    bg: 'bg-[#004e92]', // Deep Cobalt Blue
    hoverBg: 'hover:bg-[#003d73]',
    category: 'API & CLOUD PLATFORMS',
    title: 'Next-gen API & Headless CMS Architecture for Scalable Platforms',
    description: 'Decoupling frontend performance from heavy backend databases using microservices and Next.js SSR.',
    linkText: 'READ MORE',
    href: '/web-development',
  },
  {
    type: 'image',
    image: '/images/mosaic-api-cloud.png',
    alt: 'NAIZON AI Cloud Cluster and Distributed Systems',
    tag: 'NEURAL CLOUD',
    title: 'Distributed Cloud Systems',
    href: '/guides/website-development-guide',
  },
  {
    type: 'card',
    bg: 'bg-[#008775]', // Teal / Emerald
    hoverBg: 'hover:bg-[#006e5f]',
    category: 'HIGH-CONVERTING E-COMMERCE',
    title: 'Why Modern High-Performance Websites Drive 3x More Conversions',
    description: 'Optimizing checkout friction, dynamic product catalogues, and responsive mobile buying journeys.',
    linkText: 'READ MORE',
    href: '/ecommerce-development',
  },

  // --- ROW 2 ---
  {
    type: 'card',
    bg: 'bg-[#0284c7]', // Cerulean Blue
    hoverBg: 'hover:bg-[#0369a1]',
    category: 'CUSTOM WEB & SAAS ENGINEERING',
    title: 'Custom Web Apps & Client SaaS: Moving Beyond Generic Templates',
    description: 'Tailored digital solutions, client SaaS portals & multi-tenant architectures engineered around business workflows.',
    linkText: 'READ MORE',
    href: '/web-development',
  },
  {
    type: 'image',
    image: '/images/work-web.png',
    alt: 'NAIZON SaaS Analytics and Real-time Dashboard Interface',
    tag: 'LIVE SAAS',
    title: 'Real-time Production Analytics',
    href: '/web-development',
  },
  {
    type: 'card',
    bg: 'bg-[#1e40af]', // Royal Blue
    hoverBg: 'hover:bg-[#1e3a8a]',
    category: 'MOBILE & DESKTOP ARCHITECTURE',
    title: 'Mobile & Windows Software: Building Native Workflows Across Platforms',
    description: 'Balancing development velocity with 60FPS fluid touch responsiveness across iOS, Android, and Windows.',
    linkText: 'READ MORE',
    href: '/mobile-app-development',
  },
  {
    type: 'image',
    image: '/images/mosaic-cyber-mesh.png',
    alt: 'NAIZON 3D Cyber Wave Mesh and WebGL Engine',
    tag: 'WEBGL & 3D',
    title: 'Hardware-Accelerated 3D Graphics',
    href: '/#services',
  },

  // --- ROW 3 ---
  {
    type: 'image',
    image: '/images/work-mobile.png',
    alt: 'NAIZON Native Mobile Application Architecture on iOS and Android',
    tag: 'MOBILE OS',
    title: 'Biometric & Native Workflows',
    href: '/mobile-app-development',
  },
  {
    type: 'card',
    bg: 'bg-[#0369a1]', // Deep Ocean Blue
    hoverBg: 'hover:bg-[#075985]',
    category: 'SEARCH VISIBILITY',
    title: 'Technical SEO Architecture: Achieving 99+ Core Web Vitals on Google',
    description: 'Semantic markup, sub-second TTFB, and crawlable metadata built directly into Next.js server code.',
    linkText: 'READ MORE',
    href: '/guides/seo-friendly-websites',
  },
  {
    type: 'image',
    image: '/images/mosaic-utility-app.png',
    alt: 'High-Performance Utility Applications and Web Tools engineered by NAIZON',
    tag: 'UTILITY APPS',
    title: 'Utility Applications',
    href: '/website-development',
  },
  {
    type: 'card',
    bg: 'bg-[#5b51d8]', // Electric Indigo / Purple
    hoverBg: 'hover:bg-[#4d44b8]',
    category: 'GLOBAL DELIVERY',
    title: 'Delhi & Gurgaon Tech Hub: Delivering Scalable Systems Worldwide',
    description: 'Providing engineering excellence, remote agility, and rapid deployment for ambitious international startups.',
    linkText: 'READ MORE',
    href: '/delhi/website-development',
  },
]

export default function MosaicInsights() {
  return (
    <section
      id="insights"
      className="relative w-full overflow-hidden bg-[#060814] text-white pt-14 sm:pt-16 md:pt-20 pb-0 border-t border-white/10"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute top-1/4 -left-40 h-[480px] w-[480px] rounded-full bg-[#1e40af]/15 blur-[140px]" />
        <div className="absolute bottom-1/4 -right-40 h-[480px] w-[480px] rounded-full bg-[#fd5001]/10 blur-[150px]" />
      </div>

      {/* Section Header (Contained with comfortable breathing room) */}
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-10 mb-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8 border-b border-white/10 pb-8">
          <div className="max-w-2xl">
            <span className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-3 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#38bdf8]">
              <Sparkles size={11} className="text-[#38bdf8]" />
              Engineering Perspectives · What We Think & Build
            </span>
            <h2 className="text-2xl font-bold leading-tight tracking-[-0.03em] text-white sm:text-3xl md:text-4xl">
              Insights, Case Studies &amp; Digital Solutions
            </h2>
          </div>
          <p className="max-w-md text-[13.5px] leading-relaxed text-neutral-400 sm:text-[14.5px]">
            Explore how we build custom web applications, client SaaS platforms, mobile &amp; Windows software, and interactive web games that drive growth.
          </p>
        </div>
      </div>

      {/* 100% Full-Width Edge-to-Edge Mosaic Grid (Touching screen edges from corner to corner) */}
      <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[2px] bg-black border-y border-white/10">
        {mosaicItems.map((item, idx) => {
          if (item.type === 'image') {
            return (
              <a
                key={idx}
                href={item.href}
                className="group relative flex min-h-[230px] sm:min-h-[250px] lg:min-h-[270px] w-full flex-col justify-end overflow-hidden bg-[#0a0f24] p-6 lg:p-7 transition-transform duration-300"
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                />
                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-300 group-hover:opacity-75" />
                
                {/* Foreground Content */}
                <div className="relative z-10">
                  <span className="mb-1.5 inline-block rounded bg-black/60 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#38bdf8] backdrop-blur-sm">
                    {item.tag}
                  </span>
                  <h3 className="text-[16px] font-bold text-white transition-colors group-hover:text-[#fd5001]">
                    {item.title}
                  </h3>
                </div>

                <div className="absolute top-5 right-5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur-sm transition-transform duration-200 group-hover:scale-110 group-hover:text-white">
                  <ArrowUpRight size={15} />
                </div>
              </a>
            )
          }

          // Solid Colored Content Card
          return (
            <a
              key={idx}
              href={item.href}
              className={`group flex min-h-[230px] sm:min-h-[250px] lg:min-h-[270px] flex-col justify-between p-6 sm:p-7 lg:p-8 transition-all duration-300 ${item.bg} ${item.hoverBg}`}
            >
              <div>
                <span className="text-[11px] font-mono font-bold tracking-[0.16em] text-white/85">
                  {item.category}
                </span>
                <h3 className="mt-2.5 text-[17px] sm:text-[18px] font-bold leading-snug tracking-[-0.01em] text-white">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-white/85 line-clamp-3">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 flex items-center gap-1.5 text-[12px] font-mono font-bold tracking-wider text-white transition-transform duration-200 group-hover:translate-x-1">
                <span>{item.linkText}</span>
                <ArrowRight size={14} strokeWidth={2.4} />
              </div>
            </a>
          )
        })}

        {/* --- ROW 4: FEATURED WIDE CARDS (2-Column Spans Full Width) --- */}
        
        {/* Featured Wide Banner 1: AI & Operating Model */}
        <div className="relative col-span-1 md:col-span-2 flex min-h-[260px] sm:min-h-[280px] lg:min-h-[300px] flex-col justify-between overflow-hidden bg-[#040816] p-8 sm:p-10 lg:p-12 border-t border-white/10 group">
          <img
            src="/images/mosaic-ai-stream.png"
            alt="NAIZON AI and Neural Automation Stream Architecture"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-60 transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#040816] via-[#040816]/75 to-transparent" />

          <div className="relative z-10 max-w-xl">
            <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#fd5001]/30 bg-[#fd5001]/10 px-3 py-0.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#fd5001]">
              AI &amp; ENTERPRISE WORKFLOWS
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black leading-tight text-white mt-1.5">
              AI is Ready, but your Systems and Software Workflows are Not.
            </h3>
            <p className="mt-3 text-[14px] leading-relaxed text-neutral-300">
              We design tailored AI tools, automated LLM pipelines, and custom internal software that empowers your team to operate 10x faster.
            </p>
          </div>

          <div className="relative z-10 mt-6">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#fd5001] px-6 py-2.5 text-[14px] font-bold text-white shadow-[0_4px_20px_rgba(253,80,1,0.35)] transition-all hover:bg-[#e04600] hover:shadow-[0_6px_28px_rgba(253,80,1,0.5)]"
            >
              <span>Build Custom AI Tools</span>
              <ArrowRight size={15} strokeWidth={2.4} />
            </a>
          </div>
        </div>

        {/* Featured Wide Banner 2: Customer Success & Delivered Platforms */}
        <div className="relative col-span-1 md:col-span-2 flex min-h-[260px] sm:min-h-[280px] lg:min-h-[300px] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0c1a3a] via-[#0a1428] to-[#060a18] p-8 sm:p-10 lg:p-12 border-t border-white/10 group">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#38bdf8]/10 via-[#1e40af]/10 to-transparent"
          />
          
          <div className="relative z-10 max-w-xl">
            <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-3 py-0.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#38bdf8]">
              PROVEN BUSINESS OUTCOMES
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black leading-tight text-white mt-1.5">
              Customer Success Stories &amp; Delivered Platforms
            </h3>
            <p className="mt-3 text-[14px] leading-relaxed text-neutral-300">
              From high-traffic SaaS utilities and 60FPS mobile games to bespoke corporate portals, see how we deliver measurable commercial impact.
            </p>
          </div>

          <div className="relative z-10 mt-6 flex flex-wrap items-center gap-4">
            <a
              href="/#work"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-2.5 text-[14px] font-bold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/20"
            >
              <span>Explore What We Engineer</span>
              <ArrowRight size={15} strokeWidth={2.4} />
            </a>
            <span className="text-[12.5px] font-mono text-neutral-400">
              Delhi · Gurgaon · Global
            </span>
          </div>
        </div>

      </div>
    </section>
  )
}
