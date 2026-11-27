import LocationPage from '../../../components/LocationPage'

const path = '/gurgaon/website-development'

export const metadata = {
  title: 'Software & Web Development Company in Gurgaon | NAIZON',
  description:
    'Full-cycle software and website development company in Gurgaon building scalable web apps, client SaaS platforms, mobile apps, and high-performance digital systems.',
  alternates: {
    canonical: `https://naizon.in${path}`,
  },
}

export default function Page() {
  return <LocationPage locationKey="gurgaon" path={path} />
}
