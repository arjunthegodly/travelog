import { auth } from '@clerk/nextjs/server'
import { Nav } from '@/components/ui/nav'
import { getDB, profiles, eq } from '@/lib/db'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()

  let profile = null
  if (userId) {
    const db = getDB()
    profile = await db.select().from(profiles).where(eq(profiles.id, userId)).get() ?? null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav profile={profile} />
      <main className="flex-1 pb-16 sm:pb-0">{children}</main>
    </div>
  )
}
