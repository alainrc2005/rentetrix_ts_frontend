import { ref } from 'vue'
import { initPagination, executeCmd, RentetrixHttpService } from 'src/helpers'
import type { Optional, RentetrixLiteral } from 'src/types'

type Callback = (data: any) => void
export default function useDatatable(url: string, sortBy = 'name', descending = false,
                                     terms: Optional<RentetrixLiteral> = undefined,
                                     callback: Optional<Callback> = undefined) {
  const table = ref([])
  const dataReady = ref(false)
  const pagination = ref(initPagination(sortBy, descending))

  async function onRequest(props: RentetrixLiteral): Promise<void> {
    const {
      page,
      rowsPerPage,
      sortBy,
      descending
    } = props.pagination
    const startRow = (page - 1) * rowsPerPage
    const send = {
      startRow,
      rowsPerPage,
      sortBy,
      descending,
      terms
    }
    if (terms) {
      send.terms = terms
    }
    return executeCmd(RentetrixHttpService.post(url, send), r => {
      table.value = r.dt.rows
      pagination.value.rowsNumber = r.dt.recordsFiltered
      pagination.value.page = page
      pagination.value.rowsPerPage = rowsPerPage
      pagination.value.sortBy = sortBy
      pagination.value.descending = descending
      dataReady.value = true
      if (callback) {
        callback(r)
      }
    })
  }

  return {
    table,
    dataReady,
    pagination,
    onRequest
  }
}
