<template>
  <q-layout view="lHh LpR lFf">
    <q-header elevated class="bg-white q-mx-lg q-mt-md q-py-sm toolbar_blur" :style="styleToolbar">
      <q-toolbar class="GPL__toolbar">
        <q-btn flat dense round icon="menu" @click="drawer=!drawer" class="text-grey"/>
        <div style="padding: 4px 16px" class="non-selectable text-black">
          {{ $t('app_name') }}
        </div>
        <q-space/>
        <q-btn outline rounded class="q-mr-xs text-grey" size="sm" :label="store.name" v-if="$q.screen.gt.xs"/>
        <q-avatar size="26px" class="cursor-pointer">
          <img :src="avatar" alt="Rentetrix"/>
          <q-menu anchor="top end" self="top end">
            <q-list dense class="text-grey-8" style="min-width: 100px">
              <q-item aria-hidden="true" class="bg-secondary">
                <q-item-section class="text-uppercase text-white" style="font-size: 0.7rem">
                  {{ $t('user') }}
                </q-item-section>
              </q-item>
              <q-separator/>
              <q-item to="/profile" clickable v-close-popup aria-hidden="true">
                <q-item-section avatar>
                  <q-icon color="primary" name="mdi-account-cog-outline"/>
                </q-item-section>
                <q-item-section>{{ $t('profile') }}</q-item-section>
              </q-item>
              <q-item to="/logout" clickable v-close-popup aria-hidden="true">
                <q-item-section avatar>
                  <q-icon color="primary" name="mdi-logout"/>
                </q-item-section>
                <q-item-section>{{ $t('logout') }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-avatar>
      </q-toolbar>
    </q-header>

    <q-drawer
      :mini="!drawer"
      :show-if-above="$q.screen.width>1024"
      v-model="drawer"
      bordered
      content-class="bg-white"
      :width="290"
    >
      <div class="q-mini-drawer-hide absolute" style="top: 30px; right: -17px; z-index: 10">
        <q-btn color="primary" icon="chevron_left" unelevated round dense @click="drawer=false"
               style="background-color: rgb(105, 108, 255); color: white; border: 6px solid rgb(242, 242, 247);"/>
      </div>
      <q-scroll-area class="fit" :thumb-style="v_thumbStyle" style="overflow-x: hidden !important;"
                     :bar-style="v_barStyle">
        <div class="fit text-center q-mb-lg">
          <q-avatar class="q-pa-md" square style="width: auto;height: 180px">
            <img src="~assets/logo.png" alt="Logo" class="cursor-pointer" @click="router.push('/')"/>
          </q-avatar>
        </div>
        <q-separator/>
        <q-list class="menu" id="mn">
          <q-item to="/" v-ripple clickable>
            <q-item-section avatar>
              <q-icon color="primary" name="mdi-view-dashboard"/>
            </q-item-section>
            <q-item-section>{{ $t('dashboard') }}</q-item-section>
          </q-item>
          <q-separator/>
          <q-expansion-item
            :content-inset-level="0.3"
            header-class="text-primary"
            icon="mdi-cog-outline"
            :label="$t('administration')">
            <q-item to="/roles" v-ripple clickable :disable="!can('adm_sh_roles', 'adm_cr_roles')">
              <q-item-section avatar>
                <q-icon color="grey" name="mdi-shield-lock"/>
              </q-item-section>
              <q-item-section>{{ $t('roles') }}</q-item-section>
            </q-item>
            <q-item to="/users" v-ripple clickable exact :disable="!can('adm_sh_users', 'adm_cr_users')">
              <q-item-section avatar>
                <q-icon color="grey" name="mdi-shield-account"/>
              </q-item-section>
              <q-item-section>{{ $t('users') }}</q-item-section>
            </q-item>
          </q-expansion-item>
          <q-separator/>
          <q-item to="/system" v-ripple clickable>
            <q-item-section avatar>
              <q-icon color="primary" name="mdi-cpu-64-bit"/>
            </q-item-section>
            <q-item-section>{{ $t('system') }}</q-item-section>
          </q-item>
          <q-separator/>
          <q-item to="/logout" v-ripple clickable>
            <q-item-section avatar>
              <q-icon color="primary" name="mdi-logout"/>
            </q-item-section>
            <q-item-section>{{ $t('logout') }}</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container style="padding-top: 66px; padding-bottom: 37px;">
      <router-view :key="route.fullPath"/>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { TCheckPermission } from 'src/types'
import { useAppStore } from 'stores/app-store'
import { v_barStyle, v_thumbStyle } from 'src/helpers/common'
import { api } from 'boot/axios'

const can = inject('can') as TCheckPermission
const route = useRoute()
const router = useRouter()
const drawer = ref(false)
const store = useAppStore()

const styleToolbar = computed(() => ({borderRadius: '4px', left: drawer.value ? '290px' : ''}))
const avatar = computed(() => {
  const urlAvatar = `/api/users/photo/${store.userid ?? 0}`
  return `${api.defaults.baseURL}${urlAvatar}`
})
</script>

<style lang="sass" scoped>
.GPL
  &__toolbar
    height: 50px

.q-item__section--avatar
  padding-right: 4px !important
  min-width: 36px

.toolbar_blur
  background-color: rgba(255, 255, 255, 0.788) !important
  backdrop-filter: blur(10px) saturate(200%)
  -webkit-backdrop-filter: blur(10px) saturate(200%)
</style>
