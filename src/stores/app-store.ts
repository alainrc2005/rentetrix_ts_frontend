import { defineStore } from 'pinia'
import type { Optional } from 'src/types'

interface IAppState {
  layout: string
  userid: Optional<number>
  name: Optional<string>
  email: Optional<string>
  token: Optional<string>
  logged: boolean
  roles: Array<string>
  permissions: Array<string>
  locale: string
}

const initAppStore = (): IAppState => ({
  layout: 'login',
  userid: undefined,
  name: undefined,
  email: undefined,
  token: undefined,
  logged: false,
  roles: [],
  permissions: [],
  locale: 'es'
})

export const useAppStore = defineStore('app', {
  state: () => initAppStore(),

  getters: {
    authorizationCode: (state: IAppState) => `Bearer ${state.token}`,
    isAdmin: (state: IAppState) => state.roles.includes('administrators'),
    isSuperAdmin: (state: IAppState) => state.roles.includes('super-admin'),
    checkPermission: (state: IAppState) => {
      return function (permission: Array<string>) {
        return permission.reduce((acc, r) => {
          return acc || state.permissions.includes(r)
        }, false)
      }
    }
  },

  actions: {
    checkRoles(roles: Array<string>) {
      return this.roles.some(value => roles.includes(value))
    }
  }
})

export type IAppStore = ReturnType<typeof useAppStore>
