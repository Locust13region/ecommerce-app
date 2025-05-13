import type { CreateCustomerData } from '@/interfaces/signUpFormInterfaces'
import { createApiRoot } from '@/api/client'

export const createCustomer = async (signUpData: CreateCustomerData) => {
  const apiRoot = await createApiRoot()
  if (!apiRoot) {
    console.warn('apiRoot is not available')
    return
  }

  try {
    const response = await apiRoot
      .customers()
      .post({
        body: {
          email: signUpData.email,
          password: signUpData.password,
          firstName: signUpData.firstName,
          lastName: signUpData.lastName,
          dateOfBirth: signUpData.birthDate,
          addresses: [
            {
              country: signUpData.country,
              streetName: signUpData.streetName,
              streetNumber: signUpData.streetNumber,
              postalCode: signUpData.postalCode,
              city: signUpData.city,
            },
          ],
          defaultShippingAddress: 0,
        },
      })
      .execute()

    console.log('Successfully created user:', JSON.stringify((await response).body, null, 2))
    console.log('User created:', response.body)
  } catch (error) {
    console.error('Failed to create user:', error)
  }
}
