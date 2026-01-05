<template>
  <Transition name="custom-classes" enter-active-class="animate__animated animate__zoomIn"
              leave-active-class="animate__animated animate__zoomOut" mode="in-out">
    <div class="row justify-center q-pa-lg" v-if="show">
      <div class="col-lg-6 col-md-5 col-sm-8 col-xs-12">
        <div class="text-h7 text-center text-grey-7 rounded-borders text-uppercase text-bold">
          {{ $q.lang.table.noData }}
          <slot name="actions"></slot>
        </div>
        <q-img src="src/assets/no_data.svg" alt="FMS" class="responsive"/>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
</script>
