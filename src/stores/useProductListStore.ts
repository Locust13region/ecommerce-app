import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ProductProjection } from '@commercetools/platform-sdk'
import { useRoute } from 'vue-router'
import type { ProductCardItem } from '@/interfaces/catalogInterfaces'

export const useProductListStore = defineStore('productList', () => {
  const products = ref<ProductProjection[]>([])
  const totalProducts = ref(0)
  const limit = ref(9)
  const offset = ref(0)
  const loading = ref(false)
  const route = useRoute()
  const currentSlug = ref<string>(route.params.categorySlug as string)
  const pageProducts = ref<ProductCardItem[]>([])
  const productsNotFound = ref(false)

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
    pageProducts,
    productsNotFound,
  }
})
