<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { ref, watch } from 'vue'

const props = defineProps<{
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
  quantity: number
  productInCart: boolean
}>()

const emit = defineEmits<{
  (e: 'addToCart'): void
  (e: 'removeFromCart'): void
  (e: 'update:quantity', value: number): void
}>()

const internalQuantity = ref(props.quantity)

watch(
  () => props.quantity,
  (newVal) => {
    internalQuantity.value = newVal
  },
)

function increase() {
  if (internalQuantity.value < 99) {
    internalQuantity.value++
    emit('update:quantity', internalQuantity.value)
  }
}

function decrease() {
  if (internalQuantity.value > 1) {
    internalQuantity.value--
    emit('update:quantity', internalQuantity.value)
  }
}
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
    <div class="quantity-counter">
      <Button icon="pi pi-plus" @click="increase" :disabled="quantity >= 99 || productInCart" />
      <InputText :value="quantity" readonly class="product-quantity" />
      <Button icon="pi pi-minus" @click="decrease" :disabled="quantity <= 1 || productInCart" />
    </div>
    <Button
      label="Add to Bag"
      icon="pi pi-shopping-bag"
      :disabled="productInCart"
      @click="$emit('addToCart')"
    />
    <Button
      label="Take out of the Bag"
      icon="pi pi-trash"
      :disabled="!productInCart"
      @click="$emit('removeFromCart')"
    />
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

.quantity-counter {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
}

.product-quantity {
  width: 3rem;
  text-align: center;
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
