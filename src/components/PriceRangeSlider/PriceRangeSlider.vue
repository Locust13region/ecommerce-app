<script setup lang="ts">
import { ref, watch } from 'vue'
import { useProductListStore } from '@/stores/useProductListStore.ts'
import { storeToRefs } from 'pinia'
import Slider from 'primevue/slider'
import { useProductList } from '@/composables/useProductsList'
import { formatPrice } from '@/services/Catalog/parseProductsForCard/parseProductsForCard.ts'
import router from '@/router'
import { useRoute } from 'vue-router'

const productListStore = useProductListStore()
const { minCategoryPrice, maxCategoryPrice } = storeToRefs(productListStore)
const route = useRoute()

const { loadProducts } = useProductList()

const selectedPriceRange = ref<[number, number]>([minCategoryPrice.value, maxCategoryPrice.value])

watch([minCategoryPrice, maxCategoryPrice], ([min, max]) => {
  selectedPriceRange.value = [min, max]
})

watch(
  () => productListStore.selectedPriceRange,
  (newValue) => {
    if (newValue) {
      selectedPriceRange.value[0] = newValue[0]
      selectedPriceRange.value[1] = newValue[1]
    }
  },
)

const onSlideEnded = async () => {
  const [min, max] = selectedPriceRange.value

  const query = { ...route.query }

  query.price = `${min}-${max}`

  if (min === minCategoryPrice.value && max === maxCategoryPrice.value) {
    delete productListStore.productFilterQueries.price
    productListStore.offset = 0
    delete query.price
  }
  productListStore.selectedPriceRange = selectedPriceRange.value

  router.push({ query })

  await loadProducts()
}
</script>

<template>
  <div class="price-filter">
    <div class="filter-group">
      <h4>Price</h4>
      <div class="mt-2 text-sm text-gray-600">
        {{ formatPrice(selectedPriceRange[0]) }} – {{ formatPrice(selectedPriceRange[1]) }}
      </div>
      <Slider
        v-model="selectedPriceRange"
        :min="minCategoryPrice"
        :max="maxCategoryPrice"
        :range="true"
        class="w-full"
        @slideend="onSlideEnded"
      />
    </div>
  </div>
</template>

<style scoped>
.price-filter {
  padding: 1rem 0;
}
.filter-group {
  border-bottom: 1px solid #ccc;
  padding-bottom: 1rem;
}
.p-slider {
  margin-top: 10px;
}
</style>
