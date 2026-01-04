import { defineBoot } from '#q-app/wrappers'
import { Dexie } from 'dexie'
import { Notify } from 'quasar'
import { i18n } from 'src/i18n'
import { syncCategories } from 'src/helpers/categories'

const db = new Dexie('car')
export default defineBoot(async (/* { app, router, ... } */) => {
  await db.delete()
  db.version(1).stores({
    fuel_types: 'id',
    satisfaction_levels: 'id',
    phone_gps_status: 'id',
    payment_status: 'id',
    genders: 'id',
    countries: 'id',
    contact_forms: 'id',
    channels: 'id',
    car_status: 'id',
    sys_language: 'key'
  })
  await db.open().then(async () => {
    console.info('Local Database Opened')
    await syncCategories()
  }).catch(() => {
    Notify.create({
      icon: 'mdi-clippy',
      color: 'negative',
      progress: true,
      message: i18n.global.t('e_local_database')
    })
  })
})

export { db }
