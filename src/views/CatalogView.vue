<script setup lang="ts">
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
import { useProductListStore } from '@/stores/useProductListStore'

const route = useRoute()
const currentSlug = ref(route.params.slug as string)

const pageMenu = ref<MegaMenuItem[]>([])

const pageProducts = ref<ProductCardItem[]>([])

const categoriesStore = useCategoriesStore()

const productListStore = useProductListStore()

const { loadProducts } = useProductList(currentSlug)

const onPageChange = async (event: PageState) => {
  productListStore.offset = event.first
  currentSlug.value = route.params.slug as string

  const query = { offset: `${productListStore.offset}` }
  await router.push({ query: query })
  await loadProducts(currentSlug.value)

  pageProducts.value = await parseProductsForCards(productListStore.products)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(
  () => route.params.slug,
  async (newId) => {
    productListStore.offset = 0
    currentSlug.value = newId as string
    await loadProducts(newId as string)

    pageProducts.value = await parseProductsForCards(productListStore.products)
  },
)

watch(
  () => route.path,
  async (newPath) => {
    if (newPath === '/catalog') {
      productListStore.offset = 0
      await loadProducts(newPath as string)

      pageProducts.value = await parseProductsForCards(productListStore.products)
    }
  },
)

onMounted(async () => {
  await categoriesStore.loadCategories()
  pageMenu.value = transformCategoriesToMegaMenu(categoriesStore.categories, 'en-US', true)

  const isCategoryExists = categoriesStore.categoryMapBySlug.has(route.params.slug as string)

  if (route.query.offset) {
    productListStore.offset = parseInt(route.query.offset as string, 10)
  } else {
    productListStore.offset = 0
  }

  if (route.params.slug && isCategoryExists) {
    await loadProducts(currentSlug.value)
    pageProducts.value = await parseProductsForCards(productListStore.products)
  } else if (route.path === '/catalog') {
    await loadProducts(route.path)

    pageProducts.value = await parseProductsForCards(productListStore.products)
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
          v-if="productListStore.totalProducts > 0"
          :rows="productListStore.limit"
          :totalRecords="productListStore.totalProducts"
          :pageLinkSize="5"
          v-model:first="productListStore.offset"
          class="paginator"
          @page="onPageChange"
        />
      </div>
      <div class="footer"></div>
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
  align-items: stretch;
}
.catalog-main-breadcrumbs {
  text-align: left;
  width: 100%;
}
</style>
