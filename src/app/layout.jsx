import '../index.css'
import { Inter, Manrope } from 'next/font/google'
import FirebaseAnalytics from '../components/FirebaseAnalytics'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
})

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
  weight: ['600', '700', '800'],
})

export const viewport = {
  themeColor: '#f8f8f5',
  width: 'device-width',
  initialScale: 1,
}

export const metadata = {
  metadataBase: new URL('https://naizon.in'),
  title: {
    default: 'NAIZON | Custom Software, SaaS, Web, Mobile & Desktop Development',
    template: '%s',
  },
  description:
    'NAIZON is a full-cycle software development company building custom web applications, client SaaS platforms, mobile apps (iOS & Android), Windows desktop software, webpages, and interactive web games.',
  icons: {
    icon: [
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/favicon/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://naizon.in',
    siteName: 'NAIZON — Custom Software Development & Digital Solutions',
    title: 'NAIZON | Custom Software, SaaS, Web, Mobile & Desktop Development',
    description:
      'Full-cycle software development company engineering custom web applications, client SaaS platforms, mobile apps, Windows desktop software, and interactive web games.',
    images: [{ url: '/images/hero.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NAIZON | Custom Software, SaaS, Web, Mobile & Desktop Development',
    description:
      'Full-cycle software development company engineering custom web applications, client SaaS platforms, mobile apps, Windows desktop software, and interactive web games.',
    images: ['/images/hero.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={`scroll-smooth ${inter.variable} ${manrope.variable}`}>
      <body className="m-0 overflow-x-hidden overscroll-y-none bg-[#f8f8f5] text-[#172033] antialiased">
        <FirebaseAnalytics />
        {children}
      </body>
    </html>
  )
}
