<script setup lang="ts">
import CustomerBagComponent from '@/components/CustomerBag/CustomerBagComponent.vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useBagStateStore } from '@/stores/bagStates'
import { onMounted } from 'vue'

const bag = useBagStateStore()

async function getCustomerCart() {
  const { getApiRoot } = useAuth()
  try {
    const cartResponse = await getApiRoot().me().carts().get().execute()

    if (cartResponse.body.results.length === 0) {
      bag.setEmpty()
    } else if (cartResponse.body.results[0].lineItems.length !== 0) {
      const cart = cartResponse.body.results[0]
      const totalStr = `${cart.totalPrice.centAmount / 100} ${cart.totalPrice.currencyCode}`

      bag.setNotEmpty()
      bag.setItems(cart.lineItems)
      bag.setTotal(totalStr)

      if (cart.discountOnTotalPrice?.discountedAmount.centAmount) {
        const oldPrice = `${cart.totalPrice.centAmount / 100 + cart.discountOnTotalPrice.discountedAmount.centAmount / 100} ${cart.totalPrice.currencyCode}`
        bag.setOldPrice(oldPrice)
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
  }
}
onMounted(() => {
  getCustomerCart()
})
</script>

<template>
  <div class="shopping-bag">
    <h1>My shopping bag</h1>
    <div v-if="bag.isEmpty">
      Your bag is empty. You can choose any of the books provided
      <RouterLink to="/catalog"> on the catalog page.</RouterLink>
    </div>
    <CustomerBagComponent v-if="!bag.isEmpty" class="customer-bag"></CustomerBagComponent>
  </div>
</template>

<style lang="css" scoped>
.shopping-bag {
  display: flex;
  flex-direction: column;
  gap: 10px 0;
}
</style>
