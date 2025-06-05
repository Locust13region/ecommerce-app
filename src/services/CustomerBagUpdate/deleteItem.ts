import { useAuth } from '@/composables/useAuth'

const { getApiRoot } = useAuth()
export async function deleteItem(lineId: string) {
  const apiRoot = getApiRoot()
  const cartResponse = await apiRoot.me().carts().get().execute()
  const cart = cartResponse.body.results[0]

  // console.log('delete', cart, lineId)
  const response = await apiRoot
    .carts()
    .withId({ ID: cart.id })
    .post({
      body: {
        version: cart.version,
        actions: [
          {
            action: 'removeLineItem',
            lineItemId: lineId,
          },
        ],
      },
    })
    .execute()

  return response
}
