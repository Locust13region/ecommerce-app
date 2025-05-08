<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

import { Form, FormField } from '@primevue/forms'
</script>

<template>
  <Form class="flex flex-col gap-4 w-full sm:w-80">
    <FormField class="input">
      <IconField class="input-item">
        <InputIcon class="pi pi-user" />
        <InputText placeholder="Email" required />
      </IconField>
    </FormField>

    <FormField class="input">
      <Password placeholder="Password" :feedback="false" toggleMask />
    </FormField>
  </Form>
  <Button type="submit" label="Login" class="login-button">Log In</Button>
</template>

<style>
.login-button {
  width: 100%;
}

@media (min-width: 1024px) {
  .login-button {
    width: 55%;
  }
}
</style>
