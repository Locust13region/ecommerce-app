<script setup lang="ts">
import { useProduct } from '@/composables/useProduct'
import { useToast } from 'primevue'
import { useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import type { ProductProjection } from '@commercetools/platform-sdk'
import Button from 'primevue/button'
import ProductImageCarousel from '@/components/product-detailed/ProductImageCarousel.vue'
import ImageDialog from '@/components/product-detailed//ImageDialog.vue'
import ProductInfo from '@/components/product-detailed//ProductInfo.vue'
import { useProductListStore } from '@/stores/useProductListStore'
import { useUserStateStore } from '@/stores/userState'
import { useAuth } from '@/composables/useAuth'

const { productSlug } = defineProps<{ productSlug: string }>()

const toast = useToast()
const router = useRouter()
const { fetchProduct } = useProduct()
const { products } = useProductListStore()

const product = ref<ProductProjection | null>(null)
const showModal = ref(false)

const quantity = ref(1)

const images = computed(() => product.value?.masterVariant.images?.map((img) => img.url) ?? [])

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
  const productExist = products.find((product) => product.slug['en-US'] === productSlug)

  if (productExist) {
    product.value = productExist
  } else {
    try {
      product.value = await fetchProduct(productSlug)
    } catch (error) {
      console.log(error)
      toast.add({
        severity: 'error',
        summary: 'Product request failed',
        life: 5000,
      })
      goBack()
    }
  }
})

const goBack = () => router.back()
const openModal = () => (showModal.value = true)

const addToCart = async () => {
  if (!product.value) return
  const { getApiRoot } = useAuth()
  const user = useUserStateStore()
  if (user.isLoggedIn) {
    console.log('Add to cart')
    await getApiRoot().me().carts().get().execute()

    // await getApiRoot().me().carts()
    //     .post({
    //         body: {
    //             currency: "USD",
    //             country: "US",
    //             // customerEmail: "a-g@proton.com",
    //         },
    //     })
    //     .execute()

    // await getApiRoot().me().carts().withId({ ID: "c7d9ebe4-54e9-43a4-ad9d-452ec1857a66" }).delete({
    //     queryArgs: {
    //         version: 23,
    //     },
    // }).execute();

    // await getApiRoot().carts()
    //     .withId({ ID: "c7d9ebe4-54e9-43a4-ad9d-452ec1857a66" })
    //     .post({
    //         body: {
    //             version: 16,
    //             actions: [
    //                 {
    //                     action: 'addLineItem',
    //                     sku: "01-001",
    //                     quantity: 1,
    //                 }
    //             ]
    //         }
    //     })
    //     .execute();

    // await getApiRoot().products()
    //     .withId({ ID: 'b92dc2f8-f330-49f0-b2be-50aa3e904281' }) // ID твоего продукта
    //     .get()
    //     .execute();
  } else {
    toast.add({
      severity: 'info',
      summary: 'Login before add',
      life: 7000,
    })
  }
}
</script>

<template>
  <div class="product-page">
    <header class="product-header">
      <Button icon="pi pi-arrow-left" @click="goBack" />
    </header>

    <main v-if="product" class="product-main">
      <div class="product-carousel">
        <ProductImageCarousel :images="images" @imageClick="openModal" />
      </div>

      <ImageDialog v-model:visible="showModal" :images="images" :showNav="images.length > 1" />

      <ProductInfo
        :name="product.name['en-US'] || 'Name'"
        :author="
          product.masterVariant.attributes?.[1]?.value['en-US'] || 'Author - information is missing'
        "
        :genre="product.masterVariant.attributes?.[2]?.value || 'Genre - information is missing'"
        :description="product.description?.['en-US'] || 'Description - information is missing'"
        :published="
          product.masterVariant.attributes?.[0]?.value.toString() || 'information is missing'
        "
        :priceInfo="priceInfo"
        :productSku="product.masterVariant.sku"
        v-model:quantity="quantity"
        @addToCart="addToCart"
      />
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
