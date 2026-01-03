<template>
  <q-card class="card_style no-shadow fit">
    <q-card-section class="q-pa-sm">
      <q-item dense>
        <q-item-section class="column">
          <q-item-label>
            <slot name="title"/>
          </q-item-label>
        </q-item-section>
        <q-item-section side class="column">
          <slot name="buttons"/>
        </q-item-section>
      </q-item>
    </q-card-section>
    <slot>
      <q-separator/>
      <q-card-section class="q-pa-none">
        <slot name="form"/>
      </q-card-section>
    </slot>
  </q-card>
</template>
<script setup lang="ts">
</script>
