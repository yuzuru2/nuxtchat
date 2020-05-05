import { Configuration } from '@nuxt/types';

const config: Configuration = {
  mode: 'universal',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  env: {
    SERVER_IP: process.env.SERVER_IP,
    FRONTEND_PORT: process.env.FRONTEND_PORT,
    BACKEND_PORT: process.env.BACKEND_PORT,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET
  },
  head: {
    title: 'nuxtオープンチャット',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width,user-scalable=no,maximum-scale=1',
      },
      {
        hid: 'description',
        name: 'description',
        content: 'nuxtで作ったSSR(サーバサイドレンダリング)なWebチャットです。',
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: 'nuxt オープンチャット',
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://nuxtchat.itsumen.com',
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'nuxt オープンチャット',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'nuxtで作ったSSR(サーバサイドレンダリング)なWebチャットです。',
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://nuxtchat.itsumen.com/favicon.ico',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' },
      {
        rel: 'icon',
        type: 'apple-touch-icon',
        href: 'apple-touch-icon.png',
        sizes: '180x180',
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: 'android-touch-icon.png',
        sizes: '192x192',
      },
      {
        rel: 'stylesheet',
        href:
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
      }
    ],
  },
  loading: { color: '#fff' },
  css: ['@/static/css/style.css'],
  plugins: [],
  modules: ['bootstrap-vue/nuxt'],
  buildModules: ['@nuxt/typescript-build'],
  axios: {},
  build: {
    extend(config, ctx) {
      extractCSS: true,
      config.node = {
        fs: 'empty',
      };
    },
  },
  typescript: {
    typeCheck: true,
    ignoreNotFoundWarnings: true,
  },
};

export default config;
