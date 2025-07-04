<script setup lang="ts">
import { ref } from 'vue'
import { Select } from 'primevue'
import { countriesSelect, formData } from '@/consts/signUpFormConsts'
import Message from 'primevue/message'
import { useSignUpForm } from '@/composables/signUpValidation/SignUpValidation'

const props = defineProps<{
  id: string
  error?: string
  modelValue: string
  validate?: () => boolean
}>()

const selectedCountry = ref(props.modelValue)

const emit = defineEmits(['update:modelValue'])

const { validatePostalCodeField, validateBillingPostalCodeField } = useSignUpForm()

function handleCountryChange(value: string) {
  emit('update:modelValue', value)
  selectedCountry.value = value
  formData.value.country = value

  if (props.validate) {
    props.validate()
    if (props.id === 'billingCountry') {
      validateBillingPostalCodeField()
    } else if (props.id === 'country') {
      validatePostalCodeField()
    }
  }
}
</script>

<template>
  <Select
    :id="id"
    v-model="selectedCountry"
    editable
    :options="countriesSelect"
    optionLabel="name"
    placeholder="Select a Country"
    class="w-full md:w-56"
    :class="{ 'p-invalid': props.error }"
    @change="handleCountryChange(selectedCountry)"
  />
  <Message v-if="props.error" severity="error" size="small" variant="simple">{{
    props.error
  }}</Message>
</template>

<style>
.select div:first-child {
  width: 100%;
}
.p-select-label,
.p-select-label::placeholder {
  font-size: 1rem;
  color: var(--p-select-placeholder-color);
}
.p-select input {
  border-color: var(--p-inputtext-invalid-border-color);
}
</style>
