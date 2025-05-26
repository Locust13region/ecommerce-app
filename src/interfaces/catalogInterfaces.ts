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
  shortDescription: string
  imageURL: string
  slug: string
}
