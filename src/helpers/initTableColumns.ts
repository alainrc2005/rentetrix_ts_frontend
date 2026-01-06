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

function initEmailTemplateColumns(): QTableProps['columns'] {
  return [
    {
      name: 'name',
      label: i18n.global.t('name'),
      field: 'name',
      align: 'left',
      sortable: true
    },
    {
      name: 'updated_at',
      label: i18n.global.t('updated_at'),
      field: 'updated_at',
      align: 'center',
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

export { initAppLanguageColumns, initEmailTemplateColumns }
