import { Suspense } from 'react'
import AuthPage from '../../components/AuthPage'

export const metadata = {
  title: 'Create Account | NAIZON Client Portal',
  description: 'Create your NAIZON account to collaborate on engineering sprints, platform development, and digital deliverables.',
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#fbfbfa]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#fd5001] border-t-transparent" />
        </div>
      }
    >
      <AuthPage initialTab="signup" />
    </Suspense>
  )
}
