<script setup lang="ts">
import ArcCardStats2 from 'components/arcCardStats2.vue'

function scrollTo(id: string) {
  const element = document.getElementById(id)
  if (element) {
    window.scrollTo({
      top: element.offsetTop,
      behavior: 'smooth'
    })
  }
}
</script>

<template>
  <q-page class="q-pa-lg q-mt-md">
    <div class="fit row wrap justify-start items-start content-start">
      <div class="col-md-3 col-sm-6 col-xs-12 q-pa-xs">
        <arc-card-stats-2 :title="$t('car_bookings_in_progress')" icon="mdi-car-emergency" icon-color="brown-2"
                          icon-text-color="brown-10" :badge="0"/>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-12 q-pa-xs">
        <arc-card-stats-2 :title="$t('car_bookings_confirmed')" icon="mdi-car-emergency" icon-color="cyan-2"
                          icon-text-color="cyan-10" :badge="0"/>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-12 q-pa-xs">
        <arc-card-stats-2 :title="$t('car_bookings_pending')" icon="mdi-car-emergency" icon-color="red-2"
                          icon-text-color="red-10" :badge="0"/>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-12 q-pa-xs">
        <arc-card-stats-2 :title="$t('car_bookings_contacted')" icon="mdi-car-emergency" icon-color="red-2"
                          icon-text-color="red-10" :badge="0"/>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-12 q-pa-xs">
        <arc-card-stats-2 :title="$t('car_available')" icon="mdi-car-hatchback" icon-color="blue-2"
                          icon-text-color="blue-10" :badge="0"
                          @click="scrollTo('car_available')"/>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-12 q-pa-xs">
        <arc-card-stats-2 :title="$t('car_down')" icon="mdi-car-wrench" icon-color="purple-2"
                          icon-text-color="purple-10" :badge="0"
                          @click="scrollTo('car_not_available')"/>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-12 q-pa-xs">
        <arc-card-stats-2 :title="$t('car_bookings_complete')" icon="mdi-car-emergency"
                          icon-color="green-2" icon-text-color="green-10" :badge="0"/>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-12 q-pa-xs">
        <arc-card-stats-2 :title="$t('car_bookings')" icon="mdi-car-clock"
                          icon-color="teal-2" icon-text-color="teal-10" :badge="0"
                          @click="$router.push('/booking/cars')"/>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-12 q-pa-xs">
        <arc-card-stats-2 :title="$t('cars')" icon="mdi-car-hatchback" icon-color="blue-grey-2"
                          icon-text-color="blue-grey-10" :badge="0" @click="$router.push('/resources/cars')"/>
      </div>
    </div>
  </q-page>
</template>
