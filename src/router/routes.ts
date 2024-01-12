import { RouteRecordRaw } from 'vue-router'
export const commonRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/',
        name: 'Index',
        component: () => import('@/views/workspace/index.vue'),
      },
    ],
  },
]
