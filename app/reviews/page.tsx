import { createClient } from '@/lib/supabase/server'
import ReviewsPage from '@/components/public/ReviewsPage'

export const revalidate = 30

export default async function Reviews() {
  const supabase = createClient()
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_visible', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })

  return <ReviewsPage reviews={reviews ?? []} />
}
