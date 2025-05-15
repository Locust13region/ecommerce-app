import { ref } from 'vue'
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk'
import {
  ClientBuilder,
  type HttpMiddlewareOptions,
  type AnonymousAuthMiddlewareOptions,
  type PasswordAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2'
import generatorUuid from '@/services/Generator UUID/generator-uuid'

const projectKey = import.meta.env.VITE_API_PROJECT_KEY!
const clientId = import.meta.env.VITE_API_CLIENT_ID!
const clientSecret = import.meta.env.VITE_API_CLIENT_SECRET!
const authUrl = import.meta.env.VITE_API_AUTH_URL!
const apiUrl = import.meta.env.VITE_API_URL!
const scopes = [`manage_project:${projectKey}`]

export const apiRoot = ref(createApiBuilderFromCtpClient({}).withProjectKey({ projectKey }))

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiUrl,
}

export function createAnonymousClient() {
  const anonymousId = generatorUuid()

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

  apiRoot.value = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey })
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

  apiRoot.value = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey })
}
