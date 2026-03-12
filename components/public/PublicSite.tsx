'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { Service, Portfolio, Review, VisualStrip, SettingsMap } from '@/types'
import { getInitials } from '@/lib/utils'

// ---- Icons inline ----
const icons = {
  grid: <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-white fill-none stroke-2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  layers: <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-white fill-none stroke-2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  'file-text': <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-white fill-none stroke-2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>,
}

export default function PublicSite({ settings, services, portfolio, reviews, visualStrip }: {
  settings: SettingsMap; services: Service[]; portfolio: Portfolio[]; reviews: Review[]; visualStrip: VisualStrip[]
}) {
  const [page, setPage] = useState<'home' | 'reviews'>('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedService, setSelectedService] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [inquireService, setInquireService] = useState('')
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [servicePickerOpen, setServicePickerOpen] = useState(false)
  const [selectedServiceLabel, setSelectedServiceLabel] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [starRating, setStarRating] = useState(5)
  const [reviewForm, setReviewForm] = useState({ name: '', role: '', text: '', avatar: '' })
  const [contactForm, setContactForm] = useState({ firstName: '', lastName: '', email: '', message: '' })
  const [contactSuccess, setContactSuccess] = useState(false)
  const [submittingContact, setSubmittingContact] = useState(false)
  const [localReviews, setLocalReviews] = useState<Review[]>(reviews)

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000) }

  function nav(target: 'home' | 'reviews', section?: string) {
    setPage(target)
    setMenuOpen(false)
    window.scrollTo(0, 0)
    if (section) setTimeout(() => document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedServiceLabel) { alert('Please select a service.'); return }
    setSubmittingContact(true)
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name: contactForm.firstName, last_name: contactForm.lastName, email: contactForm.email, service: selectedServiceLabel, message: contactForm.message })
    })
    setSubmittingContact(false)
    if (res.ok) { setContactSuccess(true); setContactForm({ firstName: '', lastName: '', email: '', message: '' }); setSelectedServiceLabel('') }
  }

  async function handleReviewSubmit() {
    if (!reviewForm.name || !reviewForm.text) { alert('Please fill in name and review.'); return }
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: reviewForm.name, role: reviewForm.role, review_text: reviewForm.text, rating: starRating, source: 'client' })
    })
    if (res.ok) {
      const newReview = await res.json()
      setLocalReviews(prev => [newReview, ...prev])
      setReviewModalOpen(false)
      setReviewForm({ name: '', role: '', text: '', avatar: '' })
      setStarRating(5)
      showToast('Review submitted! It will appear after approval.')
    }
  }

  // Reveal animation
  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }), { threshold: 0.1, rootMargin: '0px 0px -60px 0px' })
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [page])

  const featuredReviews = localReviews.filter(r => r.is_featured).slice(0, 6)
  const homeReviews = featuredReviews.length > 0 ? featuredReviews : localReviews.slice(0, 6)

  if (page === 'reviews') return (
    <ReviewsView
      reviews={localReviews}
      onBack={() => nav('home')}
      onAddReview={() => setReviewModalOpen(true)}
      reviewModal={reviewModalOpen}
      setReviewModal={setReviewModalOpen}
      starRating={starRating}
      setStarRating={setStarRating}
      reviewForm={reviewForm}
      setReviewForm={setReviewForm}
      onSubmitReview={handleReviewSubmit}
    />
  )

  return (
    <>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] h-[72px] flex items-center justify-between px-[5%] backdrop-blur-xl bg-[rgba(245,244,240,0.88)] border-b border-accent/10 transition-all">
        <div className="font-serif text-[1.4rem] font-bold text-dark cursor-pointer" onClick={() => nav('home')}>
          Studio<span className="text-accent">·</span>Craft
        </div>
        <ul className="hidden md:flex gap-10 list-none items-center">
          <li><Link href="/services" className="text-sm font-medium text-dark hover:text-accent transition-colors">Services</Link></li>
          <li><a onClick={() => nav('home', 'process')} className="text-sm font-medium text-dark hover:text-accent transition-colors cursor-pointer">Process</a></li>
          <li><a onClick={() => nav('home', 'portfolio')} className="text-sm font-medium text-dark hover:text-accent transition-colors cursor-pointer">Portfolio</a></li>
          <li><a onClick={() => nav('reviews')} className="text-sm font-medium text-dark hover:text-accent transition-colors cursor-pointer">Reviews</a></li>
          <li><a onClick={() => nav('home', 'contact')} className="text-sm font-medium text-dark hover:text-accent transition-colors cursor-pointer">Contact</a></li>
          <li><Link href="/admin" className="text-sm font-medium bg-dark text-white px-5 py-2 rounded-full hover:bg-accent transition-colors">Admin</Link></li>
        </ul>
        <button className="md:hidden flex flex-col gap-[5px] cursor-pointer bg-none border-none" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="block w-6 h-[2px] bg-dark rounded" /><span className="block w-6 h-[2px] bg-dark rounded" /><span className="block w-6 h-[2px] bg-dark rounded" />
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed top-[72px] left-0 right-0 z-[999] bg-[rgba(245,244,240,0.97)] backdrop-blur-xl border-b border-accent/10 flex flex-col gap-4 px-[5%] py-5">
          {[['Services', '/services', false], ['Process', null, true], ['Portfolio', null, true], ['Reviews', null, false], ['Contact', null, true], ['Admin', '/admin', false]].map(([l, href, scroll]) => (
            href
              ? <Link key={l as string} href={href as string} onClick={() => setMenuOpen(false)} className="text-base font-medium text-dark py-2 border-b border-black/5 cursor-pointer">{l}</Link>
              : <a key={l as string} onClick={() => { if (l === 'Reviews') nav('reviews'); else nav('home', (l as string).toLowerCase()); setMenuOpen(false) }} className="text-base font-medium text-dark py-2 border-b border-black/5 cursor-pointer">{l}</a>
          ))}
        </div>
      )}

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-[5%] pt-[calc(72px+4rem)] pb-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,.1) 0%, transparent 70%)' }} />
        <div className="relative z-10 flex flex-col items-center">
          <div className="animate-fadeUp inline-flex items-center gap-2 bg-accent/10 border border-accent/25 text-accent-dark text-xs font-bold tracking-[0.12em] uppercase px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            {settings.availability ?? 'Available for Projects'}
          </div>
          <h1 className="animate-fadeUp-1 font-serif text-[clamp(3rem,8vw,7rem)] leading-[1.05] font-bold tracking-[-0.03em] text-dark max-w-[900px] mb-6">
            {settings.hero_headline?.split('moves').map((part, i) => i === 0 ? <span key={i}>{part}<em className="italic text-accent">moves</em></span> : <span key={i}>{part}</span>) ?? <>Design that <em className="italic text-accent">moves</em><br />people forward</>}
          </h1>
          <p className="animate-fadeUp-2 text-[clamp(1rem,2vw,1.25rem)] text-[#666] max-w-[560px] leading-[1.7] font-light mb-12">
            {settings.hero_subtext ?? 'Premium UI/UX, Branding, and Print design for ambitious brands.'}
          </p>
          <div className="animate-fadeUp-3 flex gap-4 flex-wrap justify-center">
            <button onClick={() => nav('home', 'contact')} className="bg-dark text-white px-9 py-3.5 rounded-full text-base font-semibold hover:bg-accent hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(37,99,235,.35)] transition-all">
              {settings.hero_cta_primary ?? 'Start a Project'}
            </button>
            <button onClick={() => nav('home', 'portfolio')} className="bg-transparent text-dark px-9 py-3.5 rounded-full text-base font-medium border border-black/20 hover:border-accent hover:text-accent hover:-translate-y-0.5 transition-all">
              {settings.hero_cta_secondary ?? 'View Portfolio'}
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs tracking-[0.1em] uppercase text-[#888]">
          <div className="w-px h-10 bg-gradient-to-b from-accent to-transparent animate-scrollPulse" />
          Scroll
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-dark py-4 overflow-hidden">
        <div className="marquee-track">
          {['UI/UX Design','Mobile Design','Brand Identity','Web Applications','Print Design','Logo Design','Mockups','Brand Guidelines','Poster Design','UI/UX Design','Mobile Design','Brand Identity','Web Applications','Print Design'].map((item, i) => (
            <span key={i} className="text-xs tracking-[0.18em] uppercase text-white/40 font-medium flex-shrink-0 flex items-center gap-4">
              {item}<span className="w-1 h-1 rounded-full bg-accent" />
            </span>
          ))}
        </div>
      </div>

      {/* VISUAL STRIP */}
      <div className="grid grid-cols-4 h-[300px] overflow-hidden">
        {visualStrip.map(item => (
          <div key={item.id} className="relative overflow-hidden group cursor-pointer">
            <img src={item.image_url} alt={item.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07] brightness-80 group-hover:brightness-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="vs-lbl">{item.label}</span>
          </div>
        ))}
      </div>

      {/* SERVICES */}
      <section id="services" className="py-28 px-[5%] bg-white">
        <div className="flex justify-between items-end mb-12 flex-wrap gap-6">
          <div>
            <span className="reveal block text-xs font-bold tracking-[0.18em] uppercase text-accent-dark mb-3">What I Offer</span>
            <h2 className="reveal font-serif text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.02em] leading-[1.1]">Craft built for<br />every need</h2>
          </div>
          <p className="reveal text-[#666] text-base leading-[1.7] max-w-[340px] font-light">Three disciplines. Infinite possibilities. Every project is a story told through design.</p>
        </div>
        <div className="reveal flex flex-wrap gap-px bg-black/6 border border-black/6 rounded-[20px] overflow-hidden">
          {services.map(svc => (
            <div key={svc.id} className="service-card bg-white p-10 flex-1 basis-[300px] min-w-0 relative overflow-hidden hover:bg-[#f5f4f0] transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-dark rounded-xl flex items-center justify-center mb-6">
                {icons[svc.icon_type as keyof typeof icons] ?? icons.grid}
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3">{svc.name}</h3>
              <p className="text-[#666] text-sm leading-[1.65] mb-6">{svc.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-1">
                {svc.category_tags.map(t => <span key={t} className="text-xs font-semibold px-3 py-1 bg-[#eae9e4] rounded-full text-dark">{t}</span>)}
              </div>
              {svc.sub_items.length > 0 && (
                <>
                  <p className="text-xs text-[#888] my-3">Includes:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {svc.sub_items.map(t => <span key={t} className="text-xs font-semibold px-3 py-1 bg-[#eae9e4] rounded-full text-dark">{t}</span>)}
                    <button onClick={() => { setInquireService(svc.name); setModalOpen(true) }} className="text-xs font-semibold px-3 py-1 bg-accent/12 text-accent-dark rounded-full hover:bg-accent/22 transition-colors cursor-pointer">+ Specify Other</button>
                  </div>
                </>
              )}
              <button onClick={() => { setInquireService(svc.name); setModalOpen(true) }} className="mt-5 text-xs font-bold text-accent-dark uppercase tracking-[0.04em] flex items-center gap-1 hover:gap-2 transition-all bg-none border-none cursor-pointer">
                Inquire About This →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SPLIT */}
      <div className="about-split">
        <div className="about-img-side">
          <img src="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=900&q=85&auto=format&fit=crop" alt="Studio workspace" />
          <div className="absolute bottom-6 left-6 bg-accent text-white text-sm font-bold px-4 py-2 rounded-xl">Est. 2019</div>
        </div>
        <div className="about-text-side">
          <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: 'rgba(37,99,235,.7)' }}>About the Studio</span>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-white leading-[1.1]">Design rooted in<br /><em className="italic text-accent">intention</em></h2>
          <p className="text-white/60 leading-[1.7]">Every pixel, every curve, every word — deliberate. Studio Craft is a one-person studio driven by the belief that great design is not decoration, it is strategy made visible.</p>
          <p className="text-white/60 leading-[1.7]">From early-stage startups finding their voice to established brands ready to evolve — I bring the same level of care and precision to every project.</p>
          <button onClick={() => nav('home', 'contact')} className="self-start bg-white text-dark px-8 py-3 rounded-full font-semibold hover:bg-accent hover:text-white transition-all">Work Together</button>
        </div>
      </div>

      {/* PROCESS */}
      <section id="process" className="py-28 px-[5%]">
        <span className="reveal block text-xs font-bold tracking-[0.18em] uppercase text-accent-dark mb-4">How It Works</span>
        <h2 className="reveal font-serif text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.02em] leading-[1.1] mb-16">A process as refined as the result</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[['01','Discovery','We start with a deep conversation about your goals, audience, and vision. Understanding your brand is the foundation of great design.'],
            ['02','Strategy','Research, moodboarding, and defining the creative direction. Every decision is intentional and backed by clear thinking.'],
            ['03','Execution','Design comes to life with pixel-perfect precision. You receive regular updates and revisions until everything feels right.'],
            ['04','Delivery','Final files delivered in all formats you need — organized, labeled, and ready to use immediately.']
          ].map(([num, title, desc]) => (
            <div key={num} className="reveal relative pt-12">
              <div className="process-num absolute top-0 left-0">{num}</div>
              <h4 className="font-serif text-lg font-semibold mb-2">{title}</h4>
              <p className="text-[#666] text-sm leading-[1.65]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="py-28 px-[5%] bg-white">
        <div className="flex justify-between items-end mb-14 flex-wrap gap-6">
          <div>
            <span className="reveal block text-xs font-bold tracking-[0.18em] uppercase text-accent-dark mb-3">Selected Work</span>
            <h2 className="reveal font-serif text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.02em] leading-[1.1]">
              Work that speaks<br /><em className="italic text-accent">for itself</em>
            </h2>
          </div>
          <p className="reveal text-[#666] text-base leading-[1.7] max-w-[360px] font-light">A curated look at recent work across all three disciplines.</p>
        </div>
        <div className="reveal grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map(p => (
            <div key={p.id} className="rounded-2xl overflow-hidden cursor-pointer aspect-[4/3] hover:-translate-y-1.5 hover:shadow-2xl transition-all">
              <div className={`w-full h-full ${p.color_class} flex items-end p-6 relative`}>
                {p.image_url
                  ? <img src={p.image_url} alt={p.title} className="absolute inset-0 w-full h-full object-cover opacity-80" />
                  : <div className="absolute inset-0 flex items-center justify-center opacity-[0.18]">
                      <svg viewBox="0 0 24 24" className="w-20 h-20 stroke-white fill-none stroke-[1.2]"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
                    </div>
                }
                <div className="relative z-10 bg-black/50 backdrop-blur-md rounded-xl px-4 py-2.5">
                  <h4 className="text-sm font-semibold text-white">{p.title}</h4>
                  <span className="text-xs text-white/60">{p.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 px-[5%]">
        <div className="flex justify-between items-end mb-14 flex-wrap gap-4">
          <div>
            <span className="reveal block text-xs font-bold tracking-[0.18em] uppercase text-accent-dark mb-3">Client Words</span>
            <h2 className="reveal font-serif text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.02em]">Results that speak</h2>
          </div>
          <button onClick={() => nav('reviews')} className="reveal text-sm font-semibold text-accent flex items-center gap-1.5 hover:gap-3 transition-all">
            See All Reviews →
          </button>
        </div>
        <div className="reveal grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {homeReviews.map(r => (
            <div key={r.id} className="bg-white rounded-[18px] p-8 border border-black/6 hover:-translate-y-1 hover:shadow-xl transition-all">
              <div className="text-accent text-base mb-4">{'★'.repeat(r.rating)}</div>
              <p className="text-[#666] text-sm leading-[1.7] italic mb-6">"{r.review_text}"</p>
              <div className="flex items-center gap-3">
                {r.avatar_url
                  ? <img src={r.avatar_url} alt={r.name} className="w-11 h-11 rounded-full object-cover border-2 border-accent/25" />
                  : <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{getInitials(r.name)}</div>
                }
                <div>
                  <div className="font-semibold text-sm">{r.name}</div>
                  <div className="text-xs text-[#888]">{[r.role, r.company].filter(Boolean).join(', ')}</div>
                </div>
              </div>
            </div>
          ))}
          {/* Add review card */}
          <div onClick={() => setReviewModalOpen(true)} className="bg-accent/5 border-2 border-dashed border-accent/25 rounded-[18px] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent/10 hover:border-accent transition-all min-h-[200px]">
            <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-accent fill-none stroke-[1.8] mb-3"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></svg>
            <span className="font-semibold text-accent-dark text-sm">Share Your Experience</span>
            <small className="text-xs text-[#888] mt-1">Leave your review or testimonial</small>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-28 px-[5%] bg-dark">
        <div className="grid lg:grid-cols-2 gap-24 items-start">
          <div>
            <span className="reveal block text-xs font-bold tracking-[0.18em] uppercase mb-4" style={{ color: 'rgba(37,99,235,.8)' }}>Get in Touch</span>
            <h2 className="reveal font-serif text-[clamp(2rem,5vw,3.5rem)] font-bold text-white mb-4">Let's build something great</h2>
            <p className="reveal text-white/55 text-base leading-[1.7] max-w-[480px]">Whether you have a brief or just an idea — I would love to hear about your project.</p>
            <a href={`mailto:${settings.email ?? 'hello@studiocraft.design'}`} className="reveal mt-8 inline-flex items-center gap-2 text-accent font-semibold text-lg hover:gap-4 transition-all">
              {settings.email ?? 'hello@studiocraft.design'} →
            </a>
            <div className="reveal mt-10 flex gap-4 flex-wrap">
              <div className="bg-white/6 border border-white/8 rounded-xl p-4">
                <div className="text-xs uppercase tracking-widest text-white/40 mb-1">Response Time</div>
                <div className="font-semibold text-white">Within 24 hours</div>
              </div>
              <div className="bg-white/6 border border-white/8 rounded-xl p-4">
                <div className="text-xs uppercase tracking-widest text-white/40 mb-1">Availability</div>
                <div className="font-semibold text-green-400">{settings.availability ?? 'Open to Projects'}</div>
              </div>
            </div>
          </div>
          <form onSubmit={handleContactSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2"><label className="text-xs font-semibold uppercase tracking-wider text-white/50">First Name</label><input value={contactForm.firstName} onChange={e => setContactForm(p => ({...p, firstName: e.target.value}))} placeholder="John" required className="bg-white/6 border border-white/12 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-accent transition-colors" /></div>
              <div className="flex flex-col gap-2"><label className="text-xs font-semibold uppercase tracking-wider text-white/50">Last Name</label><input value={contactForm.lastName} onChange={e => setContactForm(p => ({...p, lastName: e.target.value}))} placeholder="Smith" required className="bg-white/6 border border-white/12 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-accent transition-colors" /></div>
            </div>
            <div className="flex flex-col gap-2"><label className="text-xs font-semibold uppercase tracking-wider text-white/50">Email</label><input type="email" value={contactForm.email} onChange={e => setContactForm(p => ({...p, email: e.target.value}))} placeholder="john@company.com" required className="bg-white/6 border border-white/12 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-accent transition-colors" /></div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Service Needed</label>
              <div className="relative">
                <div onClick={() => setServicePickerOpen(!servicePickerOpen)} className={`bg-white/6 border rounded-xl px-4 py-3.5 text-sm cursor-pointer flex items-center justify-between ${servicePickerOpen ? 'border-accent' : 'border-white/12'}`}>
                  <span className={selectedServiceLabel ? 'text-white' : 'text-white/40'}>{selectedServiceLabel || 'Select a service...'}</span>
                  <svg viewBox="0 0 24 24" className={`w-4 h-4 stroke-white/40 fill-none stroke-2 transition-transform ${servicePickerOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                {servicePickerOpen && (
                  <div className="absolute top-full mt-1.5 left-0 right-0 bg-[#1a1a1a] border border-accent/20 rounded-xl z-50 overflow-hidden shadow-2xl">
                    {services.map(svc => (
                      <div key={svc.id}>
                        <div className="text-[11px] font-bold tracking-widest uppercase text-accent/55 px-4 py-2 mt-1">{svc.name}</div>
                        {svc.sub_items.map(item => (
                          <div key={item} onClick={() => { setSelectedServiceLabel(item); setServicePickerOpen(false) }} className="px-4 py-2.5 text-sm text-white/70 hover:bg-accent/10 hover:text-white cursor-pointer transition-colors">{item}</div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2"><label className="text-xs font-semibold uppercase tracking-wider text-white/50">Project Details</label><textarea value={contactForm.message} onChange={e => setContactForm(p => ({...p, message: e.target.value}))} placeholder="Tell me about your project, goals, timeline..." required rows={4} className="bg-white/6 border border-white/12 rounded-xl px-4 py-3.5 text-white text-sm outline-none focus:border-accent transition-colors resize-none" /></div>
            <button type="submit" disabled={submittingContact} className="bg-gradient-to-r from-accent to-accent-dark text-white py-4 rounded-full font-bold text-base hover:opacity-85 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(37,99,235,.4)] transition-all disabled:opacity-50">
              {submittingContact ? 'Sending...' : 'Send Message'}
            </button>
            {contactSuccess && <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl">Message sent! I'll get back to you within 24 hours. ✓</div>}
          </form>
        </div>
      </section>

      <footer className="bg-[#080808] py-12 px-[5%] flex justify-between items-center flex-wrap gap-4 border-t border-white/5">
        <div className="font-serif text-xl font-bold text-white cursor-pointer" onClick={() => nav('home')}>Studio<span className="text-accent">·</span>Craft</div>
        <div className="flex gap-6">
          {[['Services', () => {}], ['Work', () => nav('home','portfolio')], ['Reviews', () => nav('reviews')], ['Contact', () => nav('home','contact')]].map(([l, fn]) => (
            <a key={l as string} onClick={fn as () => void} className="text-sm text-white/40 hover:text-accent transition-colors cursor-pointer">{l as string}</a>
          ))}
        </div>
        <div className="text-xs text-white/25">© 2026 Studio Craft. All rights reserved.</div>
      </footer>

      {/* Inquiry Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-lg" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-3xl p-10 max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 w-8 h-8 bg-[#eae9e4] rounded-full flex items-center justify-center text-[#888] hover:text-dark transition-colors text-sm">✕</button>
            <h3 className="font-serif text-2xl font-bold mb-1">{inquireService} — Custom Request</h3>
            <p className="text-[#666] text-sm mb-6">Describe what you need and I'll get back to you with a custom quote.</p>
            <div className="flex flex-col gap-4">
              <input placeholder="Describe your custom need..." className="px-4 py-3.5 border border-black/12 rounded-xl text-sm outline-none focus:border-accent transition-colors w-full" />
              <input type="email" placeholder="Your email address" className="px-4 py-3.5 border border-black/12 rounded-xl text-sm outline-none focus:border-accent transition-colors w-full" />
              <button onClick={() => { setModalOpen(false); showToast('Request sent! We will be in touch soon.') }} className="bg-dark text-white py-3.5 rounded-full font-semibold text-base hover:bg-accent transition-colors">Send Request</button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-lg" onClick={() => setReviewModalOpen(false)}>
          <div className="bg-white rounded-3xl p-10 max-w-lg w-full relative max-h-[88vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button onClick={() => setReviewModalOpen(false)} className="absolute top-4 right-4 w-8 h-8 bg-[#eae9e4] rounded-full flex items-center justify-center text-[#888] text-sm">✕</button>
            <h3 className="font-serif text-2xl font-bold mb-1">Share Your Experience</h3>
            <p className="text-[#666] text-sm mb-6">We'd love to hear about your experience with Studio Craft.</p>
            <div className="flex flex-col gap-4">
              <input value={reviewForm.name} onChange={e => setReviewForm(p => ({...p, name: e.target.value}))} placeholder="Your full name" className="px-4 py-3.5 border border-black/12 rounded-xl text-sm outline-none focus:border-accent transition-colors w-full" />
              <input value={reviewForm.role} onChange={e => setReviewForm(p => ({...p, role: e.target.value}))} placeholder="Your role & company (e.g. CEO, Acme Inc.)" className="px-4 py-3.5 border border-black/12 rounded-xl text-sm outline-none focus:border-accent transition-colors w-full" />
              <div>
                <div className="text-xs font-semibold text-[#666] mb-2">Rating</div>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(n => <span key={n} onClick={() => setStarRating(n)} className={`text-2xl cursor-pointer transition-colors ${n <= starRating ? 'text-accent' : 'text-gray-200'}`}>★</span>)}
                </div>
              </div>
              <textarea value={reviewForm.text} onChange={e => setReviewForm(p => ({...p, text: e.target.value}))} placeholder="Tell us about your experience..." rows={4} className="px-4 py-3.5 border border-black/12 rounded-xl text-sm outline-none focus:border-accent transition-colors resize-none w-full" />
              <button onClick={handleReviewSubmit} className="bg-dark text-white py-3.5 rounded-full font-semibold text-base hover:bg-accent transition-colors">Submit Review</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-dark border border-green-500/30 text-green-400 text-sm px-5 py-3 rounded-xl shadow-2xl animate-fadeUp flex items-center gap-2">
          ✓ {toast}
        </div>
      )}
    </>
  )
}

// ===== REVIEWS PAGE VIEW =====
function ReviewsView({ reviews, onBack, onAddReview, reviewModal, setReviewModal, starRating, setStarRating, reviewForm, setReviewForm, onSubmitReview }: {
  reviews: Review[]; onBack: () => void; onAddReview: () => void; reviewModal: boolean; setReviewModal: (v: boolean) => void;
  starRating: number; setStarRating: (n: number) => void;
  reviewForm: { name: string; role: string; text: string; avatar: string };
  setReviewForm: (fn: (p: { name: string; role: string; text: string; avatar: string }) => { name: string; role: string; text: string; avatar: string }) => void;
  onSubmitReview: () => void
}) {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[1000] h-[72px] flex items-center justify-between px-[5%] backdrop-blur-xl bg-[rgba(245,244,240,0.88)] border-b border-accent/10">
        <div className="font-serif text-[1.4rem] font-bold text-dark cursor-pointer" onClick={onBack}>Studio<span className="text-accent">·</span>Craft</div>
        <button onClick={onBack} className="text-sm font-medium text-dark hover:text-accent transition-colors">← Back</button>
      </nav>

      <div className="bg-dark pt-[calc(72px+5rem)] pb-20 px-[5%] text-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(37,99,235,.18) 0%, transparent 70%)' }} />
        <div className="relative z-10">
          <span className="block text-xs font-bold tracking-[0.18em] uppercase mb-4" style={{ color: 'rgba(37,99,235,.8)' }}>Client Testimonials</span>
          <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] font-bold text-white leading-[1.05] mb-4">Every project,<br /><em className="italic text-accent">a story told</em></h1>
          <p className="text-white/55 text-lg max-w-lg mx-auto mb-8">Real words from real clients. These are the relationships and results that define Studio Craft.</p>
          <button onClick={onAddReview} className="inline-flex items-center gap-2 bg-accent text-white px-8 py-3.5 rounded-full font-semibold hover:bg-accent-dark transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-white fill-none stroke-2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            Share Your Review
          </button>
        </div>
      </div>

      <div className="py-8 px-[5%] bg-dark border-b border-white/5">
        <div className="flex items-center justify-center gap-8 flex-wrap">
          <div className="text-center"><div className="font-serif text-5xl font-bold text-accent">4.9</div><div className="text-white/40 text-sm">Average Rating</div></div>
          <div className="w-px h-12 bg-white/10" />
          <div className="text-center"><div className="font-serif text-5xl font-bold text-accent">100%</div><div className="text-white/40 text-sm">Would recommend</div></div>
          <div className="w-px h-12 bg-white/10" />
          <div className="text-center"><div className="font-serif text-5xl font-bold text-accent">{reviews.length}+</div><div className="text-white/40 text-sm">Verified reviews</div></div>
        </div>
      </div>

      <div className="py-16 px-[5%] grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map(r => (
          <div key={r.id} className="bg-white rounded-[18px] p-8 border border-black/6 hover:-translate-y-1 hover:shadow-xl transition-all">
            <div className="text-accent text-base mb-4">{'★'.repeat(r.rating)}</div>
            <p className="text-[#666] text-sm leading-[1.7] italic mb-6">"{r.review_text}"</p>
            <div className="flex items-center gap-3">
              {r.avatar_url
                ? <img src={r.avatar_url} alt={r.name} className="w-11 h-11 rounded-full object-cover border-2 border-accent/25" />
                : <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{getInitials(r.name)}</div>
              }
              <div>
                <div className="font-semibold text-sm">{r.name}</div>
                <div className="text-xs text-[#888]">{[r.role, r.company].filter(Boolean).join(', ')}</div>
              </div>
            </div>
          </div>
        ))}
        <div onClick={onAddReview} className="bg-accent/5 border-2 border-dashed border-accent/25 rounded-[18px] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent/10 hover:border-accent transition-all min-h-[200px]">
          <span className="text-4xl mb-3 text-accent">+</span>
          <span className="font-semibold text-accent-dark text-sm">Add Your Review</span>
          <small className="text-xs text-[#888] mt-1">Share your experience</small>
        </div>
      </div>

      {reviewModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-lg" onClick={() => setReviewModal(false)}>
          <div className="bg-white rounded-3xl p-10 max-w-lg w-full relative max-h-[88vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button onClick={() => setReviewModal(false)} className="absolute top-4 right-4 w-8 h-8 bg-[#eae9e4] rounded-full flex items-center justify-center text-[#888] text-sm">✕</button>
            <h3 className="font-serif text-2xl font-bold mb-1">Share Your Experience</h3>
            <p className="text-[#666] text-sm mb-6">We'd love to hear about your experience.</p>
            <div className="flex flex-col gap-4">
              <input value={reviewForm.name} onChange={e => setReviewForm(p => ({...p, name: e.target.value}))} placeholder="Your full name" className="px-4 py-3.5 border border-black/12 rounded-xl text-sm outline-none focus:border-accent w-full" />
              <input value={reviewForm.role} onChange={e => setReviewForm(p => ({...p, role: e.target.value}))} placeholder="Role & company" className="px-4 py-3.5 border border-black/12 rounded-xl text-sm outline-none focus:border-accent w-full" />
              <div className="flex gap-1">
                {[1,2,3,4,5].map(n => <span key={n} onClick={() => setStarRating(n)} className={`text-2xl cursor-pointer ${n <= starRating ? 'text-accent' : 'text-gray-200'}`}>★</span>)}
              </div>
              <textarea value={reviewForm.text} onChange={e => setReviewForm(p => ({...p, text: e.target.value}))} placeholder="Your review..." rows={4} className="px-4 py-3.5 border border-black/12 rounded-xl text-sm outline-none focus:border-accent resize-none w-full" />
              <button onClick={onSubmitReview} className="bg-dark text-white py-3.5 rounded-full font-semibold hover:bg-accent transition-colors">Submit Review</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
