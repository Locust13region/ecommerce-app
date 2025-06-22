import { useAuth } from '@/composables/useAuth'
import { useBagStateStore } from '@/stores/bagStates'
import type { CartUpdateAction } from '@commercetools/platform-sdk'

const { getApiRoot } = useAuth()
export async function updateBag(actions: CartUpdateAction[]) {
  try {
    const apiRoot = getApiRoot()
    const cartResponse = await apiRoot.me().carts().get().execute()
    const cart = cartResponse.body.results[0]
    const response = await apiRoot
      .carts()
      .withId({ ID: cart.id })
      .post({
        body: {
          version: cart.version,
          actions: actions,
        },
      })
      .execute()
    const bag = useBagStateStore()
    const updatedCart = response.body
    const itemsList = updatedCart.lineItems
    bag.setItems(itemsList)

    if (bag.items.length === 0) {
      bag.setEmpty()
    }

    if (updatedCart.discountOnTotalPrice?.discountedAmount.centAmount) {
      const oldPrice = `${updatedCart.totalPrice.centAmount / 100 + updatedCart.discountOnTotalPrice.discountedAmount.centAmount / 100} ${updatedCart.totalPrice.currencyCode}`
      bag.setOldPrice(oldPrice)
    }

    const totalPrice = `${updatedCart.totalPrice.centAmount / 100} ${updatedCart.totalPrice.currencyCode}`
    bag.setTotal(totalPrice)
    return response
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error while sending update request: ${error.message}`)
    }
  }
}
