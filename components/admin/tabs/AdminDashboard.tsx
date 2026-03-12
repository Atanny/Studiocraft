'use client'
import Link from 'next/link'
import { Mail, Briefcase, Star, TrendingUp, Eye } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Panel, StatusBadge, ViewReplyBtn, PageHeader } from '@/components/admin/AdminUI'
import type { Message } from '@/types'

export default function AdminDashboard({
  totalMessages, newMessages, portfolioCount, avgRating, reviewCount, recentMessages
}: {
  totalMessages: number
  newMessages: number
  portfolioCount: number
  avgRating: string
  reviewCount: number
  recentMessages: Message[]
}) {
  const stats = [
    { icon: Mail, val: totalMessages, label: 'Total Messages', sub: `${newMessages} new`, color: 'text-blue-400' },
    { icon: Briefcase, val: portfolioCount, label: 'Portfolio Projects', sub: 'Published & drafts', color: 'text-purple-400' },
    { icon: Star, val: avgRating, label: 'Avg Rating', sub: `From ${reviewCount} reviews`, color: 'text-amber-400' },
    { icon: TrendingUp, val: '87', label: 'SEO Score', sub: '↑ 12 pts this month', color: 'text-green-400' },
  ]

  return (
    <div>
      <PageHeader title="Good morning, Admin 👋" desc="Here's what's happening with Studio Craft today." />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-[#141414] border border-white/7 rounded-2xl p-5 relative overflow-hidden hover:border-accent/20 transition-colors group">
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent to-transparent opacity-40" />
              <Icon size={20} className={`${s.color} mb-3`} />
              <div className="font-serif text-3xl font-bold text-white">{s.val}</div>
              <div className="text-xs text-white/40 mt-1">{s.label}</div>
              <div className="text-xs text-green-400 mt-1">{s.sub}</div>
            </div>
          )
        })}
      </div>

      {/* Chart placeholder + donut */}
      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <Panel title="Messages per Month" className="lg:col-span-2 mb-0">
          <div className="flex items-end gap-2 h-28 pb-5">
            {[40, 55, 35, 70, 60, 90].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-accent/15 hover:bg-accent/30 transition-colors cursor-pointer"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[10px] text-white/30">{['Oct','Nov','Dec','Jan','Feb','Mar'][i]}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Services" className="mb-0">
          <div className="flex flex-col items-center gap-3">
            <svg width="90" height="90" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(37,99,235,.15)" strokeWidth="16"/>
              <circle cx="50" cy="50" r="35" fill="none" stroke="#2563eb" strokeWidth="16" strokeDasharray="88 132"/>
              <circle cx="50" cy="50" r="35" fill="none" stroke="#60a5fa" strokeWidth="16" strokeDasharray="55 165" strokeDashoffset="-88"/>
              <circle cx="50" cy="50" r="35" fill="none" stroke="#4ade80" strokeWidth="16" strokeDasharray="77 143" strokeDashoffset="-143"/>
            </svg>
            <div className="w-full flex flex-col gap-1">
              {[['#2563eb','UI/UX 40%'],['#60a5fa','Branding 35%'],['#4ade80','Print 25%']].map(([c,l]) => (
                <div key={l} className="flex items-center gap-2 text-xs text-white/60">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c }} />
                  {l}
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* Recent messages */}
      <Panel title="">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-white/80 text-sm">Recent Messages</div>
          <Link href="/admin/messages" className="text-xs text-accent hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {['From','Service','Preview','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white/30 border-b border-white/5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentMessages.map(m => (
                <tr key={m.id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                  <td className="px-3 py-3">
                    <div className="font-semibold text-white/90 text-sm">{m.first_name} {m.last_name}</div>
                    <div className="text-xs text-white/35">{m.email}</div>
                  </td>
                  <td className="px-3 py-3 text-sm text-white/60">{m.service}</td>
                  <td className="px-3 py-3 text-sm text-white/50 max-w-[180px] truncate">{m.message}</td>
                  <td className="px-3 py-3"><StatusBadge status={m.status} /></td>
                  <td className="px-3 py-3">
                    <Link href="/admin/messages">
                      <button className="icon-btn bg-blue-500/15 text-blue-400 hover:bg-blue-500/25">
                        <Eye size={14} />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
              {recentMessages.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-8 text-center text-white/30 text-sm">No messages yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
