<script setup lang="ts">
import { useProductList } from '@/composables/useProductsList'
import { useProductListStore } from '@/stores/useProductListStore'
import { IconField, InputIcon, InputText } from 'primevue'
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'

const productListStore = useProductListStore()

const { loadProducts } = useProductList(productListStore.currentSlug)

const route = useRoute()

watch(
  () => productListStore.searchInput,
  (newValue) => {
    productListStore.searchInput = newValue || null
  },
)

const handleKeydown = async (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    const searchInput = productListStore.searchInput ? productListStore.searchInput!.trim() : null
    onSearchSubmit(searchInput)
    await loadProducts(
      productListStore.currentSlug,
      searchInput,
      productListStore.sortOption,
      productListStore.selectedFilters,
    )
    productListStore.productsNotFound = productListStore.totalProducts === 0
  }
}

const onSearchSubmit = (keyword?: string | null) => {
  const newQuery = {
    ...route.query,
    keyword,
    offset: '0',
  }

  if (!keyword) delete newQuery.keyword

  productListStore.offset = 0

  router.push({ query: newQuery })
}
</script>

<template>
  <div class="search-bar">
    <IconField>
      <InputIcon class="pi pi-search" />
      <InputText
        v-model="productListStore.searchInput"
        placeholder="Search"
        @keydown="handleKeydown"
      />
    </IconField>
  </div>
</template>
