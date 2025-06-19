import { useAuth } from '@/composables/useAuth'
import type { FormSubmitEvent } from '@primevue/forms'

const { getApiRoot } = useAuth()
export async function changePassword(event: FormSubmitEvent) {
  const apiRoot = getApiRoot()
  const response = await apiRoot.me().get().execute()
  const customer = response.body
  return apiRoot
    .me()
    .password()
    .post({
      body: {
        version: customer.version,
        currentPassword: event.states.currentPassword.value,
        newPassword: event.states.newPassword.value,
      },
    })
    .execute()
}
