import AppLanguage from 'pages/admin/app.languages.vue'

export default [
  {
    path: '/admin/language',
    component: AppLanguage,
    meta: {
      auth: true,
      roles: ['super-admin'],
      permissions: ['crud_users']
    }
  }
]
