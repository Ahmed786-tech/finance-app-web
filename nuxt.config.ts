export default defineNuxtConfig({
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss"],
  // css: ['~/assets/css/main.css'],
  // css: ['assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "/api/v1/",
    },
  },
  nitro: {
    devProxy: {
      "/api/v1": {
        target:
          "https://finance-app-r0gywnp13-ahmed-hanifs-projects.vercel.app/api/v1",
        changeOrigin: true,
        prependPath: true,
      },
    },
  },
});
