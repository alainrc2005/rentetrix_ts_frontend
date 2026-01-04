<template>
  <q-page class="auth-wrapper auth">
    <div class="background_login" />
    <div class="version_left">{{ constant.APP_VERSION }}</div>
    <div class="row auth-inner">
      <div class="brand-logo gt-xs">
        <h5 class="text-white q-ma-none">
          {{ $t('app_name') }}
        </h5>
      </div>
      <div class="col-lg-9 col-md-8 col-sm-7 col-xs-12 flex items-center justify-center">
      </div>
      <div class="col-lg-3 col-md-4 col-sm-5 col-xs-12 q-pa-sm flex items-center bg-white">
        <q-card flat class="full-width">
          <q-card>
            <q-card-section class="text-center q-responsive q-pa-none">
              <q-img width="164px" src="~assets/logo.png" />
              <p class="q-my-lg">Inicia sesión en tu cuenta.</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-my-xs">
              <q-input :label="$t('email')" v-model="v$.email.$model" rounded outlined
                       :error="v$.email.$error" hide-bottom-space v-on:keypress.enter="checkUser" />
              <q-input :label="$t('password')" :error="v$.password.$error" hide-bottom-space rounded outlined
                       class="q-mt-sm" v-model="v$.password.$model" :type="isPwd ? 'password' : 'text'"
                       v-on:keypress.enter="checkUser">
                <template v-slot:append>
                  <q-icon v-if="login.password" :name="isPwd ? 'visibility' : 'visibility_off'" class="cursor-pointer"
                          @click="isPwd = !isPwd" />
                </template>
              </q-input>
            </q-card-section>
            <q-card-section class="text-center q-py-md">
              <q-btn rounded :disable="v$.$invalid" color="primary" class="full-width"
                     :label="$t('login')" @click="checkUser" />
            </q-card-section>
            <q-card-section class="text-center q-pt-none">
              <hr />
              <div @click="forgotPassword" :class="cursorForgotPassword">{{ $t('forgot_password') }}</div>
            </q-card-section>
          </q-card>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { inject, ref, reactive, computed } from 'vue'
import { SessionStorage } from 'quasar'
import useVuelidate from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'
import { useAppStore } from 'stores/app-store'
import {
  AskFor, appError, appSuccess, TResults, RentetrixCrypto, ksec, executeCmd,
  RentetrixHttpService
} from 'src/helpers'
import { useRouter } from 'vue-router'
import { i18n } from 'src/i18n'
import type { TConstants } from 'src/types'

const constant = inject('constant') as TConstants
const login = reactive({
  email: null,
  password: null
})
const isPwd = ref(true)
const rules = {
  email: { required, email },
  password: { required, minLength: minLength(8) }
}
const v$ = useVuelidate(rules, login)
const cursorForgotPassword = computed(() => {
  return v$.value.email.$invalid ? 'text-grey-6 cursor-not-allowed' : 'text-grey-10 cursor-pointer'
})
const store = useAppStore()
const checkError = (e: string) => {
  switch (e) {
    case TResults.E_USER_BANNED:
    case TResults.E_BAD_USER_PASSWORD:
    case TResults.E_USER_NOT_FOUND:
      return e
    default:
      return TResults.E_COMMUNICATION
  }
}
const router = useRouter()

async function checkUser() {
  if (v$.value.$invalid) return
  return executeCmd(RentetrixHttpService.post('/auth/login', login), async r => {
    SessionStorage.set('car', r.row)
    const patch = await RentetrixCrypto.cryptoAesDecrypt(ksec, r.row)
    store.$patch({ ...patch, logged: true, drawer: true })
    await router.push('/')
  }, e => {
    return appError(checkError(e.code))
  })
}

function forgotPassword() {
  if (v$.value.email.$invalid) return
  AskFor('attention', i18n.global.t('ays_password_mail'))
    .onOk(() => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      executeCmd(RentetrixHttpService.post('/users/forgot-password', { email: login.email }), r => {
        if (r.code !== TResults.OK) return appError(checkError(r.code))
        appSuccess('s_send_password')
      }, null, 'e_send_email').then(() => void 0)
    })
}
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
