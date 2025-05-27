import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Category } from '@commercetools/platform-sdk'
import { fetchCategories } from '@/services/Catalog/FetchCategories/fetchCategories.ts'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  const isLoaded = ref(false)

  const categoryMapById = ref<Map<string, Category>>(new Map())
  const categoryMapBySlug = ref<Map<string, Category>>(new Map())

  watch(
    categories,
    (newCategories) => {
      const byId = new Map<string, Category>()
      const bySlug = new Map<string, Category>()

      newCategories.forEach((cat) => {
        byId.set(cat.id, cat)

        const slug = cat.slug['en-US']
        if (slug) bySlug.set(slug, cat)
      })

      categoryMapById.value = byId
      categoryMapBySlug.value = bySlug
    },
    { immediate: true },
  )

  const getBreadcrumbPathBySlug = (slug: string): Category[] => {
    const category = categories.value.find((cat) => cat.slug['en-US'] === slug)
    if (!category) return []

    const path: Category[] = []

    let currentCategory: Category | undefined = category
    while (currentCategory) {
      path.unshift(currentCategory)
      if (!currentCategory.parent) break
      currentCategory = categories.value.find((cat) => cat.id === currentCategory?.parent?.id)
    }

    return path
  }

  const loadCategories = async () => {
    if (isLoaded.value) return
    const data = await fetchCategories()
    categories.value = data
    isLoaded.value = true
  }

  return {
    categories,
    loadCategories,
    getBreadcrumbPathBySlug,
    categoryMapById,
    categoryMapBySlug,
    isLoaded,
  }
})
