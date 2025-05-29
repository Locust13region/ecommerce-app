<script setup lang="ts">
import { useProductListStore } from '@/stores/useProductListStore'

const productListStore = useProductListStore()

// const sortOption = ref('name.en-US asc')

// const sortOptions = [
//   { label: 'Alphabet (A-Z)', value: 'name.en-US asc' },
//   { label: 'Alphabet (Z-A)', value: 'name.en-US desc' },
//   { label: 'Price ascending', value: 'price asc' },
//   { label: 'Price descending', value: 'price desc' },
// ]

// watch(sortOption, async (newSort) => {
//   await loadProducts(productListStore.currentSlug, null, newSort)
//   productListStore.pageProducts = await parseProductsForCards(productListStore.products)
// })
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
