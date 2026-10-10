/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#07070B',
        surface: {
          DEFAULT: '#12121A',
          light: '#1C1C28',
          hover: '#262636',
        },
        line: 'rgba(255, 255, 255, 0.08)',
        neon: {
          lime: '#C6FF3D',
          pink: '#FF2E93',
          purple: '#8B5CF6',
          cyan: '#00F0FF',
          amber: '#FFB800',
        },
        dim: '#9494A8',
        faint: '#5E5E72',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-lime': '0 0 25px -4px rgba(198, 255, 61, 0.45)',
        'glow-pink': '0 0 25px -4px rgba(255, 46, 147, 0.45)',
        'glow-purple': '0 0 25px -4px rgba(139, 92, 246, 0.45)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        sheetUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        sheetUp: 'sheetUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        pop: 'pop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
