export default defineNuxtConfig({
  ssr: false,
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss"],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "/api/v1/",
    },
  },
  nitro: {
    devProxy: {
      "/api/v1": {
        target: "http://localhost:4000/api/v1",
        changeOrigin: true,
        prependPath: true,
      },
    },
  },
});
