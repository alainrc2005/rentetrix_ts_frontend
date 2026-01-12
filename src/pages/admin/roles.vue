<template>
  <q-page class="q-pa-lg q-mt-md">
    <arc-window>
      <template #title>
        <q-icon name="mdi-shield-lock" size="sm" color="primary"/>
        {{ $t('roles') }}
        <q-badge color="red" align="top" rounded>{{ pagination.rowsNumber }}</q-badge>
      </template>
      <template #buttons>
        <div class="row">
          <q-btn icon="search" color="primary" dense flat @click="showTerms = !showTerms">
            <q-tooltip>
              {{ $t('search') }}
            </q-tooltip>
          </q-btn>
          <q-btn icon="mdi-plus" color="primary" dense flat @click="create">
            <q-tooltip>
              {{ $t('add') }}
            </q-tooltip>
          </q-btn>
        </div>
      </template>
      <template #default>
        <q-separator/>
        <q-card-section v-if="showTerms" class="bg-grey-3">
          <q-input autofocus debounce="500" v-model="terms.search" :label="$t('type_here')" clear-icon="close" clearable
                   dense/>
        </q-card-section>
        <q-card-section class="q-pa-none">
          <arc-no-data-found :show="table.length===0 && dataReady"/>
          <div class="row fit" v-if="table.length>0">
            <div class="col-12">
              <q-table flat
                       :grid="$q.screen.xs"
                       :rows="table"
                       :columns="columns"
                       v-model:pagination="pagination"
                       row-key="id"
                       :rows-per-page-options="[10,25,50]"
                       @request="onRequest"
                       binary-state-sort
              >
                <template #body="props">
                  <q-tr :props="props">
                    <q-td>{{ props.row.description }}</q-td>
                    <q-td auto-width class="text-center q-gutter-xs">
                      <q-btn @click="edit(props.row)" round color="positive" size="xs" icon="mdi-square-edit-outline"/>
                      <q-btn :disabled="props.row.system===true" @click="destroy(props.row.id)"
                             round color="negative" size="xs" icon="mdi-delete"/>
                    </q-td>
                  </q-tr>
                </template>
                <template #item="props">
                  <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
                    <q-card>
                      <q-list dense>
                        <q-item>
                          <q-item-section>
                            <q-item-label>{{ $t('rol') }}</q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-item-label caption>{{ props.row.description }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                      <q-separator/>
                      <q-card-actions align="center">
                        <q-btn @click="edit(props.row)" color="positive" rounded size="xs"
                               icon="mdi-square-edit-outline"
                               :label="$t('edit')"/>
                        <q-btn :disabled="props.row.system===true"
                               @click="destroy(props.row.id)" color="negative"
                               rounded size="xs" icon="mdi-delete" :label="$t('remove')"/>
                      </q-card-actions>
                    </q-card>
                  </div>
                </template>
              </q-table>
            </div>
          </div>
        </q-card-section>
      </template>
    </arc-window>

    <arc-dialog :title="$t('rol')" ref="dlg" :disable="v$.$invalid || !v$.$anyDirty" @save="save">
      <template #section>
        <q-input dense hide-bottom-space v-model="v$.row.description.$model"
                 :label="$t('name')" :error="v$.row.description.$error" :readonly="row.system"/>
        <q-scroll-area style="height: 250px">
          <q-list dense>
            <q-item clickable :key="p.value" v-for="p in permissions" @click="togglePermission(p.value)">
              <q-item-section>{{ p.label }}</q-item-section>
              <q-item-section side>
                <q-toggle :model-value="row.permissions.includes(p.value as number)"
                          @update:model-value="()=>togglePermission(p.value)"/>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
        <hr/>
      </template>
    </arc-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, watch, reactive, ref, computed, useTemplateRef } from 'vue'
import useVuelidate from '@vuelidate/core'
import {
  AskFor, ObjectAssign, appError, appSuccess, TResults,
  initRole, type TOptionValue, type TRole, executeCmd, RentetrixHttpService
} from 'src/helpers'
import { initRolesColumns } from 'src/helpers/initTableColumns'
import { required } from '@vuelidate/validators'
import useDatatable from 'src/composables/useDatatable'
import ArcDialog from 'components/arcDialog.vue'
import { kebabCase } from 'lodash'

const showTerms = ref(false)
const terms = reactive({
  search: null
})
const { table, dataReady, pagination, onRequest } = useDatatable('/roles', 'name', false, terms)
const dlg = useTemplateRef<typeof ArcDialog>('dlg')
const permissions = ref<Array<TOptionValue>>([])
const row = reactive(initRole())
const columns = computed(() => initRolesColumns())
const v$ = useVuelidate({
  row: {
    description: { required }
  }
}, { row })

function create() {
  ObjectAssign(row, initRole())
  v$.value.$reset()
  dlg.value?.show()
}

async function edit(role: TRole) {
  return executeCmd(RentetrixHttpService.get(`/roles/fetch/${role.id}`), r => {
    ObjectAssign(row, role)
    row.permissions = r.permissions
    v$.value.$reset()
    dlg.value?.show()
  })
}

function destroy(id: number) {
  AskFor().onOk(() => {
    void executeCmd(RentetrixHttpService.delete(`/roles/destroy/${id}`), () => {
      appSuccess()
      dlg.value?.hide()
      return onRequest({ pagination: pagination.value })
    }, null, 'e_removing')
  })
}

function save() {
  if (!row.system) {
    row.name = kebabCase(row.description)
  }
  const action = row.id ? RentetrixHttpService.put(`/roles/update/${row.id}`, row) : RentetrixHttpService.post('/roles/store', row)
  return executeCmd(action, () => {
    appSuccess()
    dlg.value?.hide()
    return onRequest({ pagination: pagination.value })
  }, e => {
    return appError(e.code === TResults.E_ROW_DUPLICATE ? TResults.E_ROW_DUPLICATE : 'e_saving')
  })
}

function togglePermission(id: number | string) {
  if (id) {
    const io = row.permissions.indexOf(id as number)
    if (io === -1) {
      row.permissions.push(id as number)
    } else {
      row.permissions.splice(io, 1)
    }
  }
  v$.value.$touch()
}

onMounted(() => {
  return executeCmd(RentetrixHttpService.get('/roles/permissions'), r => {
    permissions.value = r.permissions
    watch(terms, () => onRequest({ pagination: pagination.value }))
    return onRequest({ pagination: pagination.value })
  })
})
</script>
