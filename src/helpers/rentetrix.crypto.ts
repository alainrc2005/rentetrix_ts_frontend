import * as WebCrypto from './packages/webcrypto'
import { Buffer } from 'buffer'
import { RentetrixException } from 'src/helpers/exception'

export class RentetrixCrypto {

   public static async cryptoAesEncrypt(key: string, value: any): Promise<string> {
      const keyImport = await WebCrypto.importKey(WebCrypto.bufferToArrayBuffer(Buffer.from(key, 'hex')))
      const encrypted = await WebCrypto.encrypt(keyImport, value)
      return encrypted.iv + ':' + encrypted.ciphertext
   }

   public static async cryptoAesDecrypt(key: string, value: string): Promise<any> {
      const keyImport = await WebCrypto.importKey(WebCrypto.bufferToArrayBuffer(Buffer.from(key, 'hex')))
      const [ iv, ciphertext ] = value.split(':')
     if (!iv || !ciphertext) {
       throw new RentetrixException('e_crypto_error')
     }
      const cipherData: WebCrypto.CipherData = { iv, ciphertext }
      return WebCrypto.decrypt(keyImport, cipherData)
   }
}
