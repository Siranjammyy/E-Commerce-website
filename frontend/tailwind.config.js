/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFCF9',
          100: '#FAF8F5',
          200: '#F4F0E8',
          300: '#EAE4D8',
          400: '#DED6C7',
          DEFAULT: '#FAF8F5',
        },
        charcoal: {
          50: '#F5F5F4',
          100: '#E7E7E5',
          300: '#A8A8A2',
          500: '#686862',
          700: '#383834',
          800: '#242422',
          900: '#181816',
          DEFAULT: '#181816',
        },
        olive: {
          50: '#F2F6F3',
          100: '#E3EDE5',
          200: '#C7DBCB',
          300: '#A4C3AA',
          500: '#4D7559',
          600: '#395A44',
          700: '#2D4436',
          800: '#223328',
          900: '#18241D',
          DEFAULT: '#2D4436',
        },
        terracotta: {
          DEFAULT: '#A65B44',
          light: '#F8EFEA',
        },
        sand: {
          50: '#FAF9F6',
          100: '#F5F2EB',
          200: '#E9E4D8',
          300: '#DCD4C3',
          DEFAULT: '#E9E4D8',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.03em',
        tight: '-0.015em',
        widest: '0.15em',
        editorial: '0.2em',
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(24, 24, 22, 0.04), 0 1px 2px -1px rgba(24, 24, 22, 0.04)',
        card: '0 4px 20px -2px rgba(24, 24, 22, 0.05)',
        elevated: '0 12px 32px -4px rgba(24, 24, 22, 0.08)',
      }
    },
  },
  plugins: [],
}
