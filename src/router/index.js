import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ModelView from '../views/ModelView.vue'
import PanoramaView from '../views/PanoramaView.vue'
import UnityView from '../views/UnityView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { title: '首页' } },
  { path: '/model', name: 'model', component: ModelView, meta: { title: '校园模型' } },
  { path: '/panorama', name: 'panorama', component: PanoramaView, meta: { title: '全景游览' } },
  { path: '/unity', name: 'unity', component: UnityView, meta: { title: 'Unity漫游' } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const base = '深圳职业技术大学'
  document.title = to.meta.title ? `${to.meta.title} · ${base}` : base
})

export default router
