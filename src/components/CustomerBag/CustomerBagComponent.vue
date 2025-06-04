<script setup lang="ts">
import { getCustomer } from '@/services/saveChanges/getCustomer'
import type { ClientResponse, LineItem } from '@commercetools/platform-sdk'
import { useAuth } from '@/composables/useAuth'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Button } from 'primevue'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

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
    // console.log(cart.lineItems)
  }
}
getCustomer(getCustomerId)
</script>

<template>
  <div v-if="isBagEmpty">
    Your bag is empty. You can choose any of the books provided
    <RouterLink to="/catalog"> on the catalog page.</RouterLink>
  </div>
  <DataTable stripedRows :value="itemsList" :size="'small'" tableStyle="min-width: 50rem">
    <Column field="variant.images[0]" header="Cover">
      <template #body="{ data }">
        <div>
          <img :src="data.variant.images[0].url" style="width: 50px" />
        </div>
      </template>
    </Column>
    <Column field="name" header="Name">
      <template #body="{ data }">
        <div>
          <h3>{{ data.name['en-US'] }}</h3>
        </div>
      </template>
    </Column>
    <Column field="price" header="Price">
      <template #body="{ data }">
        <div>
          <h4>{{ data.price.value.centAmount / 100 }} {{ data.price.value.currencyCode }}</h4>
        </div>
      </template>
    </Column>
    <Column field="quantity" header="Quantity">
      <template #body="{ data }">
        <div class="quantity-block">
          <Button icon="pi pi-minus" severity="secondary" aria-label="minus" :size="'small'" />
          <h4>{{ data.quantity }}</h4>
          <Button icon="pi pi-plus" severity="secondary" aria-label="plus" :size="'small'" />
        </div>
      </template>
    </Column>
    <Column field="totalPrice" header="Sum">
      <template #body="{ data }">
        <div>
          <h3>{{ data.totalPrice.centAmount / 100 }} {{ data.totalPrice.currencyCode }}</h3>
        </div>
      </template>
    </Column>
    <Column header="Delete Item">
      <template #body>
        <Button icon="pi pi-times" severity="danger" aria-label="Cancel" :size="'small'" />
      </template>
    </Column>
    <template #footer>
      <div class="total">Total: {{ totalPrice }}</div>
    </template>
    <!--  -->
  </DataTable>
</template>
<style lang="css" scoped>
.total {
  text-align: end;
  border-top: 2px solid white;
  font-size: 25px;
}
.quantity-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 130px;
}
</style>
