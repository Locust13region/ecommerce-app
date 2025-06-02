import type { ProductProjection } from '@commercetools/platform-sdk'

export function parseAttributeFilters(products: ProductProjection[]) {
  const filters: Record<string, Set<string>> = {}

  for (const product of products) {
    for (const attr of product.masterVariant.attributes || []) {
      const key = attr.name
      let value = attr.value

      if (typeof value === 'object' && value['en-US']) {
        value = value['en-US']
      }

      if (!filters[key]) {
        filters[key] = new Set()
      }
      filters[key].add(value)
    }
  }

  const filtersAsArrays: Record<string, string[]> = {}
  for (const key in filters) {
    filtersAsArrays[key] = Array.from(filters[key])
  }

  return filtersAsArrays
}

export function buildFilterQuery(selected: Record<string, string[]>): string[] {
  const queries: string[] = []

  for (const [key, values] of Object.entries(selected)) {
    if (values.length === 0) continue
    const conditions = values.map((val) => `"${val}"`).join(',')
    let resultingKey = key
    if (key === 'author') resultingKey += '.en-US'
    const filterString = `variants.attributes.${resultingKey}:${conditions}`
    queries.push(filterString)
  }

  return queries
}
