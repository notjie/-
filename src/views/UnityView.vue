<script setup>
import { ref } from 'vue'

const loading = ref(true)
const unityUrl = `${import.meta.env.BASE_URL}unity/`

function onIframeLoad() {
  loading.value = false
}
</script>

<template>
  <div class="page">
    <header class="page-head">
      <h1>Unity 虚拟漫游</h1>
      <p>
        通过 <strong>Unity WebGL</strong> 技术实现的校园三维交互漫游场景。支持第一人称自由行走、场景交互等功能。
        首次加载需下载约 740MB 资源，请耐心等待加载进度条完成。
      </p>
      <div class="actions">
        <a :href="unityUrl" target="_blank" rel="noopener noreferrer" class="btn-external">
          新窗口打开
        </a>
      </div>
    </header>

    <div class="unity-wrapper">
      <div v-if="loading" class="loading-overlay">
        <div class="spinner" />
        <p>Unity WebGL 加载中…</p>
      </div>
      <iframe
        :src="unityUrl"
        class="unity-frame"
        title="Unity 虚拟漫游"
        allow="autoplay; fullscreen; microphone"
        @load="onIframeLoad"
      />
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-head h1 {
  margin: 0 0 0.5rem;
  font-size: 1.65rem;
  font-weight: 600;
}

.page-head p {
  margin: 0 0 0.75rem;
  max-width: 72ch;
  line-height: 1.75;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.actions {
  display: flex;
  gap: 0.75rem;
}

.btn-external {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1.1rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--on-accent);
  background: linear-gradient(135deg, var(--accent-strong), var(--accent));
  transition: opacity 0.15s, transform 0.12s;
}

.btn-external:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

.unity-wrapper {
  position: relative;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  background: #1a1a2e;
}

.unity-frame {
  display: block;
  width: 100%;
  height: clamp(480px, 70vh, 860px);
  border: none;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: #1a1a2e;
  z-index: 10;
  pointer-events: none;
}

.loading-overlay p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  font-family: 'Noto Sans SC', sans-serif;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.15);
  border-top-color: #c8102e;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>