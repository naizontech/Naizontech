'use client'

import { ArrowRight } from 'lucide-react'

const serviceCards = [
  {
    title: 'Web & SaaS Applications',
    description: 'Build fast business websites, custom web apps & scalable client SaaS platforms.',
    image: '/images/work-web.png',
    imageAlt: 'NAIZON Web and SaaS Application Development',
    href: '/web-development',
  },
  {
    title: 'Mobile & Windows Software',
    description: 'Experience native iOS, Android & Windows desktop apps built for performance.',
    image: '/images/work-mobile.png',
    imageAlt: 'NAIZON Native Mobile and Windows Software Development',
    href: '/mobile-app-development',
  },
  {
    title: 'Web Games & Digital Products',
    description: 'Engage users with interactive browser games, WebGL apps & custom software.',
    image: '/images/work-game.png',
    imageAlt: 'NAIZON Interactive Web Games and Custom Software Solutions',
    href: '/#contact',
  },
]

export default function Services() {
  return (
    <section
      id="services"
      className="relative bg-black text-white px-5 py-12 sm:py-16 md:py-20"
    >
      <div className="mx-auto w-full max-w-[1320px]">
        {/* Clean, uncluttered single heading matching user's reference image */}
        <h2 className="mb-8 text-2xl font-normal tracking-tight text-white sm:text-3xl lg:text-[32px]">
          Full-cycle software solutions to power up your business
        </h2>

        {/* 3-Column Card Grid (Exact Match to User's Uploaded Wipro Screenshot) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {serviceCards.map((card, idx) => (
            <a
              key={idx}
              href={card.href}
              className="group flex flex-col overflow-hidden bg-[#23272e] transition-transform duration-200 hover:-translate-y-1 shadow-lg"
            >
              {/* Top Half: Full-bleed Visual Image */}
              <div className="relative h-[200px] sm:h-[210px] w-full overflow-hidden bg-[#0c1018]">
                <img
                  src={card.image}
                  alt={card.imageAlt}
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="210"
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Bottom Half: Solid Charcoal Gray Content Block */}
              <div className="flex flex-col justify-between p-6 sm:p-7 min-h-[140px]">
                <h3 className="text-xl sm:text-[22px] font-medium tracking-tight text-white">
                  {card.title}
                </h3>

                <div className="mt-4 flex items-end justify-between gap-4">
                  <p className="whitespace-pre-line text-[13.5px] leading-relaxed text-[#c4c8d0]">
                    {card.description}
                  </p>

                  {/* Circular Blue Arrow Button (Exact Match to Reference Image) */}
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#4376b5] text-white shadow-sm transition-all duration-200 group-hover:bg-[#32629e] group-hover:scale-105">
                    <ArrowRight size={17} strokeWidth={2.4} />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
