import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600'],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Studio Craft – Design That Speaks',
  description: 'Premium UI/UX design, branding, and print services. Elevating brands through thoughtful, strategic design.',
  keywords: 'UI UX design, mobile design, web app, landing page, branding, logo design, freelance designer',
  openGraph: {
    title: 'Studio Craft – Design That Speaks',
    description: 'Premium freelance design studio offering UI/UX, Branding, and Print services.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="font-sans bg-[#f5f4f0] text-[#1a1a1a] overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
