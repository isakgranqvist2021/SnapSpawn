/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/**.{ts,tsx}',
    './containers/**/**.{ts,tsx}',
    './page-components/**/**.{ts,tsx}',
    './pages/**/**.{ts,tsx}',
    './utils/**/**.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
};
