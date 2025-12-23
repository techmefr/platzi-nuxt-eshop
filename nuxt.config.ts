export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-12-23',

  devtools: { enabled: true },

  typescript: {
    strict: true
  },

  alias: {
    '@datatable': '~/modules/datatable-v2',
    '@datatable-define': '~/modules/datatable-define',
    '@datetime': '~/modules/date-time-picker',
    '@datetime-define': '~/modules/datetime-define'
  }
})
