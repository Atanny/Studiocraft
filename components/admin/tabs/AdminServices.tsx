'use client'
import { useState } from 'react'
import { Plus, GripVertical } from 'lucide-react'
import { Modal, Toast, useToast, Panel, PageHeader, AddBtn, PrimaryBtn, Field, inputCls, DeleteBtn, EditBtn } from '@/components/admin/AdminUI'
import type { Service } from '@/types'

const emptyForm = { name: '', description: '', category_tags: '', sub_items: '', icon_type: 'grid' }

export default function AdminServices({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const { toast, showToast } = useToast()

  function openAdd() { setForm(emptyForm); setEditing(null); setShowAdd(true) }
  function openEdit(s: Service) {
    setForm({ name: s.name, description: s.description ?? '', category_tags: s.category_tags.join(', '), sub_items: s.sub_items.join(', '), icon_type: s.icon_type })
    setEditing(s)
    setShowAdd(true)
  }

  async function handleSave() {
    if (!form.name || !form.description) { showToast('Name and description are required.', 'error'); return }
    setSaving(true)

    const payload = {
      name: form.name,
      description: form.description,
      category_tags: form.category_tags.split(',').map(t => t.trim()).filter(Boolean),
      sub_items: form.sub_items.split(',').map(t => t.trim()).filter(Boolean),
      icon_type: form.icon_type,
    }

    if (editing) {
      const res = await fetch('/api/services', { method: 'PATCH', body: JSON.stringify({ id: editing.id, ...payload }), headers: { 'Content-Type': 'application/json' } })
      if (res.ok) {
        setServices(prev => prev.map(s => s.id === editing.id ? { ...s, ...payload } : s))
        showToast('Service updated!')
      } else showToast('Failed to update.', 'error')
    } else {
      const res = await fetch('/api/services', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
      if (res.ok) {
        const data = await res.json()
        setServices(prev => [...prev, data])
        showToast('Service added to site!')
      } else showToast('Failed to add service.', 'error')
    }
    setSaving(false)
    setShowAdd(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this service?')) return
    const res = await fetch('/api/services', { method: 'DELETE', body: JSON.stringify({ id }), headers: { 'Content-Type': 'application/json' } })
    if (res.ok) { setServices(prev => prev.filter(s => s.id !== id)); showToast('Service deleted.') }
    else showToast('Failed to delete.', 'error')
  }

  async function toggleVisibility(id: string, current: boolean) {
    const res = await fetch('/api/services', { method: 'PATCH', body: JSON.stringify({ id, is_visible: !current }), headers: { 'Content-Type': 'application/json' } })
    if (res.ok) {
      setServices(prev => prev.map(s => s.id === id ? { ...s, is_visible: !current } : s))
      showToast('Visibility updated!')
    }
  }

  return (
    <div>
      <PageHeader
        title="Services"
        desc="Manage what services appear on your site."
        action={<AddBtn onClick={openAdd} label="New Service" />}
      />

      {/* Service Visibility toggles */}
      <Panel title="Service Visibility">
        {services.map(s => (
          <div key={s.id} className="flex items-center justify-between py-3 border-b border-white/6 last:border-0">
            <div>
              <div className="font-semibold text-white/85 text-sm">{s.name}</div>
              <div className="text-xs text-white/35 mt-0.5">{s.sub_items.slice(0, 4).join(', ')}</div>
            </div>
            <label className="toggle cursor-pointer">
              <input
                type="checkbox"
                checked={s.is_visible}
                onChange={() => toggleVisibility(s.id, s.is_visible)}
                className="sr-only"
              />
              <span className="tslider" />
            </label>
          </div>
        ))}
      </Panel>

      {/* Services Table */}
      <Panel title="">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-white/80 text-sm">All Services ({services.length})</div>
          <AddBtn onClick={openAdd} label="New Service" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {['Service','Tags','Sub-items','Visibility','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-white/30 border-b border-white/7 bg-black/20">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 font-semibold text-white/90 text-sm">{s.name}</td>
                  <td className="px-4 py-3 text-xs text-white/50 max-w-[140px]">{s.category_tags.slice(0,3).join(', ')}</td>
                  <td className="px-4 py-3 text-xs text-white/50 max-w-[140px]">{s.sub_items.slice(0,3).join(', ')}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.is_visible ? 'bg-green-500/12 text-green-400' : 'bg-white/8 text-white/40'}`}>
                      {s.is_visible ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <EditBtn onClick={() => openEdit(s)} />
                      <DeleteBtn onClick={() => handleDelete(s.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Add/Edit Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={editing ? 'Edit Service' : 'New Service'}>
        <div className="flex flex-col gap-4">
          <Field label="Service Name">
            <input className={inputCls} value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="e.g. Motion Design" />
          </Field>
          <Field label="Description">
            <textarea className={`${inputCls} min-h-[80px] resize-none`} value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} placeholder="What this service offers..." />
          </Field>
          <Field label="Category Tags (comma separated)">
            <input className={inputCls} value={form.category_tags} onChange={e => setForm(p => ({...p, category_tags: e.target.value}))} placeholder="Animation, After Effects, Motion" />
          </Field>
          <Field label="Sub-items (comma separated)">
            <input className={inputCls} value={form.sub_items} onChange={e => setForm(p => ({...p, sub_items: e.target.value}))} placeholder="Intro Animation, Logo Reveal, UI Motion" />
          </Field>
          <PrimaryBtn onClick={handleSave} loading={saving} className="w-full justify-center mt-1">
            {editing ? 'Save Changes' : 'Add Service to Site'}
          </PrimaryBtn>
        </div>
      </Modal>

      <Toast toast={toast} />
    </div>
  )
}
