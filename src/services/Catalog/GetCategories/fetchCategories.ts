// import { useApiState } from '@/stores/apiState'
import { useAuth } from '@/composables/useAuth'
// TODO: Get Api root from useApiRoot() method
import { createApiRootWithClientCredentialsFlow } from '@/api/client'
import type { Category } from '@commercetools/platform-sdk'

export const fetchCategories = async () => {
  // const { getApiRoot } = useAuth()
  // const apiRoot = getApiRoot()
  try {
    const apiRoot = await createApiRootWithClientCredentialsFlow()
    const response = await apiRoot
      .categories()
      .get({
        queryArgs: {
          limit: 100,
          expand: ['parent'],
          sort: 'orderHint asc',
          // where: 'parent is not defined', // to provide only parent categories
        },
      })
      .execute()

    const results = await response.body.results

    return results
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    throw error
  }
}

export const getUserInfo = async () => {
  const { getApiRoot } = useAuth()
  const apiRoot = getApiRoot()
  if (apiRoot) {
    try {
      const response = await apiRoot.me().get().execute()
      console.log('User Info:', response.body)
    } catch (error) {
      console.error('Failed to get user info:', error)
    }
  } else {
    console.warn('apiRoot is not available')
  }
}

export async function createCategoryTree() {
  const allCategories = await fetchCategories()

  const buildTree = (parentId: string | null = null): Category[] => {
    return allCategories
      .filter((category) => {
        if (parentId === null) return !category.parent
        return category.parent?.obj?.id === parentId
      })
      .map((category) => ({
        ...category,
        children: buildTree(category.id),
      }))
  }

  return buildTree()
}
