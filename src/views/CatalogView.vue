<script setup lang="ts">
import { Button } from 'primevue'
import { useUserStateStore } from '@/stores/userState'
import {} from //fetchCategories,
// getUserInfo,
// createCategoryTree,
'@/services/Catalog/FetchCategories/fetchCategories'
//import { fetchProducts } from '@/services/Catalog/FetchProducts/fetchProducts.ts'
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
const route = useRoute()
const currentSlug = ref(route.params.slug as string)

const user = useUserStateStore()

const pageMenu = ref<MegaMenuItem[]>([])

const pageProducts = ref<ProductCardItem[]>([])

const categoriesStore = useCategoriesStore()
const useProductsList = useProductList(currentSlug)

// const {
//   products,
//   totalProducts,
//   offset,
//   loadProducts,
// } = useProductList(currentSlug)

const onPageChange = async (event: PageState) => {
  useProductsList.offset.value = event.first

  const query = { offset: `${useProductsList.offset.value}` }
  await router.push({ query: query })
  await useProductsList.loadProducts(currentSlug.value)

  pageProducts.value = await parseProductsForCards(useProductsList.products.value)
  window.scrollTo({ top: 0, behavior: 'smooth' })

  console.log(event, 'event on page change')
  console.log(useProductsList.offset.value, 'offset value')
}

watch(
  () => route.params.slug,
  async (newId) => {
    useProductsList.offset.value = 0
    await useProductsList.loadProducts(newId as string)

    pageProducts.value = await parseProductsForCards(useProductsList.products.value)
    useProductsList.totalProducts.value = useProductsList.totalProducts.value || 0
  },
)

onMounted(async () => {
  await categoriesStore.loadCategories()
  pageMenu.value = transformCategoriesToMegaMenu(categoriesStore.categories, 'en-US', true)

  const isCategoryExists = categoriesStore.categoryMapBySlug.has(route.params.slug as string)

  if (route.query.offset) {
    useProductsList.offset.value = parseInt(route.query.offset as string, 10)
  } else {
    useProductsList.offset.value = 0
  }

  if (route.params.slug && isCategoryExists) {
    await useProductsList.loadProducts(currentSlug.value)
    pageProducts.value = await parseProductsForCards(useProductsList.products.value)
  } else if (route.path === '/catalog') {
    await useProductsList.loadProducts('')

    pageProducts.value = await parseProductsForCards(useProductsList.products.value)
  }
})

// const { getApiRoot } = useAuth();
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
        <p>Params: {{ $route.params.slug }}</p>
      </div>
      <div class="catalog-main-breadcrumbs">
        <BreadCrumbs />
      </div>
      <div class="catalog-main-product-list">
        <ProductCard v-for="(product, index) in pageProducts" :key="index" v-bind="product" />
      </div>
      <div class="catalog-main-paginator">
        <Paginator
          v-if="useProductsList.totalProducts.value > 0"
          :rows="useProductsList.limit.value"
          :totalRecords="useProductsList.totalProducts.value"
          :pageLinkSize="5"
          v-model:first="useProductsList.offset.value"
          class="paginator"
          @page="onPageChange"
        />
      </div>
      <Button
        severity="secondary"
        label="Get products"
        @click="console.log()"
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
.catalog-main {
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
