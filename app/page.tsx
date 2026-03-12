import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { settingsToMap } from '@/lib/utils'
import PublicSite from '@/components/public/PublicSite'
import { FALLBACK_SETTINGS, FALLBACK_SERVICES, FALLBACK_PORTFOLIO, FALLBACK_REVIEWS, FALLBACK_STRIP } from '@/lib/fallback'

export const revalidate = 60

export default async function HomePage() {
  if (!isSupabaseConfigured()) {
    return <PublicSite settings={FALLBACK_SETTINGS} services={FALLBACK_SERVICES} portfolio={FALLBACK_PORTFOLIO} reviews={FALLBACK_REVIEWS} visualStrip={FALLBACK_STRIP} />
  }

  try {
    const supabase = createClient()
    const [
      { data: settingsRaw },
      { data: services },
      { data: portfolio },
      { data: reviews },
      { data: visualStrip },
    ] = await Promise.all([
      supabase.from('site_settings').select('*'),
      supabase.from('services').select('*').eq('is_visible', true).order('sort_order'),
      supabase.from('portfolio').select('*').eq('status', 'published').order('sort_order'),
      supabase.from('reviews').select('*').eq('is_visible', true).order('created_at', { ascending: false }),
      supabase.from('visual_strip').select('*').order('sort_order'),
    ])

    return (
      <PublicSite
        settings={settingsToMap(settingsRaw ?? [])}
        services={services ?? FALLBACK_SERVICES}
        portfolio={portfolio ?? FALLBACK_PORTFOLIO}
        reviews={reviews ?? FALLBACK_REVIEWS}
        visualStrip={visualStrip ?? FALLBACK_STRIP}
      />
    )
  } catch {
    return <PublicSite settings={FALLBACK_SETTINGS} services={FALLBACK_SERVICES} portfolio={FALLBACK_PORTFOLIO} reviews={FALLBACK_REVIEWS} visualStrip={FALLBACK_STRIP} />
  }
}
