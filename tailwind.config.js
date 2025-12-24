/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rentr: {
          dark: '#0F2C32', // The Deep Teal/Slate from the logo text and footer
          gold: '#A87F59', // The Bronze/Gold from the logo icon and buttons
          light: '#F5F5F0', // A warm light gray for backgrounds
        }
      }
    },
  },
  plugins: [],
}