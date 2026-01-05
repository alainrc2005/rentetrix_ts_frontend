<template>
  <q-dialog ref="dlg" persistent @hide="$emit('hide')" @show="$emit('show')"
            :position="position">
    <q-card class="dragElement border-radius-10" :style="modalWidthStyle">
      <q-toolbar class="bg-primary text-white" @mousedown="onGrab">
        <q-toolbar-title>{{ title }}</q-toolbar-title>
        <slot name="buttons"/>
        <q-btn v-if="showBtnMaximize" round dense flat :icon="maximized?'mdi-fullscreen-exit':'mdi-fullscreen'"
               @click="maximized = !maximized">
          <q-tooltip>{{ $t(maximized ? 'minimize' : 'maximize') }}</q-tooltip>
        </q-btn>
        <q-btn round dense flat icon="close" v-close-popup>
          <q-tooltip>{{ $t('close') }}</q-tooltip>
        </q-btn>
      </q-toolbar>
      <q-card-section style="max-height: 76vh" class="scroll">
        <slot name="section"></slot>
      </q-card-section>
      <q-card-actions align="right" v-if="actions">
        <slot name="actions">
          <q-btn icon="mdi-content-save-all" :disable="disable" no-caps
                 flat color="positive" :label="$t('save')" @click="$emit('save')"/>
          <q-btn icon="close" flat color="negative" :label="$t('cancel')" v-close-popup no-caps/>
        </slot>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, type PropType, useTemplateRef } from 'vue'
import useDragDropModal from 'src/composables/useDragDropModal'
import { useQuasar, type QDialogProps, QDialog } from 'quasar'
import { modalWidth } from 'src/helpers'
import type { VoidFunction} from 'src/types'

const props = defineProps({
  disable: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  actions: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'sm'
  },
  position: {
    type: String as PropType<QDialogProps['position']>,
    default: 'standard'
  },
  showBtnMaximize: {
    type: Boolean,
    default: false
  },
  firstMaximized: {
    type: Boolean,
    default: false
  }
})
defineEmits(['show', 'hide', 'save'])
const dlg = useTemplateRef<QDialog>('dlg')
let dragEvent: null | VoidFunction = null
const $q = useQuasar()
const maximized = ref(props.firstMaximized)

const modalWidthStyle = computed(() => {
  if (maximized.value) {
    return {
      width: '100%',
      maxWidth: '100%'
    }
  }
  if ($q.screen.width >= modalWidth[props.size]!) {
    const ms = `${modalWidth[props.size]}px`
    return {
      width: ms,
      maxWidth: ms
    }
  }
  return {
    width: '100%'
  }
})

function onGrab() {
  if (dragEvent) dragEvent()
}

const keyEscape = (evt: KeyboardEvent) => {
  if (evt.keyCode === 27) {
    dlg?.value?.hide()
  }
}

onMounted(() => {
  globalThis.addEventListener('keydown', keyEscape)
})

onUnmounted(() => {
  globalThis.removeEventListener('keydown', keyEscape)
})

defineExpose({
  show: async () => {
    dlg?.value?.show()
    dragEvent = (await useDragDropModal('.dragElement')).onGrab
  },
  hide: () => {
    dlg?.value?.hide()
  }
})
</script>
