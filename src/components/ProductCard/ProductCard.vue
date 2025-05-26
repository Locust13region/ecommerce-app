<script setup lang="ts">
import Card from 'primevue/card'
import Button from 'primevue/button'
import type { ProductCardItem } from '@/interfaces/catalogInterfaces.ts'
//import { useRoute } from 'vue-router';

const props = defineProps<ProductCardItem>()

//const route = useRoute()

// const productSlug = route.params.slug
</script>

<template>
  <RouterLink :to="`/catalog/${props.slug}`" class="product-card-link">
    <Card style="overflow: hidden">
      <template #header>
        <img :alt="props.title" :src="props.imageURL" />
      </template>
      <template #title> {{ props.title }}</template>
      <template #subtitle>{{ props.price }}</template>
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

<style scoped>
.p-card.p-component {
  width: 20rem;
}
.p-card-header img {
  width: 100%;
  height: 500px;
  object-fit: cover;
}
.product-card-link {
  z-index: 1;
}
.product-card-button {
  z-index: 6;
}
</style>
