'use client'
import { useEffect, useState } from 'react'
import { X, CheckCircle, Trash2, Pencil, Eye, Reply, Plus, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

// ===== TOAST =====
export function useToast() {
  const [toast, setToast] = useState<{ msg: string; type?: 'success' | 'error' } | null>(null)

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  return { toast, showToast }
}

export function Toast({ toast }: { toast: { msg: string; type?: 'success' | 'error' } | null }) {
  if (!toast) return null
  return (
    <div className={cn(
      'fixed bottom-6 right-6 z-[9999] flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl animate-[slideIn_0.3s_ease]',
      toast.type === 'error'
        ? 'bg-[#141414] border border-red-500/30 text-red-400'
        : 'bg-[#141414] border border-green-500/30 text-green-400'
    )}>
      {toast.type === 'error' ? <AlertTriangle size={15} /> : <CheckCircle size={15} />}
      {toast.msg}
    </div>
  )
}

// ===== MODAL =====
export function Modal({
  open, onClose, title, children
}: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 bg-white/8 rounded-full flex items-center justify-center text-white/40 hover:text-white/80 transition-colors">
          <X size={14} />
        </button>
        <h2 className="font-serif text-lg font-bold text-white mb-5">{title}</h2>
        {children}
      </div>
    </div>
  )
}

// ===== ICON BUTTONS =====
export function ViewReplyBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} title="View & Reply" className="icon-btn bg-blue-500/15 text-blue-400 hover:bg-blue-500/25">
      <Eye size={14} />
    </button>
  )
}

export function EditBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} title="Edit" className="icon-btn bg-amber-500/15 text-amber-400 hover:bg-amber-500/25">
      <Pencil size={14} />
    </button>
  )
}

export function DeleteBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} title="Delete" className="icon-btn bg-red-500/12 text-red-400 hover:bg-red-500/22">
      <Trash2 size={14} />
    </button>
  )
}

// ===== FIELD =====
export function Field({
  label, children, className
}: {
  label: string; children: React.ReactNode; className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-[11px] font-bold uppercase tracking-wider text-white/40">{label}</label>
      {children}
    </div>
  )
}

// ===== INPUT =====
export const inputCls = 'bg-[#1c1c1c] border border-white/10 rounded-lg px-3 py-2.5 text-white/90 text-sm outline-none focus:border-accent transition-colors font-sans w-full'

// ===== STATUS BADGE =====
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: 'bg-blue-500/15 text-blue-400',
    replied: 'bg-green-500/12 text-green-400',
    archived: 'bg-white/8 text-white/40',
    published: 'bg-green-500/12 text-green-400',
    draft: 'bg-white/8 text-white/40',
    live: 'bg-green-500/12 text-green-400',
    hidden: 'bg-white/8 text-white/40',
  }
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', map[status] ?? 'bg-white/8 text-white/40')}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// ===== PAGE HEADER =====
export function PageHeader({
  title, desc, action
}: {
  title: string; desc?: string; action?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">{title}</h1>
        {desc && <p className="text-white/40 text-sm mt-0.5">{desc}</p>}
      </div>
      {action}
    </div>
  )
}

// ===== PRIMARY BUTTON =====
export function PrimaryBtn({
  onClick, children, type = 'button', loading = false, className
}: {
  onClick?: () => void; children: React.ReactNode; type?: 'button' | 'submit'; loading?: boolean; className?: string
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={cn(
        'bg-gradient-to-r from-accent to-accent-dark text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:opacity-85 transition-opacity disabled:opacity-50 flex items-center gap-2 font-sans',
        className
      )}
    >
      {loading && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
      {children}
    </button>
  )
}

// ===== NEW SERVICE / ADD BUTTON =====
export function AddBtn({ onClick, label = 'Add New' }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-accent/12 border border-accent/30 text-accent px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent/20 transition-all"
    >
      <Plus size={15} />
      {label}
    </button>
  )
}

// ===== PANEL =====
export function Panel({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-[#141414] border border-white/7 rounded-2xl p-5 mb-5', className)}>
      {title && <div className="font-semibold text-white/80 text-sm mb-4">{title}</div>}
      {children}
    </div>
  )
}
