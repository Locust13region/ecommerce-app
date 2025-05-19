import {
  ClientBuilder,
  type HttpMiddlewareOptions,
  type AnonymousAuthMiddlewareOptions,
  type ExistingTokenMiddlewareOptions,
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

const api = useApiState()

// export const apiRoot = ref(createApiBuilderFromCtpClient({}).withProjectKey({ projectKey }))

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
    console.log('init: token not exist')
    createAnonymousClient()
    return
  }

  try {
    const parsed: TokenStore = JSON.parse(stored)
    const { token, expirationTime } = parsed

    if (token && expirationTime > Date.now()) {
      console.log('init: token exist & expired => refresh')
      refreshClient(parsed)
      // ToDo при использовании .withExistingTokenFlow токен не рефрешится SDK автоматически, в отличие от .withPasswordFlow
    } else {
      localStorage.removeItem(localStorageKey)
      createAnonymousClient()
    }
  } catch (error) {
    console.error('Invalid localStorage token :', error)
    localStorage.removeItem(localStorageKey)
    createAnonymousClient()
  }
}

export function createAnonymousClient() {
  let anonymousId = localStorage.getItem('anonymous-id')
  if (!anonymousId) {
    anonymousId = generatorUuid()
    localStorage.setItem('anonymous-id', anonymousId)
  }

  const anonymousOptions: AnonymousAuthMiddlewareOptions = {
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

  const client = new ClientBuilder()
    .withAnonymousSessionFlow(anonymousOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build()

  api.setRoot(client)
  // apiRoot.value = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey })
  console.log('Create anonymous APIRoot')
}

export function refreshClient(token: TokenStore) {
  const authorization: string = `Bearer ${token.refreshToken}`
  const options: ExistingTokenMiddlewareOptions = {
    force: true,
  }

  const client = new ClientBuilder()
    .withExistingTokenFlow(authorization, options)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build()

  api.setRoot(client)
  //   apiRoot.value = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey })
  console.log('Refresh APIRoot with existing token')
}

export function createPasswordClient(username: string, password: string) {
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
  }

  const client = new ClientBuilder()
    .withPasswordFlow(authOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build()

  api.setRoot(client)
  //   apiRoot.value = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey })
  console.log('Create APIRoot with password')
}
