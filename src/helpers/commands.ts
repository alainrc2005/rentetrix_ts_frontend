import { appError, TResults } from './common'
import { api, apiVersion } from 'boot/axios'
import type { RentetrixLiteral } from 'src/types'


type CommandCallback = null | ((e: any) => void | Promise<void>)
export async function executeCmd(url: string, callback: CommandCallback, errorCallback?: CommandCallback, error = 'e_get_data') {
  return api.post(apiVersion + url).then(r => {
    if (r.data.code !== TResults.OK) {
      if (errorCallback) {
        return errorCallback(r.data)
      }
      return appError(error)
    }
    if (callback) return callback(r.data)
  }).catch(e => {
    if (errorCallback) {
      return errorCallback(e)
    }
    appError(error)
    console.error(e)
  })
}

export function executeCmdData(url: string, data: RentetrixLiteral, callback?: CommandCallback, errorCallback?: CommandCallback, error = 'e_get_data') {
  return api.post(apiVersion + url, data).then(r => {
    if (r.data.code !== TResults.OK) {
      if (errorCallback) {
        return errorCallback(r.data)
      }
      return appError(error)
    }
    if (callback) return callback(r.data)
  }).catch(e => {
    if (errorCallback) {
      return errorCallback(e)
    }
    appError(error)
    console.error(e)
  })
}

export function executeCmdFormData(url: string, data: FormData, callback?: CommandCallback, errorCallback?: CommandCallback, error = 'e_get_data') {
  return api.post(apiVersion + url, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(r => {
    if (r.data.code !== TResults.OK) {
      if (errorCallback) {
        return errorCallback(r.data)
      }
      return appError(error)
    }
    if (callback) return callback(r.data)
  }).catch(e => {
    if (errorCallback) {
      return errorCallback(e)
    }
    appError(error)
    console.error(e)
  })
}
