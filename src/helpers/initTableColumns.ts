import { i18n } from 'src/i18n'
import type { QTableProps } from 'quasar'

function initAppLanguageColumns(): QTableProps['columns'] {
  return [
    {
      name: 'key',
      label: i18n.global.t('th_key'),
      field: 'key',
      align: 'left',
      sortable: true
    },
    {
      name: 'name_es',
      label: i18n.global.t('spanish'),
      align: 'left',
      field: 'name_en',
      sortable: true
    },
    {
      name: 'actions',
      label: i18n.global.t('action'),
      field: '',
      align: 'center',
      sortable: false
    }
  ]
}

export { initAppLanguageColumns }
