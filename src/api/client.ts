import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk'
import {
  ClientBuilder,
  type PasswordAuthMiddlewareOptions,
  type HttpMiddlewareOptions,
  type TokenCache,
  type TokenStore,
  type AuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2'

const projectKey = import.meta.env.VITE_API_PROJECT_KEY!
const clientId = import.meta.env.VITE_API_CLIENT_ID!
const clientSecret = import.meta.env.VITE_API_CLIENT_SECRET!
const authUrl = import.meta.env.VITE_API_AUTH_URL!
const apiUrl = import.meta.env.VITE_API_URL!
const scopes = [`manage_project:${projectKey}`]
const localStorageKey = 'commercetools-token'

const tokenCache: TokenCache = {
  get: () => {
    try {
      const raw = localStorage.getItem(localStorageKey)
      if (!raw) {
        return {
          token: '',
          expirationTime: 0,
        }
      }
      const parsed = JSON.parse(raw)
      return {
        token: parsed.token || '',
        expirationTime: parsed.expirationTime || 0,
        refreshToken: parsed.refreshToken,
      }
    } catch (error) {
      console.log('Error LocalStorage handle', error)
      return {
        token: '',
        expirationTime: 0,
      }
    }
  },
  set: (cache: TokenStore) => {
    console.log('TOKEN UPDATED')
    localStorage.setItem(localStorageKey, JSON.stringify(cache))
  },
}

export const buildClient = (username: string, password: string) => {
  const authOptions: PasswordAuthMiddlewareOptions = {
    host: authUrl,
    projectKey,
    credentials: {
      clientId,
      clientSecret,
      user: {
        username,
        password,
      },
    },
    scopes,
    tokenCache,
  }

  const httpOptions: HttpMiddlewareOptions = {
    host: apiUrl,
  }

  return (
    new ClientBuilder()
      .withPasswordFlow(authOptions)
      .withHttpMiddleware(httpOptions)
      // .withLoggerMiddleware()
      .build()
  )
}

export const createApiRootWithClientCredentialsFlow = () => {
  const authMiddlewareOptions: AuthMiddlewareOptions = {
    host: authUrl,
    projectKey,
    credentials: {
      clientId,
      clientSecret,
    },
    scopes,
    fetch,
  }

  const httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: apiUrl,
    fetch,
  }

  const ctpClient = new ClientBuilder()
    .withClientCredentialsFlow(authMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build()

  const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
    projectKey,
  })

  return apiRoot
}
