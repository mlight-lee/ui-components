import { defineConfig } from 'vite'
import svgLoader from 'vite-svg-loader'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import vue from '@vitejs/plugin-vue'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      vue(),
      svgLoader(),
      cssInjectedByJsPlugin(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      peerDepsExternal()
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'UIComponents',
        fileName: format => `ui-components.${format}.js`
      },
      rollupOptions: {
        output: {
          globals: {
            vue: 'Vue'
          }
        }
      }
    }
  }
})
