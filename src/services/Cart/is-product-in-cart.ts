import { useApiState } from '@/stores/apiState'
import type { ProductProjection } from '@commercetools/platform-sdk'

export const isProductInCart = async (product: ProductProjection | null) => {
  if (!product) return false

  const api = useApiState()

  try {
    const cartsResponse = await api.root.me().carts().get().execute()
    const carts = cartsResponse.body.results
    const activeCart = carts.find((cart) => cart.cartState === 'Active')
    return activeCart?.lineItems.some((item) => item.productId === product.id) || false
  } catch (error) {
    console.warn('Error searching for product in cart', error)
    return false
  }
}
