<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Carousel from 'primevue/carousel'

import { computed } from 'vue'

const { visible, images, showNav } = defineProps<{
  visible: boolean
  images: string[]
  showNav: boolean
}>()

const visibleSubstitute = computed({
  get: () => visible,
  set: (value: boolean) => emit('update:visible', value),
})

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const close = () => emit('update:visible', false)
</script>

<template>
  <Dialog
    v-model:visible="visibleSubstitute"
    modal
    dismissableMask
    :closable="false"
    :closeOnEscape="true"
    class="image-dialog"
  >
    <template #header>
      <div class="custom-dialog-header">
        <Button icon="pi pi-times" @click="close" />
      </div>
    </template>

    <Carousel
      :value="images"
      :numVisible="1"
      :numScroll="1"
      :showNavigators="showNav"
      :showIndicators="showNav"
    >
      <template #item="{ data }">
        <img :src="data" class="carousel-image-large" alt="product image enlarged" />
      </template>
    </Carousel>
  </Dialog>
</template>

<style scoped>
.carousel-image-large {
  width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

.image-dialog :deep(.p-dialog-header) {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
}

.custom-dialog-header {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
