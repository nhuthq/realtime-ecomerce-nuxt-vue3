import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  modules: [
    '@prisma/nuxt',
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/ui'
  ],
  experimental: {
    componentIslands: true,
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  runtimeConfig: {
    //Private: is accessible only in the server side
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_TOKEN_KEY: process.env.JWT_TOKEN_KEY,
    REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY,

    //Public: is accessible both server and client side
    public: {
      apiUrl: process.env.API_URL,
    },
  },
})