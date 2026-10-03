/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7ff',
          100: '#b3e8ff',
          200: '#80d9ff',
          300: '#4dcaff',
          400: '#1abcff',
          500: '#00d4ff',
          600: '#00b8e6',
          700: '#009cc2',
          800: '#008099',
          900: '#006673',
        },
        dark: {
          50: '#1a1a2e',
          100: '#16162a',
          200: '#12121a',
          300: '#0a0a0f',
          400: '#06060a',
        },
      },
      fontFamily: {
        mono: ['SF Mono', 'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};