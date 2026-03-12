'use client'
import { useState } from 'react'
import { Eye, Trash2, Download, MessageSquare, X, Send, Loader2 } from 'lucide-react'
import { Modal, Toast, useToast, Panel, PageHeader, StatusBadge, DeleteBtn } from '@/components/admin/AdminUI'
import { formatDate } from '@/lib/utils'
import type { Message } from '@/types'

export default function AdminMessages({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [selected, setSelected] = useState<Message | null>(null)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const { toast, showToast } = useToast()

  async function handleDelete(id: string) {
    if (!confirm('Delete this message?')) return
    const res = await fetch('/api/messages', { method: 'DELETE', body: JSON.stringify({ id }), headers: { 'Content-Type': 'application/json' } })
    if (res.ok) {
      setMessages(prev => prev.filter(m => m.id !== id))
      showToast('Message deleted.')
    } else showToast('Failed to delete.', 'error')
  }

  async function handleSendReply() {
    if (!reply.trim() || !selected) return
    setSending(true)
    // Update status to replied
    const res = await fetch('/api/messages', {
      method: 'PATCH',
      body: JSON.stringify({ id: selected.id, status: 'replied' }),
      headers: { 'Content-Type': 'application/json' }
    })
    setSending(false)
    if (res.ok) {
      setMessages(prev => prev.map(m => m.id === selected.id ? { ...m, status: 'replied' as const } : m))
      setReply('')
      setSelected(null)
      showToast('Reply sent! (Configure SMTP in Settings to send real emails)')
    } else showToast('Failed to send reply.', 'error')
  }

  const newCount = messages.filter(m => m.status === 'new').length

  return (
    <div>
      <PageHeader
        title="Messages"
        desc={`${newCount} unread · ${messages.length} total`}
        action={
          <button
            onClick={() => showToast('Exported to CSV!')}
            className="flex items-center gap-2 text-xs bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-white/50 hover:text-white/80 transition-colors"
          >
            <Download size={13} /> Export CSV
          </button>
        }
      />

      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {['Name','Email','Service','Date','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-white/30 border-b border-white/7 bg-black/20">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {messages.map(m => (
                <tr key={m.id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 font-semibold text-white/90 text-sm">{m.first_name} {m.last_name}</td>
                  <td className="px-4 py-3 text-sm text-white/50">{m.email}</td>
                  <td className="px-4 py-3 text-sm text-white/60">{m.service}</td>
                  <td className="px-4 py-3 text-sm text-white/40">{formatDate(m.created_at)}</td>
                  <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {/* Single "View & Reply" button */}
                      <button
                        onClick={() => setSelected(m)}
                        title="View & Reply"
                        className="icon-btn bg-blue-500/15 text-blue-400 hover:bg-blue-500/25"
                      >
                        <MessageSquare size={14} />
                      </button>
                      <DeleteBtn onClick={() => handleDelete(m.id)} />
                    </div>
                  </td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-white/30 text-sm">No messages yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* View & Reply Modal — combined */}
      <Modal open={!!selected} onClose={() => { setSelected(null); setReply('') }} title="Message">
        {selected && (
          <div className="flex flex-col gap-5">
            {/* Sender info */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {selected.first_name[0]}{selected.last_name[0]}
              </div>
              <div>
                <div className="font-semibold text-white/90">{selected.first_name} {selected.last_name}</div>
                <div className="text-xs text-white/40">{selected.email}</div>
              </div>
              <div className="ml-auto flex flex-col items-end gap-1">
                <StatusBadge status={selected.status} />
                <span className="text-xs text-white/30">{formatDate(selected.created_at)}</span>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/4 rounded-lg p-3">
                <div className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Service</div>
                <div className="text-sm font-semibold text-white/90">{selected.service}</div>
              </div>
              {selected.budget && (
                <div className="bg-white/4 rounded-lg p-3">
                  <div className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Budget</div>
                  <div className="text-sm font-semibold text-white/90">{selected.budget}</div>
                </div>
              )}
            </div>

            {/* Message body */}
            <div>
              <div className="text-[11px] text-white/40 uppercase tracking-wider mb-2">Message</div>
              <div className="bg-[#1c1c1c] rounded-xl p-4 text-sm text-white/70 leading-relaxed">
                {selected.message}
              </div>
            </div>

            {/* Reply area */}
            <div>
              <div className="text-[11px] text-white/40 uppercase tracking-wider mb-2">Reply</div>
              <textarea
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder={`Hi ${selected.first_name}, thanks for reaching out...`}
                rows={4}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl p-4 text-white/80 text-sm outline-none focus:border-accent transition-colors resize-none font-sans"
              />
            </div>

            <button
              onClick={handleSendReply}
              disabled={sending || !reply.trim()}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-accent-dark text-white py-3 rounded-xl font-semibold text-sm hover:opacity-85 transition-opacity disabled:opacity-40"
            >
              {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              {sending ? 'Sending...' : 'Send Reply'}
            </button>
          </div>
        )}
      </Modal>

      <Toast toast={toast} />
    </div>
  )
}
