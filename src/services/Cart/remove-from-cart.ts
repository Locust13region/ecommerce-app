import type { ToastServiceMethods } from 'primevue'
import type { ProductProjection } from '@commercetools/platform-sdk'
import { useApiState } from '@/stores/apiState'
import { useShoppingBag } from '@/composables/useShoppingBag'

export const removeFromCart = async (
  product: ProductProjection | null,
  toast: ToastServiceMethods,
) => {
  if (!product) return

  const api = useApiState()
  const { removeFromBag } = useShoppingBag()

  try {
    const cartsResponse = await api.root.me().carts().get().execute()
    const carts = cartsResponse.body.results
    const activeCart = carts.find((cart) => cart.cartState === 'Active')
    const lineItemId = activeCart?.lineItems.find((item) => item.productId === product.id)?.id

    if (lineItemId) {
      await removeFromBag(lineItemId)
      toast.add({
        severity: 'info',
        summary: 'The book was taken out of the bag successfully',
        life: 5000,
      })
      return true
    } else {
      toast.add({
        severity: 'info',
        summary: 'Sorry, something went wrong. Please try again later.',
        life: 5000,
      })
      return false
    }
  } catch (error) {
    console.warn('Error searching and deleting product from cart', error)
    return false
  }
}
