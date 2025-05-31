<script setup lang="ts">
// import { watch } from 'vue'
import Checkbox from 'primevue/checkbox'
import { useProductListStore } from '@/stores/useProductListStore'
import { useProductList } from '@/composables/useProductsList'
import { buildFilterQuery } from '@/services/Catalog/parseAttributeFilters/parseAttributeFilters.ts'
import { useRoute } from 'vue-router'
import { parseKebabToCamelCase } from '@/services/Catalog/parseKebabToCamelCase/parseKebabToCamelCase.ts'
import { watch } from 'vue'
import router from '@/router'

const productListStore = useProductListStore()
const { loadProducts } = useProductList(productListStore.currentSlug)
const route = useRoute()

const props = defineProps<{
  filters: Record<string, string[]>
}>()

async function toggleFilter(attr: string, value: string) {
  if (!productListStore.productFilterQueries[attr]) {
    productListStore.productFilterQueries[attr] = [value]
  } else {
    const index = productListStore.productFilterQueries[attr].indexOf(value)
    if (index === -1) {
      productListStore.productFilterQueries[attr].push(value)
    } else {
      productListStore.productFilterQueries[attr].splice(index, 1)
      if (productListStore.productFilterQueries[attr].length === 0) {
        delete productListStore.productFilterQueries[attr]
      }
    }
  }

  productListStore.selectedFilters = buildFilterQuery(productListStore.productFilterQueries)

  await loadProducts(
    productListStore.currentSlug,
    null,
    productListStore.sortOption,
    productListStore.selectedFilters,
  )

  console.log(productListStore.selectedFilters, 'product filter queries')
}

watch(
  () => productListStore.productFilterQueries,
  (filters) => {
    const query = { ...route.query }

    for (const key in query) {
      if (key.startsWith('filter=')) {
        delete query[key]
      }
    }

    for (const [key, values] of Object.entries(filters)) {
      if (values.length) {
        query[`filter=${key}`] = values.join(',')
      }
    }

    if (!query.offset) query.offset = '0'

    router.push({ query })
  },
  { deep: true },
)
</script>

<template>
  <div class="product-filters">
    <div v-for="(values, attr) in props.filters" :key="attr" class="filter-group">
      <h4>{{ parseKebabToCamelCase(attr) }}</h4>
      <div v-for="val in values" :key="val" class="filter-group-item">
        <Checkbox
          :inputId="`${attr}-${val}`"
          :value="!val"
          :modelValue="productListStore.productFilters[attr] || []"
          @change="toggleFilter(attr, val)"
        />
        <label :for="`${attr}-${val}`">{{ val }}</label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.filter-group-item {
  display: flex;
  gap: 1rem;
}
.filter-group {
  border-bottom: 1px solid #ccc;
  padding-bottom: 1rem;
}
</style>
