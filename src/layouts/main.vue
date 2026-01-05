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
            default-opened
            :content-inset-level="0.3"
            header-class="text-purple"
            icon="mdi-room-service"
            :label="$t('bookings')">
            <q-item to="/booking/cars" v-ripple clickable exact>
              <q-item-section avatar>
                <q-icon color="grey" name="mdi-car-clock"/>
              </q-item-section>
              <q-item-section>{{ $t('cars') }}</q-item-section>
            </q-item>
          </q-expansion-item>
          <q-separator/>
          <q-expansion-item
            v-if="can('view_clients', 'crud_clients', 'view_cars', 'crud_cars', 'view_car_services',
             'crud_car_services', 'crud_owners', 'view_owners', 'view_pdf', 'crud_pdf', 'view_seasons', 'crud_seasons',
             'view_fuel_logs', 'crud_fuel_logs')"
            :content-inset-level="0.3"
            header-class="text-purple"
            icon="mdi-clipboard-list-outline"
            :label="$t('resources')">
            <q-item to="/resources/car_calendar" v-ripple clickable exact
                    v-if="can('view_car_calendar', 'crud_car_calendar')">
              <q-item-section avatar>
                <q-icon color="grey" name="mdi-calendar-month-outline"/>
              </q-item-section>
              <q-item-section>{{ $t('car_calendar') }}</q-item-section>
            </q-item>
            <q-item to="/resources/clients" v-ripple clickable exact v-if="can('view_clients', 'crud_clients')">
              <q-item-section avatar>
                <q-icon color="grey" name="mdi-account-star"/>
              </q-item-section>
              <q-item-section>{{ $t('clients') }}</q-item-section>
            </q-item>
            <q-item to="/resources/cars" v-ripple clickable exact v-if="can('view_cars', 'crud_cars')">
              <q-item-section avatar>
                <q-icon color="grey" name="mdi-car-hatchback"/>
              </q-item-section>
              <q-item-section>{{ $t('cars') }}</q-item-section>
            </q-item>
            <q-item to="/resources/fuel_logs" v-ripple clickable exact v-if="can('view_fuel_logs', 'crud_fuel_logs')">
              <q-item-section avatar>
                <q-icon color="grey" name="mdi-gas-station"/>
              </q-item-section>
              <q-item-section>{{ $t('fuel_logs') }}</q-item-section>
            </q-item>
            <q-item to="/resources/car_services" v-ripple clickable exact
                    v-if="can('view_car_services', 'crud_car_services')">
              <q-item-section avatar>
                <q-icon color="grey" name="mdi-format-list-checkbox"/>
              </q-item-section>
              <q-item-section>{{ $t('car_services') }}</q-item-section>
            </q-item>
            <q-item to="/resources/car/routes" v-ripple clickable exact
                    v-if="can('view_car_route_prices', 'crud_car_route_prices')">
              <q-item-section avatar>
                <q-icon color="grey" name="mdi-routes"/>
              </q-item-section>
              <q-item-section>{{ $t('car_route_prices') }}</q-item-section>
            </q-item>
            <q-item to="/resources/seasons" v-ripple clickable exact v-if="can('view_seasons', 'crud_seasons')">
              <q-item-section avatar>
                <q-icon color="grey" name="mdi-calendar-multiselect"/>
              </q-item-section>
              <q-item-section>{{ $t('seasons') }}</q-item-section>
            </q-item>
            <q-item to="/resources/owners" v-ripple clickable exact v-if="can('crud_owners', 'view_owners')">
              <q-item-section avatar>
                <q-icon color="grey" name="mdi-account-tie-outline"/>
              </q-item-section>
              <q-item-section>{{ $t('owners') }}</q-item-section>
            </q-item>
            <q-item to="/resources/blacklist" v-ripple clickable exact v-if="can('view_blacklist', 'crud_blacklist')">
              <q-item-section avatar>
                <q-icon color="grey" name="mdi-account-cancel"/>
              </q-item-section>
              <q-item-section>{{ $t('blacklist') }}</q-item-section>
            </q-item>
            <q-item to="/resources/contacts" v-ripple clickable exact v-if="can('view_contacts', 'crud_contacts')">
              <q-item-section avatar>
                <q-icon color="grey" name="mdi-contacts"/>
              </q-item-section>
              <q-item-section>{{ $t('contacts') }}</q-item-section>
            </q-item>
          </q-expansion-item>
          <q-separator/>
          <q-expansion-item
            v-if="can('crud_categories', 'crud_roles', 'crud_users', 'view_logs', 'view_syslog', 'crud_syslog', 'crud_settings')"
            :content-inset-level="0.3"
            header-class="text-purple"
            icon="mdi-cog-outline"
            :label="$t('administration')">
            <q-item to="/admin/app_settings" v-ripple clickable exact v-if="can('crud_settings')">
              <q-item-section avatar>
                <q-icon color="grey" name="mdi-application-settings-outline"/>
              </q-item-section>
              <q-item-section>{{ $t('app_settings') }}</q-item-section>
            </q-item>
            <q-item to="/admin/categories" v-ripple clickable exact v-if="can('crud_categories')">
              <q-item-section avatar>
                <q-icon color="grey" name="mdi-tag-multiple"/>
              </q-item-section>
              <q-item-section>{{ $t('categories') }}</q-item-section>
            </q-item>
            <q-item to="/admin/language" v-ripple clickable exact>
              <q-item-section avatar>
                <q-icon color="grey" name="mdi-flag"/>
              </q-item-section>
              <q-item-section>{{ $t('app_languages') }}</q-item-section>
            </q-item>
            <q-item to="/admin/email_templates" v-ripple clickable exact>
              <q-item-section avatar>
                <q-icon color="grey" name="mdi-email-edit"/>
              </q-item-section>
              <q-item-section>{{ $t('email_templates') }}</q-item-section>
            </q-item>
            <q-separator/>
            <q-item to="/admin/roles" v-ripple clickable v-if="can('crud_roles')">
              <q-item-section avatar>
                <q-icon color="grey" name="mdi-shield-lock"/>
              </q-item-section>
              <q-item-section>{{ $t('roles') }}</q-item-section>
            </q-item>
            <q-item to="/admin/users" v-ripple clickable exact v-if="can('crud_users')">
              <q-item-section avatar>
                <q-icon color="grey" name="mdi-shield-account"/>
              </q-item-section>
              <q-item-section>{{ $t('users') }}</q-item-section>
            </q-item>
            <q-item to="/admin/resellers" v-ripple clickable exact v-if="can('crud_users')">
              <q-item-section avatar>
                <q-icon color="grey" name="mdi-account-cash"/>
              </q-item-section>
              <q-item-section>{{ $t('resellers') }}</q-item-section>
            </q-item>
            <q-separator/>
            <q-item to="/admin/actions" v-ripple clickable v-if="can('view_logs')">
              <q-item-section avatar>
                <q-icon color="grey" name="mdi-fingerprint"/>
              </q-item-section>
              <q-item-section>{{ $t('logs') }}</q-item-section>
            </q-item>
            <q-item to="/admin/syslogs" v-ripple clickable v-if="can('view_syslog', 'crud_syslog')">
              <q-item-section avatar>
                <q-icon color="grey" name="mdi-note-alert-outline"/>
              </q-item-section>
              <q-item-section>{{ $t('syslogs') }}</q-item-section>
            </q-item>
            <q-separator/>
            <q-item to="/admin/resources" v-ripple clickable>
              <q-item-section avatar>
                <q-icon color="grey" name="mdi-information-outline"/>
              </q-item-section>
              <q-item-section>{{ $t('resources') }}</q-item-section>
            </q-item>
          </q-expansion-item>
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
