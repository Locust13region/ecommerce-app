<script setup lang="ts">
import { getCustomer } from '@/services/saveChanges/getCustomer'
import type { ClientResponse, LineItem } from '@commercetools/platform-sdk'
import { useAuth } from '@/composables/useAuth'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Button, /* Image,*/ InputNumber } from 'primevue'

const { getApiRoot } = useAuth()
const isBagEmpty = ref(true)
const itemsList = ref<LineItem[]>([])
const totalPrice = ref('')
async function getCustomerId(res: ClientResponse) {
  const client = res.body.id
  // 3fdf450d-89a1-4613-be95-5fc3b06d54d4
  // console.log(client)

  const cartResponse = await getApiRoot()
    .carts()
    .withCustomerId({ customerId: client })
    .get()
    .execute()

  if (cartResponse.statusCode === 404 || cartResponse.body.lineItems.length === 0) {
    isBagEmpty.value = true
  }
  if (cartResponse.statusCode === 200 && cartResponse.body.lineItems.length !== 0) {
    isBagEmpty.value = false
    const cart = cartResponse.body
    totalPrice.value = `${cart.totalPrice.centAmount / 100} ${cart.totalPrice.currencyCode}`
    itemsList.value = cart.lineItems
    console.log(cart.lineItems)
  }

  //get lineItems array
  //show name, price, quantity, img
  //total price of cart
}
getCustomer(getCustomerId)
</script>

<template>
  <div v-if="isBagEmpty">
    Your bag is empty. You can choose any of the books provided
    <RouterLink to="/catalog"> on the catalog page.</RouterLink>
  </div>
  <div class="table-header">
    <h2>Item</h2>
    <h2>Price</h2>
    <h2>Quantity</h2>
    <h2>Cost</h2>
  </div>
  <div class="item" v-for="item in itemsList" :key="item.id">
    <div class="card">
      <!-- <Image :src="item.variant.images[0].url" alt="Image" width="50" /> -->
      <!-- <h2>{{ item.name['en-US'] }}</h2> -->
    </div>
    <div class="price">
      {{ item.price.value.centAmount / 100 }} {{ item.price.value.currencyCode }}
    </div>
    <div class="buttons">
      <div>{{ item.quantity }}</div>
      <InputNumber
        class="count"
        inputId="horizontal-buttons"
        showButtons
        buttonLayout="horizontal"
        :step="1"
        :min="0"
        :max="100"
        mode="decimal"
        fluid
      >
        <template #incrementbuttonicon>
          <span class="pi pi-plus" />
        </template>
        <template #decrementbuttonicon>
          <span class="pi pi-minus" />
        </template>
      </InputNumber>
      <Button class="removeItem">Delete</Button>
    </div>
  </div>
  <div class="total">Total: {{ totalPrice }}</div>
</template>
<style lang="css" scoped>
.table-header {
  display: flex;
  justify-content: space-between;
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.07);
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.185);
}
.card {
  display: flex;
  align-items: center;
}
.count {
  max-width: 140px;
  text-align: center;
}
.total {
  align-self: flex-end;
  border-top: 2px solid white;
  font-size: 25px;
}
</style>
