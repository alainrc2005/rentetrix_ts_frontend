import { defineBoot } from '#q-app/wrappers'
import { LoadingBar, type QVueGlobals } from 'quasar'
import type { Composer } from 'vue-i18n'
import MainLayout from 'layouts/main.vue'
import LoginLayout from 'layouts/login.vue'
import arcToolbar from 'components/arcToolbar.vue'
import arcNoDataFound from 'components/arcNoDataFound.vue'
import arcDialog from 'components/arcDialog.vue'
import arcWindow from 'components/arcWindow.vue'
import '@fontsource/rubik'
import 'animate.css'
import type { Router, RouteLocationNormalizedLoaded } from 'vue-router'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    LoginLayout: typeof LoginLayout
    MainLayout: typeof MainLayout
    arcToolbar: typeof arcToolbar
    arcNoDataFound: typeof arcNoDataFound
    arcDialog: typeof arcDialog
    arcWindow: typeof arcWindow
  }
  interface ComponentCustomProperties {
    $q: QVueGlobals
    $t: Composer['t']
    $router: Router
    $route: RouteLocationNormalizedLoaded
  }
}


export default defineBoot(({ app }) => {
  app.component('LoginLayout', LoginLayout)
  app.component('MainLayout', MainLayout)
  app.component('arcToolbar', arcToolbar)
  app.component('arcNoDataFound', arcNoDataFound)
  app.component('arcDialog', arcDialog)
  app.component('arcWindow', arcWindow)
  LoadingBar.setDefaults({
    size: '4px',
    color: 'red-6'
  })
})
