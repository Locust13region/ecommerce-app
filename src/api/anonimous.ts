import {
  ClientBuilder,
  type AnonymousAuthMiddlewareOptions,
  type HttpMiddlewareOptions,
  type TokenStore,
  type TokenCache,
} from '@commercetools/sdk-client-v2'
import fetch from 'cross-fetch'

const projectKey = 'your-project-key'

const tokenCache: TokenCache = {
  get: async (): Promise<TokenStore> => {
    const raw = localStorage.getItem('anon-token')
    return raw
      ? JSON.parse(raw)
      : {
          token: '',
          expirationTime: 0,
          refreshToken: '',
          refreshTokenExpirationTime: 0,
        }
  },
  set: async (cache: TokenStore) => {
    localStorage.setItem('anon-token', JSON.stringify(cache))
  },
}

const anonymousAuthOptions: AnonymousAuthMiddlewareOptions = {
  host: 'https://auth.europe-west1.gcp.commercetools.com',
  projectKey,
  credentials: {
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    anonymousId: 'guest-user-id-or-random-uuid', // <-- генерируешь или сохраняешь
  },
  scopes: [`manage_project:${projectKey}`],
  fetch,
  tokenCache,
}

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: 'https://api.europe-west1.gcp.commercetools.com',
  fetch,
}

export const anonClient = new ClientBuilder()
  .withAnonymousSessionFlow(anonymousAuthOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .build()
