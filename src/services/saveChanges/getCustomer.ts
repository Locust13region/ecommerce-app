import { useAuth } from '@/composables/useAuth'
import type { ClientResponse } from '@commercetools/platform-sdk'

const { getApiRoot } = useAuth()
export async function getCustomer(getDateCallback: (res: ClientResponse) => void): Promise<void> {
  getApiRoot()
    .me()
    .get()
    .execute()
    .then((res) => {
      getDateCallback(res)
    })
}
