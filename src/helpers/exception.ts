import type { Optional, RentetrixLiteral } from 'src/types'

/**
 * Clase para el tratamiento de excepciones
 * @author Alain Ramírez Cabrejas <alainrc2005@gmail.com>
 */
export class RentetrixException extends Error {
   public readonly code: string
   public readonly data: Optional<RentetrixLiteral>

   constructor(code: string, message?: string, data?: RentetrixLiteral) {
      super()
      this.name = 'RentetrixException'
      this.code = code
      this.message = message ?? code
      this.data = data

      Error.captureStackTrace(this, this.constructor);
   }
}
