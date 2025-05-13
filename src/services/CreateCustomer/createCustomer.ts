import { useAuth } from '@/composables/useAuth'

const { getApiRoot } = useAuth()

export const createCustomer = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  streetName: string,
  streetNumber: string,
  city: string,
  postalCode: string,
  country: string,
  dateOfBirth: string,
) => {
  const apiRoot = getApiRoot()
  if (!apiRoot) {
    console.warn('apiRoot is not available')
    return
  }

  try {
    const response = await apiRoot
      .customers()
      .post({
        body: {
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
          dateOfBirth: dateOfBirth,
          addresses: [
            {
              country: country,
              streetName: streetName,
              streetNumber: streetNumber,
              postalCode: postalCode,
              city: city,
            },
          ],
          defaultShippingAddress: 1,
        },
      })
      .execute()

    console.log('User created:', response.body)
  } catch (error) {
    console.error('Failed to create user:', error)
  }
}
