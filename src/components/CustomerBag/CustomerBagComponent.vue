<script setup lang="ts">
import type { CartUpdateAction, LineItem } from '@commercetools/platform-sdk'
import { useAuth } from '@/composables/useAuth'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Button, useToast } from 'primevue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { changeQuantityRequest } from '@/services/CustomerBagUpdate/changeQuantity'
import { deleteItem } from '@/services/CustomerBagUpdate/deleteItem'

const { getApiRoot } = useAuth()
const isBagEmpty = ref(true)
const itemsList = ref<LineItem[]>([])
const totalPrice = ref('')
const toast = useToast()

async function getCustomerCart() {
  const cartResponse = await getApiRoot().me().carts().get().execute()

  if (cartResponse.body.results.length === 0) {
    isBagEmpty.value = true
  } else if (cartResponse.body.results[0].lineItems.length !== 0) {
    isBagEmpty.value = false
    const cart = cartResponse.body.results[0]

    totalPrice.value = `${cart.totalPrice.centAmount / 100} ${cart.totalPrice.currencyCode}`
    itemsList.value = cart.lineItems
  }
}
async function decreaseQuantity(lineId: string, quantity: number) {
  try {
    const res = await changeQuantityRequest(lineId, quantity - 1)
    itemsList.value = res.body.lineItems
    if (itemsList.value.length === 0) {
      isBagEmpty.value = true
    }
    totalPrice.value = `${res.body.totalPrice.centAmount / 100} ${res.body.totalPrice.currencyCode}`
  } catch (error) {
    if (error instanceof Error) {
      toast.add({ severity: 'error', summary: `${error.message}`, life: 5000 })
    }
  }
}
async function increaseQuantity(lineId: string, quantity: number) {
  try {
    const res = await changeQuantityRequest(lineId, quantity + 1)
    itemsList.value = res.body.lineItems
    totalPrice.value = `${res.body.totalPrice.centAmount / 100} ${res.body.totalPrice.currencyCode}`
  } catch (error) {
    if (error instanceof Error) {
      toast.add({ severity: 'error', summary: `${error.message}`, life: 5000 })
    }
  }
}
async function deleteHandler(lineId: string) {
  try {
    const action: CartUpdateAction = { action: 'removeLineItem', lineItemId: lineId }
    const res = await deleteItem([action])
    itemsList.value = res.body.lineItems
    totalPrice.value = `${res.body.totalPrice.centAmount / 100} ${res.body.totalPrice.currencyCode}`
    toast.add({ severity: 'success', summary: `Item deleted`, life: 5000 })
  } catch (error) {
    if (error instanceof Error) {
      toast.add({ severity: 'error', summary: `${error.message}`, life: 5000 })
    }
  }
}
async function emptyBag() {
  try {
    const cartResponse = await getApiRoot().me().carts().get().execute()
    if (cartResponse.body.results.length !== 0) {
      const cart = cartResponse.body.results[0]
      const actionArray: CartUpdateAction[] = []
      if (cart.lineItems.length !== 0) {
        const items = cart.lineItems
        items.map((item) => {
          actionArray.push({
            action: 'removeLineItem',
            lineItemId: item.id,
          })
        })
      }
      await deleteItem(actionArray)
      isBagEmpty.value = true
      itemsList.value = []
    }
    toast.add({ severity: 'success', summary: 'Bag is empty', life: 5000 })
  } catch (error) {
    if (error instanceof Error) {
      toast.add({ severity: 'error', summary: `${error.message}`, life: 5000 })
    }
  }
}
getCustomerCart()
</script>

<template>
  <div v-if="isBagEmpty">
    Your bag is empty. You can choose any of the books provided
    <RouterLink to="/catalog"> on the catalog page.</RouterLink>
  </div>
  <DataTable
    stripedRows
    :value="itemsList"
    :size="'small'"
    tableStyle="min-width: 50rem"
    v-if="!isBagEmpty"
  >
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
          <Button
            icon="pi pi-minus"
            severity="secondary"
            aria-label="minus"
            :size="'small'"
            @click="decreaseQuantity(data.id, data.quantity)"
          />
          <h4>{{ data.quantity }}</h4>
          <Button
            icon="pi pi-plus"
            severity="secondary"
            aria-label="plus"
            :size="'small'"
            @click="increaseQuantity(data.id, data.quantity)"
          />
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
      <template #body="{ data }">
        <Button
          icon="pi pi-times"
          severity="danger"
          aria-label="Cancel"
          :size="'small'"
          @click="deleteHandler(data.id)"
        />
      </template>
    </Column>
    <template #footer>
      <div class="total">
        <Button
          label="Clear bag"
          icon="pi pi-trash"
          severity="danger"
          aria-label="Delete"
          :size="'small'"
          @click="emptyBag"
        >
        </Button>
        <div>Total: {{ totalPrice }}</div>
      </div>
    </template>
  </DataTable>
</template>
<style lang="css" scoped>
.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding-top: 5px;
  gap: 10px;
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
