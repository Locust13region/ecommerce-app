<script setup lang="ts">
// import { watch } from 'vue'
import Checkbox from 'primevue/checkbox'
import { useProductListStore } from '@/stores/useProductListStore'
import { useProductList } from '@/composables/useProductsList'
import { parseProductsForCards } from '@/services/Catalog/parseProductsForCard/parseProductsForCard.ts'
import { buildFilterQuery } from '@/services/Catalog/parseAttributeFilters/parseAttributeFilters.ts'

const productListStore = useProductListStore()
const { loadProducts } = useProductList(productListStore.currentSlug)

const props = defineProps<{
  filters: Record<string, string[]>
}>()

// const emit = defineEmits<{
//   (e: 'update:filters', value: Record<string, string[]>): void
// }>()

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

  const filters = buildFilterQuery(productListStore.productFilterQueries)

  await loadProducts(productListStore.currentSlug, null, productListStore.sortOption, filters)
  productListStore.pageProducts = await parseProductsForCards(productListStore.products)
  //productListStore.productFilters = parseAttributeFilters(productListStore.products)

  console.log(productListStore.productFilterQueries)
}

// watch(
//   () => productListStore.productFilterQueries,
//   (newFilters) => {
//     for (const key in newFilters) {
//       if (!(key in productListStore.productFilters)) {
//         productListStore.productFilters[key] = []
//       }
//     }
//   },
//   { immediate: true }
// )
</script>

<template>
  <div class="product-filters">
    <div v-for="(values, attr) in props.filters" :key="attr" class="filter-group">
      <h4>{{ attr }}</h4>
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
