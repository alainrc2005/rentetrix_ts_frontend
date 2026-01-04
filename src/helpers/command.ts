/**
 * Clase para el tratamiento de peticiones a servidor
 * @author Alain Ramírez Cabrejas <alainrc2005@gmail.com>
 */
import { firstValueFrom, map, from } from 'rxjs'
import { api, apiVersion } from 'boot/axios'
import type { TResult } from 'src/types'

class RentetrixHttpService {

   /**
    * Servicio Http.FILE
    * @param path Ruta de acceso a invocar
    */
   static async file(path: string): Promise<string> {
      return firstValueFrom(
         from(api.get<Blob>(apiVersion + path, {
             responseType: 'blob'
         }))
             .pipe(map(res => URL.createObjectURL(res.data)))
      )
   }

   /**
    * Servicio Http.GET
    * @param path Ruta de acceso a invocar
    */
   static async get(path: string): Promise<TResult> {
      return firstValueFrom(
         from(api.get<TResult>(apiVersion + path)).pipe(map(res => res.data))
      )
   }

   /**
    * Servicio Http.POST
    * @param path Ruta de acceso a invocar
    * @param data Datos
    */
   static async post(path: string, data: any): Promise<TResult> {
      return firstValueFrom(
         from(api.post<TResult>(apiVersion + path, data)).pipe(map(res => res.data))
      )
   }

  /**
   * Servicio Http.POST
   * @param path Ruta de acceso a invocar
   * @param data Datos
   */
  static async postForm(path: string, data: any): Promise<TResult> {
    return firstValueFrom(
      from(api.postForm<TResult>(apiVersion + path, data)).pipe(map(res => res.data))
    )
  }

   /**
    * Servicio Http.PUT
    * @param path Ruta de acceso a invocar
    * @param data Datos
    */
   static async put(path: string, data: any): Promise<TResult> {
      return firstValueFrom(
         from(api.put<TResult>(apiVersion + path, data)).pipe(map(res => res.data))
      )
   }

   /**
    * Servicio Http.DELETE
    * @param path Ruta de acceso a invocar
    */
   static async delete(path: string): Promise<TResult> {
      return firstValueFrom(
         from(api.delete<TResult>(apiVersion + path)).pipe(map(res => res.data))
      )
   }
}

export { RentetrixHttpService }
