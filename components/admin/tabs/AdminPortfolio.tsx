'use client'
import { useState, useRef } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { Modal, Toast, useToast, Panel, PageHeader, AddBtn, PrimaryBtn, Field, inputCls, DeleteBtn, EditBtn, StatusBadge } from '@/components/admin/AdminUI'
import type { Portfolio } from '@/types'

const COLOR_OPTIONS = ['pc1','pc2','pc3','pc4','pc5','pc6']
const emptyForm: { title: string; category: string; tags: string; description: string; status: 'published' | 'draft'; color_class: string; image_url: string } = { title: '', category: 'UI/UX Design', tags: '', description: '', status: 'published', color_class: 'pc1', image_url: '' }

export default function AdminPortfolio({ initialPortfolio }: { initialPortfolio: Portfolio[] }) {
  const [portfolio, setPortfolio] = useState<Portfolio[]>(initialPortfolio)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<Portfolio | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const { toast, showToast } = useToast()

  function openAdd() { setForm(emptyForm); setEditing(null); setShowAdd(true) }
  function openEdit(p: Portfolio) {
    setForm({ title: p.title, category: p.category, tags: p.tags.join(', '), description: p.description ?? '', status: p.status, color_class: p.color_class, image_url: p.image_url ?? '' })
    setEditing(p)
    setShowAdd(true)
  }

  async function handleImageUpload(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'portfolio')
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (res.ok) {
      const { url } = await res.json()
      setForm(p => ({ ...p, image_url: url }))
      showToast('Image uploaded!')
    } else showToast('Upload failed.', 'error')
    setUploading(false)
  }

  async function handleSave() {
    if (!form.title) { showToast('Title is required.', 'error'); return }
    setSaving(true)
    const payload = { title: form.title, category: form.category, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), description: form.description, status: form.status, color_class: form.color_class, image_url: form.image_url || null }

    if (editing) {
      const res = await fetch('/api/portfolio', { method: 'PATCH', body: JSON.stringify({ id: editing.id, ...payload }), headers: { 'Content-Type': 'application/json' } })
      if (res.ok) { setPortfolio(prev => prev.map(p => p.id === editing.id ? { ...p, ...payload } : p)); showToast('Project updated!') }
      else showToast('Failed to update.', 'error')
    } else {
      const res = await fetch('/api/portfolio', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
      if (res.ok) { const data = await res.json(); setPortfolio(prev => [...prev, data]); showToast('Project added!') }
      else showToast('Failed to add.', 'error')
    }
    setSaving(false)
    setShowAdd(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this project?')) return
    const res = await fetch('/api/portfolio', { method: 'DELETE', body: JSON.stringify({ id }), headers: { 'Content-Type': 'application/json' } })
    if (res.ok) { setPortfolio(prev => prev.filter(p => p.id !== id)); showToast('Project deleted.') }
  }

  return (
    <div>
      <PageHeader title="Portfolio" desc="Manage your featured projects." action={<AddBtn onClick={openAdd} label="Add Project" />} />

      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {['Project','Category','Tags','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-white/30 border-b border-white/7 bg-black/20">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {portfolio.map(p => (
                <tr key={p.id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg ${p.color_class} flex-shrink-0`} />
                      <div className="font-semibold text-white/90 text-sm">{p.title}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/60">{p.category}</td>
                  <td className="px-4 py-3 text-xs text-white/40">{p.tags.slice(0,3).join(', ')}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <EditBtn onClick={() => openEdit(p)} />
                      <DeleteBtn onClick={() => handleDelete(p.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={editing ? 'Edit Project' : 'Add Project'}>
        <div className="flex flex-col gap-4">
          <Field label="Project Title">
            <input className={inputCls} value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="e.g. Velora Mobile App" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select className={inputCls} value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))}>
                {['UI/UX Design','Branding','Print'].map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select className={inputCls} value={form.status} onChange={e => setForm(p => ({...p, status: e.target.value as 'published'|'draft'}))}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </Field>
          </div>
          <Field label="Tags (comma separated)">
            <input className={inputCls} value={form.tags} onChange={e => setForm(p => ({...p, tags: e.target.value}))} placeholder="Mobile, iOS, Figma" />
          </Field>
          <Field label="Description">
            <textarea className={`${inputCls} resize-none`} rows={2} value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} placeholder="Brief project description..." />
          </Field>
          <Field label="Card Color">
            <div className="flex gap-2">
              {COLOR_OPTIONS.map(c => (
                <button key={c} type="button" onClick={() => setForm(p => ({...p, color_class: c}))}
                  className={`w-8 h-8 rounded-lg ${c} transition-all ${form.color_class === c ? 'ring-2 ring-accent ring-offset-1 ring-offset-[#141414]' : ''}`} />
              ))}
            </div>
          </Field>
          <Field label="Project Image">
            {form.image_url && <img src={form.image_url} alt="preview" className="w-full h-32 object-cover rounded-lg mb-2" />}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full border-2 border-dashed border-white/15 rounded-xl p-4 text-white/40 hover:border-accent/40 hover:text-accent/60 transition-all flex items-center justify-center gap-2 text-sm"
            >
              {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
          </Field>
          <PrimaryBtn onClick={handleSave} loading={saving} className="w-full justify-center">
            {editing ? 'Save Changes' : 'Add Project'}
          </PrimaryBtn>
        </div>
      </Modal>

      <Toast toast={toast} />
    </div>
  )
}
