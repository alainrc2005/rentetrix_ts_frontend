import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'es',
  legacy: false,
  globalInjection: true,
  warnHtmlInMessage: 'off',
  messages: {},
})

export { i18n }
