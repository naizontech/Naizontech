import LocationPage from '../../../components/LocationPage'

const path = '/delhi/website-development'

export const metadata = {
  title: 'Software & Web Development Company in Delhi | NAIZON',
  description:
    'Full-cycle software and website development company serving Delhi businesses with custom SaaS, web apps, mobile apps, and dependable engineering support.',
  alternates: {
    canonical: `https://naizon.in${path}`,
  },
}

export default function Page() {
  return <LocationPage locationKey="delhi" path={path} />
}
