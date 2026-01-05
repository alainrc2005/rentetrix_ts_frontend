<script setup lang="ts">
import { computed, onMounted, reactive, ref, useTemplateRef, watch } from 'vue'
import {
  initAppLanguage,
  appSuccess, editorLanguageToolbar, ObjectAssign,
  initAppLanguageColumns, executeCmd, RentetrixHttpService
} from 'src/helpers'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import ArcDialog from 'components/arcDialog.vue'
import useDatatable from 'src/composables/useDatatable'

const terms = reactive({
  search: null
})
const showTerms = ref(false)
const dlg = useTemplateRef<typeof ArcDialog>('dlg')
const row = reactive(initAppLanguage())
const v$ = useVuelidate({
  row: {
    name_en: { required },
    name_es: { required },
    name_fr: { required }
  }
}, { row })
const columns = computed(() => initAppLanguageColumns())
const { table, dataReady, pagination, onRequest } = useDatatable('/language', 'key', true, terms)

async function edit(id: number) {
  return executeCmd(RentetrixHttpService.get(`/categories/language/fetch/${id}`), r => {
    ObjectAssign(row, r.row)
    v$.value.$reset()
    dlg.value?.show()
  })
}

async function save() {
  return executeCmd(RentetrixHttpService.put('/categories/language/update', { row }), async () => {
    appSuccess('s_successful')
    dlg.value?.hide()
    return onRequest({ pagination: pagination.value })
  }, null, 'e_saving')
}

onMounted(async () => {
  watch(terms, async () => {
    pagination.value.page = 1
    return onRequest({ pagination: pagination.value })
  })
  return onRequest({ pagination: pagination.value })
})
</script>

<template>
  <q-page class="q-pa-lg q-mt-md">
    <arc-window>
      <template #title>
        <q-icon name="mdi-flag" size="sm" color="primary"/>
        {{ $t('app_languages') }}
        <q-badge color="red-6" :label="pagination.rowsNumber" align="top"/>
      </template>
      <template #buttons>
        <div class="row">
          <q-btn icon="search" color="primary" dense flat @click="showTerms=!showTerms">
            <q-tooltip> {{ $t('search') }}</q-tooltip>
          </q-btn>
        </div>
      </template>
      <template #form>
        <div class="row fit" v-if="showTerms">
          <div class="col-md-3 col-sm-6 col-xs-12 q-pa-sm  ">
            <q-input v-model="terms.search" debounce="750" :label="$t('type_here')" filled clearable/>
          </div>
        </div>
        <arc-no-data-found :show="table.length===0 && dataReady"/>
        <div class="row fit q-mt-xs" v-if="table.length>0">
          <div class="col-12">
            <q-table
              :grid="$q.screen.xs"
              :columns="columns"
              :rows="table"
              v-model:pagination="pagination"
              row-key="id"
              :rows-per-page-options="[10,25,50]"
              @request="onRequest"
              binary-state-sort
              dense
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td auto-width>{{ props.row.key }}</q-td>
                  <q-td>
                    <div style="overflow: hidden; white-space: normal" v-html="props.row.name_es"/>
                  </q-td>
                  <q-td auto-width class="text-center q-gutter-xs">
                    <q-btn @click="edit(props.row.id)" round color="positive" size="xs" icon="mdi-square-edit-outline"/>
                  </q-td>
                </q-tr>
              </template>
              <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3">
                  <q-card>
                    <q-list dense>
                      <q-item>
                        <q-item-section>
                          <q-item-label>{{ $t('spanish') }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-item-label caption>
                            <div style="overflow: hidden; white-space: normal" v-html="props.row.name_es"/>
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                    <q-separator/>
                    <q-card-actions align="center">
                      <q-btn @click="edit(props.row.id)" color="positive" rounded size="xs" icon="mdi-square-edit-outline"
                             :label="$t('edit')"/>
                    </q-card-actions>
                  </q-card>
                </div>
              </template>
            </q-table>
          </div>
          <arc-dialog ref="dlg" size="md" :title="$t('language')" :disable="v$.$invalid" @save="save"
                      show-btn-maximize>
            <template #section>
              <div class="bg-info text-black q-pa-md text-center rounded-borders">{{ $t('spanish') }}</div>
              <q-input v-if="row.type==='text'" autofocus v-model="v$.row.name_es.$model"
                       :error="v$.row.name_es.$error" hide-bottom-space filled/>
              <q-editor v-else v-model="v$.row.name_es.$model" :label="$t('spanish')" toolbar-outline
                        square class="q-mt-md" min-height="10em" :toolbar="editorLanguageToolbar($q)"
                        :dense="$q.screen.lt.md"/>
              <div class="bg-info text-black q-pa-md text-center rounded-borders">{{ $t('english') }}</div>
              <q-input v-if="row.type==='text'" autofocus v-model="v$.row.name_en.$model"
                       :error="v$.row.name_en.$error" hide-bottom-space filled/>
              <q-editor v-else v-model="v$.row.name_en.$model" :label="$t('english')" toolbar-outline
                        square class="q-mt-md" min-height="10em" :toolbar="editorLanguageToolbar($q)"
                        :dense="$q.screen.lt.md"/>
              <div class="bg-info text-black q-pa-md text-center rounded-borders">{{ $t('french') }}</div>
              <q-input v-if="row.type==='text'" autofocus v-model="v$.row.name_fr.$model"
                       :error="v$.row.name_fr.$error" hide-bottom-space filled/>
              <q-editor v-else v-model="v$.row.name_fr.$model" :label="$t('french')" toolbar-outline
                        square class="q-mt-md" min-height="10em" :toolbar="editorLanguageToolbar($q)"
                        :dense="$q.screen.lt.md"/>
            </template>
          </arc-dialog>
        </div>
        </template>
    </arc-window>
  </q-page>
</template>
