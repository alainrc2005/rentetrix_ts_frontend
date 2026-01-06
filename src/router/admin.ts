import AppLanguage from 'pages/admin/app.languages.vue'
import EmailTemplate from 'pages/admin/email.templates.vue'

export default [
  {
    path: '/admin/language',
    component: AppLanguage,
    meta: {
      auth: true,
      roles: ['super-admin'],
      permissions: ['crud_users']
    }
  },
  {
    path: '/admin/email-template',
    component: EmailTemplate,
    meta: {
      auth: true,
      roles: ['super-admin'],
      permissions: ['crud_email_template', 'view_email_template']
    }
  }
]
