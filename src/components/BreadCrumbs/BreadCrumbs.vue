<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumb from 'primevue/breadcrumb'
import { useCategoriesStore } from '@/composables/useCategoryStore'

const home = ref({
  icon: 'pi pi-home',
  label: 'Catalog',
  route: '/catalog',
})

const route = useRoute()
const categoriesStore = useCategoriesStore()

const currentSlug = ref((route.params.slug as string) || '')

const breadcrumbItems = ref<{ label: string; route: string }[]>([])

const updateBreadcrumbs = () => {
  const path = categoriesStore.getBreadcrumbPathBySlug(currentSlug.value)

  // TODO: add Catalog to the breadcrumb path

  breadcrumbItems.value = path.map((cat) => ({
    label: cat.name['en-US'],
    route: `/catalog/${cat.slug['en-US']}`,
  }))
}

onMounted(() => {
  updateBreadcrumbs()
})

watch(
  () => route.params.slug,
  (newSlug) => {
    currentSlug.value = newSlug as string
    updateBreadcrumbs()
  },
)

watch(
  () => categoriesStore.isLoaded,
  () => {
    updateBreadcrumbs()
  },
)
</script>

<template>
  <div class="card flex justify-start">
    <Breadcrumb :home="home" :model="breadcrumbItems">
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
