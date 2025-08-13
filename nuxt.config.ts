export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],
    // css: ['~/assets/css/main.css'],
  // css: ['assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:4000'
    }
  }
});