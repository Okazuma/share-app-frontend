// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'], // Pinia追加
  css: [
    '@/assets/styles/tailwind.css', // Tailwind CSS を読み込み
    '@/assets/styles/global.css',   // カスタムグローバルスタイルを読み込み
  ]
})
