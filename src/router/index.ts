import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'generate',
      component: () => import('../views/GenerateView.vue'),
      meta: { title: '视频生成工作台' }
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/HistoryView.vue'),
      meta: { title: '生成历史' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || '首页'} - ${import.meta.env.VITE_APP_TITLE}`
  next()
})

export default router