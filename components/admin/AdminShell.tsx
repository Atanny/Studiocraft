'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, Mail, Briefcase, Layers, Star,
  Search, Settings, LogOut, Menu, X, ExternalLink
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, group: 'Main' },
  { href: '/admin/messages', label: 'Messages', icon: Mail, group: 'Main', badge: true },
  { href: '/admin/portfolio', label: 'Portfolio', icon: Briefcase, group: 'Main' },
  { href: '/admin/services', label: 'Services', icon: Layers, group: 'Manage' },
  { href: '/admin/reviews', label: 'Testimonials', icon: Star, group: 'Manage' },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings, group: 'Settings' },
]

export default function AdminShell({
  children,
  unreadCount,
}: {
  children: React.ReactNode
  unreadCount: number
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const groups = ['Main', 'Manage', 'Settings']

  const SidebarContent = () => (
    <>
      <div className="p-6 pb-4 border-b border-white/7">
        <div className="font-serif text-lg font-bold text-white">
          Studio<span className="text-accent">·</span>Craft
        </div>
        <div className="text-[11px] text-white/35 mt-0.5">Admin Panel v2.0</div>
      </div>

      <nav className="flex-1 py-3 overflow-y-auto">
        {groups.map(group => (
          <div key={group}>
            <div className="text-[10px] font-bold tracking-widest uppercase text-white/30 px-6 py-2 mt-2">
              {group}
            </div>
            {navItems.filter(i => i.group === group).map(item => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`adm-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  <span>{item.label}</span>
                  {item.badge && unreadCount > 0 && (
                    <span className="ml-auto bg-accent text-white text-[10px] font-bold rounded-full px-2 py-0.5">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/7 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          SC
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white/90 truncate">Studio Admin</div>
          <div className="text-xs text-white/35">Administrator</div>
        </div>
        <button onClick={handleLogout} className="text-white/30 hover:text-red-400 transition-colors" title="Logout">
          <LogOut size={15} />
        </button>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-[#0d0d0d]">
      {/* Desktop sidebar */}
      <aside className="w-60 bg-[#141414] border-r border-white/7 fixed left-0 top-0 h-full flex flex-col z-50 hidden lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-60 bg-[#141414] border-r border-white/7 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="lg:ml-60 flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <div className="sticky top-0 z-40 bg-[#0d0d0d]/92 backdrop-blur-xl border-b border-white/7 px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-white/50 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-semibold text-white/90 capitalize">
              {pathname === '/admin' ? 'Dashboard' : pathname.split('/').pop()?.replace(/-/g, ' ')}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-white/40 hover:text-accent text-xs px-3 py-1.5 rounded-lg border border-white/7 hover:border-accent/30 transition-all bg-white/3"
            >
              <ExternalLink size={12} />
              View Site
            </a>
          </div>
        </div>

        <div className="p-6 flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}
