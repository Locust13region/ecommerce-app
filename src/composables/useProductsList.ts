import { ref } from 'vue'
import { fetchProducts } from '@/services/Catalog/FetchProducts/fetchProducts.ts'
import { useProductListStore } from '@/stores/useProductListStore'
import { parseProductsForCards } from '@/services/Catalog/parseProductsForCard/parseProductsForCard.ts'

const productListStore = useProductListStore()

export function useProductList(slugRef: string) {
  const loading = ref(false)

  const loadProducts = async (
    slug: string = slugRef,
    name: string | null = null,
    sort?: string,
    filters?: string[],
    limit: number = 100,
  ) => {
    // if (!slug) return
    loading.value = true
    try {
      const response = await fetchProducts(
        slug,
        limit,
        productListStore.offset,
        name,
        sort,
        filters,
      )
      productListStore.products = response.results.slice(0, 9)
      productListStore.allCategoryProducts = response.results
      productListStore.totalProducts = response.total

      productListStore.pageProducts = await parseProductsForCards(productListStore.products)
    } catch (error) {
      console.error('Failed to load products:', error)
      productListStore.products = []
      productListStore.totalProducts = 0
    } finally {
      loading.value = false
    }
  }

  // watch(slugRef, () => {
  //   productListStore.offset = 0
  // })

  return {
    loading,
    loadProducts,
  }
}
