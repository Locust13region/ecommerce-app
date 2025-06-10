import { useAuth } from '@/composables/useAuth'
import { useBagStateStore } from '@/stores/bagStates'
import type { CartUpdateAction } from '@commercetools/platform-sdk'

const { getApiRoot } = useAuth()
export async function updateBag(actions: CartUpdateAction[]) {
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

  if (response.statusCode === 200) {
    const bag = useBagStateStore()
    const cart = response.body
    const itemsList = cart.lineItems
    bag.setItems(itemsList)

    if (bag.items.length === 0) {
      bag.setEmpty()
    }

    if (cart.discountOnTotalPrice?.discountedAmount.centAmount) {
      const oldPrice = `${cart.totalPrice.centAmount / 100 + cart.discountOnTotalPrice.discountedAmount.centAmount / 100} ${cart.totalPrice.currencyCode}`
      bag.setOldPrice(oldPrice)
    }

    const totalPrice = `${cart.totalPrice.centAmount / 100} ${cart.totalPrice.currencyCode}`
    bag.setTotal(totalPrice)
  } else {
    throw new Error('Error while sending update request')
  }
  return response
}
