/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        kitsune: {
          black: '#0D0D0D',
          pink: '#FF006E',
          lime: '#00FF41',
          gray: '#1A1A1A',
          border: '#2A2A2A',
          dark: '#0D0D0D',
        }
      },
      fontFamily: {
        display: ['Roc Grotesk', 'system-ui', 'sans-serif'],
        accent: ['Clash Grotesk', 'system-ui', 'sans-serif'],
        body: ['Inter Tight', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        "main-bg": "url('/src/assets/bg-1.png')",
        "large-bg": "url('/src/assets/bg-1-lg.png')",
        "medium-bg": "url('/src/assets/bg-1-md.png')",
        "small-bg": "url('/src/assets/bg-1-sm.png')",
      },
    },
  },
  plugins: [],
};
