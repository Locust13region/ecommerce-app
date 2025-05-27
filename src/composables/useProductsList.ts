import { ref, watch, type Ref } from 'vue'
import { fetchProducts } from '@/services/Catalog/FetchProducts/fetchProducts.ts'
import type { ProductProjection } from '@commercetools/platform-sdk'

export function useProductList(slugRef: Ref<string>) {
  const products = ref<ProductProjection[]>([])
  const totalProducts = ref(0)
  const limit = ref(9)
  const offset = ref(0)
  const loading = ref(false)

  //const first = ref(0)

  const loadProducts = async (slug: string = slugRef.value) => {
    if (!slug) return

    loading.value = true
    try {
      const response = await fetchProducts(slug, limit.value, offset.value)
      products.value = response.results
      totalProducts.value = response.total
    } catch (error) {
      console.error('Failed to load products:', error)
      products.value = []
      totalProducts.value = 0
    } finally {
      loading.value = false
    }
  }

  function onPageChange(event: { first: number }) {
    offset.value = event.first
  }

  // watch(() => slugRef.value, () => {
  //   offset.value = 0
  //   loadProducts(slugRef.value)
  // }, { immediate: true })

  // watch(first, loadProducts)

  // watch([slugRef, limit, offset], loadProducts, { immediate: true })

  watch(loading, () => {
    console.log('Loading state changed:', loading.value)
  })

  watch(slugRef, () => {
    offset.value = 0
  })

  return {
    products,
    totalProducts,
    limit,
    offset,
    loading,
    loadProducts,
    onPageChange,
  }
}
