/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bone: '#F6F4F2',
        slate: {
          DEFAULT: '#425664',
          muted: 'rgba(66, 86, 100, 0.2)',
        },
        gold: '#C6AD8F',
      },
      borderRadius: {
        'none': '0px',
        'sm': '2px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      letterSpacing: {
        'widest-xl': '0.25em',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
