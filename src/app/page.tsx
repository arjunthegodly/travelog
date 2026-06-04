import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Map, Users, BookOpen } from 'lucide-react'

export default async function LandingPage() {
  const { userId } = await auth()
  if (userId) redirect('/feed')

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-xl text-indigo-600">Travelog</span>
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign in</Link>
          <Link href="/sign-up" className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Get started</Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 max-w-2xl">
          Your travels,{' '}
          <span className="text-indigo-600">mapped</span>{' '}
          and told.
        </h1>
        <p className="mt-6 text-xl text-gray-500 max-w-xl">
          Pin journal entries to an interactive world map. Organize by trip. Share with followers or keep it private.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link href="/sign-up" className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-xl text-lg hover:bg-indigo-700 transition-colors">
            Start for free
          </Link>
          <Link href="/explore" className="border border-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-xl text-lg hover:bg-gray-50 transition-colors">
            Explore maps
          </Link>
        </div>
      </main>

      <section className="border-t border-gray-100 py-20 px-6">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-10 text-center">
          {[
            { icon: Map, title: 'Interactive map', desc: "Every journal entry lives on a pin. Zoom in, explore your history, see where you've been." },
            { icon: BookOpen, title: 'Rich journaling', desc: 'Write freely with rich text, star ratings, and custom tags for every place you visit.' },
            { icon: Users, title: 'Share or stay private', desc: 'Publish entries to your public feed, or keep them just for yourself. You decide, per entry.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title}>
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
