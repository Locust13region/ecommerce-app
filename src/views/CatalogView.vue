<script setup lang="ts">
import { Button } from 'primevue'
import { useUserStateStore } from '@/stores/userState'
import {
  fetchCategories,
  // getUserInfo,
  createCategoryTree,
} from '@/services/Catalog/GetCategories/fetchCategories'
import type { MegaMenuItem } from '@/interfaces/catalogInterfaces'
import MegaMenu from '@/components/MegaMenu/MegaMenu.vue'
import { onMounted, ref } from 'vue'
import { transformCategoriesToMegaMenu } from '@/services/Catalog/ParseCategoriesToMegaMenu/parseCategoriesToMegaMenu'
// import { useAuth } from '@/composables/useAuth'
// import { useApiState } from '@/stores/apiState'

const user = useUserStateStore()

const pageMenu = ref<MegaMenuItem[]>([])

onMounted(async () => {
  const categories = await fetchCategories()
  pageMenu.value = transformCategoriesToMegaMenu(categories, 'en-US', true)
})

// const { getApiRoot } = useAuth();
</script>

<template>
  <div class="catalog">
    <h1>Catalog</h1>
    <p>Welcome to the catalog page!</p>
    <MegaMenu :model="pageMenu" />
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
