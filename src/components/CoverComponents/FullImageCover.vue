<script setup lang="ts">
import { Button } from 'primevue'
import router from '@/router'

const routeToCatalog = () => {
  router.push('/catalog')
}
</script>

<template>
  <div class="cover-container">
    <span class="cover-text" @click="console.log('pizda')">The Undefined team book store.</span>
    <Button
      label="Shop Now"
      raised
      severity="secondary"
      class="w-full product-card-button"
      @click="routeToCatalog"
    />
  </div>
</template>

<style scoped>
.cover-container {
  width: 100%;
  height: 100%;
  background-image: url(@/assets/cover-book-store.jpg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
}
.cover-text,
.cover-container .p-button-label {
  color: #fff;
  font-size: 3rem;
  text-shadow: 3px 1px 5px black;
}
</style>
