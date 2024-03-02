/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	darkMode: 'class',
  theme: {
    extend: {
      colors: {
        body: 'var(--body)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        pink: 'var(--pink)',
        darkBlue: 'var(--darkBlue)',
      }
    },
  },
  plugins: [],
}

