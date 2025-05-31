import { ref } from 'vue'
import { fetchProducts } from '@/services/Catalog/FetchProducts/fetchProducts.ts'
import { useProductListStore } from '@/stores/useProductListStore'
import { parseProductsForCards } from '@/services/Catalog/parseProductsForCard/parseProductsForCard.ts'

const productListStore = useProductListStore()

export function useProductList() {
  const loading = ref(false)

  const loadProducts = async (
    slug: string = productListStore.currentSlug,
    name: string | null | undefined = productListStore.searchInput,
    sort: string = productListStore.sortOption,
    filters: string[] = productListStore.selectedFilters,
    limit: number = 100,
  ) => {
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

  return {
    loading,
    loadProducts,
  }
}
