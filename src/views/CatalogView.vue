<script setup lang="ts">
import { Button } from 'primevue'
import { useUserStateStore } from '@/stores/userState'

import type { MegaMenuItem, ProductCardItem } from '@/interfaces/catalogInterfaces'
import MegaMenu from '@/components/MegaMenu/MegaMenu.vue'
import BreadCrumbs from '@/components/BreadCrumbs/BreadCrumbs.vue'
import { onMounted, ref, watch } from 'vue'
import { transformCategoriesToMegaMenu } from '@/services/Catalog/ParseCategoriesToMegaMenu/parseCategoriesToMegaMenu'
import ProductCard from '@/components/ProductCard/ProductCard.vue'
import { parseProductsForCards } from '@/services/Catalog/parseProductsForCard/parseProductsForCard.ts'
import { useRoute } from 'vue-router'
import { useCategoriesStore } from '@/composables/useCategoryStore'
import Paginator from 'primevue/paginator'
import type { PageState } from 'primevue/paginator'
import router from '@/router'
import { useProductList } from '@/composables/useProductsList.ts'

// import { useAuth } from '@/composables/useAuth'
// import { useApiState } from '@/stores/apiState'
// const { getApiRoot } = useAuth();
const route = useRoute()
const currentSlug = ref(route.params.slug as string)

const user = useUserStateStore()

const pageMenu = ref<MegaMenuItem[]>([])

const pageProducts = ref<ProductCardItem[]>([])

const categoriesStore = useCategoriesStore()

const {
  products,
  totalProducts,
  limit,
  offset,
  // loading,
  loadProducts,
} = useProductList(currentSlug)

const onPageChange = async (event: PageState) => {
  offset.value = event.first
  currentSlug.value = route.params.slug as string

  const query = { offset: `${offset.value}` }
  await router.push({ query: query })
  await loadProducts(currentSlug.value)

  pageProducts.value = await parseProductsForCards(products.value)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(
  () => route.params.slug,
  async (newId) => {
    offset.value = 0
    currentSlug.value = newId as string
    await loadProducts(newId as string)

    pageProducts.value = await parseProductsForCards(products.value)
  },
)

watch(
  () => route.path,
  async (newPath) => {
    if (newPath === '/catalog') {
      offset.value = 0
      await loadProducts(newPath as string)

      pageProducts.value = await parseProductsForCards(products.value)
    }
  },
)

onMounted(async () => {
  await categoriesStore.loadCategories()
  pageMenu.value = transformCategoriesToMegaMenu(categoriesStore.categories, 'en-US', true)

  const isCategoryExists = categoriesStore.categoryMapBySlug.has(route.params.slug as string)

  if (route.query.offset) {
    offset.value = parseInt(route.query.offset as string, 10)
  } else {
    offset.value = 0
  }

  if (route.params.slug && isCategoryExists) {
    await loadProducts(currentSlug.value)
    pageProducts.value = await parseProductsForCards(products.value)
  } else if (route.path === '/catalog') {
    await loadProducts(route.path)

    pageProducts.value = await parseProductsForCards(products.value)
  }
})
</script>

<template>
  <div class="catalog">
    <div class="catalog-menu">
      <MegaMenu :model="pageMenu" />
    </div>
    <div class="catalog-main">
      <div class="catalog-main-header">
        <h1>Catalog</h1>
        <p>Welcome to the catalog page!</p>
      </div>
      <div class="catalog-main-breadcrumbs">
        <BreadCrumbs />
      </div>
      <div class="catalog-main-product-list">
        <ProductCard v-for="(product, index) in pageProducts" :key="index" v-bind="product" />
      </div>
      <div class="catalog-main-paginator">
        <Paginator
          v-if="totalProducts > 0"
          :rows="limit"
          :totalRecords="totalProducts"
          :pageLinkSize="5"
          v-model:first="offset"
          class="paginator"
          @page="onPageChange"
        />
      </div>
      <Button
        severity="secondary"
        label="Get products"
        @click="console.log(products)"
        v-if="user.isLoggedIn"
      />
      <Button
        severity="secondary"
        label="Get current category products"
        @click="console.log()"
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
  justify-content: flex-start;
}
.catalog-main,
.catalog-main-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.catalog-menu {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.catalog-main-product-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}
.catalog-main-breadcrumbs {
  text-align: left;
  width: 100%;
}
</style>
