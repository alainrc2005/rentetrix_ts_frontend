import { appError, TResults } from './index'
import type { TResult } from 'src/types'

export type CommandCallback = null | ((e: any) => void | Promise<void>)

export function executeCmd(promise: Promise<any>, callback?: CommandCallback, errorCallback?: CommandCallback, error = 'e_get_data'): Promise<void> {
   return promise.then((r: TResult) => {
      if (r.code !== TResults.OK) {
         if (errorCallback) {
            return errorCallback(r)
         }
         return appError(error)
      }
      if (callback) return callback(r)
   }).catch((e: unknown) => {
      if (errorCallback) {
         return errorCallback(e)
      }
      appError(error)
      console.error(e)
   })
}
