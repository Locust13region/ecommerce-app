<script setup lang="ts">
import { Button } from 'primevue'
import { useUserStateStore } from '@/stores/userState'
import {
  fetchCategories,
  // getUserInfo,
  createCategoryTree,
} from '@/services/Catalog/FetchCategories/fetchCategories'
import { fetchProducts } from '@/services/Catalog/FetchProducts/fetchProducts.ts'
import type { MegaMenuItem, ProductCardItem } from '@/interfaces/catalogInterfaces'
import MegaMenu from '@/components/MegaMenu/MegaMenu.vue'
import BreadCrumbs from '@/components/BreadCrumbs/BreadCrumbs.vue'
import { onMounted, onUpdated, ref } from 'vue'
import { transformCategoriesToMegaMenu } from '@/services/Catalog/ParseCategoriesToMegaMenu/parseCategoriesToMegaMenu'
import ProductCard from '@/components/ProductCard/ProductCard.vue'
import { parseProductsForCards } from '@/services/Catalog/parseProductsForCard/parseProductsForCard.ts'
// import { useAuth } from '@/composables/useAuth'
// import { useApiState } from '@/stores/apiState'

const user = useUserStateStore()

const pageMenu = ref<MegaMenuItem[]>([])

const pageProducts = ref<ProductCardItem[]>([])

onMounted(async () => {
  const categories = await fetchCategories()
  pageMenu.value = transformCategoriesToMegaMenu(categories, 'en-US', true)
})

onUpdated(async () => {
  const products = await fetchProducts()
  pageProducts.value = await parseProductsForCards(products)

  console.log(pageProducts.value, 'parsedProducts')
})

// const { getApiRoot } = useAuth();
</script>

<template>
  <div class="catalog">
    <div class="catalog-menu">
      <MegaMenu :model="pageMenu" />
    </div>
    <div class="catalog-main">
      <h1>Catalog</h1>
      <p>Welcome to the catalog page!</p>
      <div class="catalog-main-breadcrumbs">
        <BreadCrumbs />
      </div>
      <div class="catalog-main-product-list">
        <ProductCard v-for="(product, index) in pageProducts" :key="index" v-bind="product" />
      </div>
      <Button
        severity="secondary"
        label="Get products"
        @click="console.log(fetchProducts())"
        v-if="user.isLoggedIn"
      />
      <Button
        severity="secondary"
        label="Get API ROOT"
        @click="console.log(createCategoryTree())"
        v-if="user.isLoggedIn"
      />
    </div>
  </div>
</template>

<style scoped>
.catalog {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.catalog-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: auto;
}
.catalog-menu {
  margin-bottom: auto;
}

.catalog-main-product-list {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}
.catalog-main-breadcrumbs {
  text-align: left;
  width: 100%;
}
</style>
