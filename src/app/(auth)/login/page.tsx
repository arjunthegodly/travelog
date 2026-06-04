import { LoginForm } from '@/components/ui/login-form'

export const metadata = { title: 'Sign in — Travelog' }

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome back</h1>
        <p className="text-gray-500 text-center mb-8">Sign in to your Travelog account</p>
        <LoginForm />
      </div>
    </main>
  )
}
