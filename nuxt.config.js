import colors from 'vuetify/es5/util/colors'
const bodyParser = require('body-parser')
export default {
  serverMiddleware: [
    bodyParser.json(),
    { path: '/api/deleteUser', handler: '~/middleware/deleteUser.js' },
  ],
  head: {
    titleTemplate: '%s',
    title: 'Health Bridge Laos',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Lao&display=swap',
      },
    ],
  },

  css: ['~/assets/global.css'],

  plugins: [
    { src: '@/plugins/set_token.js', mode: 'client' },
    { src: '@/plugins/intitial_app.js', mode: 'client' },
  ],

  components: true,

  buildModules: ['@nuxtjs/vuetify', '@nuxtjs/pwa'],

  modules: [
    '@nuxtjs/firebase',
    '@nuxtjs/apollo',
    '@nuxtjs/i18n',
    'nuxt-sweetalert2',
  ],

  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en.json',
        name: 'English',
      },
      {
        code: 'lo',
        file: 'lo.json',
        name: 'ພາສາລາວ',
      },
    ],
    strategy: 'no_prefix',
    langDir: 'locales/',
    lazy: false,
    defaultLocale: 'en',
  },

  apollo: {
    cookieAttributes: {
      expires: 7,
    },
    defaultOptions: {
      $query: {
        loadingKey: 'loading',
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
    clientConfigs: {
      default: {
        httpEndpoint: '[Your EndPoint]',
        tokenName: 'access_token',
        includeNodeModules: true,
        authenticationType: 'Bearer',
        httpLinkOptions: {
          headers: {
            'X-Hasura-Admin-Secret': '[Your Secret key ]',
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,PATCH,OPTIONS,DELETE,POST',
          },
        },
      },
    },
  },
  // Config your firebase
  firebase: {
    config: {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
    },
    services: {
      auth: {
        initialize: {
          onAuthStateChangedAction: 'onAuthStateChanged',
        },
        ssr: true,
      },
      storage: true,
    },
  },

  pwa: {
    workbox: {},
  },

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        light: {
          primary: '#243168',
          accent: colors.white,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green,
        },
      },
    },
    defaultAssets: {
      font: {
        family: 'Noto Sans Lao',
      },
    },
    treeShake: true,
  },

  build: {},
}
