'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Map, Compass, PlusCircle, User } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { cn } from '@/utils/cn'
import type { Profile } from '@/types'

const navItems = [
  { href: '/feed',    label: 'Feed',    icon: Map },
  { href: '/explore', label: 'Explore', icon: Compass },
]

export function Nav({ profile }: { profile: Profile | null }) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={profile ? '/feed' : '/'} className="font-bold text-lg tracking-tight text-indigo-600">
          Travelog
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                pathname.startsWith(href)
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {profile ? (
            <>
              <Link
                href="/new"
                className="flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">New entry</span>
              </Link>
              <Link
                href={`/@${profile.username}`}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <User className="w-4 h-4" />
                {profile.username}
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5">Sign in</Link>
              <Link href="/signup" className="bg-indigo-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">Sign up</Link>
            </>
          )}
        </div>
      </div>

      {profile && (
        <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 flex z-50">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center py-2 text-xs font-medium transition-colors',
                pathname.startsWith(href) ? 'text-indigo-600' : 'text-gray-500'
              )}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              {label}
            </Link>
          ))}
          <Link href="/new" className="flex-1 flex flex-col items-center py-2 text-xs font-medium text-gray-500">
            <PlusCircle className="w-5 h-5 mb-0.5" />New
          </Link>
          <Link href={`/@${profile.username}`} className="flex-1 flex flex-col items-center py-2 text-xs font-medium text-gray-500">
            <User className="w-5 h-5 mb-0.5" />Profile
          </Link>
        </div>
      )}
    </header>
  )
}
