// src/composables/useAuth.ts
import { ref } from 'vue'

import { apiRoot, createAnonymousClient, createPasswordClient } from '@/api/api-root'

const isLoggedIn = ref<boolean>(false)

import { type FormData } from '@/interfaces/signUpFormInterfaces'
interface CreateCustomerData extends Omit<FormData, 'street' | 'billingStreet'> {
  streetName?: string
  streetNumber?: string
  billingStreetName?: string
  billingStreetNumber?: string
  defaultShippingAddress?: number
  defaultBillingAddress?: number
}

export function useAuth() {
  const register = async (signUPData: CreateCustomerData) => {
    try {
      const customerResponse = await apiRoot.value
        .customers()
        .post({
          body: signUPData,
        })
        .execute()
      console.log('Register new customer with ID:', customerResponse.body.customer.id)

      await login(signUPData.email, signUPData.password)
    } catch (error) {
      console.error('Error registering new customer:', error)
    }
  }

  const login = async (username: string, password: string) => {
    try {
      const loginResponse = await apiRoot.value
        .me()
        .login()
        .post({
          body: {
            email: username,
            password: password,

            activeCartSignInMode: 'UseAsNewActiveCustomerCart',
          },
        })
        .execute()
      console.log('Logged in customer', loginResponse.body.customer)
      console.log('Cart:', loginResponse.body.cart?.lineItems)

      isLoggedIn.value = true
      createPasswordClient(username, password)
      localStorage.removeItem('anonymous-id')
    } catch (error) {
      console.error('Login failed:', error)

      logout()
      if (error instanceof Error) {
        throw new Error(`Login failed: ${error.message}`)
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('commercetools-token')
    isLoggedIn.value = false
    createAnonymousClient()
  }

  const isAuthenticated = () => isLoggedIn.value
  const getApiRoot = () => apiRoot.value

  return {
    register,
    login,
    logout,
    isAuthenticated,
    getApiRoot,
  }
}
