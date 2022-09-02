/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      gridTemplateColumns: {
        fill: 'repeat(auto-fit, minmax(200px, 1fr))',
      },
      colors: {
        primary: {
          0: 'white',
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },
        'primary-dark': {
          900: '#fafafa',
          800: '#f4f4f5',
          700: '#e4e4e7',
          600: '#d4d4d8',
          500: '#a1a1aa',
          400: '#71717a',
          300: '#52525b',
          150: '#2b2b2e',
          200: '#3f3f46',
          100: '#27272a',
          50: '#18181b',
        },
      },
    },
  },
  plugins: [],
};
