import { defineRouter } from '#q-app/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import routes from './routes'
import { useAppStore } from 'stores/app-store'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  const store = useAppStore()
  Router.beforeEach((to, from, next) => {
    const sent = '/'
    if (to?.meta?.layout) {
      store.$patch({ layout: to.meta.layout })
    } else {
      store.$patch({ layout: 'main' })
    }
    if (to.path === '/login' && store.logged) {
      return next(sent)
    }
    if (to.matched.some(record => record.meta.auth)) {
      if (to.meta?.auth === true) {
        if (!store.logged && to.path !== '/login') {
          next('/login')
        }
      }
    }
    if (!store.isSuperAdmin) {
      if (to?.meta?.excludes && store.checkPermission(to.meta.excludes)) {
        next(sent)
      }
      if (to?.meta?.permissions && !store.checkPermission(to.meta.permissions)) {
        next(sent)
      }
      if (to?.meta?.roles && !store.checkRoles(to.meta.roles)) {
        next(sent)
      }
    }
    next()
  })

  return Router
})
