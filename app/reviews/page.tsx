import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import ReviewsPage from '@/components/public/ReviewsPage'
import { FALLBACK_REVIEWS } from '@/lib/fallback'

export const revalidate = 30

export default async function Reviews() {
  if (!isSupabaseConfigured()) return <ReviewsPage reviews={FALLBACK_REVIEWS} />
  try {
    const supabase = createClient()
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_visible', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
    return <ReviewsPage reviews={reviews ?? FALLBACK_REVIEWS} />
  } catch {
    return <ReviewsPage reviews={FALLBACK_REVIEWS} />
  }
}
