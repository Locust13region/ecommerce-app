<script setup lang="ts">
import { setBillingAddressIfSameAsShipping } from '@/services/SetBillingAddress/setBillingAddressIfSameAsShipping'
import { Checkbox } from 'primevue'
import { ref, watch } from 'vue'

const props = defineProps<{
  name: string
  modelValue: boolean
  value: string
  label: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const modelValue = ref<boolean>(props.modelValue)

watch(modelValue, (val) => {
  emit('update:modelValue', val)
  setBillingAddressIfSameAsShipping()
})

watch(
  () => props.modelValue,
  (val) => {
    modelValue.value = val
  },
)
</script>

<template>
  <div class="flex items-center gap-2 checkbox-wrapper">
    <Checkbox
      v-model="modelValue"
      :inputId="props.name"
      :name="props.name"
      :value="props.value"
      :binary="true"
    />
    <label :for="props.name"> {{ props.label }} </label>
  </div>
</template>

<style>
.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
