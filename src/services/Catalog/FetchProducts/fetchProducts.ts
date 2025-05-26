// import { useApiState } from '@/stores/apiState'
//import { useAuth } from '@/composables/useAuth'
// TODO: Get Api root from useApiRoot() method
import { createApiRootWithClientCredentialsFlow } from '@/api/client'
import router from '@/router'
import { useCategoriesStore } from '@/stores/categoryStore'
import type { ProductProjection, VariableMap } from '@commercetools/platform-sdk'
//import type { Product } from '@commercetools/platform-sdk'

const limit = 9 // product's per page

export const fetchProducts = async (
  page: number = 0,
  slug?: string,
): Promise<ProductProjection[]> => {
  // const { getApiRoot } = useAuth()
  // const apiRoot = getApiRoot()

  // TODO: add pagination offset parameter

  const offset = limit * page

  try {
    const apiRoot = await createApiRootWithClientCredentialsFlow()
    const queryArgs: VariableMap = {
      limit,
      offset,
    }

    if (slug) {
      const category = useCategoriesStore().categoryMapBySlug.get(slug)
      if (category) {
        queryArgs.filter = [`categories.id:"${category.id}"`]
      }
    }

    const response = await apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs,
      })
      .execute()

    const results = await response.body.results

    return results
  } catch (error) {
    console.error('Failed to fetch products:', error)
    router.push('/not-found')
    throw error
  }
}
