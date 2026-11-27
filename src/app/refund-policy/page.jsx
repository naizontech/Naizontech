import LegalPage from '../../components/LegalPage'

export const metadata = {
  title: 'Refund Policy | NAIZON',
  description:
    'Read the NAIZON refund and cancellation policy for recurring maintenance retainers and custom software engineering projects.',
  alternates: {
    canonical: 'https://naizon.in/refund-policy',
  },
}

export default function Page() {
  return <LegalPage type="refund" />
}
