import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk'
import { type Client } from '@commercetools/sdk-client-v2'
import { defineStore } from 'pinia'

const projectKey = import.meta.env.VITE_API_PROJECT_KEY!

export const useApiState = defineStore('api', {
  state: () => ({
    root: createApiBuilderFromCtpClient({}).withProjectKey({ projectKey }),
  }),
  actions: {
    setRoot(client: Client) {
      this.root = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey })
    },
  },
})
