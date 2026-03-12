import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, role, company, review_text, rating, avatar_url, source = 'client' } = body

  if (!name || !review_text) {
    return NextResponse.json({ error: 'Name and review text are required' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase.from('reviews').insert({
    name, role, company, review_text, rating: rating ?? 5, avatar_url,
    source, is_visible: source === 'admin', is_featured: false,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, ...updates } = body
  const supabase = createAdminClient()
  const { error } = await supabase.from('reviews').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  const supabase = createAdminClient()
  const { error } = await supabase.from('reviews').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
