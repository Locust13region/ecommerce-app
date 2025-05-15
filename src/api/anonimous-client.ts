import generatorUuid from '@/services/Generator UUID/generator-uuid'
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk'
import {
  ClientBuilder,
  type AnonymousAuthMiddlewareOptions,
  type HttpMiddlewareOptions,
  type TokenStore,
  type TokenCache,
} from '@commercetools/sdk-client-v2'

const projectKey = import.meta.env.VITE_API_PROJECT_KEY!
const clientId = import.meta.env.VITE_API_CLIENT_ID!
const clientSecret = import.meta.env.VITE_API_CLIENT_SECRET!
const authUrl = import.meta.env.VITE_API_AUTH_URL!
const apiUrl = import.meta.env.VITE_API_URL!
const scopes = [`manage_project:${projectKey}`]
const localStorageKey = 'anonymous-token'

const anonymousId = localStorage.getItem('anonymous-id') || generatorUuid()
localStorage.setItem('anonymous-id', anonymousId)

const tokenCache: TokenCache = {
  get: () => {
    try {
      const raw = localStorage.getItem(localStorageKey)
      console.log('get token')
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
      }
    } catch (error) {
      console.log('Error anonymous-token LocalStorage handle', error)
      return {
        token: '',
        expirationTime: 0,
      }
    }
  },
  set: (cache: TokenStore) => {
    console.log('set token')
    localStorage.setItem(localStorageKey, JSON.stringify(cache))
  },
}

export const createAnonymousApiRoot = () => {
  const anonymousAuthOptions: AnonymousAuthMiddlewareOptions = {
    host: authUrl,
    projectKey,
    credentials: {
      clientId,
      clientSecret,
      anonymousId,
    },
    scopes,
    tokenCache,
  }

  const httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: apiUrl,
  }

  const anonymousClient = new ClientBuilder()
    .withAnonymousSessionFlow(anonymousAuthOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build()
  console.log('create', anonymousClient)

  return createApiBuilderFromCtpClient(anonymousClient).withProjectKey({ projectKey })
}
