/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // or 'media' if OS preference is preferred initially
  content: [
    "./index.html",
    // Add other paths if HTML/JS is split into more files later
  ],
  theme: {
    extend: {
      colors: {
        // Example: Define custom colors for the dark theme if needed
        // 'dark-bg': '#1a202c',
        // 'dark-card': '#2d3748',
        // 'dark-text': '#e2e8f0',
      },
      fontFamily: {
        // The current HTML uses 'Inter', so let's ensure it's configured
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
