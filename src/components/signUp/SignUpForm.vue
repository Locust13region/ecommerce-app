<script setup lang="ts">
import Button from 'primevue/button'
import { Message } from 'primevue'
import { Form } from '@primevue/forms'
import FormInputField from '../FormInputField/FormInputField.vue'
import {
  validateEmailField,
  firstNameValidation,
  lastNameValidation,
  passwordValidation,
  validateStreet,
  validateForm,
  validateCity,
  validateCountry,
  validatePostalCode,
} from '@/services/signUp-validation/signUp-validation'
import { formData, formErrors } from '@/consts/signUpFormConsts'
import countrySelect from '@/components/signUp/SignUpFormCountry.vue'
import SignUpPassword from '@/components/signUp/SignUpPassword.vue'

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
          class="firstName"
          :error="formErrors.firstName"
          v-model:modelValue="formData.firstName"
          type="text"
          placeholder="First Name"
          :validate="firstNameValidation"
        />
      </div>
      <div class="last-name-wrapper">
        <FormInputField
          class="lastName"
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

    <FormInputField
      name="steet"
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
      :validate="validatePostalCode"
    />

    <countrySelect @change="validateCountry" v-model="formData.country" />
    <Message v-if="formErrors.country" severity="error" size="small" variant="simple">{{
      formErrors.country
    }}</Message>
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
