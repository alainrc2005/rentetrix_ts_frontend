<template>
  <q-btn v-bind="$attrs" :loading="$q.loadingBar.isActive || loading" @click="$emit('click')">
    <template #loading>
      <q-spinner-orbit/>
    </template>
  </q-btn>
</template>

<script setup lang="ts">
defineEmits(['click'])
defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
</script>
