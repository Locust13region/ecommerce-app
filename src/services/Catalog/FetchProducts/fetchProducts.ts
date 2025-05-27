// import { useApiState } from '@/stores/apiState'
//import { useAuth } from '@/composables/useAuth'
// TODO: Get Api root from useApiRoot() method
import { createApiRootWithClientCredentialsFlow } from '@/api/client'
import type { FetchProductsResponse } from '@/interfaces/catalogInterfaces'
import router from '@/router'
import { useCategoriesStore } from '@/composables/useCategoryStore'
import type { VariableMap } from '@commercetools/platform-sdk'
//import type { Product } from '@commercetools/platform-sdk'

export const fetchProducts = async (
  slug: string,
  limit: number = 9,
  offset: number = 0,
): Promise<FetchProductsResponse> => {
  // const { getApiRoot } = useAuth()
  // const apiRoot = getApiRoot()

  // TODO: add pagination offset parameter

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

    const results = response.body.results
    const total = response.body.total

    return {
      results,
      total: total || 0,
    }
  } catch (error) {
    console.error('Failed to fetch products:', error)
    router.push('/not-found')
    throw error
  }
}
