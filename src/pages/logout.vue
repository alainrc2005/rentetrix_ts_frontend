<template>
  <q-page class="auth-wrapper auth">
    <div class="background_login" />
    <div class="version">1.1</div>
    <div class="row auth-inner">
      <div class="brand-logo mobile-hide">
        <h5 class="brand-text text-primary q-ma-none">
          {{ $t('app_name') }}
        </h5>
      </div>
      <div class="col-12 flex items-center justify-center mobile-hide">
        <q-img width="747px" src="~assets/logout.svg" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { SessionStorage } from 'quasar'
import { useRouter } from 'vue-router'
import { delay, executeCmd, RentetrixHttpService } from 'src/helpers'
import { useAppStore } from 'stores/app-store'

const store = useAppStore()
const router = useRouter()

onMounted(async () => {
  await executeCmd(RentetrixHttpService.get(`/auth/logout/${store.userid}`))
  store.$reset()
  SessionStorage.remove('car')
  await delay(3)
  await router.push('/login')
})
</script>
<style lang="sass">
.auth-wrapper
  display: flex
  flex-basis: 100%
  min-height: calc(var(--vh, 1vh) * 100)
  width: 100%

  .auth-inner
    width: 100%
    position: relative

  &.auth
    align-items: flex-start

    .auth-inner
      overflow-y: auto
      // For v2 scroll for long auth form
      height: calc(var(--vh, 1vh) * 100)

    .brand-logo
      position: absolute
      top: 1.3rem
      left: 1.3rem
      margin: 0 !important
      z-index: 1
</style>
