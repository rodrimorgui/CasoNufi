import { redirect } from 'next/navigation'

import { LogoutButton } from '@/components/logout-button'
import { createClient } from '@/lib/server'
import Link from 'next/link'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="flex h-svh w-full items-center justify-center gap-2">
      <p>
        Hello <span>{data.user.email}</span>
      </p>
      <LogoutButton />
      <Link href="/dashboard">
        <button className="ml-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">Go to Dashboard</button>
      </Link>
    </div>
  )
}
