/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        brand: {
          50: '#fff0f4',
          100: '#ffdeea',
          200: '#ffbdd5',
          300: '#ff8cb5',
          400: '#ff4d8d',
          500: '#ff0557',
          600: '#e6004a',
          700: '#c2003e',
          800: '#a10034',
          900: '#85002c',
          950: '#4d0015',
        },
      },
      borderRadius: {
        'm3-xs': '4px',
        'm3-s': '8px',
        'm3-m': '12px',
        'm3-l': '16px',
        'm3-xl': '28px',
        'm3-full': '9999px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
