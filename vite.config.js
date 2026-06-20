import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

//elementPlus按需导入配置
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver({importStyle:"sass"})],
    }),
  ],
  server: {
    historyApiFallback: true,
    port: 5173,
    allowedHosts: ['686e255c.r35.cpolar.top'],
    proxy: {
    '/api': { // 必须加前置斜杠
      target: 'http://pcapi-xiaotuxian-front-devtest.itheima.net',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css:{
    preprocessorOptions: {
      scss: {
        additionalData:`
          @use "@/styles/element/index.scss" as *;
          @use "@/styles/var.scss" as *;
        `,
      }
    }
  }
})
