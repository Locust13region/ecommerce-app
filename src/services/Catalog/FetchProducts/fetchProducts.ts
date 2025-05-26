// import { useApiState } from '@/stores/apiState'
//import { useAuth } from '@/composables/useAuth'
// TODO: Get Api root from useApiRoot() method
import { createApiRootWithClientCredentialsFlow } from '@/api/client'
import router from '@/router'
import { useCategoriesStore } from '@/stores/categoryStore'
import type { ProductProjection } from '@commercetools/platform-sdk'
//import type { Product } from '@commercetools/platform-sdk'

const limit = 9 // product's per page

export const fetchAllProducts = async (page: number = 0) => {
  // const { getApiRoot } = useAuth()
  // const apiRoot = getApiRoot()

  // TODO: add pagination offset parameter

  const offset = limit * page

  try {
    const apiRoot = await createApiRootWithClientCredentialsFlow()
    const response = await apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          limit,
          offset,
        },
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

export async function fetchProductsByCategorySlug(slug: string): Promise<ProductProjection[]> {
  try {
    const apiRoot = await createApiRootWithClientCredentialsFlow()
    const category = useCategoriesStore().categoryMapBySlug.get(slug)

    if (!category) return []

    const response = await apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          filter: [`categories.id:"${category.id}"`],
          limit,
          offset: 0,
        },
      })
      .execute()

    console.log(response.body.results, 'Products by category slug')
    return response.body.results
  } catch (error) {
    console.error('Error fetching products by category slug:', error)
    // router.push('/not-found')
    throw error
  }
}
