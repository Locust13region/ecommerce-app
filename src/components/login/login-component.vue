<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import { loginValidator } from '@/services/loginValidator/loginFormValidation'
import { Form, FormField, type FormSubmitEvent } from '@primevue/forms'
import { ref } from 'vue'
import { Message } from 'primevue'
import { useToast } from 'primevue/usetoast'
import { useAuth } from '@/composables/useAuth'

const { login } = useAuth()
const toast = useToast()
const email = ref('')
const password = ref('')

const formSubmit = async (event: FormSubmitEvent) => {
  if (event.valid) {
    const email = event.states.email.value
    const password = event.states.password.value
    try {
      await login(email, password)
    } catch (error) {
      if (error instanceof Error) {
        toast.add({ severity: 'error', summary: `${error.message}`, life: 5000 })
      }
    }
  }
}
</script>

<template>
  <Form v-slot="$form" :resolver="loginValidator" @submit="formSubmit" class="login-form">
    <FormField>
      <IconField>
        <InputIcon class="pi pi-user" />
        <InputText class="input-email" placeholder="Email" name="email" v-model.trim="email" />
      </IconField>
      <Message
        class="email-validation-error-message"
        v-if="$form.email?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $form.email.error?.message }}
      </Message>
    </FormField>
    <FormField>
      <Password
        class="input-password"
        name="password"
        placeholder="Password"
        :feedback="false"
        v-model="password"
        toggleMask
      />
      <div v-if="$form.password?.invalid" class="password-validation-error-block">
        <Message
          class="password-validation-error-message"
          v-for="(error, index) of $form.password.errors"
          :key="index"
          severity="error"
          size="small"
          variant="simple"
          >{{ error.message }}<br
        /></Message>
      </div>
    </FormField>
    <Button type="submit" label="Login" class="login-button">Log In</Button>
  </Form>
</template>

<style>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.login-button {
  width: 235px;
}

.password-validation-error-message {
  display: flex;
  flex-direction: column;
  max-width: 235px;
  word-break: normal;
}

@media (min-width: 1024px) {
  .login-button {
    width: 100%;
  }
}
</style>
