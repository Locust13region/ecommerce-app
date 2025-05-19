<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import router from '@/router'
import { loginValidator } from '@/services/loginFormValidation'
import { Form, FormField, type FormSubmitEvent } from '@primevue/forms'
import { ref } from 'vue'
import { Message, Toast } from 'primevue'
import { useToast } from 'primevue/usetoast'
import { useAuth } from '@/composables/useAuth'

const { login } = useAuth()
const email = ref('')
const password = ref('')

const formSubmit = async (event: FormSubmitEvent) => {
  const toast = useToast()
  if (event.valid) {
    const email = event.states.email.value
    const password = event.states.password.value
    try {
      await login(email, password)
      router.push('/')
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
        <InputText placeholder="Email" name="email" v-model.trim="email" />
      </IconField>
      <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
        $form.email.error?.message
      }}</Message>
    </FormField>
    <FormField>
      <Password
        name="password"
        placeholder="Password"
        :feedback="false"
        v-model="password"
        toggleMask
      />
      <div v-if="$form.password?.invalid" class="flex flex-col gap-1">
        <Message
          v-for="(error, index) of $form.password.errors"
          :key="index"
          severity="error"
          size="small"
          variant="simple"
          class="message"
          >{{ error.message }}<br
        /></Message>
      </div>
    </FormField>
    <Button type="submit" label="Login" class="login-button">Log In</Button>
  </Form>
  <Toast></Toast>
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

.message {
  max-width: 235px;
  word-break: normal;
}

@media (min-width: 1024px) {
  .login-button {
    width: 100%;
  }
}
</style>
