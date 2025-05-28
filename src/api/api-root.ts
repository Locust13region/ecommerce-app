import {
  ClientBuilder,
  type HttpMiddlewareOptions,
  type AnonymousAuthMiddlewareOptions,
  type RefreshAuthMiddlewareOptions,
  type PasswordAuthMiddlewareOptions,
  type TokenCache,
  type TokenStore,
} from '@commercetools/sdk-client-v2'
import generatorUuid from '@/services/Generator UUID/generator-uuid'
import { useApiState } from '@/stores/apiState'

const projectKey = import.meta.env.VITE_API_PROJECT_KEY!
const clientId = import.meta.env.VITE_API_CLIENT_ID!
const clientSecret = import.meta.env.VITE_API_CLIENT_SECRET!
const authUrl = import.meta.env.VITE_API_AUTH_URL!
const apiUrl = import.meta.env.VITE_API_URL!
const scopes = [`manage_project:${projectKey}`]
const localStorageKey = 'commercetools-token'

export const tokenCache: TokenCache = {
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
    localStorage.setItem(localStorageKey, JSON.stringify(cache))
  },
}

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiUrl,
}

export function initializeClient() {
  const stored = localStorage.getItem(localStorageKey)

  if (!stored) {
    createAnonymousClient()
    return
  }

  try {
    const parsed: TokenStore = JSON.parse(stored)
    const { token, expirationTime, refreshToken } = parsed

    if (token && refreshToken && expirationTime > Date.now()) {
      refreshClient(parsed)
      // ToDo при использовании .withExistingTokenFlow токен не рефрешится SDK автоматически, в отличие от .withPasswordFlow
    } else {
      localStorage.removeItem(localStorageKey)
      localStorage.removeItem('commercetools-isLoggedIn')
      createAnonymousClient()
    }
  } catch (error) {
    console.error('Invalid localStorage token :', error)
    localStorage.removeItem(localStorageKey)
    localStorage.removeItem('commercetools-isLoggedIn')
    createAnonymousClient()
  }
}

export function createAnonymousClient() {
  const api = useApiState()
  const anonymousId = generatorUuid()
  localStorage.setItem('anonymous-id', anonymousId)

  const anonymousOptions: AnonymousAuthMiddlewareOptions = {
    host: authUrl,
    projectKey,
    credentials: {
      clientId,
      clientSecret,
      anonymousId,
    },
    scopes,
  }

  const client = new ClientBuilder()
    .withAnonymousSessionFlow(anonymousOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build()

  api.setRoot(client)
}

export function refreshClient(token: TokenStore) {
  const api = useApiState()

  const refreshOptions: RefreshAuthMiddlewareOptions = {
    host: authUrl,
    projectKey,
    credentials: {
      clientId,
      clientSecret,
    },
    refreshToken: token.refreshToken!,
    tokenCache,
  }

  const client = new ClientBuilder()
    .withRefreshTokenFlow(refreshOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build()

  api.setRoot(client)
}

export function createPasswordClient(username: string, password: string) {
  const api = useApiState()
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

  const client = new ClientBuilder()
    .withPasswordFlow(authOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build()

  api.setRoot(client)
}
