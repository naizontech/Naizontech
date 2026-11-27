'use client'

import { useRef, useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const engineeredProducts = [
  {
    category: 'SaaS Platform',
    title: 'Custom SaaS & Cloud Systems',
    description:
      'Scalable multi-tenant SaaS platforms with role-based dashboards, subscription billing, and automated microservice APIs.',
    image: '/images/work/work-saas.jpg',
    imageAlt: 'Custom SaaS and cloud platform engineered by Naizon',
    href: '/web-development',
  },
  {
    category: 'Mobile App',
    title: 'Mobile Applications (iOS & Android)',
    description:
      'High-performance cross-platform mobile apps for on-demand dispatch, customer portals, and seamless real-time workflows.',
    image: '/images/work/work-service.jpg',
    imageAlt: 'Cross-platform mobile application developed by Naizon',
    href: '/mobile-app-development',
  },
  {
    category: 'Web Game',
    title: 'Interactive Web & 2D Games',
    description:
      'Engaging browser games and casual mobile titles with 60FPS responsive mechanics, custom particle physics, and sound.',
    image: '/images/work/work-game.jpg',
    imageAlt: 'Interactive 2D web and mobile game developed by Naizon',
    href: '/#contact',
  },
  {
    category: 'Windows Software',
    title: 'Windows & Desktop Software',
    description:
      'Robust native Windows desktop applications and local productivity utilities built for high-throughput enterprise tasks.',
    image: '/images/work/work-filewala.jpg',
    imageAlt: 'Windows desktop application and productivity tool by Naizon',
    href: '/#contact',
  },
  {
    category: 'Webpages & Commerce',
    title: 'Webpages & High-Converting Stores',
    description:
      'SEO-engineered business webpages, dynamic catalogs, and fast custom e-commerce storefronts designed for maximum conversion.',
    image: '/images/work/work-ecommerce.jpg',
    imageAlt: 'High-converting business website and custom e-commerce platform by Naizon',
    href: '/ecommerce-development',
  },
]

export default function Portfolio() {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollButtons = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    updateScrollButtons()
    window.addEventListener('resize', updateScrollButtons)
    return () => window.removeEventListener('resize', updateScrollButtons)
  }, [])

  const scroll = (direction) => {
    if (!scrollRef.current) return
    const cardWidth = scrollRef.current.firstElementChild?.offsetWidth || 340
    const scrollAmount = (cardWidth + 24) * (direction === 'left' ? -1 : 1)
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  return (
    <section id="work" className="relative bg-white py-12 sm:py-16 md:py-20 border-b border-slate-100">
      <div className="mx-auto w-full max-w-[1360px] px-5 sm:px-8 lg:px-10">
        
        {/* Header: Left Title 'What We Engineer', Right Navigation Arrows */}
        <div className="flex items-center justify-between mb-8 sm:mb-9">
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-normal tracking-tight text-slate-900">
            What We Engineer
          </h2>

          <div className="flex items-center gap-4">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous engineered product"
              className="p-1.5 text-slate-300 hover:text-slate-900 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={22} strokeWidth={1.8} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Next engineered product"
              className="p-1.5 text-slate-900 hover:text-slate-600 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
            >
              <ArrowRight size={22} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel of Product Mockup Cards */}
        <div
          ref={scrollRef}
          onScroll={updateScrollButtons}
          className="flex gap-5 sm:gap-6 overflow-x-auto scroll-smooth pb-4 pt-1 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {engineeredProducts.map((story, idx) => (
            <a
              key={idx}
              href={story.href}
              className="group relative flex-shrink-0 w-[280px] sm:w-[320px] md:w-[350px] lg:w-[370px] h-[450px] sm:h-[480px] lg:h-[500px] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 snap-start bg-[#060911]"
            >
              {/* Product Design Category Badge */}
              <div className="absolute top-4 left-4 z-20">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8]" />
                  {story.category}
                </span>
              </div>

              {/* Full-bleed authentic product mockup */}
              <img
                src={story.image}
                alt={story.imageAlt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Bottom dark gradient overlay for crisp typography contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 via-50% to-transparent pointer-events-none" />

              {/* Bottom text block with Naizon's content */}
              <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-7">
                <h3 className="text-xl sm:text-2xl lg:text-[24px] font-medium tracking-tight text-white group-hover:text-[#38bdf8] transition-colors">
                  {story.title}
                </h3>
                <p className="mt-2 text-[13.5px] sm:text-[14px] leading-relaxed text-neutral-300 line-clamp-3">
                  {story.description}
                </p>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}
