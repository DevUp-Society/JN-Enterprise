/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
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
          DEFAULT: '#425664', // Slate Blue
          hover: '#354550',
          muted: 'rgba(66, 86, 100, 0.1)'
        },
        gold: {
          DEFAULT: '#C6AD8F', // Muted Gold
          muted: 'rgba(198, 173, 143, 0.1)'
        },
        bone: {
          DEFAULT: '#F6F4F2', // Bone White
        },
        slate: {
          DEFAULT: '#FFFFFF',
          muted: '#A0A0A0',
        },
      },
      borderRadius: {
        'none': '0px',
        'sm': '0px',
        'md': '0px',
        'lg': '0px',
        'xl': '0px',
        '2xl': '0px',
        '3xl': '0px',
        'full': '9999px', // keep full for actual circles
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      letterSpacing: {
        'widest-xl': '0.25em',
      },
      boxShadow: {
        'floating': '0 20px 25px -5px rgba(66, 86, 100, 0.05), 0 10px 10px -5px rgba(66, 86, 100, 0.02)',
        'glass': '0 8px 32px 0 rgba(66, 86, 100, 0.08)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

