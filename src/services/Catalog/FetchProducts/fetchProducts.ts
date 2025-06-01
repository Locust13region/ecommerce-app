import { useAuth } from '@/composables/useAuth'
import type { FetchProductsResponse } from '@/interfaces/catalogInterfaces'
import router from '@/router'
import { useCategoriesStore } from '@/composables/useCategoryStore'
import type { ProductProjection, VariableMap } from '@commercetools/platform-sdk'
import { parseAttributeFilters } from '../parseAttributeFilters/parseAttributeFilters'

export const fetchProducts = async (
  slug: string,
  limit: number = 100,
  offset: number = 0,
  name: string | null = null,
  sort: string = 'name.en-US asc',
  filters: string[] = [],
  priceRange: [number, number] | null,
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

    if (priceRange && priceRange.length === 2) {
      const [min, max] = priceRange
      queryArgs.filter = (queryArgs.filter as string[]) || []
      queryArgs.filter = queryArgs.filter.filter((f) => !f.startsWith('variants.price.centAmount:'))
      queryArgs.filter.push(`variants.price.centAmount:range(${min} to ${max})`)
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

export async function fetchAllProductsByCategorySlug(slug: string) {
  const { getApiRoot } = useAuth()
  const apiRoot = getApiRoot()
  const categoriesStore = useCategoriesStore()

  const category = categoriesStore.categoryMapBySlug.get(slug)
  if (!category) {
    console.warn(`Category not found for slug: ${slug}`)
    return {
      products: [],
      filters: {},
    }
  }

  const categoryId = category.id
  const limit = 100
  let offset = 0
  const allProducts: ProductProjection[] = []
  let hasMore = true

  while (hasMore) {
    const response = await apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          limit,
          offset,
          filter: [`categories.id:"${categoryId}"`],
        },
      })
      .execute()

    const results = response.body.results
    allProducts.push(...results)

    offset += limit
    hasMore = results.length === limit
  }

  const filters = parseAttributeFilters(allProducts)

  return {
    products: allProducts,
    filters,
  }
}
