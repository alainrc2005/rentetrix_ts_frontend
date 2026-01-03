<template>
  <div class="fullscreen q-pa-md flex flex-center">
    <div class="row">
      <div class="col-md-6 flex flex-center">
        <img width="320" :src="ErrorSvg" alt="Rentetrix"/>
      </div>

      <div class="col-md-6">
        <div class="text-h1">404</div>
        <div class="text-h4">UH OH! Estás perdido.</div>
        <p>La página que estás buscando no existe.
          Como llegaste aquí es un misterio. Pero puedes dar click en el botón siguiente para ir al inicio.
        </p>

        <q-btn
          style="width: 155px"
          rounded
          outline
          class="q-mt-xs"
          color="white"
          text-color="primary"
          unelevated
          to="/"
          label="Inicio"
          no-caps
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QBtn } from 'quasar'
import ErrorSvg from 'src/assets/404.svg'
</script>
