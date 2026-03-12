import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('site_settings').select('*').order('key')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json() // { key: string, value: string }[]
  const supabase = createAdminClient()

  const updates = Array.isArray(body) ? body : [body]
  const { error } = await supabase.from('site_settings').upsert(
    updates.map((u: { key: string; value: string }) => ({
      key: u.key,
      value: u.value,
      updated_at: new Date().toISOString(),
    })),
    { onConflict: 'key' }
  )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
