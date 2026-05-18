<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const links = [
  { to: '/', label: '首页' },
  { to: '/model', label: '模型' },
  { to: '/panorama', label: '全景游览' },
  { to: '/unity', label: 'Unity漫游' },
]
</script>

<template>
  <header class="header">
    <div class="inner">
      <router-link to="/" class="brand">
        <span class="brand-mark" aria-hidden="true" />
        <span class="brand-text">深圳职业技术大学 · 虚拟参观</span>
      </router-link>
      <nav class="nav" aria-label="主导航">
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          :class="{ active: route.path === link.to }"
        >
          {{ link.label }}
        </router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 2px solid rgba(200, 16, 46, 0.2);
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
}

.inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.brand-mark {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent-yellow));
  box-shadow: 0 0 14px rgba(200, 16, 46, 0.35);
}

.brand-text {
  font-size: 1.05rem;
}

.nav {
  display: flex;
  gap: 0.25rem;
}

.nav-link {
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  font-size: 0.9rem;
  color: var(--text-muted);
  transition: color 0.15s, background 0.15s;
}

.nav-link:hover {
  color: var(--text);
  background: var(--accent-dim);
}

.nav-link.active {
  color: var(--on-accent);
  background: var(--accent);
  font-weight: 500;
}

@media (max-width: 520px) {
  .brand-text {
    font-size: 0.95rem;
  }

  .nav-link {
    padding: 0.4rem 0.65rem;
    font-size: 0.82rem;
  }
}
</style>
