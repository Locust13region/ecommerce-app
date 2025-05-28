<script setup lang="ts">
import { useProduct } from '@/composables/useProduct'
import type { ProductProjection } from '@commercetools/platform-sdk'
import Button from 'primevue/button'
import Carousel from 'primevue/carousel'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()
const { fetchProduct } = useProduct()

const product = ref<ProductProjection | null>(null)
const showModal = ref(false)

const images = computed(() => {
  return product.value?.masterVariant.images?.map((img) => img.url) ?? []
})

const priceInfo = computed(() => {
  const price = product.value?.masterVariant.prices?.[0]
  if (!price) return null

  const original = price.value
  const discounted = price.discounted?.value

  return {
    original: original.centAmount / 100,
    discounted: discounted ? discounted.centAmount / 100 : null,
    currency: discounted?.currencyCode ?? original.currencyCode,
  }
})

onMounted(async () => {
  const result = await fetchProduct('lewis-carroll-alices-adventures-in-wonderland')
  if (!result) {
    toast.add({
      severity: 'error',
      summary: 'Product request failed',
      life: 5000,
    })
    goBack()
  } else {
    product.value = result
    console.log(result)
  }
})

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const goBack = () => {
  router.back()
}

const addToCart = () => {
  if (!product.value) return
  console.log('Add to cart')
}
</script>

<template>
  <div class="product-page">
    <header class="product-header">
      <Button icon="pi pi-arrow-left" @click="goBack" />
    </header>

    <main v-if="product" class="product-main">
      <div class="product-carousel">
        <Carousel
          :value="product.masterVariant.images?.map((img) => img.url) || []"
          :numVisible="1"
          :numScroll="1"
          :showNavigators="images.length > 1"
          :showIndicators="images.length > 1"
        >
          <template #item="{ data }">
            <img :src="data" class="carousel-image" alt="product image" @click="openModal" />
          </template>
        </Carousel>
      </div>

      <Dialog
        v-model:visible="showModal"
        modal
        dismissableMask
        :closable="false"
        :closeOnEscape="true"
        class="image-dialog"
      >
        <template #header>
          <div class="custom-dialog-header">
            <Button icon="pi pi-times" @click="closeModal" />
          </div>
        </template>

        <Carousel
          :value="product.masterVariant.images?.map((img) => img.url) || []"
          :numVisible="1"
          :numScroll="1"
          :showNavigators="images.length > 1"
          :showIndicators="images.length > 1"
        >
          <template #item="{ data }">
            <img :src="data" class="carousel-image-large" alt="product image enlarged" />
          </template>
        </Carousel>
      </Dialog>

      <div class="product-info">
        <h2 class="product-title">
          {{ product.name['en-US'] || 'Name' }}
        </h2>
        <h3 class="product-subtitle">
          {{
            product.masterVariant.attributes?.[1]?.value['en-US'] ||
            'Author - information is missing.'
          }}
        </h3>
        <p>
          {{ product.masterVariant.attributes?.[2]?.value || 'Genre - information is missing.' }}
        </p>
        <p class="product-description">
          {{ product.description?.['en-US'] || 'Description - information is missing.' }}
        </p>
        <p>
          Published in
          {{ product.masterVariant.attributes?.[0]?.value || ' - information is missing.' }}
        </p>
        <div class="product-price-block" v-if="priceInfo">
          <p v-if="priceInfo.discounted" class="original-price">
            {{ priceInfo.original.toFixed(2) }} {{ priceInfo.currency }}
          </p>
          <p class="product-price">
            {{ (priceInfo.discounted ?? priceInfo.original).toFixed(2) }} {{ priceInfo.currency }}
          </p>
        </div>

        <Button label="Add to cart" icon="pi pi-shopping-cart" @click="addToCart" />
      </div>
    </main>

    <div v-else class="loading">Loading...</div>
  </div>
</template>

<style scoped>
.product-page {
  padding: 1rem;
}

.product-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
}

.product-main {
  display: flex;
  flex-direction: row;
  gap: 2rem;
}

.product-carousel {
  flex: 1;
}

.carousel-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 0.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: zoom-in;
}

.carousel-image-large {
  width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

.image-dialog :deep(.p-dialog-header) {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
}

.custom-dialog-header {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-title {
  font-size: 2rem;
  font-weight: bold;
}

.product-subtitle {
  font-size: 1.5rem;
  font-weight: bold;
}

.product-description {
  font-size: 1.2rem;
}

.product-price-block {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.original-price {
  text-decoration: line-through;
  font-size: 1.2rem;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2e7d32;
}

.loading {
  text-align: center;
  font-size: 1.5rem;
  margin-top: 2rem;
}

@media (max-width: 64rem) {
  .product-main {
    flex-direction: column;
  }
}
</style>
