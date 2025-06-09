import type { LineItem } from '@commercetools/platform-sdk'
import { defineStore } from 'pinia'

export const useBagStateStore = defineStore('bag', {
  state: () => ({
    isEmpty: true,
    items: <LineItem[]>[],
    total: '',
    oldPrice: '',
    isPromoUsed: false,
  }),
  actions: {
    setEmpty() {
      this.isEmpty = true
    },
    setNotEmpty() {
      this.isEmpty = false
    },
    setItems(array: LineItem[]) {
      this.items = array
    },
    setTotal(price: string) {
      this.total = price
    },
    setOldPrice(price: string) {
      this.oldPrice = price
    },
    promoUsed() {
      this.isPromoUsed = true
    },
  },
})
