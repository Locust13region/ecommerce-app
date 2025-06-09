import { useAuth } from '@/composables/useAuth'
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

  return response
}
