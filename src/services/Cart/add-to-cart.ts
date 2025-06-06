import { useShoppingBag } from '@/composables/useShoppingBag'
import { useUserStateStore } from '@/stores/userState'
import type { ToastServiceMethods } from 'primevue'
import type { ProductProjection } from '@commercetools/platform-sdk'

export const addToCart = async (
  product: ProductProjection | null,
  quantity: number,
  toast: ToastServiceMethods,
) => {
  if (!product) return

  const { addToBag } = useShoppingBag()
  const user = useUserStateStore()

  if (user.isLoggedIn) {
    if (product.masterVariant.sku) {
      await addToBag({ sku: product.masterVariant.sku, quantity })
    } else {
      toast.add({
        severity: 'info',
        summary: "Sorry, you can't buy this product. It doesn't have SKU.",
        life: 5000,
      })
    }
  } else {
    toast.add({
      severity: 'info',
      summary: 'Login before add',
      life: 5000,
    })
  }
}
