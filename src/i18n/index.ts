import { createI18n } from 'vue-i18n'
import enUS from './en'
import es from './es'

const messages = {
  'en-US': enUS,
  'es': es,
}

export type MessageLanguages = keyof typeof messages;
// Type-define 'en-US' as the master schema for the resource
export type MessageSchema = typeof enUS;

// See https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {
  }

  // define the datetime format schema
  export interface DefineDateTimeFormat {
  }

  // define the number format schema
  export interface DefineNumberFormat {
  }
}

const i18n = createI18n({
  locale: 'es',
  legacy: false,
  globalInjection: true,
  warnHtmlInMessage: 'off',
  messages,
})

export { i18n, messages }
