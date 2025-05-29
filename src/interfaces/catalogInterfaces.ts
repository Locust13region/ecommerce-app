import type { ProductProjection } from '@commercetools/platform-sdk'

export interface MegaMenuItem {
  label: string
  items: MegaMenuInnerItem[][]
  url?: string
}

export interface MegaMenuInnerItem {
  label: string
  items: MegaMenuItem[]
  url?: string
}

export interface ProductCardItem {
  title: string
  price: string
  discountedPrice?: string | null
  shortDescription: string
  imageURL: string
  slug: string
}

export interface FetchProductsResponse {
  results: ProductProjection[]
  total: number
}
