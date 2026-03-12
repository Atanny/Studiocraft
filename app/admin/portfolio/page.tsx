import { createClient } from '@/lib/supabase/server'
import AdminPortfolio from '@/components/admin/tabs/AdminPortfolio'

export default async function AdminPortfolioPage() {
  const supabase = createClient()
  const { data: portfolio } = await supabase
    .from('portfolio')
    .select('*')
    .order('sort_order')

  return <AdminPortfolio initialPortfolio={portfolio ?? []} />
}
