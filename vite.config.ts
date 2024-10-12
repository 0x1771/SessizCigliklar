import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { defineConfig } from 'vite'

export default defineConfig({
  // GitHub Pages expects an index.html in the root directory
  // so just run npm build before pushing to GitHub and this will rebuild our assets to the root
  build: { outDir: '..' },
  // needed for github pages just put the repo name here
  base: '/your-repo-name-here/', 

// https://vitejs.dev/config/
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
