/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{html,js,jsx,ts,tsx}"];
export const theme = {
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
};
export const plugins = [];
