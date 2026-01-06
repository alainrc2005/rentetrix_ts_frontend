<script setup lang="ts">
import { computed, onMounted, reactive, ref, useTemplateRef, watch } from 'vue'
import { initEmailTemplate } from 'src/helpers/initModels'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import {
  appSuccess, editorLanguageToolbar, formatDateTime, ObjectAssign, RentetrixHttpService,
  executeCmd, initEmailTemplateColumns, isHtmlEmpty, appWarning
} from 'src/helpers'
import useDatatable from 'src/composables/useDatatable'
import ArcDialog from 'components/arcDialog.vue'

const terms = reactive({
  search: null
})
const showTerms = ref(false)
const dlg = useTemplateRef<typeof ArcDialog>('dlg')
const row = reactive(initEmailTemplate())
const v$ = useVuelidate({
  row: {
    name: { required },
    subject_en: { required },
    subject_es: { required },
    subject_fr: { required },
    mail_en: { required },
    mail_es: { required },
    mail_fr: { required }
  }
}, { row })
const columns = computed(() => initEmailTemplateColumns())
const { table, dataReady, pagination, onRequest } = useDatatable('/email-template', 'name', true, terms)

async function edit(id: number) {
  return executeCmd(RentetrixHttpService.get(`/email-template/fetch/${id}`), r => {
    ObjectAssign(row, r.row)
    v$.value.$reset()
    dlg.value?.show()
  })
}


async function save() {
  if (isHtmlEmpty(row.mail_es) || isHtmlEmpty(row.mail_en) || isHtmlEmpty(row.mail_fr)) {
    return appWarning('w_validating_data')
  }
  return executeCmd(RentetrixHttpService.put(`/email-template/update/${row.id}`, row), async () => {
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
        <q-icon name="mdi-email-edit" size="sm" color="primary"/>
        {{ $t('email_templates') }}
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
          <div class="col-12 q-pa-sm">
            <q-input v-model="terms.search" debounce="750" :label="$t('type_here')" filled clearable autofocus/>
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
                  <q-td>{{ props.row.name }}</q-td>
                  <q-td auto-width>{{ formatDateTime(props.row.updated_at) }}</q-td>
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
                          <q-item-label>{{ $t('english') }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-item-label caption>{{ props.row.subject_en }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          <q-item-label>{{ $t('spanish') }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-item-label caption>{{ props.row.subject_es }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          <q-item-label>{{ $t('french') }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-item-label caption>{{ props.row.subject_fr }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          <q-item-label>{{ $t('updated_at') }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-item-label caption>{{ formatDateTime(props.row.updated_at) }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                    <q-separator/>
                    <q-card-actions align="center">
                      <q-btn @click="edit(props.row.id)" color="positive" rounded size="xs"
                             icon="mdi-square-edit-outline"
                             :label="$t('edit')"/>
                    </q-card-actions>
                  </q-card>
                </div>
              </template>
            </q-table>
          </div>
        </div>
      </template>
    </arc-window>
    <arc-dialog ref="dlg" size="md" :title="$t('email_template')" :disable="v$.$invalid" @save="save"
                show-btn-maximize>
      <template #section>
        <q-input autofocus v-model="v$.row.name.$model" :label="$t('name')"
                 :error="v$.row.name.$error" hide-bottom-space/>
        <div class="bg-teal-4 text-white q-pa-xs text-center rounded-borders">{{ $t('spanish') }}</div>
        <q-input v-model="v$.row.subject_es.$model" :label="$t('subject')"
                 :error="v$.row.subject_es.$error" hide-bottom-space/>
        <q-input v-model="row.action_es" :label="$t('action_button_caption')"
                 hide-bottom-space/>
        <q-editor v-model="v$.row.mail_es.$model" :label="$t('spanish')" toolbar-outline
                  square class="q-mt-md" min-height="10em" :toolbar="editorLanguageToolbar($q)"
                  :dense="$q.screen.lt.md"/>
        <div class="bg-teal-4 text-white q-pa-xs text-center rounded-borders">{{ $t('english') }}</div>
        <q-input v-model="v$.row.subject_en.$model" :label="$t('subject')"
                 :error="v$.row.subject_en.$error" hide-bottom-space/>
        <q-input v-model="row.action_en" :label="$t('action_button_caption')"
                 hide-bottom-space/>
        <q-editor v-model="v$.row.mail_en.$model" :label="$t('english')" toolbar-outline
                  square class="q-mt-md" min-height="10em" :toolbar="editorLanguageToolbar($q)"
                  :dense="$q.screen.lt.md"/>
        <div class="bg-teal-4 text-white q-pa-xs text-center rounded-borders">{{ $t('french') }}</div>
        <q-input v-model="v$.row.subject_fr.$model" :label="$t('subject')"
                 :error="v$.row.subject_fr.$error" hide-bottom-space/>
        <q-input v-model="row.action_fr" :label="$t('action_button_caption')"
                 hide-bottom-space/>
        <q-editor v-model="v$.row.mail_fr.$model" :label="$t('french')" toolbar-outline
                  square class="q-mt-md" min-height="10em" :toolbar="editorLanguageToolbar($q)"
                  :dense="$q.screen.lt.md"/>
      </template>
    </arc-dialog>
  </q-page>
</template>
