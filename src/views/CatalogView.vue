<script setup lang="ts">
import type {
  MegaMenuItem,
  // ProductCardItem
} from '@/interfaces/catalogInterfaces'
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
import ProgressSpinner from 'primevue/progressspinner'
import SearchBar from '@/components/SearchBar/SearchBar.vue'
import SelectFilters from '@/components/SelectFilters/SelectFilters.vue'

const route = useRoute()
// const currentSlug = ref(route.params.categorySlug as string)

const pageMenu = ref<MegaMenuItem[]>([])

// const pageProducts = ref<ProductCardItem[]>([])

const categoriesStore = useCategoriesStore()

const productListStore = useProductListStore()

const { loadProducts, loading } = useProductList(productListStore.currentSlug)

const onPageChange = async (event: PageState) => {
  productListStore.offset = event.first
  productListStore.currentSlug = route.params.categorySlug as string

  console.log('current slug', productListStore.currentSlug)

  const query = { offset: `${productListStore.offset}` }
  await router.push({ query: query })
  await loadProducts(productListStore.currentSlug, null, productListStore.sortOption)

  productListStore.pageProducts = await parseProductsForCards(productListStore.products)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(
  () => route.params.categorySlug,
  async (newId) => {
    productListStore.offset = 0
    productListStore.currentSlug = newId as string
    await loadProducts(newId as string, null, productListStore.sortOption)

    productListStore.pageProducts = await parseProductsForCards(productListStore.products)
  },
)

watch(
  () => route.path,
  async (newPath) => {
    if (newPath === '/catalog') {
      productListStore.offset = 0
      await loadProducts(newPath as string, null, productListStore.sortOption)

      productListStore.pageProducts = await parseProductsForCards(productListStore.products)
    }
  },
)

onMounted(async () => {
  productListStore.currentSlug = route.params.categorySlug as string
  await categoriesStore.loadCategories()
  pageMenu.value = transformCategoriesToMegaMenu(categoriesStore.categories, 'en-US', true)

  const isCategoryExists = categoriesStore.categoryMapBySlug.has(
    route.params.categorySlug as string,
  )

  if (route.query.offset) {
    productListStore.offset = parseInt(route.query.offset as string, 10)
  } else {
    productListStore.offset = 0
  }

  if (route.params.categorySlug && isCategoryExists) {
    await loadProducts(productListStore.currentSlug, null, productListStore.sortOption)
    productListStore.pageProducts = await parseProductsForCards(productListStore.products)
    console.log(productListStore.pageProducts, 'page products11111')
  } else if (route.path === '/catalog') {
    await loadProducts(route.path, null, productListStore.sortOption)

    productListStore.pageProducts = await parseProductsForCards(productListStore.products)
  } else {
    router.push('/not-found')
  }
})
</script>

<template>
  <div class="card flex justify-center" v-if="loading">
    <ProgressSpinner class="spinner" />
  </div>
  <div class="catalog">
    <div class="catalog-menu">
      <MegaMenu :model="pageMenu" />
    </div>
    <div class="catalog-main">
      <div class="catalog-main-header">
        <h1>Catalog</h1>
        <p>Welcome to the "Undefined Team" catalog page!</p>
      </div>
      <div class="catalog-main-breadcrumbs">
        <BreadCrumbs />
        <SearchBar />
      </div>
      <div class="filters-container">
        <SelectFilters />
      </div>
      <div class="catalog-main-product-list">
        <p v-if="productListStore.productsNotFound">No products by this search parameter</p>
        <ProductCard
          v-for="(product, index) in productListStore.pageProducts"
          :key="index"
          v-bind="product"
        />
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
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
}
.filters-container {
  width: 100%;
}
</style>
