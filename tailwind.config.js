/** @type {import('tailwindcss').Config} */
export default {
  future: {
    disableTailwindOxide: true, // 👈 This disables the buggy oxide compiler
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
