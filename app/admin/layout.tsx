import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  // Get unread message count
  const { count } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new')

  return (
    <AdminShell unreadCount={count ?? 0}>
      {children}
    </AdminShell>
  )
}
