import { createClient } from '@/lib/supabase/server'
import { settingsToMap } from '@/lib/utils'
import AdminSettings from '@/components/admin/tabs/AdminSettings'

export default async function AdminSettingsPage() {
  const supabase = createClient()
  const [
    { data: settingsRaw },
    { data: visualStrip },
  ] = await Promise.all([
    supabase.from('site_settings').select('*'),
    supabase.from('visual_strip').select('*').order('sort_order'),
  ])

  const settings = settingsToMap(settingsRaw ?? [])

  return <AdminSettings settings={settings} visualStrip={visualStrip ?? []} />
}
