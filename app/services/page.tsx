import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import ServicesPage from '@/components/public/ServicesPage'
import { FALLBACK_SERVICES } from '@/lib/fallback'

export const revalidate = 60

export default async function Services() {
  if (!isSupabaseConfigured()) return <ServicesPage services={FALLBACK_SERVICES} />
  try {
    const supabase = createClient()
    const { data: services } = await supabase.from('services').select('*').eq('is_visible', true).order('sort_order')
    return <ServicesPage services={services ?? FALLBACK_SERVICES} />
  } catch {
    return <ServicesPage services={FALLBACK_SERVICES} />
  }
}
