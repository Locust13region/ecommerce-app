// src/composables/useAuth.ts
import { ref } from 'vue'

import { apiRoot, createAnonymousClient } from '@/api/api-root'

const isLoggedIn = ref<boolean>(false)

export function useAuth() {
  const register = async () => {
    try {
      const customerResponse = await apiRoot.value
        .customers()
        .post({
          body: {
            email: 'user@proton.com',
            password: '1qaz2wsx',
            firstName: 'John',
            lastName: 'Lennon',
          },
        })
        .execute()

      console.log('Register new customer with ID:', customerResponse.body.customer.id)
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
    } catch (error) {
      console.error('Login failed:', error)
      logout()
    }
  }

  const logout = () => {
    localStorage.removeItem('commercetools-token')
    isLoggedIn.value = false
    createAnonymousClient()
  }

  const isAuthenticated = () => isLoggedIn.value
  const getApi = () => apiRoot.value

  return {
    register,
    login,
    logout,
    isAuthenticated,
    getApi,
  }
}
