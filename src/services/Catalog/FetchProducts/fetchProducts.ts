// import { useApiState } from '@/stores/apiState'
//import { useAuth } from '@/composables/useAuth'
// TODO: Get Api root from useApiRoot() method
import { createApiRootWithClientCredentialsFlow } from '@/api/client'
import router from '@/router'
//import type { Product } from '@commercetools/platform-sdk'

export const fetchProducts = async (page: number = 0) => {
  // const { getApiRoot } = useAuth()
  // const apiRoot = getApiRoot()

  // TODO: add pagination offset parameter
  const limit = 9 // product's per page
  const offset = limit * page

  try {
    const apiRoot = await createApiRootWithClientCredentialsFlow()
    const response = await apiRoot
      .products()
      .get({
        queryArgs: {
          limit,
          offset,
        },
      })
      .execute()
    // .categories()
    // .get({
    //   queryArgs: {
    //     limit: 100,
    //     expand: ['parent'],
    //     sort: 'orderHint asc',
    //     // where: 'parent is not defined', // to provide only parent categories
    //   },
    // })
    // .execute()

    const results = await response.body.results

    return results
  } catch (error) {
    console.error('Failed to fetch products:', error)
    router.push('/404')
    throw error
  }
}
/*
"Malformed parameter: sort:
  Invalid query field 'orderHint' in sort path.
  Sortable fields are:
  `createdAt`,
  `createdBy`,
  `id`,
  `key`,
  `lastMessageSequenceNumber`,
  `lastModifiedAt`,
  `lastModifiedBy`, `masterData`, `priceMode`,
  `productType`,
  `reviewRatingStatistics`,
  `state`,
  `taxCategory`, `version`."
*/
