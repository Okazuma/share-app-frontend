export default {
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'], // Pinia追加
  css: [
    '@/assets/styles/tailwind.css',
    '@/assets/styles/global.css',
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
};

