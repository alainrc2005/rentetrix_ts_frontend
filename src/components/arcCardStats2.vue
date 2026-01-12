<template>
  <q-card :flat="flat" style="min-height: 85px" class="rounded-borders cursor-pointer" :class="animate"
          @mouseenter="hoverOver" @mouseleave="hoverOut">
    <q-card-section class="row">
      <q-avatar size="48px" :color="iconColor" :icon="icon" :text-color="iconTextColor">
        <q-badge :label="badge" :color="badgeColor" floating/>
      </q-avatar>
      <div class="column q-ml-lg text-center justify-center">
        <span class="card-admin-title text-h6 ellipsis">{{ title }}</span>
        <span class="text-caption text-grey-8">{{ subtitle }}</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: [String, null]
  },
  icon: {
    type: String,
    required: true
  },
  iconColor: {
    type: String,
    required: true
  },
  iconTextColor: {
    type: String,
    required: true
  },
  badge: {
    type: [String, Number],
    required: true
  },
  flat: {
    type: Boolean,
    default: true
  },
  badgeColor: {
    type: String,
    default: 'red-6'
  }
})
const animate = ref<string[]>([])

function hoverOver() {
  animate.value = ['animate__animated', 'animate__pulse']
}

function hoverOut() {
  animate.value = []
}
</script>
