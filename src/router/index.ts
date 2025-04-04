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
    },
    {
      path: '/outline',
      name: 'outline',
      component: () => import('../views/OutlineView.vue'),
      meta: { title: '视频提纲生成' }
    },
    {
      path: '/script/:id',
      name: 'script-edit',
      component: () => import('../views/ScriptEditView.vue'),
      meta: { title: '脚本编辑' }
    },
    {
      path: '/data',
      name: 'data',
      component: () => import('../views/DataView.vue'),
      meta: { title: '数据展示' }
    },
    {
      path: '/scripts',
      name: 'scripts',
      component: () => import('../views/ScriptView.vue'),
      meta: { title: '脚本管理' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || '首页'} - ${import.meta.env.VITE_APP_TITLE}`
  next()
})

export default router