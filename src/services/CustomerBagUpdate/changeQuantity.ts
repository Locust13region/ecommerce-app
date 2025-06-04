import { useAuth } from '@/composables/useAuth'

const { getApiRoot } = useAuth()
export async function changeQuantityRequest(lineId: string, newQuantity: number) {
  const apiRoot = getApiRoot()
  const customerResponse = await apiRoot.me().get().execute()
  const customerId = customerResponse.body.id
  const cartResponse = await apiRoot
    .carts()
    .withCustomerId({ customerId: customerId })
    .get()
    .execute()
  const cart = cartResponse.body
  const response = await apiRoot
    .carts()
    .withId({ ID: cart.id })
    .post({
      body: {
        version: cart.version,
        actions: [
          {
            action: 'changeLineItemQuantity',
            lineItemId: lineId,
            quantity: newQuantity,
          },
        ],
      },
    })
    .execute()

  return response
}
