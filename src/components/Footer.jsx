const columns = [
  ['Services', [['Web & SaaS Applications', '/web-development'], ['Websites & Webpages', '/website-development'], ['Mobile Apps (iOS & Android)', '/mobile-app-development'], ['Windows & Desktop Apps', '/#work'], ['Web Games & Interactive', '/#work'], ['Ecommerce & UI/UX', '/ecommerce-development']]],
  ['Company', [['About NAIZON', '/about'], ['Careers & Internships', '/careers'], ['Website Guides', '/guides'], ['Work', '/#work'], ['Delhi', '/delhi/website-development'], ['Gurgaon', '/gurgaon/website-development'], ['Contact', '/#contact']]],
  ['Legal', [['Privacy', '/privacy'], ['Terms', '/terms'], ['Refund Policy', '/refund-policy']]],
]

export default function Footer() {
  return <footer className="bg-[#172033] py-12 text-white"><div className="shell"><div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]"><div><a href="/" aria-label="NAIZON home"><img src="/logo/logo-dark.png" alt="NAIZON — Custom Software Development & Digital Solutions" width="2013" height="549" className="h-10 w-auto max-w-[210px] object-contain"/></a><p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">NAIZON — Full-cycle software development, client SaaS platforms, mobile apps, Windows applications &amp; web games.</p></div>{columns.map(([title, items]) => <div key={title}><h3 className="text-sm font-semibold">{title}</h3><ul className="mt-4 space-y-2.5">{items.map(([label, href]) => <li key={label}><a href={href} className="text-sm text-slate-400 transition hover:text-white">{label}</a></li>)}</ul></div>)}</div><div className="mt-10 border-t border-white/15 pt-6 text-xs text-slate-500">© 2026 NAIZON — Full-Cycle Software Development &amp; Digital Solutions. All rights reserved.</div></div></footer>
}
