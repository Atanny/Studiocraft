'use client'
import { useState, useRef } from 'react'
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react'
import { Toast, useToast, Panel, PageHeader, PrimaryBtn, Field, inputCls } from '@/components/admin/AdminUI'
import type { SettingsMap, VisualStrip } from '@/types'

export default function AdminSettings({
  settings: initialSettings,
  visualStrip: initialStrip,
}: {
  settings: SettingsMap
  visualStrip: VisualStrip[]
}) {
  const [settings, setSettings] = useState<SettingsMap>(initialSettings)
  const [strip, setStrip] = useState<VisualStrip[]>(initialStrip)
  const [savingGeneral, setSavingGeneral] = useState(false)
  const [savingHero, setSavingHero] = useState(false)
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null)
  const fileRefs = useRef<(HTMLInputElement | null)[]>([])
  const { toast, showToast } = useToast()

  function s(key: string) { return settings[key] ?? '' }
  function set(key: string, val: string) { setSettings(p => ({ ...p, [key]: val })) }

  async function saveKeys(keys: string[], setLoading: (v: boolean) => void) {
    setLoading(true)
    const payload = keys.map(k => ({ key: k, value: settings[k] ?? '' }))
    const res = await fetch('/api/settings', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
    setLoading(false)
    if (res.ok) showToast('Settings saved!')
    else showToast('Failed to save.', 'error')
  }

  async function handleStripImageUpload(file: File, stripItem: VisualStrip, idx: number) {
    setUploadingIdx(idx)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'strip')
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (res.ok) {
      const { url } = await res.json()
      // Update in DB
      await fetch('/api/settings', {
        method: 'POST',
        body: JSON.stringify([{ key: `strip_image_${stripItem.id}`, value: url }]),
        headers: { 'Content-Type': 'application/json' }
      })
      // Update local state
      setStrip(prev => prev.map((s, i) => i === idx ? { ...s, image_url: url } : s))
      showToast('Image updated!')
    } else showToast('Upload failed.', 'error')
    setUploadingIdx(null)
  }

  return (
    <div>
      <PageHeader title="Site Settings" desc="Manage your site content and appearance." />

      {/* General Info */}
      <Panel title="General Info">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <Field label="Studio Name"><input className={inputCls} value={s('studio_name')} onChange={e => set('studio_name', e.target.value)} /></Field>
          <Field label="Tagline"><input className={inputCls} value={s('tagline')} onChange={e => set('tagline', e.target.value)} /></Field>
          <Field label="Email"><input type="email" className={inputCls} value={s('email')} onChange={e => set('email', e.target.value)} /></Field>
          <Field label="Phone"><input className={inputCls} value={s('phone')} onChange={e => set('phone', e.target.value)} placeholder="+1 (555) 000-0000" /></Field>
          <Field label="Location"><input className={inputCls} value={s('location')} onChange={e => set('location', e.target.value)} placeholder="City, Country" /></Field>
          <Field label="Availability">
            <select className={inputCls} value={s('availability')} onChange={e => set('availability', e.target.value)}>
              <option>Open to Projects</option>
              <option>Fully Booked</option>
              <option>Limited Availability</option>
            </select>
          </Field>
        </div>
        <PrimaryBtn onClick={() => saveKeys(['studio_name','tagline','email','phone','location','availability'], setSavingGeneral)} loading={savingGeneral}>
          Save General Settings
        </PrimaryBtn>
      </Panel>

      {/* Hero Section */}
      <Panel title="Hero Section">
        <div className="flex flex-col gap-4 mb-4">
          <Field label="Headline"><input className={inputCls} value={s('hero_headline')} onChange={e => set('hero_headline', e.target.value)} /></Field>
          <Field label="Subtext"><textarea className={`${inputCls} resize-none`} rows={3} value={s('hero_subtext')} onChange={e => set('hero_subtext', e.target.value)} /></Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Primary CTA"><input className={inputCls} value={s('hero_cta_primary')} onChange={e => set('hero_cta_primary', e.target.value)} /></Field>
            <Field label="Secondary CTA"><input className={inputCls} value={s('hero_cta_secondary')} onChange={e => set('hero_cta_secondary', e.target.value)} /></Field>
          </div>
        </div>
        <PrimaryBtn onClick={() => saveKeys(['hero_headline','hero_subtext','hero_cta_primary','hero_cta_secondary'], setSavingHero)} loading={savingHero}>
          Update Hero
        </PrimaryBtn>
      </Panel>

      {/* Visual Strip Images */}
      <Panel title="Visual Strip Images (Homepage)">
        <p className="text-xs text-white/40 mb-4">Upload new images for the 4-panel visual strip on the homepage.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {strip.map((item, idx) => (
            <div key={item.id} className="flex flex-col gap-2">
              <div className="text-xs font-semibold text-white/50">{item.label}</div>
              <div className="relative group rounded-xl overflow-hidden aspect-square bg-white/5">
                <img src={item.image_url} alt={item.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => fileRefs.current[idx]?.click()}
                    disabled={uploadingIdx === idx}
                    className="flex flex-col items-center gap-1 text-white/80 hover:text-white text-xs"
                  >
                    {uploadingIdx === idx ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                    {uploadingIdx === idx ? 'Uploading' : 'Change'}
                  </button>
                </div>
              </div>
              <input
                ref={el => { fileRefs.current[idx] = el }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => e.target.files?.[0] && handleStripImageUpload(e.target.files[0], item, idx)}
              />
            </div>
          ))}
        </div>
      </Panel>

      {/* Feature Toggles */}
      <Panel title="Feature Toggles">
        {[
          { key: 'show_testimonials', label: 'Show testimonials section' },
          { key: 'show_portfolio', label: 'Show portfolio section' },
          { key: 'show_process', label: 'Show process section' },
          { key: 'maintenance_mode', label: 'Maintenance mode' },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between py-3 border-b border-white/6 last:border-0">
            <span className="text-sm text-white/70">{label}</span>
            <label className="toggle cursor-pointer">
              <input
                type="checkbox"
                checked={s(key) === 'true'}
                onChange={e => { set(key, e.target.checked ? 'true' : 'false'); fetch('/api/settings', { method: 'POST', body: JSON.stringify([{ key, value: e.target.checked ? 'true' : 'false' }]), headers: { 'Content-Type': 'application/json' } }) }}
                className="sr-only"
              />
              <span className="tslider" />
            </label>
          </div>
        ))}
      </Panel>

      {/* SEO */}
      <Panel title="SEO Meta Tags">
        <div className="flex flex-col gap-4 mb-4">
          <Field label="Page Title"><input className={inputCls} value={s('seo_title')} onChange={e => set('seo_title', e.target.value)} /></Field>
          <Field label="Meta Description"><textarea className={`${inputCls} resize-none`} rows={3} value={s('seo_description')} onChange={e => set('seo_description', e.target.value)} /></Field>
          <Field label="Keywords"><input className={inputCls} value={s('seo_keywords')} onChange={e => set('seo_keywords', e.target.value)} /></Field>
        </div>
        <PrimaryBtn onClick={() => saveKeys(['seo_title','seo_description','seo_keywords'], () => {})}>
          Save SEO Settings
        </PrimaryBtn>
      </Panel>

      <Toast toast={toast} />
    </div>
  )
}
