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
