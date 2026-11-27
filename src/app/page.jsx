import dynamic from 'next/dynamic'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Footer from '../components/Footer'
import { organizationSchema, websiteSchema } from '../data/schemas'

// High-Performance Dynamic Code Splitting for Below-the-Fold Sections
const Portfolio = dynamic(() => import('../components/Portfolio'), { ssr: true })
const MosaicInsights = dynamic(() => import('../components/MosaicInsights'), { ssr: true })
const NewsAndInsights = dynamic(() => import('../components/NewsAndInsights'), { ssr: true })
const HowItWorks = dynamic(() => import('../components/HowItWorks'), { ssr: true })
const WhyChooseUs = dynamic(() => import('../components/WhyChooseUs'), { ssr: true })
const About = dynamic(() => import('../components/About'), { ssr: true })
const FAQ = dynamic(() => import('../components/FAQ'), { ssr: true })
const Contact = dynamic(() => import('../components/Contact'), { ssr: true })
const WhatsAppButton = dynamic(() => import('../components/WhatsAppButton'))

export const metadata = {
  title: 'NAIZON | Custom Software, SaaS, Web, Mobile & Desktop Development',
  description:
    'NAIZON is a full-cycle software development company. We build custom web applications, client SaaS platforms, mobile apps, Windows desktop software, webpages, and interactive web games.',
  alternates: {
    canonical: 'https://naizon.in',
  },
}

export default function HomePage() {
  const schemas = [organizationSchema, websiteSchema]

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Navbar />
      <main id="main-content">
        <Hero />
        <Services />
        <Portfolio />
        <MosaicInsights />
        <NewsAndInsights />
        <HowItWorks />
        <WhyChooseUs />
        <About />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
