<script setup>
const tours = [
  {
    id: 'main',
    title: '深职大主线路漫游',
    desc: '由 Pano2VR 制作的全景序列与热点导航，呈现深圳职业技术大学校门、广场、教学楼与图书馆等节点。',
    panovrUrl: `${import.meta.env.BASE_URL}pano2vr/index.html`,
  },
  {
    id: 'dorm',
    title: '生活区导览',
    desc: '宿舍区、食堂与运动场周边环境，帮助新生提前熟悉深职大校园生活动线。',
    panovrUrl: '',
    status: 'coming',
  },
]

function openPanovr(url) {
  if (!url) return
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div class="page">
    <header class="page-head">
      <h1>全景游览</h1>
      <p>
        以下为<strong>深圳职业技术大学</strong>全景漫游入口，点击卡片可打开由 <strong>Pano2VR</strong>
        发布的项目（新标签页）。
      </p>
    </header>

    <ul class="cards" role="list">
      <li v-for="tour in tours" :key="tour.id" class="card">
        <div class="card-body">
          <h2>{{ tour.title }}</h2>
          <p>{{ tour.desc }}</p>
          <p v-if="tour.status === 'coming'" class="badge">Panovr2 项目待接入</p>
        </div>
        <div class="card-actions">
          <button
            type="button"
            class="btn"
            :disabled="!tour.panovrUrl"
            @click="openPanovr(tour.panovrUrl)"
          >
            {{ tour.panovrUrl ? '进入全景漫游' : '即将开放' }}
          </button>
        </div>
      </li>
    </ul>
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

.page-head code {
  font-size: 0.85em;
  padding: 0.12rem 0.35rem;
  border-radius: 6px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--accent);
}

.cards {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.35rem 1.5rem;
  border-radius: var(--radius);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.card-body {
  flex: 1;
  min-width: 200px;
}

.card-body h2 {
  margin: 0 0 0.5rem;
  font-size: 1.15rem;
  font-weight: 600;
}

.card-body p {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.65;
  font-size: 0.92rem;
}

.badge {
  margin-top: 0.75rem !important;
  display: inline-block;
  padding: 0.25rem 0.55rem;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  background: var(--accent-dim);
  color: var(--accent);
}

.card-actions {
  flex-shrink: 0;
}

.btn {
  padding: 0.6rem 1.15rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, var(--accent-strong), var(--accent));
  color: var(--on-accent);
  transition: opacity 0.15s, transform 0.12s;
}

.btn:hover:not(:disabled) {
  opacity: 0.95;
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  background: var(--surface);
  color: var(--text-muted);
}

</style>
