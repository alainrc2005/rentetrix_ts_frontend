import AppLanguage from 'pages/admin/app.languages.vue'
import EmailTemplate from 'pages/admin/email.templates.vue'
import Roles from 'pages/admin/roles.vue'
import Users from 'pages/admin/users.vue'

export default [
  {
    path: '/admin/language',
    component: AppLanguage,
    meta: {
      auth: true,
      permissions: ['crud_language']
    }
  },
  {
    path: '/admin/email-template',
    component: EmailTemplate,
    meta: {
      auth: true,
      permissions: ['crud_email_template', 'view_email_template']
    }
  },
  {
    path: '/admin/roles',
    component: Roles,
    meta: {
      auth: true,
      permissions: ['crud_roles']
    }
  },
  {
    path: '/admin/users',
    component: Users,
    meta: {
      auth: true,
      permissions: ['crud_users']
    }
  }
]
