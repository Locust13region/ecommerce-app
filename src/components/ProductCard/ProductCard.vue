<script setup lang="ts">
import Card from 'primevue/card'
import Button from 'primevue/button'
import type { ProductCardItem } from '@/interfaces/catalogInterfaces.ts'
import router from '@/router'
import { addToCart } from '@/services/Cart/add-to-cart'
import { useToast } from 'primevue'

const props = defineProps<ProductCardItem>()

const toast = useToast()

const addToBagOnClick = async (event: Event) => {
  event.stopPropagation()
  // add AddToBag method to add this product to bag
  await addToCart(props.currentProduct, 1, toast)
}

const onCardClick = (slug: string) => {
  router.push(`/product/${slug}`)
}
</script>

<template>
  <div class="product-card-link">
    <Card style="overflow: hidden" @click="onCardClick(props.slug)">
      <template #header>
        <img :alt="props.title" :src="props.imageURL" />
        <span v-if="props.discountedPrice" class="p-card-ribbon">ON SALE</span>
      </template>
      <template #title> {{ props.title }}</template>
      <template #subtitle>
        <span v-if="props.discountedPrice" :class="{ highlighted: props.discountedPrice }">{{
          props.discountedPrice
        }}</span>
        <span> </span>
        <span class="price" :class="{ 'line-through grey': props.discountedPrice }">{{
          props.price
        }}</span>
      </template>
      <template #content>
        <p class="m-0">
          {{ props.shortDescription }}
        </p>
      </template>
      <template #footer>
        <div class="flex gap-4 mt-1 justify-center align-center">
          <Button
            label="Add to Bag"
            outlined
            class="w-full product-card-button"
            @click="addToBagOnClick"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<style>
.product-card-link {
  border-radius: 5px;
  border: 1px solid transparent;
  cursor: pointer;
}
.product-card-link:hover .p-card-title {
  color: var(--marked-text);
}
.product-card-link:hover {
  border-color: var(--marked-text);
  transition: all 0.3s ease-in-out;
}

.product-card-link .p-card.p-component {
  width: 20rem;
  height: 100%;
}
.product-card-link .p-card .p-card-header {
  position: relative !important;
}
.p-card-header img {
  width: 100%;
  height: 500px;
  object-fit: cover;
}
.p-card-body {
  height: 100%;
}
.p-card-footer {
  margin-top: auto;
}
.highlighted {
  color: green;
  font-weight: bold;
  margin-right: 0.3rem;
}
.grey {
  color: grey;
}
.p-card-ribbon {
  position: absolute;
  right: 0px;
  background-color: var(--p-primary-700);
  padding: 5px 10px;
  top: 1rem;
}
.p-card-footer .product-card-button:active {
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  transform: translate3d(0, 1px, 0);
}
</style>
