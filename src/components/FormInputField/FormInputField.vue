<script setup lang="ts">
import { Message } from 'primevue'
import { FormField } from '@primevue/forms'
import { InputText } from 'primevue'
import { defineModel } from 'vue'

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
  <label :for="name" v-if="label">{{ label }}</label>
  <FormField :name="name" class="flex flex-col gap-1">
    <InputText
      :id="name"
      class="input"
      :type="type"
      :placeholder="placeholder"
      v-model="model"
      :class="{ 'p-invalid': error, inputClass }"
      @change="validate"
    />
    <Message v-if="error" severity="error" size="small" variant="simple">{{ error }}</Message>
  </FormField>
</template>
<style scoped>
.registration-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 80%;
}

.input {
  width: 100%;
}
</style>
