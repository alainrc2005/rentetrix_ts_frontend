import { api, apiVersion, constant } from 'boot/axios.js'
import { db } from 'boot/dexie.js'
import { appError } from 'src/helpers/index'
import type { ICodeValue } from 'src/types'

export async function syncCategories() {
  console.info('syncCategories ')
  return api.get(apiVersion + '/categories')
    .then(async (r) => {
      if (r.data.code !== 'Ok') return false
      for (const name in r.data.lookups) {
        if (r.data.lookups[name].length !== 0) {
          if (!db.table(name)) continue
          await db.table(name).clear()
          const res = await db.table(name).bulkPut(r.data.lookups[name])
          if (!res) return false
        }
      }
      r.data.options.forEach((option: { code: string, value: any}) => {
        constant[option.code] = option.value
      })
      constant.today = r.data.today
    })
    .catch(e => {
      console.error(e)
      appError('e_communication')
    })
}

export async function getCodeTypes(table: string): Promise<Array<ICodeValue>> {
  const rows = await db.table(table).toArray()
  const map = rows.map(cs => {
    return {
      value: cs.code as string,
      label: `${cs.code} - ${cs.description ?? cs.name}`,
      disable: cs.active === 0
    } as ICodeValue
  })
  return map.sort((a, b) => a.value.localeCompare(b.value))
}

export async function getCategoryTypes(table: string): Promise<Array<ICodeValue>> {
  const rows = await db.table(table).toArray()
  const map = rows.map(cs => {
    return {
      value: cs.id as string,
      label: cs.name,
      disable: cs.active === 0
    } as ICodeValue
  })
  return map.sort((a, b) => a.label.localeCompare(b.label))
}
