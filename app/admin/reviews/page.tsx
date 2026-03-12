import { createClient } from '@/lib/supabase/server'
import AdminReviews from '@/components/admin/tabs/AdminReviews'

export default async function AdminReviewsPage() {
  const supabase = createClient()
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })

  return <AdminReviews initialReviews={reviews ?? []} />
}
