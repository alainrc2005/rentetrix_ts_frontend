import type {
   QNotifyUpdateOptions, QNotifyAction, QNotifyOptions, VueStyleObjectProp,
   QDialogOptions, QVueGlobals
} from 'quasar'
import {
   Dialog, Notify
} from 'quasar'
import { i18n } from 'src/i18n'
import type { Optional, Nullable, RentetrixLiteral } from 'src/types'
// https://github.com/quasarframework/quasar/issues/14122
//import Notify from 'quasar/src/plugins/notify/Notify'

let dismiss: (props?: QNotifyUpdateOptions) => void = () => void 0
const closeButton: Array<QNotifyAction> = [{
   icon: 'mdi-close-box',
   color: 'yellow',
   dense: true,
   label: i18n.global.t('close'),
   noCaps: true
}]

export function appError(message: string | RentetrixLiteral = 'e_get_data', timeout = 5000, position: QNotifyOptions['position'] = 'bottom', dismissed = true) {
   dismiss()
   const result = Notify.create({
      icon: 'mdi-alert-circle',
      color: 'negative',
      progress: true,
      html: true,
      position,
      timeout,
      message: typeof message === 'string' ? i18n.global.t(message) : message.text,
      multiLine: timeout === 0,
      actions: timeout === 0 ? closeButton : []
   })
   if (dismissed) {
      dismiss = result
   }
}

export function appSuccess(message = 's_successful', timeout = 5000, position: QNotifyOptions['position'] = 'bottom', dismissed = true) {
   dismiss()
   const result = Notify.create({
      icon: 'mdi-checkbox-marked-circle',
      color: 'positive',
      progress: true,
      html: true,
      position,
      message: i18n.global.t(message),
      multiLine: timeout === 0,
      timeout,
      actions: timeout === 0 ? closeButton : []
   })
   if (dismissed) {
      dismiss = result
   }
}

export function appWarning(message: string, timeout = 5000, position: QNotifyOptions['position'] = 'bottom', dismissed = true) {
   dismiss()
   const result = Notify.create({
      icon: 'mdi-flash-alert',
      color: 'deep-orange-6',
      progress: true,
      html: true,
      position,
      message: i18n.global.t(message),
      multiLine: timeout === 0,
      timeout,
      actions: timeout === 0 ? closeButton : []
   })
   if (dismissed) {
      dismiss = result
   }
}

export function AskFor(title: Optional<Nullable<string>> = null, message: Optional<Nullable<string>> = null, cancel = true) {
   const dlg: QDialogOptions = {
      title: title ?? i18n.global.t('confirmation'),
      message: message ?? i18n.global.t('m_ask_no_undo'),
      ok: {
         color: 'positive',
         flat: true,
         noCaps: true,
         icon: 'mdi-check',
         label: i18n.global.t('ok')
      },
      persistent: true
   }
   if (cancel) {
      dlg.cancel = {
         color: 'negative',
         flat: true,
         noCaps: true,
         icon: 'close',
         label: i18n.global.t('cancel')
      }
   }
   return Dialog.create(dlg)
}

export const v_thumbStyle: VueStyleObjectProp = {
   right: '-4px',
   borderRadius: '5px',
   backgroundColor: '#0078AE',
   width: '5px',
   opacity: '0.75'
}

export const v_barStyle: VueStyleObjectProp = {
   right: '-6px',
   borderRadius: '9px',
   backgroundColor: '#0078AE',
   width: '9px',
   opacity: '0.2'
}

export const modalWidth: { [key: string]: number } = {
   xs: 444,
   sm: 600,
   md: 900,
   lg: 1200,
   xl: 1536
}


function buildParams(pagination: RentetrixLiteral, search: string, selectors: Nullable<RentetrixLiteral> = null): string {
   const params: string[] = [
      `startRow=${(pagination.page - 1) * pagination.rowsPerPage}`,
      `rowsPerPage=${pagination.rowsPerPage}`,
      `sortBy=${pagination.sortBy ?? 'id'}`
   ]
   if (pagination.descending) {
      params.push('descending=true')
   }
   if (search) {
      params.push(`search=${search}`)
   }
   if (selectors) {
      Object.keys(selectors).forEach((key) => {
         params.push(`${key}=${selectors[key]}`)
      })
   }
   return `?${params.join('&')}`
}

function dataUrlToBlob(dataUrl: string): Blob {
   const arr = dataUrl.split(',')
   const mime = arr[0]?.match(/:(.*?);/)![1]

   const byteCharacters = atob(arr?.[1] || '')
   const byteNumbers = new Array(byteCharacters.length)
   for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.codePointAt(i)
   }
   return new Blob([new Uint8Array(byteNumbers)], { type: mime || 'application/octet-stream' })
}

function validateFile(file: File, mimetype: string = '', maxSize: number = 10 * 1024 * 1024) {
   if (mimetype && !file.type.startsWith(mimetype)) {
      return appError('e_invalid_file')
   }

   if (file.size === 0) {
      return appError('e_file_size_zero')
   }

   if (maxSize && file.size > maxSize) {
      return appError('e_max_file_size')
   }

   return true
}

const TResults = {
  E_USER_NOT_FOUND: 'e_user_not_found',
  E_BAD_USER_PASSWORD: 'e_bad_user_password',
  E_USER_BANNED: 'e_user_banned',
  E_COMMUNICATION: 'e_communication',
  E_ROW_DUPLICATE: 'e_row_duplicate',
  E_ROW_FOREIGN_KEY: 'e_row_foreign_key',
  E_RECORD_NOT_FOUND: 'e_record_not_found',
  E_PASSWORD_INVALID: 'e_password_invalid',
  /**
   * No autorizado
   */
  E_UNAUTHORIZED: 'e_unauthorized',
  /**
   * Invalid One Time Password code
   */
  E_BAD_OTP: 'e_bad_otp',
  OK: 'Ok',
  Error: 'Error'
}

const ksec = 'f0fcdd65e29c4c8aa0c24246d59ff1fc2f7464300b0f288d6495a1f7dd4509b5'

async function delay(seconds: number) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

function ObjectAssign(target: RentetrixLiteral, source: RentetrixLiteral) {
  Object.getOwnPropertyNames(target).forEach(property => {
    // eslint-disable-next-line no-prototype-builtins
    if (source.hasOwnProperty(property) && property !== '__ob__') {
      if (source[property] == null || typeof source[property] !== 'object' || Array.isArray(source[property])) {
        target[property] = source[property]
      } else {
        target[property] = { ...source[property] }
      }
    }
  })
  return target
}

const editorLanguageToolbar = ($q: QVueGlobals) => ([
  ['print', 'fullscreen'],
  ['left', 'center', 'right', 'justify'],
  ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
  [
    {
      icon: $q.iconSet.editor.fontSize,
      fixedLabel: true,
      fixedIcon: true,
      list: 'no-icons',
      options: [
        'size-1',
        'size-2',
        'size-3',
        'size-4',
        'size-5',
        'size-6',
        'size-7'
      ]
    }
  ],
  ['unordered', 'ordered', 'outdent', 'indent'],
  ['undo', 'redo', 'viewsource']
])

export { TResults, validateFile, dataUrlToBlob, buildParams, ksec, delay, ObjectAssign,
editorLanguageToolbar }
