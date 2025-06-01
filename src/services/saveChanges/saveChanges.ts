import { useAuth } from '@/composables/useAuth'
import type { ClientResponse, MyCustomerUpdateAction } from '@commercetools/platform-sdk'

const { getApiRoot } = useAuth()
export async function saveChanges(changes: MyCustomerUpdateAction[]): Promise<ClientResponse> {
  const apiRoot = getApiRoot()
  const customerRes = await apiRoot.me().get().execute()
  const customer = customerRes.body

  return apiRoot
    .me()
    .post({
      body: {
        version: customer.version,
        actions: changes,
      },
    })
    .execute()
}
