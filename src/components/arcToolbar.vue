<template>
  <q-page-sticky expand position="top" class="z-middle">
    <q-toolbar class="ip_sticky bg-white q-px-xl">
      <q-breadcrumbs>
        <q-breadcrumbs-el :label="$t(label)" :icon="icon"/>
        <q-badge color="red" align="top" :label="rowsNumber"/>
      </q-breadcrumbs>
    </q-toolbar>
  </q-page-sticky>
  <transition appear enter-active-class="animate__animated animate__fadeInDown"
              leave-active-class="animate__animated animate__fadeOutUp" mode="in-out">
    <q-card class="card_border_primary q-mt-xl">
      <q-toolbar class="bg-secondary text-white rounded-borders">
        <q-btn no-caps rounded color="primary" @click="showTerms = !showTerms" icon="search"
               :label="$q.screen.gt.xs ? $t('search') : void 0"/>
        <q-space/>
        <q-btn no-caps rounded color="primary" @click="$emit('add')"
               class="q-ml-sm"
               icon="mdi-plus" v-if="showAdd" :label="$q.screen.gt.xs ? $t('add') : void 0"/>
        <slot name="buttons"/>
      </q-toolbar>
      <div class="col-12 text-center q-pa-sm q-mx-md" v-if="showTerms">
        <slot name="form"/>
      </div>
    </q-card>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  rowsNumber: {
    type: Number,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  showAdd: {
    type: Boolean,
    default: false
  }
})
defineEmits(['add'])
const showTerms = ref(false)
</script>
