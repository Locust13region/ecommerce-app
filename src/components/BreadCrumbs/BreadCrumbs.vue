<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumb from 'primevue/breadcrumb'

const home = ref({
  icon: 'pi pi-home',
  route: '/',
})

const route = useRoute()
const items = ref<{ label: string; to?: string }[]>([])

function getCategoryNameBySlug(slug: string): string {
  const slugs = slug.split('/')
  const categorySlug = slugs[slugs.length - 1]

  const categoryName = categorySlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return categoryName
}

function updateBreadcrumbs() {
  const path = route.path

  const segments = path.split('/').filter(Boolean)
  const accumulatedPath: string[] = []

  const crumbs = segments.map((segment) => {
    accumulatedPath.push(segment)
    const route = '/' + accumulatedPath.join('/')
    return {
      label: getCategoryNameBySlug(segment),
      route,
    }
  })

  items.value = crumbs
}

onMounted(() => {
  updateBreadcrumbs()
})

watch(
  () => route.fullPath,
  () => {
    updateBreadcrumbs()
  },
)
</script>

<template>
  <div class="card flex justify-start">
    <Breadcrumb :home="home" :model="items">
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a :href="href" v-bind="props.action" @click="navigate">
            <span :class="[item.icon, 'text-color']" />
            <span class="text-primary font-semibold">{{ item.label }}</span>
          </a>
        </router-link>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span class="text-surface-700 dark:text-surface-0">{{ item.label }}</span>
        </a>
      </template>
    </Breadcrumb>
  </div>
</template>
