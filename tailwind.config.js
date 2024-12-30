/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: [
    './pages/**/*.{html,js,ts,vue}',
    './components/**/*.{html,js,ts,vue}',
    './layouts/**/*.{html,js,ts,vue}',
    './composables/**/*.{html,js,ts,vue}',
    './plugins/**/*.{html,js,ts,vue}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

