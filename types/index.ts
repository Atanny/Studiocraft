export interface SiteSetting {
  id: string
  key: string
  value: string | null
  updated_at: string
}

export interface Service {
  id: string
  name: string
  description: string | null
  category_tags: string[]
  sub_items: string[]
  icon_type: string
  is_visible: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Portfolio {
  id: string
  title: string
  category: string
  tags: string[]
  description: string | null
  image_url: string | null
  status: 'published' | 'draft'
  color_class: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  first_name: string
  last_name: string
  email: string
  service: string
  budget: string | null
  message: string
  status: 'new' | 'replied' | 'archived'
  replied_at: string | null
  created_at: string
}

export interface Review {
  id: string
  name: string
  role: string | null
  company: string | null
  review_text: string
  rating: number
  avatar_url: string | null
  source: 'client' | 'admin'
  is_visible: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface VisualStrip {
  id: string
  label: string
  image_url: string
  sort_order: number
  updated_at: string
}

export type SettingsMap = Record<string, string>
