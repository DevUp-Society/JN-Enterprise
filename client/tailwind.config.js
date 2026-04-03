/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#2A2A2A',
          surface: '#383838',
          accent: '#1E1E1E'
        },
        primary: {
          DEFAULT: '#FF6B00',
          hover: '#E66000',
          muted: 'rgba(255, 107, 0, 0.1)'
        },
        slate: {
          DEFAULT: '#FFFFFF',
          muted: '#A0A0A0',
        },
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
