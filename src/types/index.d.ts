/**
 * @author Alain Ramírez Cabrejas <alainrc2005@gmail.com>
 */

type Nullable<T> = T|null
type Optional<T> = T|undefined

type TMetaFileStorage = {
   uuid: string,
   filename: string,
   mimeType: string,
   size: number
}

type TResult = { [key: string]: any }

interface RentetrixLiteral {
  [key: string]: any;
}

type TCheckPermission = (...permission: Array<string>) => boolean
type TConstants = { APP_VERSION: string, SERVER_URL: string, today: string, valid_currencies: Array<string> } & RentetrixLiteral
type TCan = (...permission: Array<string>) => boolean
interface ICodeValue {
  value: string,
  label: string,
  disable?: boolean
}
export type { Nullable, Optional, TMetaFileStorage, TResult, RentetrixLiteral, TCheckPermission,
TConstants, TCan, ICodeValue }
