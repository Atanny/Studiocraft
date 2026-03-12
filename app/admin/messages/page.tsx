import { createClient } from '@/lib/supabase/server'
import AdminMessages from '@/components/admin/tabs/AdminMessages'

export default async function AdminMessagesPage() {
  const supabase = createClient()
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  return <AdminMessages initialMessages={messages ?? []} />
}
