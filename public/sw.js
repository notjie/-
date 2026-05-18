/**
 * Service Worker — 预缓存 Unity WebGL 构建文件
 * 
 * 首次访问后台下载，后续秒开（Cache-First 策略）
 * 构建文件带有哈希名，内容永不变，适合长期缓存
 */
const CACHE_NAME = 'unity-webgl-v1'

// Unity Build 目录下所有文件（含预压缩版本）
const UNITY_FILES = [
  '/unity/',
  '/unity/Build/266cdb3c6df1cedd27de19d4b544bfed.wasm',
  '/unity/Build/266cdb3c6df1cedd27de19d4b544bfed.wasm.br',
  '/unity/Build/266cdb3c6df1cedd27de19d4b544bfed.wasm.gz',
  '/unity/Build/3f205de7467aab4df85a3cf4302517ba.js',
  '/unity/Build/3f205de7467aab4df85a3cf4302517ba.js.br',
  '/unity/Build/3f205de7467aab4df85a3cf4302517ba.js.gz',
  '/unity/Build/40dc6a7f83d344b4678eddc5a9200bc5.data',
  '/unity/Build/40dc6a7f83d344b4678eddc5a9200bc5.data.gz',
  '/unity/Build/WebGL.loader.js',
  '/unity/Build/WebGL.loader.js.gz',
  '/unity/TemplateData/style.css',
  '/unity/TemplateData/favicon.ico',
  '/unity/TemplateData/fullscreen-button.png',
  '/unity/TemplateData/progress-bar-empty-dark.png',
  '/unity/TemplateData/progress-bar-empty-light.png',
  '/unity/TemplateData/progress-bar-full-dark.png',
  '/unity/TemplateData/progress-bar-full-light.png',
  '/unity/TemplateData/unity-logo-dark.png',
  '/unity/TemplateData/unity-logo-light.png',
  '/unity/TemplateData/webgl-logo.png',
]

// ---------- Install：全量预缓存 ----------
self.addEventListener('install', (event) => {
  console.log('[SW] Installing — caching Unity assets...')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // 逐个缓存，单个失败不影响整体
      return Promise.allSettled(
        UNITY_FILES.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[SW] Failed to cache:', url, err.message)
          })
        )
      )
    }).then(() => {
      console.log('[SW] All Unity assets cached')
      return self.skipWaiting()
    })
  )
})

// ---------- Activate：清理旧缓存 ----------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  )
})

// ---------- Fetch：Unity 构建文件走 Cache-First，其他走网络 ----------
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // 仅拦截 Unity 资源
  if (url.pathname.startsWith('/unity/Build/') ||
      url.pathname.startsWith('/unity/TemplateData/') ||
      url.pathname === '/unity/') {

    // Cache-First：缓存命中直接返回，否则网络请求后缓存
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached

        return fetch(event.request).then((response) => {
          // 只缓存成功响应
          if (!response || response.status !== 200) return response

          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone)
          })
          return response
        })
      })
    )
  }
  // 其他请求走默认网络
})