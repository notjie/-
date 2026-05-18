<script setup>
import CampusModelViewer from '../components/CampusModelViewer.vue'
import BuildingCard from '../components/BuildingCard.vue'
import { buildings } from '../data/buildings.js'

const baseUrl = import.meta.env.BASE_URL
</script>

<template>
  <div class="page">
    <header class="page-head">
      <h1>校园模型</h1>
      <p>
        以<strong>深圳职业技术大学</strong>校园为展示对象，使用 Three.js 在浏览器中浏览建筑与场地模型。
        下方展示了西丽湖校区七栋主要建筑的三维模型，支持鼠标拖拽旋转、滚轮缩放与自动旋转。
        悬停建筑上的<strong>热点标记</strong>可查看简介，点击查看详细信息。
      </p>
    </header>

    <!-- 建筑网格 -->
    <section class="building-grid">
      <BuildingCard
        v-for="b in buildings"
        :key="b.name"
        :model-path="`${baseUrl}${b.file}`"
        :model-name="b.name"
        :hotspot-data="b.hotspot ? { ...b.hotspot, title: b.name } : null"
      />
    </section>

    <!-- 完整校园模型（全景） -->
    <section class="full-model-section">
      <header class="section-head">
        <h2>校园全景模型</h2>
        <p>将 RealityCapture 重建的完整 campus.glb 放入 <code>public/models/</code> 即可加载；当前为内置演示场景。</p>
      </header>
      <CampusModelViewer class="full-viewer" />
      <p class="hint">
        操作：拖拽旋转视角，滚轮缩放，右键平移。若加载外部 GLB 体积较大，请使用 Draco 压缩后配合 CDN。
      </p>
    </section>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.page-head h1 {
  margin: 0 0 0.5rem;
  font-size: 1.65rem;
  font-weight: 600;
}

.page-head p {
  margin: 0;
  max-width: 72ch;
  line-height: 1.75;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.page-head strong {
  color: var(--text);
  font-weight: 600;
}

/* 建筑网格 */
.building-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.25rem;
}

@media (max-width: 480px) {
  .building-grid {
    grid-template-columns: 1fr;
  }
}

/* 完整模型区域 */
.full-model-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-head h2 {
  margin: 0 0 0.35rem;
  font-size: 1.3rem;
  font-weight: 600;
}

.section-head p {
  margin: 0;
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.section-head code {
  font-size: 0.85em;
  padding: 0.12rem 0.35rem;
  border-radius: 6px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--accent);
}

.full-viewer {
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.hint {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-muted);
}
</style>