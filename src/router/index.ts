import { createRouter, createWebHistory } from 'vue-router'
import { commonRoutes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: commonRoutes,

  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})
export default router
