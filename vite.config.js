import {
  defineConfig,
  loadEnv
} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({mode}) =>{
  const env = loadEnv(mode, __dirname)
  return {
    base: './', // 在生产中服务时的基本公共路径
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
     // 本地运行配置，及反向代理配置
     server: {
        server: env['VITE_APP_HOST'],// 指定服务器主机名
        port: env['VITE_APP_PORT'],  // 指定服务器端口
        open: true, // 在服务器启动时自动在浏览器中打开应用程序
        strictPort: false, // 设为 false 时，若端口已被占用则会尝试下一个可用端口,而不是直接退出
        https: false, // 是否开启 https
        cors: true, // 为开发服务器配置 CORS。默认启用并允许任何源
        proxy: { // 为开发服务器配置自定义代理规则
            // '/monitor': { // 后台接口地址
            //   target: 'http://192.168.50.200:8090', //代理接口
            //   changeOrigin:true,
            //   pathRewrite: {
            //     '^/monitor': '/monitor'
            //   }
            // }, 
            '/api': {
              target: env['VITE_APP_DEV_URL'], //代理接口
              changeOrigin:true,
              ws:true,
              pathRewrite:{
                '/^\/api/': ''
              }
          },
        }
    },
    build: {
      sourcemap: false, // 构建后是否生成 source map 文件
      minify: 'terser', // 混淆器，terser构建后文件体积更小
      chunkSizeWarningLimit: 1500,
      outDir: 'dist', // 指定输出路径
      assetsDir: 'assets', // 指定生成静态资源的存放路径
      /* 去掉打印 */
      terserOptions:{
          compress: {
              drop_console: true, //打包时删除console
              drop_debugger: true //打包时删除 debugger
          },
          output:{  // 去掉注释内容
            comments: true,
          }
      },
      target: 'modules', // 设置最终构建的浏览器兼容目标。modules:支持原生 ES 模块的浏览器
      rollupOptions: {
          output: {
              manualChunks(id) {
                  if (id.includes('node_modules')) {
                      return id.toString().split('node_modules/')[1].split('/')[0].toString();
                  }
              },
              entryFileNames: `assets/[name].js`,
              chunkFileNames: `assets/[name].js`,
              assetFileNames: `[ext]/[name].[hash].[ext]`
          }
      }
    }
  }
})