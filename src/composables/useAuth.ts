import { createAnonymousClient, createPasswordClient } from '@/api/api-root'
import type { CreateCustomerData } from '@/interfaces/signUpFormInterfaces'
import { useApiState } from '@/stores/apiState'
import { useUserStateStore } from '@/stores/userState'

const user = useUserStateStore()
const api = useApiState()

export function useAuth() {
  const register = async (signUPData: CreateCustomerData) => {
    try {
      const customerResponse = await api.root
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
      const loginResponse = await api.root
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

      user.loginState()
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
    user.logoutState()
    createAnonymousClient()
  }

  const isAuthenticated = () => user.isLoggedIn
  const getApiRoot = () => api.root

  return {
    register,
    login,
    logout,
    isAuthenticated,
    getApiRoot,
  }
}
