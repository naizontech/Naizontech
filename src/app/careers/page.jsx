import CareersPage from '../../components/CareersPage'

export const metadata = {
  title: 'Careers & Internships | Certificate Verification | NAIZON',
  description:
    'Explore engineering careers, student internships (Frontend, Fullstack, Mobile, UI/UX), and verify training certificates and credentials issued by NAIZON. Inquiries: info@naizon.in.',
  alternates: {
    canonical: 'https://naizon.in/careers',
  },
  openGraph: {
    title: 'Careers & Internships at NAIZON | Check Certification',
    description:
      'Join NAIZON engineering team. Explore software internships, verify completion certificates, and build real production software.',
    url: 'https://naizon.in/careers',
  },
}

export default function Page() {
  return <CareersPage />
}
