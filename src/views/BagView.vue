<script setup lang="ts">
import CustomerBagComponent from '@/components/CustomerBag/CustomerBagComponent.vue'
</script>

<template>
  <div class="bag">
    <h1>My shopping bag</h1>
    <CustomerBagComponent></CustomerBagComponent>
  </div>
</template>

<style lang="css" scoped>
.bag {
  display: flex;
  flex-direction: column;
  gap: 10px 0;
}
</style>
