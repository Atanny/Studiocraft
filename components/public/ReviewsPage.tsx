'use client'
import Link from 'next/link'
import { useState } from 'react'
import type { Review } from '@/types'
import { getInitials } from '@/lib/utils'

export default function ReviewsPage({ reviews }: { reviews: Review[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', role: '', text: '' })
  const [stars, setStars] = useState(5)
  const [localReviews, setLocalReviews] = useState(reviews)
  const [toast, setToast] = useState(false)

  async function handleSubmit() {
    if (!form.name || !form.text) return
    const res = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, role: form.role, review_text: form.text, rating: stars, source: 'client' }) })
    if (res.ok) {
      setModalOpen(false); setForm({ name: '', role: '', text: '' }); setStars(5)
      setToast(true); setTimeout(() => setToast(false), 4000)
    }
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[1000] h-[72px] flex items-center justify-between px-[5%] backdrop-blur-xl bg-[rgba(245,244,240,0.88)] border-b border-accent/10">
        <Link href="/" className="font-serif text-[1.4rem] font-bold text-dark no-underline">Studio<span className="text-accent">·</span>Craft</Link>
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/services" className="text-sm font-medium hover:text-accent transition-colors text-dark">Services</Link>
          <Link href="/reviews" className="text-sm font-semibold text-accent">Reviews</Link>
          <Link href="/#contact" className="text-sm font-medium bg-dark text-white px-5 py-2 rounded-full hover:bg-accent transition-colors">Contact</Link>
        </div>
      </nav>

      <div className="bg-dark pt-[calc(72px+5rem)] pb-20 px-[5%] text-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(37,99,235,.18) 0%, transparent 70%)' }} />
        <div className="relative z-10">
          <span className="block text-xs font-bold tracking-[0.18em] uppercase mb-4 text-accent/80">Client Testimonials</span>
          <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] font-bold text-white leading-[1.05] mb-6">Every project,<br /><em className="italic text-accent">a story told</em></h1>
          <p className="text-white/55 text-lg max-w-lg mx-auto mb-10">Real words from real clients. These are the relationships and results that define Studio Craft.</p>
          <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 bg-accent text-white px-8 py-3.5 rounded-full font-semibold hover:bg-accent-dark transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-white fill-none stroke-2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            Share Your Review
          </button>
        </div>
      </div>

      <div className="bg-dark py-8 px-[5%] border-b border-white/5">
        <div className="flex items-center justify-center gap-10 flex-wrap">
          <div className="text-center"><div className="font-serif text-5xl font-bold text-accent">4.9</div><div className="text-white/40 text-sm mt-1">Average Rating</div></div>
          <div className="w-px h-12 bg-white/10 hidden sm:block" />
          <div className="text-center"><div className="font-serif text-5xl font-bold text-accent">100%</div><div className="text-white/40 text-sm mt-1">Would recommend</div></div>
          <div className="w-px h-12 bg-white/10 hidden sm:block" />
          <div className="text-center"><div className="font-serif text-5xl font-bold text-accent">{localReviews.length}+</div><div className="text-white/40 text-sm mt-1">Verified reviews</div></div>
        </div>
      </div>

      <div className="py-16 px-[5%] grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {localReviews.map(r => (
          <div key={r.id} className="bg-white rounded-[18px] p-8 border border-black/6 hover:-translate-y-1 hover:shadow-xl transition-all">
            <div className="text-accent text-base mb-4">{'★'.repeat(r.rating)}</div>
            <p className="text-[#666] text-sm leading-[1.7] italic mb-6">"{r.review_text}"</p>
            <div className="flex items-center gap-3">
              {r.avatar_url
                ? <img src={r.avatar_url} alt={r.name} className="w-11 h-11 rounded-full object-cover border-2 border-accent/25" />
                : <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{getInitials(r.name)}</div>
              }
              <div>
                <div className="font-semibold text-sm">{r.name}</div>
                <div className="text-xs text-[#888]">{[r.role, r.company].filter(Boolean).join(', ')}</div>
              </div>
            </div>
          </div>
        ))}
        <div onClick={() => setModalOpen(true)} className="bg-[#2563eb]/5 border-2 border-dashed border-[#2563eb]/25 rounded-[18px] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#2563eb]/10 hover:border-[#2563eb] transition-all min-h-[200px]">
          <span className="text-4xl mb-3 text-[#2563eb]">+</span>
          <span className="font-semibold text-[#1d4ed8] text-sm">Add Your Review</span>
          <small className="text-xs text-[#888] mt-1">Share your experience with Studio Craft</small>
        </div>
      </div>

      <div className="py-20 px-[5%] bg-dark text-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(37,99,235,.2) 0%, transparent 70%)' }} />
        <div className="relative z-10">
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] text-white mb-3">Ready to be next?</h2>
          <p className="text-white/50 mb-8">Join the growing list of clients who have elevated their brand through intentional design.</p>
          <Link href="/#contact"><button className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white px-10 py-4 rounded-full font-bold hover:opacity-85 transition-opacity">Start a Project →</button></Link>
        </div>
      </div>

      <footer className="bg-[#080808] py-10 px-[5%] flex justify-between items-center flex-wrap gap-4 border-t border-white/5">
        <Link href="/" className="font-serif text-xl font-bold text-white">Studio<span className="text-[#2563eb]">·</span>Craft</Link>
        <div className="flex gap-6">
          {[['Services','/services'],['Work','/'],['Reviews','/reviews'],['Contact','/#contact']].map(([l,h]) => (
            <Link key={l} href={h} className="text-sm text-white/40 hover:text-[#2563eb] transition-colors">{l}</Link>
          ))}
        </div>
        <div className="text-xs text-white/25">© 2026 Studio Craft. All rights reserved.</div>
      </footer>

      {modalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-lg" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-3xl p-10 max-w-lg w-full relative max-h-[88vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 w-8 h-8 bg-[#eae9e4] rounded-full flex items-center justify-center text-[#888] text-sm">✕</button>
            <h3 className="font-serif text-2xl font-bold mb-1">Share Your Experience</h3>
            <p className="text-[#666] text-sm mb-6">We'd love to hear about your project experience.</p>
            <div className="flex flex-col gap-4">
              <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Your full name" className="px-4 py-3.5 border border-black/12 rounded-xl text-sm outline-none focus:border-[#2563eb] transition-colors w-full" />
              <input value={form.role} onChange={e => setForm(p => ({...p, role: e.target.value}))} placeholder="Role & company (optional)" className="px-4 py-3.5 border border-black/12 rounded-xl text-sm outline-none focus:border-[#2563eb] transition-colors w-full" />
              <div className="flex gap-1">
                {[1,2,3,4,5].map(n => <span key={n} onClick={() => setStars(n)} className={`text-2xl cursor-pointer ${n <= stars ? 'text-[#2563eb]' : 'text-gray-200'}`}>★</span>)}
              </div>
              <textarea value={form.text} onChange={e => setForm(p => ({...p, text: e.target.value}))} placeholder="Tell us about your experience..." rows={4} className="px-4 py-3.5 border border-black/12 rounded-xl text-sm outline-none focus:border-[#2563eb] resize-none w-full" />
              <button onClick={handleSubmit} className="bg-dark text-white py-3.5 rounded-full font-semibold hover:bg-[#2563eb] transition-colors">Submit Review</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-dark border border-green-500/30 text-green-400 text-sm px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          ✓ Review submitted! It will appear after approval.
        </div>
      )}
    </>
  )
}
