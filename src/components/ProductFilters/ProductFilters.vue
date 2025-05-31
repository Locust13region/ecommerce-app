<script setup lang="ts">
// import { watch } from 'vue'
import Checkbox from 'primevue/checkbox'
import { useProductListStore } from '@/stores/useProductListStore'
import { useProductList } from '@/composables/useProductsList'
import { buildFilterQuery } from '@/services/Catalog/parseAttributeFilters/parseAttributeFilters.ts'
// import { useRoute } from 'vue-router'
import { parseKebabToCamelCase } from '@/services/Catalog/parseKebabToCamelCase/parseKebabToCamelCase.ts'
import { watch } from 'vue'
import router from '@/router'

const productListStore = useProductListStore()
const { loadProducts } = useProductList()
// const route = useRoute()

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

  await loadProducts()
}

watch(
  () => productListStore.productFilterQueries,
  (filters) => {
    const query: Record<string, string> = {}

    for (const [key, values] of Object.entries(filters)) {
      if (Array.isArray(values) && values.length > 0) {
        query[key] = values.map(encodeURIComponent).join(',')
      }
    }

    if (productListStore.searchInput?.trim()) {
      query.keyword = productListStore.searchInput.trim()
    }

    if (productListStore.offset && productListStore.offset > 0) {
      query.offset = String(productListStore.offset)
    }

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
          :value="String(val)"
          :modelValue="productListStore.productFilterQueries[attr] || []"
          @change="toggleFilter(attr, val.toString())"
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
