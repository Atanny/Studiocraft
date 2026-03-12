import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    // Not yet set up — show setup notice instead of crashing
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-[#141414] border border-amber-500/30 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">⚙️</div>
          <h1 className="font-serif text-2xl font-bold text-white mb-2">Supabase Not Configured</h1>
          <p className="text-white/50 text-sm mb-6 leading-relaxed">
            Add your Supabase credentials to <code className="text-amber-400 bg-white/5 px-1.5 py-0.5 rounded">.env.local</code> to enable the admin panel.
          </p>
          <div className="bg-black/40 rounded-xl p-4 text-left text-xs font-mono text-green-400 leading-6">
            <div>NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co</div>
            <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key</div>
            <div>SUPABASE_SERVICE_ROLE_KEY=your_service_key</div>
          </div>
          <p className="text-white/30 text-xs mt-4">See README.md for full setup instructions.</p>
        </div>
      </div>
    )
  }

  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/admin/login')

    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new')

    return (
      <AdminShell unreadCount={count ?? 0}>
        {children}
      </AdminShell>
    )
  } catch {
    redirect('/admin/login')
  }
}
