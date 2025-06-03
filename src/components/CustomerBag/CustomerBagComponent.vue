<script setup lang="ts">
import { getCustomer } from '@/services/saveChanges/getCustomer'
import type { ClientResponse } from '@commercetools/platform-sdk'
import { useAuth } from '@/composables/useAuth'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const { getApiRoot } = useAuth()
const isBagEmpty = ref(true)
async function getCustomerId(res: ClientResponse) {
  const client = res.body.id

  const cart = await getApiRoot().carts().withCustomerId(client).get().execute()

  if (cart.statusCode === 404) {
  }
  //get lineItems array
  //show name, price, quantity
  //total price of cart

  console.log(cart)
  console.log(client)
}
getCustomer(getCustomerId)
</script>

<template>
  <div v-if="isBagEmpty">
    Your bag is empty. You can choose any of the books provided
    <RouterLink to="/catalog"> on the catalog page.</RouterLink>
  </div>
  <div class="items"></div>
  <!-- v-for="itemsList" -->
</template>
