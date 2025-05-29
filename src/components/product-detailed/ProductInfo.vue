<script setup lang="ts">
import Button from 'primevue/button'

defineProps<{
  name: string
  author: string
  genre: string
  description: string
  published: string
  priceInfo: {
    original: number
    discounted: number | null
    currency: string
  } | null
}>()

defineEmits<{
  (e: 'addToCart'): void
}>()
</script>

<template>
  <div class="product-info">
    <h2 class="product-title">{{ name }}</h2>
    <h3 class="product-subtitle">{{ author }}</h3>
    <p>{{ genre }}</p>
    <p class="product-description">{{ description }}</p>
    <p>Published in {{ published }}</p>

    <div class="product-price-block" v-if="priceInfo">
      <p v-if="priceInfo.discounted" class="original-price">
        {{ priceInfo.original.toFixed(2) }} {{ priceInfo.currency }}
      </p>
      <p class="product-price">
        {{ (priceInfo.discounted ?? priceInfo.original).toFixed(2) }} {{ priceInfo.currency }}
      </p>
    </div>

    <Button label="Add to cart" icon="pi pi-shopping-cart" @click="$emit('addToCart')" />
  </div>
</template>

<style scoped>
.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-title {
  font-size: 2rem;
  font-weight: bold;
}

.product-subtitle {
  font-size: 1.5rem;
  font-weight: bold;
}

.product-description {
  font-size: 1.2rem;
}

.product-price-block {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.original-price {
  text-decoration: line-through;
  font-size: 1.2rem;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2e7d32;
}
</style>
