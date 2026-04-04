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
        primary: {
          DEFAULT: '#000000', 
          hover: '#111111',
          muted: 'rgba(0, 0, 0, 0.1)'
        },
        accent: {
          DEFAULT: '#000000', 
          muted: 'rgba(0, 0, 0, 0.1)'
        },
        cream: {
          DEFAULT: '#FFFFFF', 
        },
        dark: {
          DEFAULT: '#000000',
          surface: '#111111',
          accent: '#000000'
        },
        gold: {
          DEFAULT: '#000000', 
          muted: 'rgba(0, 0, 0, 0.1)'
        },
        bone: {
          DEFAULT: '#D6D6D6', 
        },
        slate: {
          DEFAULT: '#FFFFFF',
          muted: '#D6D6D6',
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

