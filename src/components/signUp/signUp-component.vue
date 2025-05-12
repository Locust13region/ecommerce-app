<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import { Message } from 'primevue'
import { reactive } from 'vue'
import { Form, FormField } from '@primevue/forms'
import {
  validateEmail,
  validateName,
  validatePassword,
} from '@/services/signUp-validation/signUp-validation'

const formData = reactive({
  email: '',
  firstName: '',
  lastName: '',
  password: '',
})

const errors = reactive({
  email: '',
  firstName: '',
  lastName: '',
  password: '',
})

const emailValidation = (): boolean => {
  const emailValidation = validateEmail(formData.email)
  errors.email = emailValidation.message || ''
  if (!emailValidation.valid) return false
  return true
}

const firstNameValidation = (): boolean => {
  const firstNameValidation = validateName(formData.firstName, 'First name')
  errors.firstName = firstNameValidation.message || ''
  if (!firstNameValidation.valid) return false
  return true
}

const lastNameValidation = (): boolean => {
  const lastNameValidation = validateName(formData.lastName, 'Last name')
  errors.lastName = lastNameValidation.message || ''
  if (!lastNameValidation.valid) return false
  return true
}

const passwordValidation = (): boolean => {
  const passwordValidation = validatePassword(formData.password)
  errors.password = passwordValidation.message || ''
  if (!passwordValidation.valid) return false
  return true
}

const validateForm = (): boolean => {
  emailValidation()
  firstNameValidation()
  lastNameValidation()
  passwordValidation()
  return emailValidation() && firstNameValidation() && lastNameValidation() && passwordValidation()
}

function onFormSubmit() {
  if (validateForm()) {
    console.log('Form submitted:', formData)
    // TODO: add sending data to server
  } else {
    console.log('Form validation failed')
  }
}
</script>

<template>
  <Form @submit="onFormSubmit" class="flex flex-col gap-4 w-full sm:w-80 registration-form">
    <label>Email</label>
    <FormField name="email" class="flex flex-col gap-1">
      <InputText
        class="input"
        type="text"
        placeholder="Email"
        v-model="formData.email"
        :class="{ 'p-invalid': errors.email }"
        @change="emailValidation"
      />
      <Message v-if="errors.email" severity="error" size="small" variant="simple">{{
        errors.email
      }}</Message>
    </FormField>

    <div class="name-wrapper">
      <div class="first-name-wrapper">
        <label>First Name</label>
        <FormField name="firstName" class="flex flex-col gap-1">
          <InputText
            class="input firstName"
            type="text"
            placeholder="First Name"
            v-model="formData.firstName"
            :class="{ 'p-invalid': errors.firstName }"
            @change="firstNameValidation"
          />
          <Message v-if="errors.firstName" severity="error" size="small" variant="simple">{{
            errors.firstName
          }}</Message>
        </FormField>
      </div>
      <div class="last-name-wrapper">
        <label>Last Name</label>
        <FormField name="lastName" class="flex flex-col gap-1">
          <InputText
            class="input lastName"
            type="text"
            placeholder="Last Name"
            v-model="formData.lastName"
            :class="{ 'p-invalid': errors.lastName }"
            @change="lastNameValidation"
          />
          <Message v-if="errors.lastName" severity="error" size="small" variant="simple">{{
            errors.lastName
          }}</Message>
        </FormField>
      </div>
    </div>
    <FormField name="password" class="flex flex-col gap-1">
      <Password
        type="text"
        placeholder="Password"
        :feedback="false"
        toggleMask
        fluid
        v-model="formData.password"
        :class="{ 'p-invalid': errors.password }"
        @change="passwordValidation"
      />
      <Message v-if="errors.password" severity="error" size="small" variant="simple">{{
        errors.password
      }}</Message>
    </FormField>

    <Button type="submit" severity="secondary" label="Sign Up" />
  </Form>
</template>

<style scoped>
.registration-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 80%;
}
.name-wrapper {
  display: flex;
  justify-content: space-between;
}
.firstName,
.lastName {
  width: 45%;
}
.input {
  width: 100%;
}
</style>
