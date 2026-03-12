import { createClient } from '@/lib/supabase/server'
import ServicesPage from '@/components/public/ServicesPage'

export const revalidate = 60

export default async function Services() {
  const supabase = createClient()
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order')

  return <ServicesPage services={services ?? []} />
}
