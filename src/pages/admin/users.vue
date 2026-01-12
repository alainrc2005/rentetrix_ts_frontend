<template>
  <q-page class="q-pa-lg q-mt-md">
    <arc-window>
      <template #title>
        <q-icon name="mdi-shield-lock" size="sm" color="primary"/>
        {{ $t('users') }}
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
          <arc-no-data-found :show="table.length===0 && dataReady" />
          <div class="row fit" v-if="table.length>0">
            <div class="col-12">
              <q-table flat
                :grid="$q.screen.xs"
                :columns="columns"
                :rows="table"
                v-model:pagination="pagination"
                row-key="id"
                :rows-per-page-options="[10,25,50]"
                @request="onRequest"
                binary-state-sort
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td>{{ props.row.name }}</q-td>
                    <q-td>{{ props.row.email }}</q-td>
                    <q-td class="text-center">{{ props.row.phone }}</q-td>
                    <q-td auto-width key="active">
                      <q-toggle checked-icon="check" unchecked-icon="clear" size="xs"
                                :model-value="props.row.active === true" @update:model-value="()=>active(props.row)" />
                    </q-td>
                    <q-td auto-width class="text-center q-gutter-xs">
                      <q-btn @click.stop="update(props.row)" round color="positive" size="xs"
                             icon="mdi-square-edit-outline" />
                      <q-btn @click.stop="destroy(props.row.id)" round color="negative" size="xs" icon="mdi-delete" />
                    </q-td>
                  </q-tr>
                </template>
                <template v-slot:item="props">
                  <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
                    <q-card>
                      <q-list dense>
                        <q-item>
                          <q-item-section>
                            <q-item-label>{{ $t('full_name') }}</q-item-label>
                          </q-item-section>
                          <q-item-section class="text-right q-item__label q-item__label--caption text-caption">
                            <q-item-label caption>{{ props.row.name }}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <q-item-label>{{ $t('email') }}</q-item-label>
                          </q-item-section>
                          <q-item-section class="text-right q-item__label q-item__label--caption text-caption">
                            <q-item-label caption>{{ props.row.email }}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <q-item-label>{{ $t('phone') }}</q-item-label>
                          </q-item-section>
                          <q-item-section class="text-right q-item__label q-item__label--caption text-caption">
                            <q-item-label caption>{{ props.row.phone }}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <q-item-label>{{ $t('active') }}</q-item-label>
                          </q-item-section>
                          <q-item-section class="text-right q-item__label q-item__label--caption text-caption">
                            <q-item-label caption>
                              <q-toggle checked-icon="check" unchecked-icon="clear" size="xs"
                                        :model-value="props.row.active === true"
                                        @update:model-value="()=>active(props.row)" />
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                      <q-separator />
                      <q-card-actions align="center">
                        <q-btn @click="update(props.row)" color="positive" rounded size="xs" icon="mdi-square-edit-outline"
                               :label="$t('edit')" />
                        <q-btn @click="destroy(props.row.id)" color="negative" rounded size="xs" icon="mdi-delete"
                               :label="$t('remove')" />
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
    <arc-dialog ref="dlg" :title="$t('user')" @save="save" size="xs">
      <template #section>
        <q-input maxlength="150" v-model="v$.user.name.$model" :label="$t('full_name')" class="required"
                 :error="v$.user.name.$error" dense />
        <q-input maxlength="150" v-model="v$.user.email.$model" :label="$t('email')" class="required"
                 :error="v$.user.email.$error" dense />
        <q-input maxlength="20" v-model="user.phone" :label="$t('phone')" dense class="required"
                 :error="v$.user.phone.$error" />
        <div class="bg-secondary text-white q-pa-xs text-center rounded-borders q-my-sm">
          {{ $t('roles') }}
        </div>
        <div v-for="r in roles" :key="`fr${r.value}`">
          <q-toggle :label="r.label" checked-icon="check"
                    unchecked-icon="clear" size="xs" color="secondary"
                    :model-value="user.roles.includes(r.value as number)"
                    @update:model-value="e=>togglePermission(e, r.value as number)" />
        </div>
      </template>
    </arc-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch, computed, useTemplateRef } from 'vue'
import {
  initUser, type TOptionValue, type TUser,
  AskFor, ObjectAssign, appError, appSuccess, appWarning, TResults, executeCmd, RentetrixHttpService
} from 'src/helpers'
import useVuelidate from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import { initUserColumns } from 'src/helpers/initTableColumns'
import useDatatable from 'src/composables/useDatatable'
import ArcDialog from 'components/arcDialog.vue'
import type { TResult } from 'src/types'

const showTerms = ref(false)
const terms = reactive({
  search: null
})
const { table, dataReady, pagination, onRequest } = useDatatable('/users', 'name', false, terms)
const dlg = useTemplateRef<typeof ArcDialog>('dlg')
const roles = ref<Array<TOptionValue>>([])
const user = reactive(initUser())
const columns = computed(() => initUserColumns())
const v$ = useVuelidate({
  user: {
    name: { required },
    email: { required, email },
    phone: { required }
  }
}, { user })

function togglePermission(evt: Event, roleId: number) {
  if (roleId) {
    if (evt) user.roles.push(roleId)
    else user.roles.splice(user.roles.indexOf(roleId), 1)
  }
  v$.value.$touch()
}

function create() {
  ObjectAssign(user, initUser())
  v$.value.$reset()
  dlg.value?.show()
}

async function update(row: TUser) {
  return executeCmd(RentetrixHttpService.get(`/users/fetch/${row.id}`), r => {
    ObjectAssign(user, r.user)
    v$.value.$reset()
    dlg.value?.show()
  })
}

function destroy(id: number) {
  AskFor()
    .onOk(() => {
      void executeCmd(RentetrixHttpService.delete(`/users/destroy/${id}`), async () => {
        appSuccess()
        return onRequest({ pagination: pagination.value })
      }, null, 'e_removing')
    })
}

async function save() {
  v$.value.$touch()
  if (v$.value.$invalid) {
    return appWarning('w_validating_data')
  }
  const action: Promise<TResult> = user.id ?
    RentetrixHttpService.put(`/users/update/${user.id}`, user) :
    RentetrixHttpService.post('/users/store', user)
  return executeCmd(action,async () => {
    appSuccess()
    dlg.value?.hide()
    return onRequest({ pagination: pagination.value })
  }, e => {
    if (e.code === TResults.E_ROW_DUPLICATE) return appError(e.code)
    if (e.code !== TResults.OK) return appError('e_saving')
  }, 'e_saving')
}

async function active(row: TUser): Promise<void> {
  ObjectAssign(user, row)
  user.active = !user.active
  return save()
}

onMounted(async () => {
  return executeCmd(RentetrixHttpService.get('/roles/all'), async r => {
    roles.value = r.roles
    watch(terms, async () => {
      return onRequest({ pagination: pagination.value })
    })
    return onRequest({ pagination: pagination.value })
  })
})
</script>
