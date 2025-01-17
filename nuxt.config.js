export default {
  ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'], // Pinia追加
  css: [
    '@/assets/styles/tailwind.css',
    '@/assets/styles/global.css',
    '@fortawesome/fontawesome-free/css/all.min.css', // Font Awesomeをローカルで利用
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  routeRules: {
  },
  plugins: [
    '~/plugins/firebase.js' // Firebaseプラグインを追加
  ]
};

