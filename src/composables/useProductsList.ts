import { ref, watch, type Ref } from 'vue'
import { fetchProducts } from '@/services/Catalog/FetchProducts/fetchProducts.ts'
import { useProductListStore } from '@/stores/useProductListStore'

const productListStore = useProductListStore()

export function useProductList(slugRef: Ref<string>) {
  const loading = ref(false)

  const loadProducts = async (slug: string = slugRef.value) => {
    if (!slug) return

    loading.value = true
    try {
      const response = await fetchProducts(slug, productListStore.limit, productListStore.offset)
      productListStore.products = response.results
      productListStore.totalProducts = response.total
    } catch (error) {
      console.error('Failed to load products:', error)
      productListStore.products = []
      productListStore.totalProducts = 0
    } finally {
      loading.value = false
    }
  }

  watch(slugRef, () => {
    productListStore.offset = 0
  })

  return {
    loading,
    loadProducts,
  }
}
