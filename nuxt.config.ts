// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  components: [
    {
      path: '~/app/components',
      pathPrefix: false
    }
  ],
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '~/assets/css/main.css'
  ],

  app: {
    head: {
      title: 'SmartMart',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
        {
          name: 'description',
          content: 'Professional Nuxt 4 Admin Dashboard'
        }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/logo.png' 
        }
      ]
    }
  },

  modules: [
    // you can add later:
    '@pinia/nuxt',
    // '@nuxtjs/tailwindcss',
  ],

  runtimeConfig: {
    public: {
      apiBase: 'https://smart-mart-api.onrender.com/api',
      credentials: 'include'
    }
  },

  compatibilityDate: '2025-01-01'
})