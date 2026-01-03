import { defineBoot } from '#q-app/wrappers'
import axios, { type CreateAxiosDefaults } from 'axios'
import type { TConstants } from 'src/types'
import { useAppStore } from 'stores/app-store'
import { appError } from 'src/helpers'

const constant: TConstants = {
  APP_VERSION: '1.3.1',
  SERVER_URL: process.env.SERVER_URL ?? '',
  today: '',
  valid_currencies: []
}

const apiVersion = '/api'

const api = axios.create({
  baseURL: constant.SERVER_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Origin': '*'
  },
  withCredentials: false,
  withXSRFToken: true,
  timeout: 60 * 5 * 1000
} as CreateAxiosDefaults)

export default defineBoot(({ app }) => {
  app.provide('constant', constant)
  app.provide('api', api)
  api.defaults.baseURL = constant.SERVER_URL

  const store = useAppStore()
  api.interceptors.request.use(config => {
    config.headers.Authorization = store.authorizationCode
    return config
  })
  api.interceptors.response.use((response) => {
    if (response.status === 401) {
      appError('e_session_expired', 5_000, 'center')
      globalThis.location.href = '/logout'
    }
    return response
  }, (error) => {
    if (error.response?.status === 401) {
      appError('e_session_expired', 5_000, 'center')
      globalThis.location.href = '/logout'
    }
    return Promise.reject(new Error(JSON.stringify(error)))
  })
})

export { api, constant, apiVersion }
