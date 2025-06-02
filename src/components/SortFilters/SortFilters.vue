<script setup lang="ts">
import { useProductListStore } from '@/stores/useProductListStore'

const productListStore = useProductListStore()
</script>

<template>
  <div class="sort-select">
    <label for="sort">Sort:</label>
    <select id="sort" v-model="productListStore.sortOption">
      <option
        v-for="option in productListStore.sortOptions"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.sort-select {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin: 1rem 0px;
}
</style>
