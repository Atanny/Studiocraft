'use client'
import { useState } from 'react'
import { Star } from 'lucide-react'
import { Modal, Toast, useToast, Panel, PageHeader, AddBtn, PrimaryBtn, Field, inputCls, DeleteBtn, EditBtn } from '@/components/admin/AdminUI'
import type { Review } from '@/types'

const emptyForm = { name: '', role: '', company: '', review_text: '', rating: 5, is_featured: false }

export default function AdminReviews({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<Review | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const { toast, showToast } = useToast()

  function openAdd() { setForm(emptyForm); setEditing(null); setShowAdd(true) }
  function openEdit(r: Review) {
    setForm({ name: r.name, role: r.role ?? '', company: r.company ?? '', review_text: r.review_text, rating: r.rating, is_featured: r.is_featured })
    setEditing(r)
    setShowAdd(true)
  }

  async function handleSave() {
    if (!form.name || !form.review_text) { showToast('Name and review text are required.', 'error'); return }
    setSaving(true)
    const payload = { ...form, source: 'admin' as const, is_visible: true }

    if (editing) {
      const res = await fetch('/api/reviews', { method: 'PATCH', body: JSON.stringify({ id: editing.id, ...payload }), headers: { 'Content-Type': 'application/json' } })
      if (res.ok) { setReviews(prev => prev.map(r => r.id === editing.id ? { ...r, ...payload } : r)); showToast('Review updated!') }
      else showToast('Failed.', 'error')
    } else {
      const res = await fetch('/api/reviews', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
      if (res.ok) { const data = await res.json(); setReviews(prev => [data, ...prev]); showToast('Review added!') }
      else showToast('Failed.', 'error')
    }
    setSaving(false)
    setShowAdd(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this review?')) return
    const res = await fetch('/api/reviews', { method: 'DELETE', body: JSON.stringify({ id }), headers: { 'Content-Type': 'application/json' } })
    if (res.ok) { setReviews(prev => prev.filter(r => r.id !== id)); showToast('Review deleted.') }
  }

  async function toggleVisibility(id: string, cur: boolean) {
    const res = await fetch('/api/reviews', { method: 'PATCH', body: JSON.stringify({ id, is_visible: !cur }), headers: { 'Content-Type': 'application/json' } })
    if (res.ok) { setReviews(prev => prev.map(r => r.id === id ? { ...r, is_visible: !cur } : r)); showToast('Updated!') }
  }

  return (
    <div>
      <PageHeader title="Testimonials" desc="Manage client reviews. Clients submit via the public site." action={<AddBtn onClick={openAdd} label="Add Review" />} />

      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {['Client','Rating','Preview','Source','Visible','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-white/30 border-b border-white/7 bg-black/20">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r.id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white/90 text-sm">{r.name}</div>
                    <div className="text-xs text-white/35">{[r.role, r.company].filter(Boolean).join(', ')}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < r.rating ? 'text-accent fill-accent' : 'text-white/15'} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/50 max-w-[200px] truncate">{r.review_text}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.source === 'admin' ? 'bg-purple-500/15 text-purple-400' : 'bg-blue-500/15 text-blue-400'}`}>
                      {r.source === 'admin' ? 'Admin' : 'Client'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <label className="toggle cursor-pointer">
                      <input type="checkbox" checked={r.is_visible} onChange={() => toggleVisibility(r.id, r.is_visible)} className="sr-only" />
                      <span className="tslider" />
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <EditBtn onClick={() => openEdit(r)} />
                      <DeleteBtn onClick={() => handleDelete(r.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={editing ? 'Edit Review' : 'Add Review'}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Client Name">
              <input className={inputCls} value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Marco Rivera" />
            </Field>
            <Field label="Role">
              <input className={inputCls} value={form.role} onChange={e => setForm(p => ({...p, role: e.target.value}))} placeholder="CEO" />
            </Field>
          </div>
          <Field label="Company">
            <input className={inputCls} value={form.company} onChange={e => setForm(p => ({...p, company: e.target.value}))} placeholder="Velora Inc." />
          </Field>
          <Field label="Rating">
            <div className="flex gap-2">
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => setForm(p => ({...p, rating: n}))}>
                  <Star size={20} className={n <= form.rating ? 'text-accent fill-accent' : 'text-white/20'} />
                </button>
              ))}
            </div>
          </Field>
          <Field label="Review Text">
            <textarea className={`${inputCls} resize-none`} rows={4} value={form.review_text} onChange={e => setForm(p => ({...p, review_text: e.target.value}))} placeholder="Client review text..." />
          </Field>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={e => setForm(p => ({...p, is_featured: e.target.checked}))} className="sr-only" />
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${form.is_featured ? 'bg-accent border-accent' : 'border-white/20'}`}>
              {form.is_featured && <svg viewBox="0 0 12 12" className="w-3 h-3 fill-white"><path d="M2 6l3 3 5-5"/></svg>}
            </div>
            <span className="text-sm text-white/60">Feature on homepage</span>
          </label>
          <PrimaryBtn onClick={handleSave} loading={saving} className="w-full justify-center">
            {editing ? 'Save Changes' : 'Add Review'}
          </PrimaryBtn>
        </div>
      </Modal>

      <Toast toast={toast} />
    </div>
  )
}
