import { useAuth } from '@/composables/useAuth'
import type { ProductProjection } from '@commercetools/platform-sdk'

export function useProduct() {
  const { getApiRoot } = useAuth()

  const fetchProduct = async (id: string): Promise<ProductProjection | null> => {
    try {
      const response = await getApiRoot()
        .productProjections()
        .withId({ ID: id })
        .get({ queryArgs: { staged: false } })
        .execute()

      return response.body ?? null
    } catch (error) {
      console.warn('Product request failed: ', error)
      return null
    }
  }

  return { fetchProduct }
}
