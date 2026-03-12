import type { Service, Portfolio, Review, VisualStrip, SettingsMap } from '@/types'

export const FALLBACK_SETTINGS: SettingsMap = {
  studio_name: 'Studio Craft',
  tagline: 'Design That Speaks',
  email: 'hello@studiocraft.design',
  phone: '',
  location: '',
  availability: 'Open to Projects',
  hero_headline: 'Design that moves people forward',
  hero_subtext: 'Premium UI/UX, Branding, and Print design for ambitious brands. From concept to pixel-perfect execution.',
  hero_cta_primary: 'Start a Project',
  hero_cta_secondary: 'View Portfolio',
  show_testimonials: 'true',
  show_portfolio: 'true',
  show_process: 'true',
  maintenance_mode: 'false',
  seo_title: 'Studio Craft – Design That Speaks',
  seo_description: 'Premium UI/UX design, branding, and print services.',
  seo_keywords: 'UI UX design, branding, logo design, freelance designer',
}

export const FALLBACK_SERVICES: Service[] = [
  {
    id: '1', name: 'UI / UX Design',
    description: 'Thoughtful interfaces that balance beauty and usability. Experiences users love and return to.',
    category_tags: ['UI Design', 'UX Research', 'Wireframing', 'Prototyping'],
    sub_items: ['Mobile Design', 'Web App', 'Landing Page', 'Dashboard'],
    icon_type: 'grid', is_visible: true, sort_order: 1,
    created_at: '', updated_at: '',
  },
  {
    id: '2', name: 'Branding',
    description: 'Identities that stick. From the first mark to complete brand systems with lasting impact.',
    category_tags: ['Strategy', 'Visual Identity', 'Typography', 'Color Systems'],
    sub_items: ['Logo Design', 'Mockups', 'Brand Guidelines', 'Patterns'],
    icon_type: 'layers', is_visible: true, sort_order: 2,
    created_at: '', updated_at: '',
  },
  {
    id: '3', name: 'Posters & Print',
    description: 'Designs that translate beautifully from screen to physical. Print pieces that command attention.',
    category_tags: ['Print-Ready', 'Vector Art', 'CMYK', 'High-Res'],
    sub_items: ['Pubmats', 'Ads', 'Vector Poster', 'Notebook Design'],
    icon_type: 'file-text', is_visible: true, sort_order: 3,
    created_at: '', updated_at: '',
  },
]

export const FALLBACK_PORTFOLIO: Portfolio[] = [
  { id: '1', title: 'Velora Mobile App', category: 'UI/UX Design', tags: ['Mobile', 'iOS'], description: 'A clean mobile banking experience.', image_url: null, status: 'published', color_class: 'pc1', sort_order: 1, created_at: '', updated_at: '' },
  { id: '2', title: 'Ember Brand Identity', category: 'Branding', tags: ['Logo', 'Brand System'], description: 'Complete brand overhaul.', image_url: null, status: 'published', color_class: 'pc2', sort_order: 2, created_at: '', updated_at: '' },
  { id: '3', title: 'Clarity Dashboard', category: 'UI/UX Design', tags: ['SaaS', 'Dashboard'], description: 'Data-rich analytics dashboard.', image_url: null, status: 'published', color_class: 'pc3', sort_order: 3, created_at: '', updated_at: '' },
  { id: '4', title: 'Cosmos Landing Page', category: 'UI/UX Design', tags: ['Landing Page'], description: 'High-converting SaaS landing page.', image_url: null, status: 'published', color_class: 'pc5', sort_order: 4, created_at: '', updated_at: '' },
  { id: '5', title: 'Noire Collection', category: 'Branding', tags: ['Fashion', 'Luxury'], description: 'Luxury fashion brand identity.', image_url: null, status: 'published', color_class: 'pc4', sort_order: 5, created_at: '', updated_at: '' },
  { id: '6', title: 'Soleil Print Series', category: 'Print', tags: ['Poster', 'Events'], description: 'Art exhibition poster series.', image_url: null, status: 'published', color_class: 'pc6', sort_order: 6, created_at: '', updated_at: '' },
]

export const FALLBACK_REVIEWS: Review[] = [
  { id: '1', name: 'Marco Rivera', role: 'CEO', company: 'Velora Inc.', review_text: 'The brand identity exceeded every expectation. Our customers immediately recognized the premium quality — sales went up 40% after the rebrand.', rating: 5, avatar_url: null, source: 'admin', is_visible: true, is_featured: true, created_at: '', updated_at: '' },
  { id: '2', name: 'Sofia Lim', role: 'Product Manager', company: 'Clarity', review_text: 'Absolutely incredible UI work. Our app retention improved dramatically after the redesign. The attention to detail is unmatched.', rating: 5, avatar_url: null, source: 'admin', is_visible: true, is_featured: true, created_at: '', updated_at: '' },
  { id: '3', name: 'James Kwon', role: 'Creative Director', company: 'Noire', review_text: 'Our event materials looked stunning. The poster and pubmat designs created so much buzz. Will definitely work together again!', rating: 5, avatar_url: null, source: 'admin', is_visible: true, is_featured: true, created_at: '', updated_at: '' },
  { id: '4', name: 'David Tan', role: 'Marketing Lead', company: 'Apex', review_text: 'Delivered our landing page ahead of schedule. Our bounce rate dropped 30% in the first week — the conversion-focused design made all the difference.', rating: 5, avatar_url: null, source: 'admin', is_visible: true, is_featured: false, created_at: '', updated_at: '' },
  { id: '5', name: 'Lena Mora', role: 'Co-Founder', company: 'Klave', review_text: 'The logo and brand kit gave us instant credibility. We closed our seed round two weeks after the rebrand launched.', rating: 5, avatar_url: null, source: 'admin', is_visible: true, is_featured: false, created_at: '', updated_at: '' },
]

export const FALLBACK_STRIP: VisualStrip[] = [
  { id: '1', label: 'UI Design', image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=700&q=85&auto=format&fit=crop', sort_order: 1, updated_at: '' },
  { id: '2', label: 'Branding', image_url: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=700&q=85&auto=format&fit=crop', sort_order: 2, updated_at: '' },
  { id: '3', label: 'Print', image_url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=700&q=85&auto=format&fit=crop', sort_order: 3, updated_at: '' },
  { id: '4', label: 'Mobile', image_url: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=700&q=85&auto=format&fit=crop', sort_order: 4, updated_at: '' },
]
