/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        urgent: '#E57373',
        important: '#64B5F6',
        soon: '#81C784',
        someday: '#BA68C8',
        'bg-primary': '#1B1B1B',
        'bg-secondary': '#1E1E1E',
        'bg-card': '#252525',
        'text-primary': '#EDEDED',
        'text-secondary': '#999999',
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

