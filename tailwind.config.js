export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        raised: 'rgb(var(--raised) / <alpha-value>)',
        paper: 'rgb(var(--paper) / <alpha-value>)',
        dim: 'rgb(var(--dim) / <alpha-value>)',
        faint: 'rgb(var(--faint) / <alpha-value>)',
        amber: 'rgb(var(--amber) / <alpha-value>)',
        amberDeep: 'rgb(var(--amber-deep) / <alpha-value>)',
        sober: 'rgb(var(--sober) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['Karla', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgb(var(--amber) / 0.25), 0 8px 40px -8px rgb(var(--amber) / 0.35)',
        card: '0 1px 0 rgb(var(--line) / 0.6), 0 10px 30px -18px rgb(0 0 0 / 0.5)',
        sheet: '0 -20px 60px -20px rgb(0 0 0 / 0.6)',
      },
      animation: {
        fadeIn: 'fadeIn 0.25s ease-out',
        sheetUp: 'sheetUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        tally: 'tally 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        pop: 'pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
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
        tally: {
          '0%': { transform: 'scale(1.12)', opacity: '0.4' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pop: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
