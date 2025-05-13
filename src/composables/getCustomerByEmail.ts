import { useAuth } from './useAuth'

const { getApiRoot } = useAuth()

export const returnCustomerByEmail = (customerEmail: string) => {
  const apiRoot = getApiRoot()
  if (apiRoot) {
    return apiRoot
      .customers()
      .get({
        queryArgs: {
          where: `email="${customerEmail}"`,
        },
      })
      .execute()
  }
}
