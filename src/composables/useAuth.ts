// src/composables/useAuth.ts
import { ref } from 'vue'
import { buildClient } from '@/api/client'
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk'
import type { Client } from '@commercetools/sdk-client-v2'
import type { ApiRoot } from '@commercetools/platform-sdk'

const client = ref<Client | null>(null)
const apiRoot = ref<ApiRoot | null>(null)
const isLoggedIn = ref<boolean>(false)

export function useAuth() {
  const login = async (username: string, password: string) => {
    try {
      const builtClient = buildClient(username, password)
      await builtClient.execute({
        uri: `/${import.meta.env.VITE_API_PROJECT_KEY}/me`,
        method: 'GET',
      })

      client.value = builtClient
      apiRoot.value = createApiBuilderFromCtpClient(builtClient)
      isLoggedIn.value = true
    } catch (e) {
      logout()
      if (e instanceof Error) {
        throw new Error(`Login failed: ${e.message}`)
      }
      // console.error('Login failed:', e)
    }
  }

  const logout = () => {
    localStorage.removeItem('commercetools-token')
    client.value = null
    apiRoot.value = null
    isLoggedIn.value = false
  }

  const getClient = () => client.value
  const isAuthenticated = () => isLoggedIn.value
  const getApiRoot = () => {
    if (!client.value) return null
    return createApiBuilderFromCtpClient(client.value).withProjectKey({
      projectKey: import.meta.env.VITE_API_PROJECT_KEY!,
    })
  }

  return {
    login,
    logout,
    getClient,
    getApiRoot,
    isAuthenticated,
  }
}
