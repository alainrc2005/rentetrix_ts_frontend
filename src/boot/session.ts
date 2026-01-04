import { defineBoot } from '#q-app/wrappers'
import { SessionStorage } from 'quasar'
import { ksec, RentetrixCrypto } from 'src/helpers'
import { useAppStore } from 'stores/app-store'

export default defineBoot(async ({ app }) => {
  const store = useAppStore()
  if (SessionStorage.has('car')) {
    const user = await RentetrixCrypto.cryptoAesDecrypt(ksec, SessionStorage.getItem('car') || '')
    store.$patch({ logged: true, ...user })
  }
  app.provide('can', (...permission: Array<string>): boolean => store.checkPermission(permission))
})
