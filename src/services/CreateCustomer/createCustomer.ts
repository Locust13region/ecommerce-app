import type {
  Address,
  CommerceToolsError,
  CreateCustomerBodyRequest,
  CreateCustomerData,
} from '@/interfaces/signUpFormInterfaces'
import { createApiRootWithClientCredentialsFlow } from '@/api/client'

export const createCustomer = async (signUpData: CreateCustomerData) => {
  const apiRoot = await createApiRootWithClientCredentialsFlow()
  if (!apiRoot) {
    console.warn('apiRoot is not available')
    return
  }

  const shippingAddress: Address = {
    country: signUpData.country,
    streetName: signUpData.streetName,
    streetNumber: signUpData.streetNumber,
    postalCode: signUpData.postalCode,
    city: signUpData.city,
  }

  const billingAddress: Address = {
    country: signUpData.billingCountry,
    streetName: signUpData.billingStreetName,
    streetNumber: signUpData.billingStreetNumber,
    postalCode: signUpData.billingPostalCode,
    city: signUpData.billingCity,
  }

  const addresses: Address[] = [shippingAddress]

  let defaultBillingAddress = signUpData.defaultBillingAddress

  if (!signUpData.isBillingSameAsShipping) {
    addresses.push(billingAddress)
    defaultBillingAddress = 1
  }

  const body: CreateCustomerBodyRequest = {
    email: signUpData.email,
    password: signUpData.password,
    firstName: signUpData.firstName,
    lastName: signUpData.lastName,
    dateOfBirth: signUpData.birthDate,
    addresses: addresses,
    defaultBillingAddress: defaultBillingAddress,
  }

  if (signUpData.isDefaultShippingAddress) {
    body['defaultShippingAddress'] = 0
  }

  try {
    const response = await apiRoot
      .customers()
      .post({
        body: body,
      })
      .execute()

    console.log('Successfully created user:', JSON.stringify((await response).body, null, 2))
    console.log('User created:', response.body)
    return response.body
  } catch (err) {
    const error = err as CommerceToolsError
    console.error('Failed to create user:', error)
    throw error
  }
}
