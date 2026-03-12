import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { SettingsMap, SiteSetting } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function settingsToMap(settings: SiteSetting[]): SettingsMap {
  return settings.reduce((acc, s) => {
    acc[s.key] = s.value ?? ''
    return acc
  }, {} as SettingsMap)
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function getInitials(name: string) {
  return name.split(' ').map(n => n[0] ?? '').join('').toUpperCase().slice(0, 2)
}
