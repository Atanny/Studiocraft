import { createClient } from '@/lib/supabase/server'
import { settingsToMap } from '@/lib/utils'
import PublicSite from '@/components/public/PublicSite'

export const revalidate = 60 // ISR every 60s

export default async function HomePage() {
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

  const settings = settingsToMap(settingsRaw ?? [])

  return (
    <PublicSite
      settings={settings}
      services={services ?? []}
      portfolio={portfolio ?? []}
      reviews={reviews ?? []}
      visualStrip={visualStrip ?? []}
    />
  )
}
