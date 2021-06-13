import config from './config'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  server: {
    host: config.host,
    port: config.port
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'das-dapp-demo',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width,height=device-height,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,viewport-fit=cover' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [{
      src: '//at.alicdn.com/t/font_2342047_piatg6rxe.js',
      async: true
    }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/init.scss',
    '~/assets/index.scss'
  ],

  // Customize the progress-bar color
  loading: { color: '#00aadd' },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/vuex-persistedstate.ts',
    '~/plugins/vee-validate',
    '~/plugins/services.ts',
    '~/plugins/alert.ts',
    '~/plugins/toast.ts',
    '~/plugins/wallet-sdk.ts'
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://i18n.nuxtjs.org/
    'nuxt-i18n'
  ],

  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en.js',
        iso: 'en',
        name: 'English'
      },
      {
        code: 'zh',
        file: 'zh.js',
        iso: 'zh',
        name: '简体中文'
      }
    ],
    strategy: 'no_prefix',
    defaultLocale: 'cn',
    lazy: true,
    langDir: 'lang/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'das_i18n_redirected',
      onlyOnRoot: true
    }
  },

  // disable prefetching globally
  router: {
    prefetchLinks: false
  },

  render: {
    // prevent preload, improve first time performance
    resourceHints: false
    // https://nuxtjs.org/guides/directory-structure/static
    // https://www.npmjs.com/package/serve-static
    // static: {
    //   maxAge: 24 * 60 * 60 * 1000
    // }
  },

  // The build Property: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-build
  build: {
    extractCSS: true,
    babel: {
      presets () {
        return []
      }
    }
  }
}
