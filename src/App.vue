<template>
  <div id="q-app">
    <component v-bind:is="layout">
      <router-view/>
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from 'stores/app-store'
const store = useAppStore()
const layout = computed(() => {
  return `${store.layout}-layout`
})
</script>
