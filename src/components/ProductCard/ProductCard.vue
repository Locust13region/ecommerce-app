<script setup lang="ts">
import Card from 'primevue/card'
import Button from 'primevue/button'
import type { ProductCardItem } from '@/interfaces/catalogInterfaces.ts'

const props = defineProps<ProductCardItem>()
</script>

<template>
  <RouterLink :to="`/product/${props.slug}`" class="product-card-link">
    <Card style="overflow: hidden">
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
          <Button label="Add to Bag" outlined class="w-full product-card-button" />
        </div>
      </template>
    </Card>
  </RouterLink>
</template>

<style>
.p-card.p-component {
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
  color: green; /* Example color for highlighted price */
  font-weight: bold;
  margin-right: 0.3rem;
}
.grey {
  color: grey; /* Example color for greyed out price */
}
.p-card-ribbon {
  position: absolute;
  right: 0px;
  background-color: var(--p-primary-700);
  padding: 5px 10px;
  top: 1rem;
}
.product-card-link {
  border-radius: 5px;
}
a.product-card-link:hover .p-card-title {
  color: var(--marked-text);
}
</style>
