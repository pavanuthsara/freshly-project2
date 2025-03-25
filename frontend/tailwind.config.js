/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#22c55e',
          white: '#ffffff'
        },
        accent: {
          black: '#000000'
        }
      }
    },
  },
  plugins: [],
}