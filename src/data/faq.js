export const faqs = [
  ['What software development services does NAIZON provide?', 'NAIZON provides full-cycle software development services, including modern business websites and webpages, custom web applications, multi-tenant SaaS platforms, native and cross-platform mobile apps (Android & iOS), Windows desktop applications, and interactive HTML5 web games.'],
  ['Can NAIZON develop custom SaaS applications for clients?', 'Yes. We build complete SaaS platforms for clients—including authentication, multi-tenancy, subscription billing, customer portals, admin dashboards, real-time analytics, and scalable cloud API backends.'],
  ['Do you build Windows and desktop applications?', 'Yes. We develop high-performance Windows desktop applications and cross-platform utilities for business automation, local data processing, system integrations, and internal tooling.'],
  ['Do you develop mobile applications for iOS and Android?', 'Yes. We build responsive cross-platform and native mobile apps using modern frameworks like Flutter and React Native, connected to reliable cloud databases and APIs.'],
  ['Can you build web-based games and interactive experiences?', 'Yes. We build interactive 2D browser games, WebGL experiences, and casual mobile gameplay with smooth 60FPS physics, engaging animations, and cross-device performance.'],
  ['Are your websites and web applications SEO-optimized?', 'Yes. Every web application and website is built with clean semantic code, sub-second load times, structured Schema.org metadata, and technical Core Web Vitals optimization to rank effectively on search engines.'],
  ['Do clients own the source code and IP?', 'Yes. Complete source code access, intellectual property rights, and deployment documentation are handed over to you upon project completion as agreed in the contract.'],
  ['How is software pricing and timeline determined?', 'Pricing and timelines are scoped transparently based on your feature set, target platforms (Web, Mobile, Windows, SaaS), backend complexity, and integrations. We provide a clear estimate following an initial discovery discussion.'],
  ['Do you provide post-launch maintenance and updates?', 'Yes. We offer ongoing maintenance, cloud server monitoring, bug fixes, security patches, and feature updates so your software continues running reliably.']
]

export const faqCategories = [
  {
    id: 'general',
    name: 'General & Services',
    questions: [
      {
        q: faqs[0][0],
        a: faqs[0][1],
      },
      {
        q: faqs[6][0],
        a: faqs[6][1],
      },
      {
        q: faqs[5][0],
        a: faqs[5][1],
      },
    ],
  },
  {
    id: 'web-saas',
    name: 'SaaS & Web Apps',
    questions: [
      {
        q: faqs[1][0],
        a: faqs[1][1],
      },
      {
        q: faqs[4][0],
        a: faqs[4][1],
      },
    ],
  },
  {
    id: 'mobile-desktop',
    name: 'Mobile & Windows',
    questions: [
      {
        q: faqs[3][0],
        a: faqs[3][1],
      },
      {
        q: faqs[2][0],
        a: faqs[2][1],
      },
    ],
  },
  {
    id: 'pricing-support',
    name: 'Pricing & Support',
    questions: [
      {
        q: faqs[7][0],
        a: faqs[7][1],
      },
      {
        q: faqs[8][0],
        a: faqs[8][1],
      },
    ],
  },
]
