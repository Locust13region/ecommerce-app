<script setup lang="ts">
import { Button } from 'primevue'
import { useUserStateStore } from '@/stores/userState'
import {
  fetchCategories,
  // getUserInfo,
  createCategoryTree,
} from '@/services/Catalog/GetCategories/fetchCategories'
// import { useAuth } from '@/composables/useAuth'
// import { useApiState } from '@/stores/apiState'

const user = useUserStateStore()

// const { getApiRoot } = useAuth();
</script>

<template>
  <div class="catalog">
    <h1>Catalog</h1>
    <p>Welcome to the catalog page!</p>

    <Button
      severity="secondary"
      label="Get categories"
      @click="console.log(fetchCategories())"
      v-if="user.isLoggedIn"
    />
    <Button
      severity="secondary"
      label="Get API ROOT"
      @click="console.log(createCategoryTree())"
      v-if="user.isLoggedIn"
    />
  </div>
</template>

<style scoped>
.catalog {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
