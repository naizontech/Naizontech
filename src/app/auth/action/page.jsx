import { Suspense } from 'react'
import AuthActionHandler from '../../../components/AuthActionHandler'

export const metadata = {
  title: 'Authentication Action | NAIZON Identity Management',
  description: 'Complete your email verification or password reset securely.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AuthActionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0e131f]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#fd5001] border-t-transparent" />
        </div>
      }
    >
      <AuthActionHandler />
    </Suspense>
  )
}
