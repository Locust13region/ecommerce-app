import { createAnonymousClient, createPasswordClient } from '@/api/api-root'
import type { CreateCustomerData } from '@/interfaces/signUpFormInterfaces'
import router from '@/router'
import { useApiState } from '@/stores/apiState'
import { useUserStateStore } from '@/stores/userState'

export function useAuth() {
  const user = useUserStateStore()
  const api = useApiState()
  const register = async (signUPData: CreateCustomerData) => {
    try {
      await api.root
        .customers()
        .post({
          body: signUPData,
        })
        .execute()

      await login(signUPData.email, signUPData.password)
    } catch (error) {
      console.error('Error registering new customer:', error)
    }
  }

  const login = async (username: string, password: string) => {
    try {
      await api.root
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

      createPasswordClient(username, password)

      user.loginState()
      localStorage.removeItem('anonymous-id')

      await router.push({ path: '/' })
    } catch (error) {
      console.error('Login failed:', error)
      logout()
      if (error instanceof Error) {
        throw new Error(`Login failed: ${error.message}`)
      }
    }
  }

  const logout = () => {
    user.logoutState()
    localStorage.removeItem('commercetools-token')
    createAnonymousClient()
  }

  const getApiRoot = () => api.root

  return {
    register,
    login,
    logout,
    getApiRoot,
  }
}
