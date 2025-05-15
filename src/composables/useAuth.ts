// src/composables/useAuth.ts
import { ref } from 'vue'

import { apiRoot, createAnonymousClient, createPasswordClient } from '@/api/api-root'

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
      isLoggedIn.value = true
      createPasswordClient(username, password)
      const customer = await apiRoot.value.me().get().execute()
      console.log('LoggedIn:', customer.body)
    } catch (e) {
      console.error('Login failed:', e)
      logout()
    }
  }

  const logout = () => {
    localStorage.removeItem('commercetools-token')
    createAnonymousClient()
    isLoggedIn.value = false
  }

  const isAuthenticated = () => isLoggedIn.value

  return {
    register,
    login,
    logout,
    isAuthenticated,
  }
}
