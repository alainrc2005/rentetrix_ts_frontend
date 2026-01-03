<template>
  <q-input v-model="model" v-bind="$attrs" @clear="clearModel"
           @keydown.prevent>
    <template #prepend>
      <q-icon name="event"/>
    </template>
    <template #after>
      <slot name="after"/>
    </template>
    <q-menu ref="dlgProxy" anchor="top left" self="top left" v-if="!$attrs.readonly">
      <q-date minimal :options="options" :mask="mask" :model-value="model"
              @update:model-value="select" no-unset/>
    </q-menu>
  </q-input>
</template>

<script setup lang="ts">
import { type PropType, useTemplateRef } from 'vue'
import { type QDateProps, QMenu } from 'quasar'

// No se puede instanciar con undefined, solo null o cadena
const model = defineModel<string | null | undefined>({ required: true, default: null })
defineProps({
  options: {
    type: [Object, Function] as PropType<QDateProps['options']>
  },
  mask: {
    type: String as PropType<QDateProps['mask']>,
    default: 'DD/MM/YYYY'
  }
})
const dlgProxy = useTemplateRef<typeof QMenu>('dlgProxy')

function clearModel() {
  model.value = null
}

function select(val: string) {
  model.value = val
  dlgProxy.value?.hide()
}
</script>
