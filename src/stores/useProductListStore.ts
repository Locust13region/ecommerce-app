import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ProductProjection } from '@commercetools/platform-sdk'

export const useProductListStore = defineStore('productList', () => {
  const products = ref<ProductProjection[]>([])
  const totalProducts = ref(0)
  const limit = ref(9)
  const offset = ref(0)
  const loading = ref(false)
  const currentSlug = ref<string>('')

  function resetPagination() {
    offset.value = 0
  }

  return {
    products,
    totalProducts,
    limit,
    offset,
    loading,
    currentSlug,
    resetPagination,
  }
})
