import { Suspense } from 'react'
import AuthPage from '../../components/AuthPage'

export const metadata = {
  title: 'Sign In | NAIZON Client Portal',
  description: 'Sign in to your NAIZON account to access client sprint updates, engineering deliverables, and technical platforms.',
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#fbfbfa]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#fd5001] border-t-transparent" />
        </div>
      }
    >
      <AuthPage initialTab="login" />
    </Suspense>
  )
}
