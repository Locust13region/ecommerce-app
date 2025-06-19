<script setup lang="ts">
import { changePassword } from '@/services/saveChanges/changePassword'
import { Button, Message, Password, useToast } from 'primevue'
import { personalDataValidator } from '@/services/PersonalDataValidator/PersonalDataValidator'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { useAuth } from '@/composables/useAuth'
import router from '@/router'

const toast = useToast()
const { logout } = useAuth()
async function onSubmit(event: FormSubmitEvent) {
  if (event.valid) {
    try {
      await changePassword(event)
      logout()
      router.push('/login')
      toast.add({ severity: 'success', summary: 'Password changed', life: 5000 })
    } catch (error) {
      if (error instanceof Error) {
        toast.add({ severity: 'error', summary: `${error.message}`, life: 5000 })
      }
    }
  }
}
</script>
<template>
  <Form class="change-password" :resolver="personalDataValidator" v-slot="$form" @submit="onSubmit">
    <Password
      class="current password"
      name="currentPassword"
      placeholder="Enter current password"
      :feedback="false"
      fluid
      toggleMask
    ></Password>
    <Message
      class="validation-error-message"
      severity="error"
      size="small"
      variant="simple"
      v-if="$form.currentPassword?.invalid"
      >{{ $form.currentPassword.error?.message }}</Message
    >
    <Password
      class="new password"
      name="newPassword"
      placeholder="Enter new password"
      toggleMask
      :feedback="false"
      fluid
    ></Password>
    <Message
      class="validation-error-message"
      severity="error"
      size="small"
      variant="simple"
      v-if="$form.newPassword?.invalid"
      >{{ $form.newPassword.error?.message }}</Message
    >
    <Button severity="secondary" class="save-button" type="submit" raised
      ><span class="pi pi-check"></span> Save</Button
    >
  </Form>
</template>
<style scoped>
.change-password {
  display: flex;
  flex-direction: column;
  gap: 10px 0;
  width: 35%;
}

@media (max-width: 560px) {
  .change-password {
    width: 100%;
  }
}
</style>
