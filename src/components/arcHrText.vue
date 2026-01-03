<template>
  <div :style="cssProps" class="hr-text">
    <div class="hr-text-left" />
    <div class="hr-content">
      <slot name="default" />
    </div>
    <div class="hr-text-right" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { colors } from 'quasar'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'secondary'
  }
})
const cssProps = computed(() => ({ '--hr-text-color': colors.getPaletteColor(props.color) }))
</script>

<style scoped>
.hr-text {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 14px 0 2px;
}

.hr-text-left {
  content: "";
  background: linear-gradient(to right, transparent, var(--hr-text-color), var(--hr-text-color));
  flex: 1 1;
  height: 1px;
}

.hr-text-right {
  content: "";
  background: linear-gradient(to left, transparent, var(--hr-text-color), var(--hr-text-color));
  flex: 1 1;
  height: 1px;
}

.hr-content {
  padding-left: 10px;
  padding-right: 10px;
  text-align: center;
}
</style>
