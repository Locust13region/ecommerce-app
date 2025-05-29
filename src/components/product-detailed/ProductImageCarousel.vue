<script setup lang="ts">
import Carousel from 'primevue/carousel'

defineProps<{
  images: string[]
}>()

const emit = defineEmits<{
  (e: 'imageClick'): void
}>()

const onImageClick = () => emit('imageClick')
</script>

<template>
  <Carousel
    :value="images"
    :numVisible="1"
    :numScroll="1"
    :showNavigators="images.length > 1"
    :showIndicators="images.length > 1"
  >
    <template #item="{ data }">
      <img :src="data" class="carousel-image" alt="product image" @click="onImageClick" />
    </template>
  </Carousel>
</template>

<style scoped>
.carousel-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 0.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: zoom-in;
}
</style>
