/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        chatwoot: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#1f93ff',
          600: '#0072eb',
          700: '#0058b8',
          800: '#004794',
          900: '#1f2d3d',
        }
      }
    },
  },
  plugins: [],
}
