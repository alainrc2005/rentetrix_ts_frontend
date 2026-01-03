import type { RouteRecordRaw } from 'vue-router'
import Index from 'src/pages/index.vue'
import Login from 'src/pages/login.vue'
import Error404 from 'src/pages/error404.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Index, meta: { auth: true } },
  { path: '/login', component: Login, meta: { layout: 'login' } },
  {
    path: '/:catchAll(.*)*', component: Error404,
  },
]

export default routes
