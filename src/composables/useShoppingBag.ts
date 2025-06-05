import { useApiState } from '@/stores/apiState'
import { ref } from 'vue'

export function useShoppingBag() {
  const api = useApiState()

  const bagId = ref('')
  const bagVersion = ref(0)

  const getBag = async (): Promise<{ id: string; version: number }> => {
    try {
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

      return { id: bagId.value, version: bagVersion.value }
    } catch (error) {
      console.error('Failed to get or create cart:', error)
      throw error
    }
  }

  const getBagId = () => bagId.value
  const getBagVersion = () => bagVersion.value

  const addToBag = async ({ sku, quantity = 1 }: { sku: string; quantity?: number }) => {
    try {
      const { id, version } = await getBag()

      const response = await api.root
        .me()
        .carts()
        .withId({ ID: id })
        .post({
          body: {
            version,
            actions: [
              {
                action: 'addLineItem',
                sku,
                quantity,
              },
            ],
          },
        })
        .execute()

      bagVersion.value = response.body.version
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'statusCode' in error &&
        error.statusCode === 409
      ) {
        console.warn('Cart version conflict. Retrying...')
        return addToBag({ sku, quantity })
      } else {
        console.error('Failed to add to cart by SKU:', error)
      }
    }
  }

  const removeFromBag = async (lineItemId: string) => {
    try {
      const { id, version } = await getBag()

      const response = await api.root
        .me()
        .carts()
        .withId({ ID: id })
        .post({
          body: {
            version,
            actions: [
              {
                action: 'removeLineItem',
                lineItemId,
              },
            ],
          },
        })
        .execute()

      bagVersion.value = response.body.version
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'statusCode' in error &&
        error.statusCode === 409
      ) {
        console.warn('Cart version conflict. Retrying...')
        return removeFromBag(lineItemId)
      } else {
        console.error('Failed to remove from cart:', error)
      }
    }
  }

  const getAllBags = async () => {
    await api.root.me().carts().get().execute()
  } // техническая функция просмотра корзин

  return {
    getBagId,
    getBagVersion,
    addToBag,
    removeFromBag,
    getAllBags,
  }
}
