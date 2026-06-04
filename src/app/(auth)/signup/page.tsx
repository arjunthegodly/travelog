import { SignupForm } from '@/components/ui/signup-form'

export const metadata = { title: 'Create account — Travelog' }

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Start your journey</h1>
        <p className="text-gray-500 text-center mb-8">Create a free Travelog account</p>
        <SignupForm />
      </div>
    </main>
  )
}
