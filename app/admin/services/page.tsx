import { createClient } from '@/lib/supabase/server'
import AdminServices from '@/components/admin/tabs/AdminServices'

export default async function AdminServicesPage() {
  const supabase = createClient()
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('sort_order')

  return <AdminServices initialServices={services ?? []} />
}
