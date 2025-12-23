import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom'
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './'),
      '@datatable': resolve(__dirname, './modules/datatable-v2'),
      '@datatable-define': resolve(__dirname, './modules/datatable-define'),
      '@datetime': resolve(__dirname, './modules/date-time-picker'),
      '@datetime-define': resolve(__dirname, './modules/datetime-define')
    }
  }
})
