import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      colors: {
        accent: '#2563eb',
        'accent-dark': '#1d4ed8',
        'accent-light': 'rgba(37,99,235,0.12)',
        dark: '#0d0d0d',
        surface: '#141414',
        surface2: '#1c1c1c',
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        fadeUp: 'fadeUp 0.8s ease both',
        fadeIn: 'fadeIn 0.4s ease both',
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        fadeUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
      },
    },
  },
  plugins: [],
}
export default config
