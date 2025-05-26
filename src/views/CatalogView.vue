<script setup lang="ts">
import { Button } from 'primevue'
import { useUserStateStore } from '@/stores/userState'
import {} from //fetchCategories,
// getUserInfo,
// createCategoryTree,
'@/services/Catalog/FetchCategories/fetchCategories'
import { fetchProducts } from '@/services/Catalog/FetchProducts/fetchProducts.ts'
import type { MegaMenuItem, ProductCardItem } from '@/interfaces/catalogInterfaces'
import MegaMenu from '@/components/MegaMenu/MegaMenu.vue'
import BreadCrumbs from '@/components/BreadCrumbs/BreadCrumbs.vue'
import { onMounted, onUpdated, ref, watch } from 'vue'
import { transformCategoriesToMegaMenu } from '@/services/Catalog/ParseCategoriesToMegaMenu/parseCategoriesToMegaMenu'
import ProductCard from '@/components/ProductCard/ProductCard.vue'
import { parseProductsForCards } from '@/services/Catalog/parseProductsForCard/parseProductsForCard.ts'
import { useRoute } from 'vue-router'
import { useCategoriesStore } from '@/stores/categoryStore.ts'
// import { useAuth } from '@/composables/useAuth'
// import { useApiState } from '@/stores/apiState'

const user = useUserStateStore()

const pageMenu = ref<MegaMenuItem[]>([])

const pageProducts = ref<ProductCardItem[]>([])

const categoriesStore = useCategoriesStore()

const route = useRoute()

watch(
  () => route.params.slug,
  async (newId) => {
    const currentCategoryProducts = await fetchProducts(0, newId as string)
    pageProducts.value = await parseProductsForCards(currentCategoryProducts)
  },
)

onMounted(async () => {
  await categoriesStore.loadCategories()
  pageMenu.value = transformCategoriesToMegaMenu(categoriesStore.categories, 'en-US', true)

  const isCategoryExists = categoriesStore.categoryMapBySlug.has(route.params.slug as string)
  console.log(categoriesStore.categories, 'categories')
  console.log(route.query, 'ROUTE QUERY PARAMS')

  if (route.params.slug && isCategoryExists) {
    const currentCategoryProducts = await fetchProducts(0, route.params.slug as string)
    pageProducts.value = await parseProductsForCards(currentCategoryProducts)
  } else if (route.path === '/catalog') {
    const products = await fetchProducts()
    pageProducts.value = parseProductsForCards(products)
  }
})

onUpdated(async () => {
  // const products = await fetchProducts()
  // pageProducts.value = await parseProductsForCards(products)
  // console.log(pageProducts.value, 'parsedProducts')
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
      <p>Params: {{ $route.params.slug }}</p>
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
        label="Get current category products"
        @click="
          fetchProducts(0, route.params.slug as string).then((products) => console.log(products))
        "
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
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}
.catalog-main-breadcrumbs {
  text-align: left;
  width: 100%;
}
</style>
