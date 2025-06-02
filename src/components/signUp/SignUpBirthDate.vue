<script setup lang="ts">
import DatePicker from 'primevue/datepicker'
import { Message } from 'primevue'
import { watch, ref } from 'vue'
const props = defineProps<{
  name: string
  modelValue: string | Date
  label?: string
  error?: string
  placeholder?: string
  validate?: () => boolean
}>()
const emit = defineEmits(['update:modelValue'])
const model = ref<Date | null>(null)
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      model.value = typeof newVal === 'string' ? parseDate(newVal) : newVal
    }
    // else {
    //   model.value = null;
    // }
  },
  { immediate: true },
)
function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null
  const parts = dateStr.split('/')
  if (parts.length !== 3) return null
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1
  const year = parseInt(parts[2], 10)
  return new Date(year, month, day)
}
function handleDateChange() {
  const selectedDate = model.value
  if (selectedDate) {
    const day = String(selectedDate.getDate()).padStart(2, '0')
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
    const year = selectedDate.getFullYear()
    const formattedDate = `${day}/${month}/${year}`
    emit('update:modelValue', formattedDate)
  } else {
    emit('update:modelValue', '')
  }
  if (props.validate) {
    props.validate()
  }
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <label :for="name" v-if="label">{{ label }}</label>
    <DatePicker
      :inputId="name"
      dateFormat="dd/mm/yy"
      fluid
      :manualInput="false"
      :placeholder="placeholder || 'DD/MM/YYYY'"
      v-model="model"
      @date-select="handleDateChange"
      @input="handleDateChange"
      @blur="validate && validate()"
    />
    <Message v-if="error" severity="error" size="small" variant="simple">{{ error }}</Message>
  </div>
</template>

<style>
/* #name {
  background-color: black;
} */
</style>
