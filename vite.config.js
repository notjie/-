import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    // 自定义插件：为 Unity Build 文件提供 Brotli/gzip 预压缩 + 长缓存头
    {
      name: 'unity-compress-cache',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // 仅处理 Unity Build 目录下的文件
          if (!req.url || !req.url.startsWith('/unity/Build/')) return next()

          const filePath = path.join(__dirname, 'public', req.url.split('?')[0])
          const acceptEncoding = req.headers['accept-encoding'] || ''
          const ext = path.extname(filePath).toLowerCase()

          const mimeTypes = {
            '.wasm': 'application/wasm',
            '.js': 'application/javascript',
            '.data': 'application/octet-stream',
          }

          // 优先 Brotli（压缩率最高），其次 gzip，最后原始文件
          let served = false

          // 1) Brotli 优先
          const brPath = filePath + '.br'
          if (acceptEncoding.includes('br') && fs.existsSync(brPath)) {
            res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream')
            res.setHeader('Content-Encoding', 'br')
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
            res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
            res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
            fs.createReadStream(brPath).pipe(res)
            served = true
          }

          // 2) 回退到 gzip
          if (!served) {
            const gzPath = filePath + '.gz'
            if (acceptEncoding.includes('gzip') && fs.existsSync(gzPath)) {
              res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream')
              res.setHeader('Content-Encoding', 'gzip')
              res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
              res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
              res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
              fs.createReadStream(gzPath).pipe(res)
              served = true
            }
          }

          // 3) 原始文件（也有缓存头）
          if (!served && fs.existsSync(filePath)) {
            res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream')
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
            res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
            res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
            fs.createReadStream(filePath).pipe(res)
            served = true
          }

          if (!served) next()
        })
      },
    },
  ],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
})