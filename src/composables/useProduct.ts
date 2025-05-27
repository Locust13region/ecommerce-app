import { useAuth } from '@/composables/useAuth'
import type { ProductProjection } from '@commercetools/platform-sdk'

export function useProduct() {
  const { getApiRoot } = useAuth()

  const fetchProduct = async (sku: string): Promise<ProductProjection | null> => {
    try {
      const response = await getApiRoot()
        .productProjections()
        .search()
        .get({
          queryArgs: {
            filter: [`variants.sku:"${sku}"`],
            staged: false,
          },
        })
        .execute()

      return response.body.results[0] ?? null
    } catch (error) {
      console.warn('Product request failed: ', error)
      return null
    }
  }

  return { fetchProduct }
}
