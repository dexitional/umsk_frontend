/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // primary: {
        //   DEFAULT: '#008e46',
        //   dark: '#045B16',
        //   accent: '#e67f37'
        // },
         primary: {
          DEFAULT: '#343434',
          dark: '#AD5913',
          accent: '#E77B1D'
        },
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.55s cubic-bezier(0.16,1,0.3,1) both',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
    fontFamily: {
      'serif': [...defaultTheme.fontFamily.serif],
      'sans': [...defaultTheme.fontFamily.sans],
      'poppins': ["'Poppins'", 'sans-serif'],
      'roboto': ["'Roboto'", 'sans-serif'],
      'noto': ["'Noto Sans'", 'sans-serif'],
      'quicksand': ["'Quicksand'", 'sans-serif'],
      'arial-narrow': ["'Arial Narrow'", 'Arial', 'sans-serif'],
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
    require('tailwind-scrollbar-hide'),
  ],
}

