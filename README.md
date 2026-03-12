# Studio Craft — Full-Stack Next.js App

Premium design portfolio with live database, admin panel, and Supabase auth.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Hosting | Vercel |

---

## 🚀 Setup in 10 Minutes

### Step 1 — Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Choose a region close to your users
3. Save your database password

### Step 2 — Run the Database Schema

1. In your Supabase dashboard → **SQL Editor**
2. Copy and paste the entire contents of `supabase/schema.sql`
3. Click **Run**

### Step 3 — Create Storage Bucket

1. In Supabase → **Storage** → **New Bucket**
2. Name it: `studio-uploads`
3. Check **Public bucket** ✓
4. Click **Create bucket**

### Step 4 — Create Admin User

1. In Supabase → **Authentication** → **Users** → **Invite User**
2. Enter your admin email (e.g. `admin@studiocraft.design`)
3. Set a strong password
4. The user is now your admin account

### Step 5 — Get API Keys

In Supabase → **Project Settings** → **API**:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY`

### Step 6 — Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_ADMIN_EMAIL=admin@studiocraft.design
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 7 — Run Locally

```bash
npm install
npm run dev
```

Visit:
- **Public site**: http://localhost:3000
- **Services page**: http://localhost:3000/services
- **Reviews page**: http://localhost:3000/reviews
- **Admin panel**: http://localhost:3000/admin

---

## 🌐 Deploy to Vercel

### Option A — Vercel CLI (Recommended)

```bash
npm install -g vercel
vercel
# Follow the prompts
```

Then add environment variables:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_SITE_URL
```

### Option B — GitHub + Vercel Dashboard

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. In **Environment Variables**, add all 4 variables from Step 5
5. Click **Deploy**

### After Deployment

Update your `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

Re-deploy for the change to take effect.

---

## 🏗️ Project Structure

```
studiocraft/
├── app/
│   ├── page.tsx              # Homepage (SSR)
│   ├── services/page.tsx     # Services page
│   ├── reviews/page.tsx      # Reviews page
│   ├── admin/
│   │   ├── layout.tsx        # Admin auth check
│   │   ├── login/page.tsx    # Login page
│   │   ├── page.tsx          # Dashboard
│   │   ├── messages/         # Messages management
│   │   ├── portfolio/        # Portfolio management
│   │   ├── services/         # Services management
│   │   ├── reviews/          # Reviews/testimonials
│   │   └── settings/         # Site settings + images
│   └── api/
│       ├── messages/         # Contact form CRUD
│       ├── reviews/          # Reviews CRUD
│       ├── services/         # Services CRUD
│       ├── portfolio/        # Portfolio CRUD
│       ├── settings/         # Site settings CRUD
│       └── upload/           # File upload to Supabase Storage
├── components/
│   ├── admin/
│   │   ├── AdminShell.tsx    # Sidebar layout
│   │   ├── AdminUI.tsx       # Reusable UI components
│   │   ├── LoginForm.tsx     # Auth form
│   │   └── tabs/             # Dashboard, Messages, etc.
│   └── public/
│       ├── PublicSite.tsx    # Main site (homepage + reviews SPA)
│       ├── ServicesPage.tsx  # Services page
│       └── ReviewsPage.tsx   # Reviews page
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Browser Supabase client
│   │   └── server.ts         # Server Supabase client
│   └── utils.ts              # Helpers
├── types/index.ts            # TypeScript types
├── supabase/schema.sql       # Database schema
└── middleware.ts             # Auth protection
```

---

## ✅ Admin Features

| Feature | Status |
|---------|--------|
| **Login** | Supabase Auth (email + password) |
| **Dashboard** | Stats, charts, recent messages |
| **Messages** | View & Reply (combined modal), Delete, Export |
| **Portfolio** | Add/Edit/Delete projects, image upload |
| **Services** | Add/Edit/Delete, visibility toggle, New Service button |
| **Reviews** | Add/Edit/Delete, visibility toggle, featured toggle |
| **Settings** | Site info, hero content, feature toggles, visual strip images, SEO |

## ✅ Public Features

| Feature | Status |
|---------|--------|
| **Homepage** | Dynamic from database |
| **Services page** | `/services` — full service showcase |
| **Reviews page** | `/reviews` — client reviews + submit form |
| **Contact form** | Saves to Supabase messages |
| **Client reviews** | Submit form (pending admin approval) |
| **Visual strip** | Images managed in admin |

---

## 🔐 Security Notes

- Admin routes protected by `middleware.ts` — unauthenticated users redirected to `/admin/login`
- RLS (Row Level Security) enabled on all tables
- Clients can only **insert** reviews with `source = 'client'`, not update/delete
- Service role key is server-only (never exposed to browser)
- File uploads go through a server API route, not direct from browser

---

## 📧 Real Email Replies

The reply feature currently marks messages as "replied" in the database.  
To send real emails, add your SMTP credentials to Site Settings and configure a service like **Resend**, **SendGrid**, or **Nodemailer**.

Recommended: [Resend](https://resend.com) — free tier, easy Next.js integration.
