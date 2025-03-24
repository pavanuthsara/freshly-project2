/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"], // Make sure all React files are included
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
};
