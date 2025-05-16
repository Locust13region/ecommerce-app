import { useAuth } from './useAuth'

const { getApiRoot } = useAuth()

export const getCustomerByEmail = (customerEmail: string) => {
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
