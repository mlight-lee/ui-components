import { defineConfig, Alias } from 'vite'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import vue from '@vitejs/plugin-vue'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

export default defineConfig(({ command }) => {
  const aliases: Alias[] = []
  if (command === 'serve') {
    aliases.push({
      find: '@mlightcad/ui-components',
      replacement: resolve(__dirname, '../ui-components/src')
    })
  }
  return {
    base: './',
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      peerDepsExternal()
    ],
    resolve: {
      alias: aliases
    },
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
