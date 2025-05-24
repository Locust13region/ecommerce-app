import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk'
import {
  ClientBuilder,
  type HttpMiddlewareOptions,
  type AuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2'

const projectKey = import.meta.env.VITE_API_PROJECT_KEY!
const clientId = import.meta.env.VITE_API_CLIENT_ID!
const clientSecret = import.meta.env.VITE_API_CLIENT_SECRET!
const authUrl = import.meta.env.VITE_API_AUTH_URL!
const apiUrl = import.meta.env.VITE_API_URL!
const scopes = [`manage_project:${projectKey}`]

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

  console.log(ctpClient, 'ctpClient from CreateRoot with Credentials')

  const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
    projectKey,
  })

  return apiRoot
}
