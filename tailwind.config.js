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
        // Secondary navy sampled from the AKATSICO crest (shield outline/
        // banner text). Primary is Tailwind's blue-900/blue-950.
        primary: {
          DEFAULT: '#1e3a8a',
          dark: '#172554',
        },
        secondary: {
          DEFAULT: '#0a1358',
          accent: {
            DEFAULT: '#aacce1',
            50: '#f4f8fb',
            100: '#e5eff6',
            200: '#c6ddeb',
            300: '#a1c6de',
            400: '#7bb0d0',
            500: '#5599c3',
            600: '#3c80aa',
            700: '#29688e',
            800: '#20516f',
            900: '#173a4f',
          },
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
      'sans': ["'Roboto'", ...defaultTheme.fontFamily.sans],
      'poppins': ["'Poppins'", 'sans-serif'],
      'roboto': ["'Roboto'", 'sans-serif'],
      'noto': ["'Noto Sans'", 'sans-serif'],
      'quicksand': ["'Quicksand'", 'sans-serif'],
      'arial-narrow': ["'Arial Narrow'", 'Arial', 'sans-serif'],
      // Matches the profile-card design reference's typography.
      'inter': ["'Inter'", ...defaultTheme.fontFamily.sans],
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

