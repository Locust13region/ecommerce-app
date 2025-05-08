<script setup lang="ts">
import { FormField } from '@primevue/forms'
import { Message } from 'primevue'
import Password from 'primevue/password'

defineProps<{
  name: string
  label?: string
  modelValue: string
  inputClass?: string
  error?: string
  type?: string
  placeholder?: string
  validate?: () => boolean
}>()

const model = defineModel('modelValue', {
  type: String,
  required: true,
})
</script>

<template>
  <FormField :name="name" class="flex flex-col gap-1">
    <label :for="name">{{ label }}</label>
    <Password
      :id="name"
      :type="type"
      :placeholder="placeholder"
      :feedback="false"
      toggleMask
      fluid
      v-model="model"
      :class="{ 'p-invalid': error, inputClass }"
      @change="validate"
    />
    <Message v-if="error" severity="error" size="small" variant="simple">{{ error }}</Message>
  </FormField>
</template>

<style>
.p-invalid input {
  border-color: var(--p-inputtext-invalid-border-color);
}
</style>
