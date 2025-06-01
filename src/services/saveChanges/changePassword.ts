import { useAuth } from '@/composables/useAuth'
import type { FormSubmitEvent } from '@primevue/forms'

const { getApiRoot } = useAuth()
export async function changePassword(event: FormSubmitEvent) {
  await getApiRoot()
    .me()
    .get()
    .execute()
    .then(async (res) => {
      const customer = res.body
      return await getApiRoot()
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
    })
}
