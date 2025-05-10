import { apiRoot } from './build-client'

export async function getCustomerById(id: string) {
  const response = await apiRoot.customers().withId({ ID: id }).get().execute()
  return response.body
}
