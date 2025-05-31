import { useAuth } from '@/composables/useAuth'
import type { FetchProductsResponse } from '@/interfaces/catalogInterfaces'
import router from '@/router'
import { useCategoriesStore } from '@/composables/useCategoryStore'
import type { VariableMap } from '@commercetools/platform-sdk'

export const fetchProducts = async (
  slug: string,
  limit: number = 100,
  offset: number = 0,
  name: string | null = null,
  sort: string = 'name.en-US asc',
  filters: string[] = [],
): Promise<FetchProductsResponse> => {
  const { getApiRoot } = useAuth()
  const apiRoot = getApiRoot()

  try {
    const queryArgs: VariableMap = {
      limit,
      offset,
    }

    if (slug) {
      // Currently searching through current category. Set (slug && !name) to search through all products
      const category = useCategoriesStore().categoryMapBySlug.get(slug)
      if (category) {
        queryArgs.filter = [`categories.id:"${category.id}"`]
      }
    }

    if (name) {
      queryArgs['text.en-US'] = name
    }

    if (filters.length > 0) {
      queryArgs.filter = filters
    }

    queryArgs.sort = sort

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
