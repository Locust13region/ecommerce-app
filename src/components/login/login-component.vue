<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import router from '@/router'

import { Form, FormField, type FormSubmitEvent } from '@primevue/forms'
import { ref } from 'vue'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { Message, Toast } from 'primevue'
import { useToast } from 'primevue/usetoast'
import { useAuth } from '@/composables/useAuth'
import { getCustomerByEmail } from '@/composables/getCustomerByEmail'

const { login /*, logout*/ } = useAuth()
const toast = useToast()
const email = ref('')
const password = ref('')

const resolver = ref(
  zodResolver(
    z.object({
      email: z
        .string()
        .min(1, { message: 'Email is required.' })
        .email({ message: 'Invalid email address.' }),
      password: z
        .string()
        .min(8, { message: 'Minimum 8 characters.' })
        .max(12, { message: 'Maximum 12 characters.' })
        .refine((value) => /[a-z]/.test(value), {
          message: 'Must have a lowercase letter.',
        })
        .refine((value) => /[A-Z]/.test(value), {
          message: 'Must have an uppercase letter.',
        })
        .refine((value) => /[0-9]/.test(value), {
          message: 'Must have a number.',
        })
        .refine((value) => /^[^\s]+$/.test(value), {
          message: 'Password cannot include spaces.',
        }),
    }),
  ),
)

const formSubmit = async (event: FormSubmitEvent) => {
  if (event.valid) {
    const email = event.states.email.value
    const password = event.states.password.value
    await login(email, password).catch((e) => {
      toast.add({ severity: 'error', summary: `${e.message}`, life: 5000 })
    })

    const responseWithCustomerData = await getCustomerByEmail(email)
    if (
      responseWithCustomerData &&
      responseWithCustomerData.statusCode === 200 &&
      responseWithCustomerData.body.results.length !== 0
    ) {
      console.log(responseWithCustomerData)
      console.log(responseWithCustomerData.body.results)
      router.push('/')
      localStorage.setItem('commercetools-isLogined', 'true')
    }
  }
}
</script>

<template>
  <Form
    v-slot="$form"
    :resolver="resolver"
    @submit="formSubmit"
    class="flex flex-col gap-4 w-full sm:w-80"
  >
    <FormField>
      <IconField>
        <InputIcon class="pi pi-user" />
        <InputText placeholder="Email" name="email" v-model="email" />
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
          >{{ error.message }}<br
        /></Message>
      </div>
    </FormField>
    <Button type="submit" label="Login" class="login-button">Log In</Button>
  </Form>
  <Toast></Toast>
</template>

<style>
.login-button {
  width: 235px;
}

@media (min-width: 1024px) {
  .login-button {
    width: 100%;
  }
}
</style>
