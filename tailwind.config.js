/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F8F3EA', // Ana arkaplan
        },
        navy: {
          DEFAULT: '#0B1957', // Koyu mavi metin
        },
        sky: {
          DEFAULT: '#9ECCFA', // Açık mavi accent
        },
        beige: {
          DEFAULT: '#E6D8C7', // Bej/altın accent
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 4px 12px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}

