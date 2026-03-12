import { createClient } from '@/lib/supabase/server'
import AdminDashboard from '@/components/admin/tabs/AdminDashboard'

export default async function AdminPage() {
  const supabase = createClient()

  const [
    { count: msgCount },
    { count: portfolioCount },
    { data: reviews },
    { count: newMsgCount },
    { data: recentMessages },
  ] = await Promise.all([
    supabase.from('messages').select('*', { count: 'exact', head: true }),
    supabase.from('portfolio').select('*', { count: 'exact', head: true }),
    supabase.from('reviews').select('rating').eq('is_visible', true),
    supabase.from('messages').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  const avgRating = reviews && reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—'

  return (
    <AdminDashboard
      totalMessages={msgCount ?? 0}
      newMessages={newMsgCount ?? 0}
      portfolioCount={portfolioCount ?? 0}
      avgRating={avgRating}
      reviewCount={reviews?.length ?? 0}
      recentMessages={recentMessages ?? []}
    />
  )
}
