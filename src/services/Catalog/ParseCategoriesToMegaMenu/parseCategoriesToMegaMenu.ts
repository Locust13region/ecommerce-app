import type { MegaMenuItem } from '@/interfaces/catalogInterfaces'
import type { Category } from '@commercetools/platform-sdk'

export function transformCategoriesToMegaMenu(
  categories: Category[],
  locale: string = 'en-US',
  isHorizontal: boolean,
): MegaMenuItem[] {
  const categoryMap = new Map<string, Category[]>()

  for (const cat of categories) {
    const parentId = cat.parent?.id || 'root'
    if (!categoryMap.has(parentId)) {
      categoryMap.set(parentId, [])
    }
    categoryMap.get(parentId)!.push(cat)
  }

  const buildSubcategories = (parentId: string): MegaMenuItem[] => {
    const children = categoryMap.get(parentId)
    if (!children) return []

    return children.map((cat) => ({
      label: cat.name[locale],
      url: `/catalog/${cat.slug[locale]}`,
      items: [],
    }))
  }

  const topLevelCategories = categoryMap.get('root') || []

  if (isHorizontal) {
    const result: MegaMenuItem[] = topLevelCategories.map((cat) => {
      const subcategories = buildSubcategories(cat.id)

      return {
        label: cat.name[locale],
        url: `/catalog/${cat.slug[locale]}`,
        items: subcategories.length
          ? [
              [
                {
                  label: '',
                  items: subcategories,
                },
              ],
            ]
          : [],
      }
    })

    return result
  } else {
    const categoriesGroup: MegaMenuItem = {
      label: 'Catalog',
      url: `/catalog`,
      items: [
        topLevelCategories.map((cat) => ({
          label: cat.name[locale],
          url: `/catalog/${cat.slug[locale]}`,
          items: buildSubcategories(cat.id),
        })),
      ],
    }

    return [categoriesGroup]
  }
}
