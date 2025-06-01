import { useAuth } from '@/composables/useAuth'
import type { MyCustomerUpdateAction } from '@commercetools/platform-sdk'

const { getApiRoot } = useAuth()
export async function saveChanges(changes: MyCustomerUpdateAction[]) {
  getApiRoot()
    .me()
    .get()
    .execute()
    .then(async (res) => {
      const customer = res.body
      return customer
    })
    .then((customer) => {
      getApiRoot()
        .me()
        .post({
          body: {
            version: customer.version,
            actions: changes,
          },
        })
        .execute()
    })
}
