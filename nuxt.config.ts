export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui'
  ],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    firecrawlApiKey: process.env.FIRECRAWL_API_KEY,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  }
})