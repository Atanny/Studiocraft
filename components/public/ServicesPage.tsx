'use client'
import Link from 'next/link'
import type { Service } from '@/types'

const icons: Record<string, React.ReactNode> = {
  grid: <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-white fill-none stroke-2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  layers: <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-white fill-none stroke-2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  'file-text': <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-white fill-none stroke-2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>,
}

export default function ServicesPage({ services }: { services: Service[] }) {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[1000] h-[72px] flex items-center justify-between px-[5%] backdrop-blur-xl bg-[rgba(245,244,240,0.88)] border-b border-[rgba(37,99,235,.1)]">
        <Link href="/" className="font-serif text-[1.4rem] font-bold text-dark no-underline">Studio<span className="text-accent">·</span>Craft</Link>
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/services" className="text-sm font-semibold text-accent">Services</Link>
          <Link href="/#portfolio" className="text-sm font-medium text-dark hover:text-accent transition-colors">Portfolio</Link>
          <Link href="/reviews" className="text-sm font-medium text-dark hover:text-accent transition-colors">Reviews</Link>
          <Link href="/#contact" className="text-sm font-medium bg-dark text-white px-5 py-2 rounded-full hover:bg-accent transition-colors">Contact</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-dark pt-[calc(72px+5rem)] pb-20 px-[5%] text-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(37,99,235,.18) 0%, transparent 70%)' }} />
        <div className="relative z-10">
          <span className="block text-xs font-bold tracking-[0.18em] uppercase mb-4 text-accent/80">What I Offer</span>
          <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] font-bold text-white leading-[1.05] mb-4">
            Services built for<br /><em className="italic text-accent">ambitious</em> brands
          </h1>
          <p className="text-white/55 text-lg max-w-lg mx-auto">Three core disciplines, infinite possibilities. Every service is crafted with the same commitment to quality.</p>
        </div>
      </div>

      {/* Services Grid */}
      <section className="py-24 px-[5%] bg-white">
        <div className="text-center mb-12">
          <span className="block text-xs font-bold tracking-[0.18em] uppercase text-accent-dark mb-3">All Services</span>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold">Choose your discipline</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(svc => (
            <div key={svc.id} className="bg-[#f5f4f0] rounded-2xl p-10 border border-black/6 hover:bg-white hover:shadow-[0_16px_48px_rgba(37,99,235,.1)] hover:-translate-y-1 transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent to-accent-dark scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <div className="w-14 h-14 bg-gradient-to-br from-accent to-accent-dark rounded-xl flex items-center justify-center mb-6">
                {icons[svc.icon_type] ?? icons.grid}
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">{svc.name}</h3>
              <p className="text-[#666] text-sm leading-[1.7] mb-6">{svc.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {[...svc.category_tags, ...svc.sub_items].map(t => (
                  <span key={t} className="text-xs font-semibold px-3 py-1 bg-white rounded-full text-dark border border-black/6">{t}</span>
                ))}
              </div>
              <Link href={`/?service=${encodeURIComponent(svc.name)}#contact`}>
                <button className="bg-dark text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-accent transition-colors flex items-center gap-2">
                  Inquire →
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-[5%] bg-[#f5f4f0]">
        <div className="text-center mb-12">
          <span className="block text-xs font-bold tracking-[0.18em] uppercase text-accent-dark mb-3">Common Questions</span>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold">What you might want to know</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            ['How long does a project take?', 'Timelines vary by scope. Landing pages: 3–5 days. Brand identities: 1–2 weeks. Full UI/UX projects: 2–6 weeks. Every project gets a detailed timeline upfront.'],
            ['What does the process look like?', 'Discovery → Strategy → Execution → Delivery. You\'re kept in the loop with regular updates and have revision rounds built into every package.'],
            ['What tools do you use?', 'Figma for UI/UX and prototyping, Adobe Illustrator & Photoshop for branding and print, with handoff-ready files in any format you need.'],
            ['Do you offer revisions?', 'Yes. Every project includes structured revision rounds. Feedback is collected at key milestones so nothing gets lost in translation.'],
          ].map(([q, a]) => (
            <div key={q} className="bg-white rounded-2xl p-8 border border-black/6">
              <h4 className="font-serif text-lg font-semibold mb-3">{q}</h4>
              <p className="text-[#666] text-sm leading-[1.7]">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-dark py-20 px-[5%] text-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(37,99,235,.2) 0%, transparent 70%)' }} />
        <div className="relative z-10">
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] text-white mb-4">Ready to start something?</h2>
          <p className="text-white/50 mb-8">Let's talk about your project and find the right service for your needs.</p>
          <Link href="/#contact">
            <button className="bg-gradient-to-r from-accent to-accent-dark text-white px-10 py-4 rounded-full font-bold hover:opacity-85 transition-opacity">
              Start a Project →
            </button>
          </Link>
        </div>
      </div>

      <footer className="bg-[#080808] py-10 px-[5%] flex justify-between items-center flex-wrap gap-4 border-t border-white/5">
        <Link href="/" className="font-serif text-xl font-bold text-white">Studio<span className="text-accent">·</span>Craft</Link>
        <div className="flex gap-6">
          <Link href="/services" className="text-sm text-white/40 hover:text-accent transition-colors">Services</Link>
          <Link href="/" className="text-sm text-white/40 hover:text-accent transition-colors">Work</Link>
          <Link href="/reviews" className="text-sm text-white/40 hover:text-accent transition-colors">Reviews</Link>
          <Link href="/#contact" className="text-sm text-white/40 hover:text-accent transition-colors">Contact</Link>
        </div>
        <div className="text-xs text-white/25">© 2026 Studio Craft. All rights reserved.</div>
      </footer>
    </>
  )
}
