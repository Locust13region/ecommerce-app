<script setup lang="ts">
import { useProductList } from '@/composables/useProductsList'
import { useProductListStore } from '@/stores/useProductListStore'
import { parseProductsForCards } from '@/services/Catalog/parseProductsForCard/parseProductsForCard.ts'
import { IconField, InputIcon, InputText } from 'primevue'
import { ref, watch } from 'vue'

const searchInput = ref<string>()
const productListStore = useProductListStore()

const { loadProducts } = useProductList(productListStore.currentSlug)

watch(
  () => searchInput.value,
  (newValue) => {
    searchInput.value = newValue
  },
)

const handleKeydown = async (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    await loadProducts(productListStore.currentSlug, searchInput.value!.trim())
    productListStore.pageProducts = await parseProductsForCards(productListStore.products)
    productListStore.productsNotFound = productListStore.totalProducts === 0
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
