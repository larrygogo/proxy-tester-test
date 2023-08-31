/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,tsx}',
  ],
  theme: {
    extend: {
      zIndex: {
        'z-1000': 1000,
      }
    },
  },
  plugins: [],
}

