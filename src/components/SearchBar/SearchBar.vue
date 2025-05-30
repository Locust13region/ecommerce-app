<script setup lang="ts">
import { useProductList } from '@/composables/useProductsList'
import { useProductListStore } from '@/stores/useProductListStore'
import { parseProductsForCards } from '@/services/Catalog/parseProductsForCard/parseProductsForCard.ts'
import { IconField, InputIcon, InputText } from 'primevue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
//import router from '@/router'

const searchInput = ref<string>()
const productListStore = useProductListStore()

const { loadProducts } = useProductList(productListStore.currentSlug)

const route = useRoute()

watch(
  () => searchInput.value,
  (newValue) => {
    searchInput.value = newValue
  },
)

const handleKeydown = async (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    await loadProducts(
      productListStore.currentSlug,
      searchInput.value!.trim(),
      productListStore.sortOption,
    )
    productListStore.pageProducts = await parseProductsForCards(productListStore.products)
    productListStore.productsNotFound = productListStore.totalProducts === 0
    const query = { keyword: `${searchInput.value!.trim()}` }
    console.log(query, route.params)
    // await router.push({ query: query })
  }
}
</script>

<template>
  <div class="search-bar">
    <IconField>
      <InputIcon class="pi pi-search" />
      <InputText v-model="searchInput" placeholder="Search" @keydown="handleKeydown" />
    </IconField>
  </div>
</template>
