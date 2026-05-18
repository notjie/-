<script setup>
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <main class="main">
    <router-view />
  </main>
  <footer class="footer">
    <p>深圳职业技术大学 · 虚拟参观（课程/演示站点，非学校官方网站）</p>
  </footer>
</template>

<style scoped>
.main {
  flex: 1;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.25rem 1.25rem 3rem;
}

.footer {
  padding: 1.25rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-muted);
  border-top: 1px solid var(--border);
  background: var(--bg-elevated);
}

.footer p {
  margin: 0;
}
</style>
