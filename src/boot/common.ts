import { defineBoot } from '#q-app/wrappers'
import { LoadingBar, type QVueGlobals } from 'quasar'
import type { Composer } from 'vue-i18n'
import MainLayout from 'layouts/main.vue'
import LoginLayout from 'layouts/login.vue'
import '@fontsource/rubik'
import 'animate.css'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    LoginLayout: typeof LoginLayout
    MainLayout: typeof MainLayout
  }
  interface ComponentCustomProperties {
    $q: QVueGlobals
    $t: Composer['t']
  }
}


export default defineBoot(({ app }) => {
  app.component('LoginLayout', LoginLayout)
  app.component('MainLayout', MainLayout)
  LoadingBar.setDefaults({
    size: '4px',
    color: 'red-6'
  })
})
