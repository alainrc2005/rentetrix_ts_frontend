<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Nullable, Optional, TMenuItem } from 'src/types'
import { useAppStore } from 'stores/app-store'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  items: {
    type: Array<TMenuItem>,
    default: () => []
  },
  indent: {
    type: Number,
    default: 0
  }
})
const authStore = useAppStore()
const route = useRoute()
const router = useRouter()

const currentItems = ref<TMenuItem[]>([])

const getIcon = (item: TMenuItem) => {
  return item.icon || ''
}

const go = async (item: TMenuItem) => {
  if (item.items) {
    item.expanded = !item.expanded
  } else if (item.route) {
    await router.push(item.route)
  }
}

const itemHasPermission = (item: TMenuItem): boolean => {
  return (!item.items && (!item.permissions || authStore.checkPermission(item.permissions)))
}

const childrenHasPermission = (items: TMenuItem[]): boolean => {
  return items.some(
    (item: TMenuItem) => itemHasPermission(item) || childrenHasPermission(item.items || [])
  )
}

const filterSecureItems = (items: TMenuItem[]): TMenuItem[] => {
  return items.filter(
    (item: TMenuItem) => itemHasPermission(item) || childrenHasPermission(item.items || [])
  )
}

const filteredSecureItems = computed(() => {
  return filterSecureItems(currentItems.value)
})

const hasActiveChild = (item: TMenuItem, path: string): boolean => {
  if (item.route === path) {
    return true
  }
  return (item.items || []).some((item: TMenuItem) => hasActiveChild(item, path))
}

const mapItems = (items: TMenuItem[], path: string): TMenuItem[] => {
  return items.map((item: TMenuItem) => ({
    ...item,
    items: item.items ? mapItems(item.items, path) : undefined,
    expanded: hasActiveChild(item, path)
  })) as TMenuItem[]
}

const isActive = (item: TMenuItem): boolean => {
  const active: Optional<Nullable<boolean>> = typeof item.active === 'function' ? item.active() : item.active
  return route.path !== item.route && !!active
}

watch(
  () => route.path,
  (path) => {
    currentItems.value = mapItems(props.items, path)
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <template v-for="(item, itemIndex) in filteredSecureItems" :key="itemIndex">
      <q-item :v-ripple="isActive(item)"
              :clickable="isActive(item)"
              :class="{'inactive': !isActive(item), 'current': route.path === item.route}"
              @click="go(item)">
        <q-item-section avatar>
          <q-icon :style="`margin-left: ${indent || 0}em`" color="primary" :name="getIcon(item)"/>
        </q-item-section>
        <q-item-section>{{ $t(item.label) }}</q-item-section>
        <q-item-section side v-if="(item.items || []).length">
          <q-icon :name="item.expanded ? 'mdi-chevron-down' : 'mdi-chevron-right'"/>
        </q-item-section>
      </q-item>
      <Transition
        name="custom-classes"
        enter-active-class="animate__animated animate__slideInLeft animate__faster"
        leave-active-class="animate__animated animate__slideOutLeft animate__faster"
      >
      <arc-menu-item :items="item.items || []"
                     :indent="(indent || 0) + 1"
                     :route="route"
                     :router="router"
                     v-if="item.expanded!! && (item.items || []).length > 0"
      />
      </Transition>
    </template>
  </div>
</template>

<style scoped lang="scss">
.inactive {
  pointer-events: none;

  &:not(.current) {
    i {
      color: var(--q-secondary) !important;
    }
  }
}

.current {
  pointer-events: none !important;
  font-weight: 600;
}
</style>
