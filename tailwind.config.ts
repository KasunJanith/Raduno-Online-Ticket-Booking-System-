import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {      colors: {
        maroon: {
          DEFAULT: '#800000',
          light: '#9B1B1B',
          dark: '#6B0101',
          50: '#f5f1f1',
          100: '#e8dede',
          200: '#d1bcbc',
          500: '#800000',
          600: '#6B0101',
          700: '#5a0000',
        },
        gold: {
          DEFAULT: '#FFD700',
          light: '#FFEA70',
          dark: '#C5A700',
          50: '#fffbf0',
          100: '#fff7e0',
          400: '#ffd700',
          500: '#FFD700',
          600: '#E6B800',
        },
        black: {
          DEFAULT: '#111111',
          card: '#1A1A1A',
          lighter: '#2a2a2a',
          50: '#f5f5f5',
          100: '#e5e5e5',
          800: '#1a1a1a',
          900: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      animation: {
        'bounce-in': 'bounceIn 0.6s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'spin-gold': 'spinGold 2s linear infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'success-check': 'successCheck 0.6s ease-out',
      },
      keyframes: {
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        spinGold: {
          '0%': { transform: 'rotate(0deg)', borderColor: '#FFD700' },
          '100%': { transform: 'rotate(360deg)', borderColor: '#C5A700' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 215, 0, 0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(255, 215, 0, 0)' },
        },
        successCheck: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;