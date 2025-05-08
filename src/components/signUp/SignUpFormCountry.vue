<script setup lang="ts">
import { ref } from 'vue'
import { Select } from 'primevue'
import { countriesSelect } from '@/consts/signUpFormConsts'

const selectedCountry = ref('')
</script>

<template>
  <Select
    id="country"
    v-model="selectedCountry"
    editable
    :options="countriesSelect"
    optionLabel="name"
    placeholder="Select a Country"
    class="w-full md:w-56"
  />
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
</style>
