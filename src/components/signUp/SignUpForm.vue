<script setup lang="ts">
import Button from 'primevue/button'
import { Form } from '@primevue/forms'
import Toast from 'primevue/toast'
import { useToast } from 'primevue'
import { useRouter } from 'vue-router'

import FormInputField from '../FormInputField/FormInputField.vue'
import SignUpBirthDate from '@/components/signUp/SignUpBirthDate.vue'
import countrySelect from '@/components/signUp/SignUpFormCountry.vue'
import SignUpPassword from '@/components/signUp/SignUpPassword.vue'

import { useSignUpForm } from '@/composables/signUpValidation/SignUpValidation'

import { parseSignUpFormData } from '@/services/SignUpFormParser/signUpFormParsers'
import { createCustomer } from '@/services/CreateCustomer/createCustomer'
import type { CommerceToolsError } from '@/interfaces/signUpFormInterfaces'

import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const toast = useToast()

const { login } = useAuth()

const {
  formData,
  formErrors,
  validateForm,
  validateEmailField,
  validateFirstName: firstNameValidation,
  validateLastName: lastNameValidation,
  validatePasswordField: passwordValidation,
  validateStreetField: validateStreet,
  validateCityField: validateCity,
  validatePostalCodeField: postalCodeValidation,
  validateCountryField: countryValidation,
  validateBirthDateField: validateDateField,
} = useSignUpForm()

const onFormSubmit = async () => {
  if (validateForm()) {
    try {
      const response = await createCustomer(parseSignUpFormData(formData.value))
      console.log('Customer created successfully:', response)
      // TODO: show success message using Toast
      //       redirect customer to main page
      toast.add({
        severity: 'success',
        summary: 'Success!',
        detail: `Your account ${formData.value.email} has been created successfully!`,
        life: 10000,
      })

      await login(formData.value.email, formData.value.password)
      console.log('Customer logged in successfully:', response)

      toast.add({
        severity: 'info',
        summary: 'Info Message',
        detail: 'You are logged in. Redirecting to the main page...',
        life: 3000,
      })

      setTimeout(() => {
        router.push({ path: '/' })
      }, 3000)
    } catch (err) {
      const error = err as CommerceToolsError
      console.error('Error when creating customer:', error.body.message)

      if (error.body.message === 'There is already an existing customer with the provided email.') {
        formErrors.value.email = 'Email already exists'
      } else {
        formErrors.value.email = ''
      }

      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: `${error.body.message} Go to login page to log in with this email.`,
        life: 10000,
      })
    }
  } else {
    console.log('Form validation failed')
  }
}
</script>

<template>
  <Toast />
  <Form @submit="onFormSubmit" class="flex flex-col gap-4 w-full sm:w-80 registration-form">
    <FormInputField
      name="email"
      label="Email"
      :error="formErrors.email"
      v-model:modelValue="formData.email"
      type="text"
      placeholder="Email"
      :validate="validateEmailField"
    />

    <div class="name-wrapper">
      <div class="first-name-wrapper">
        <FormInputField
          name="firstName"
          label="First Name"
          inputClass="firstName"
          :error="formErrors.firstName"
          v-model:modelValue="formData.firstName"
          type="text"
          placeholder="First Name"
          :validate="firstNameValidation"
        />
      </div>
      <div class="last-name-wrapper">
        <FormInputField
          inputClass="lastName"
          name="lastName"
          label="Last Name"
          :error="formErrors.lastName"
          v-model:modelValue="formData.lastName"
          type="text"
          placeholder="Last Name"
          :validate="lastNameValidation"
        />
      </div>
    </div>

    <SignUpPassword
      name="password"
      label="Password"
      :error="formErrors.password"
      v-model:modelValue="formData.password"
      type="password"
      placeholder="Password"
      :validate="passwordValidation"
    />

    <SignUpBirthDate
      name="birthDate"
      label="Birth Date"
      :error="formErrors.birthDate"
      v-model:modelValue="formData.birthDate"
      :validate="validateDateField"
    />

    <FormInputField
      name="street"
      label="Address"
      :error="formErrors.street"
      v-model:modelValue="formData.street"
      type="text"
      placeholder="Street"
      :validate="validateStreet"
    />

    <FormInputField
      name="city"
      :error="formErrors.city"
      v-model:modelValue="formData.city"
      type="text"
      placeholder="City"
      :validate="validateCity"
    />
    <FormInputField
      name="postalCode"
      :error="formErrors.postalCode"
      v-model:modelValue="formData.postalCode"
      type="text"
      placeholder="Postal Code"
      :validate="postalCodeValidation"
    />

    <countrySelect
      v-model:modelValue="formData.country"
      :error="formErrors.country"
      :validate="countryValidation"
    />
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
  gap: 8px;
  width: 100%;
}
.first-name-wrapper,
.last-name-wrapper {
  width: 100%;
}
.firstName,
.lastName {
  width: 50%;
}
.input {
  width: 100%;
}
</style>
