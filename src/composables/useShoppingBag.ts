import { useApiState } from '@/stores/apiState'
import { ref } from 'vue'

export function useShoppingBag() {
  const api = useApiState()

  const bagId = ref('')
  const bagVersion = ref(0)

  const getBag = async () => {
    const cartsResponse = await api.root.me().carts().get().execute()
    const carts = cartsResponse.body.results
    const activeCart = carts.find((cart) => cart.cartState === 'Active')
    if (activeCart) {
      bagId.value = activeCart.id
      bagVersion.value = activeCart.version
    } else {
      const createResponse = await api.root
        .me()
        .carts()
        .post({
          body: {
            currency: 'USD',
            country: 'US',
          },
        })
        .execute()
      const newCart = createResponse.body
      bagId.value = newCart.id
      bagVersion.value = newCart.version
    }
  }

  const getBagId = () => bagId.value
  const getBagVersion = () => bagVersion.value

  return { getBag, getBagId, getBagVersion, addToBag, removeFromBag }
}
// await getApiRoot().me().carts()
//     .post({
//         body: {
//             currency: "USD",
//             country: "US",
//             customerEmail: "a-g@proton.com",
//         },
//     })
//     .execute()

// await getApiRoot().me().carts().withId({ ID: "c7d9ebe4-54e9-43a4-ad9d-452ec1857a66" }).delete({
//     queryArgs: {
//         version: 1,
//     },
// }).execute();

// await getApiRoot().carts()
//     .withId({ ID: "c7d9ebe4-54e9-43a4-ad9d-452ec1857a66" })
//     .post({
//         body: {
//             version: 16,
//             actions: [
//                 {
//                     action: 'addLineItem',
//                     sku: "01-001",
//                     quantity: 1,
//                 }
//             ]
//         }
//     })
//     .execute();

// await getApiRoot().products()
//     .withId({ ID: 'b92dc2f8-f330-49f0-b2be-50aa3e904281' })
//     .get()
//     .execute();
