-- ================================================
-- Studio Craft — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ================================================
-- SITE SETTINGS
-- ================================================
create table if not exists site_settings (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value text,
  updated_at timestamptz default now()
);

insert into site_settings (key, value) values
  ('studio_name', 'Studio Craft'),
  ('tagline', 'Design That Speaks'),
  ('email', 'hello@studiocraft.design'),
  ('phone', ''),
  ('location', ''),
  ('availability', 'Open to Projects'),
  ('hero_headline', 'Design that moves people forward'),
  ('hero_subtext', 'Premium UI/UX, Branding, and Print design for ambitious brands. From concept to pixel-perfect execution.'),
  ('hero_cta_primary', 'Start a Project'),
  ('hero_cta_secondary', 'View Portfolio'),
  ('show_testimonials', 'true'),
  ('show_portfolio', 'true'),
  ('show_process', 'true'),
  ('maintenance_mode', 'false'),
  ('seo_title', 'Studio Craft – Design That Speaks'),
  ('seo_description', 'Premium UI/UX design, branding, and print services. Elevating brands through thoughtful, strategic design.'),
  ('seo_keywords', 'UI UX design, mobile design, web app, landing page, branding, logo design, freelance designer')
on conflict (key) do nothing;

-- ================================================
-- SERVICES
-- ================================================
create table if not exists services (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  category_tags text[] default '{}',
  sub_items text[] default '{}',
  icon_type text default 'grid',
  is_visible boolean default true,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

insert into services (name, description, category_tags, sub_items, icon_type, sort_order) values
  ('UI / UX Design', 'Thoughtful interfaces that balance beauty and usability. Experiences users love and return to.', 
   array['UI Design','UX Research','Wireframing','Prototyping'], 
   array['Mobile Design','Web App','Landing Page','Dashboard'], 'grid', 1),
  ('Branding', 'Identities that stick. From the first mark to complete brand systems with lasting impact.',
   array['Strategy','Visual Identity','Typography','Color Systems'],
   array['Logo Design','Mockups','Brand Guidelines','Patterns'], 'layers', 2),
  ('Posters & Print', 'Designs that translate beautifully from screen to physical. Print pieces that command attention.',
   array['Print-Ready','Vector Art','CMYK','High-Res'],
   array['Pubmats','Ads','Vector Poster','Notebook Design'], 'file-text', 3)
on conflict do nothing;

-- ================================================
-- PORTFOLIO
-- ================================================
create table if not exists portfolio (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text not null,
  tags text[] default '{}',
  description text,
  image_url text,
  status text default 'published' check (status in ('published', 'draft')),
  color_class text default 'pc1',
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

insert into portfolio (title, category, tags, description, status, color_class, sort_order) values
  ('Velora Mobile App', 'UI/UX Design', array['Mobile','iOS','Figma'], 'A clean, intuitive mobile banking experience.', 'published', 'pc1', 1),
  ('Ember Brand Identity', 'Branding', array['Logo','Brand System','Visual Identity'], 'Complete brand overhaul for premium restaurant chain.', 'published', 'pc2', 2),
  ('Clarity Dashboard', 'UI/UX Design', array['SaaS','Dashboard','Web App'], 'Data-rich SaaS analytics dashboard.', 'published', 'pc3', 3),
  ('Noire Collection', 'Branding', array['Fashion','Luxury','Identity'], 'Luxury fashion brand visual identity.', 'draft', 'pc4', 4),
  ('Cosmos Landing Page', 'UI/UX Design', array['Landing Page','Conversion','Web'], 'High-converting SaaS landing page.', 'published', 'pc5', 5),
  ('Soleil Print Series', 'Print', array['Poster','Print','Events'], 'Art exhibition poster series.', 'published', 'pc6', 6)
on conflict do nothing;

-- ================================================
-- MESSAGES (contact form submissions)
-- ================================================
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  email text not null,
  service text not null,
  budget text,
  message text not null,
  status text default 'new' check (status in ('new', 'replied', 'archived')),
  replied_at timestamptz,
  created_at timestamptz default now()
);

-- ================================================
-- REVIEWS / TESTIMONIALS
-- ================================================
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text,
  company text,
  review_text text not null,
  rating int default 5 check (rating between 1 and 5),
  avatar_url text,
  source text default 'client' check (source in ('client', 'admin')),
  is_visible boolean default true,
  is_featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

insert into reviews (name, role, company, review_text, rating, is_featured, source) values
  ('Marco Rivera', 'CEO', 'Velora Inc.', 'The brand identity exceeded every expectation. Our customers immediately recognized the premium quality — sales went up 40% after the rebrand.', 5, true, 'admin'),
  ('Sofia Lim', 'Product Manager', 'Clarity', 'Absolutely incredible UI work. Our app retention improved dramatically after the redesign. The attention to detail is unmatched.', 5, true, 'admin'),
  ('James Kwon', 'Creative Director', 'Noire', 'Our event materials looked stunning. The poster and pubmat designs created so much buzz. Will definitely work together again!', 5, true, 'admin'),
  ('David Tan', 'Marketing Lead', 'Apex', 'Delivered our landing page ahead of schedule with a design that converts. Our bounce rate dropped by 30% in the first week alone.', 5, true, 'admin'),
  ('Lena Mora', 'Co-Founder', 'Klave', 'The logo and brand kit gave us instant credibility with investors. We closed our seed round two weeks after the rebrand launched.', 5, false, 'admin'),
  ('Carlos Perez', 'Events Manager', 'Soleil', 'We hired for a simple pubmat and ended up with a full visual system. The creativity and professionalism throughout was outstanding.', 5, false, 'admin'),
  ('Yuki Nakamura', 'Product Owner', 'Floe App', 'The mobile app design was clean, intuitive, and beautiful. Onboarding completion went up by 55%.', 5, false, 'admin'),
  ('Bella Russo', 'Brand Director', 'Sable Co.', 'Pattern and mockup work was exceptional. The brand guidelines document alone was so thorough our entire team could apply the brand consistently.', 5, false, 'admin')
on conflict do nothing;

-- ================================================
-- VISUAL STRIP IMAGES (admin-managed)
-- ================================================
create table if not exists visual_strip (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  image_url text not null,
  sort_order int default 0,
  updated_at timestamptz default now()
);

insert into visual_strip (label, image_url, sort_order) values
  ('UI Design', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=700&q=85&auto=format&fit=crop', 1),
  ('Branding', 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=700&q=85&auto=format&fit=crop', 2),
  ('Print', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=700&q=85&auto=format&fit=crop', 3),
  ('Mobile', 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=700&q=85&auto=format&fit=crop', 4)
on conflict do nothing;

-- ================================================
-- RLS POLICIES
-- ================================================

-- Site settings: public read, auth write
alter table site_settings enable row level security;
create policy "Public read site_settings" on site_settings for select using (true);
create policy "Auth write site_settings" on site_settings for all using (auth.role() = 'authenticated');

-- Services: public read, auth write
alter table services enable row level security;
create policy "Public read services" on services for select using (true);
create policy "Auth write services" on services for all using (auth.role() = 'authenticated');

-- Portfolio: public read published, auth write all
alter table portfolio enable row level security;
create policy "Public read published portfolio" on portfolio for select using (status = 'published' or auth.role() = 'authenticated');
create policy "Auth write portfolio" on portfolio for all using (auth.role() = 'authenticated');

-- Messages: public insert (contact form), auth read/write
alter table messages enable row level security;
create policy "Public insert messages" on messages for insert with check (true);
create policy "Auth read messages" on messages for select using (auth.role() = 'authenticated');
create policy "Auth update messages" on messages for update using (auth.role() = 'authenticated');
create policy "Auth delete messages" on messages for delete using (auth.role() = 'authenticated');

-- Reviews: public read visible, public insert (client), auth write all
alter table reviews enable row level security;
create policy "Public read visible reviews" on reviews for select using (is_visible = true or auth.role() = 'authenticated');
create policy "Public insert reviews" on reviews for insert with check (source = 'client');
create policy "Auth write reviews" on reviews for all using (auth.role() = 'authenticated');

-- Visual strip: public read, auth write
alter table visual_strip enable row level security;
create policy "Public read visual_strip" on visual_strip for select using (true);
create policy "Auth write visual_strip" on visual_strip for all using (auth.role() = 'authenticated');

-- ================================================
-- STORAGE BUCKET for uploads
-- ================================================
-- Run in Supabase Storage dashboard:
-- Create bucket named: "studio-uploads" (public)
-- Or run: insert into storage.buckets (id, name, public) values ('studio-uploads', 'studio-uploads', true);
