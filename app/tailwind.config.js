/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/**.{ts,tsx}',
    './containers/**/**.{ts,tsx}',
    './context/**/**.{ts,tsx}',
    './pages/**/**.{ts,tsx}',
    './utils/**/**.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
};
