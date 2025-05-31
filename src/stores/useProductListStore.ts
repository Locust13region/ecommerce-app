import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { ProductProjection } from '@commercetools/platform-sdk'
import { useRoute } from 'vue-router'
import type { ProductCardItem } from '@/interfaces/catalogInterfaces'
import { parseProductsForCards } from '@/services/Catalog/parseProductsForCard/parseProductsForCard.ts'
import { useProductList } from '@/composables/useProductsList'

export const useProductListStore = defineStore('productList', () => {
  const products = ref<ProductProjection[]>([])
  const allCategoryProducts = ref<ProductProjection[]>([])
  const totalProducts = ref(0)
  const limit = ref(9)
  const offset = ref(0)
  const loading = ref(false)
  const route = useRoute()
  const currentSlug = ref<string>(route.params.categorySlug as string)
  const pageProducts = ref<ProductCardItem[]>([])
  const productsNotFound = ref(false)
  const sortOption = ref('name.en-US asc')
  const productFilters = ref<Record<string, string[]>>({})
  const productFilterQueries = ref<Record<string, string[]>>({})
  const selectedFilters = ref<string[]>([])

  const sortOptions = [
    { label: 'Alphabet (A-Z)', value: 'name.en-US asc' },
    { label: 'Alphabet (Z-A)', value: 'name.en-US desc' },
    { label: 'Price ascending', value: 'price asc' },
    { label: 'Price descending', value: 'price desc' },
  ]

  function resetPagination() {
    offset.value = 0
  }

  function resetProductFilters() {
    productFilterQueries.value = {}
    selectedFilters.value = []
  }

  const { loadProducts } = useProductList(currentSlug.value)

  watch(sortOption, async (newSort) => {
    await loadProducts(currentSlug.value, null, newSort)
    pageProducts.value = await parseProductsForCards(products.value)
  })

  return {
    products,
    allCategoryProducts,
    totalProducts,
    limit,
    offset,
    loading,
    currentSlug,
    resetPagination,
    resetProductFilters,
    pageProducts,
    productsNotFound,
    sortOption,
    sortOptions,
    productFilters,
    productFilterQueries,
    selectedFilters,
  }
})
