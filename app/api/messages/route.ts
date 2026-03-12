import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { first_name, last_name, email, service, budget, message } = body

    if (!first_name || !last_name || !email || !service || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { error } = await supabase.from('messages').insert({
      first_name, last_name, email, service, budget, message, status: 'new',
    })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, status } = body
  const supabase = createAdminClient()

  const update: Record<string, string> = { status }
  if (status === 'replied') update.replied_at = new Date().toISOString()

  const { error } = await supabase.from('messages').update(update).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  const supabase = createAdminClient()
  const { error } = await supabase.from('messages').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
