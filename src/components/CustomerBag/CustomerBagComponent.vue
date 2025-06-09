<script setup lang="ts">
import type { CartUpdateAction, LineItem } from '@commercetools/platform-sdk'
import { useAuth } from '@/composables/useAuth'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Button, useToast } from 'primevue'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { changeQuantityRequest } from '@/services/CustomerBagUpdate/changeQuantity'
import { updateBag } from '@/services/CustomerBagUpdate/updateBag'
import { Form, type FormSubmitEvent } from '@primevue/forms'

const { getApiRoot } = useAuth()
const isBagEmpty = ref(true)
const itemsList = ref<LineItem[]>([])
const totalPrice = ref('')
const oldPrice = ref('')
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
    if (cart.discountOnTotalPrice?.discountedAmount.centAmount) {
      oldPrice.value = `${cart.totalPrice.centAmount / 100 + cart.discountOnTotalPrice.discountedAmount.centAmount / 100} ${cart.totalPrice.currencyCode}`
    }
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
    const res = await updateBag([action])
    itemsList.value = res.body.lineItems
    totalPrice.value = `${res.body.totalPrice.centAmount / 100} ${res.body.totalPrice.currencyCode}`
    toast.add({ severity: 'success', summary: `Item deleted`, life: 5000 })
    if (itemsList.value.length === 0) {
      isBagEmpty.value = true
    }
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
      await updateBag(actionArray)
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
async function promoSubmit(event: FormSubmitEvent) {
  const input = event.states.promo.value
  const promoResponse = await getApiRoot().discountCodes().get().execute()
  const promoItems = promoResponse.body.results
  const promoList: string[] = []
  promoItems.forEach((promo) => promoList.push(promo.code))

  if (input) {
    if (promoList.includes(input)) {
      const response = await updateBag([
        {
          action: 'addDiscountCode',
          code: input,
        },
      ])
      const cart = response.body
      if (cart.discountOnTotalPrice?.discountedAmount.centAmount) {
        oldPrice.value = `${cart.totalPrice.centAmount / 100 + cart.discountOnTotalPrice.discountedAmount.centAmount / 100} ${cart.totalPrice.currencyCode}`
      }
      totalPrice.value = `${cart.totalPrice.centAmount / 100} ${cart.totalPrice.currencyCode}`
      if (oldPrice.value !== '') {
        toast.add({ severity: 'warn', summary: 'You already used a promo code', life: 5000 })
      } else {
        toast.add({ severity: 'success', summary: 'Promo code is activated', life: 5000 })
      }
    } else {
      toast.add({ severity: 'error', summary: 'Invalid promo code', life: 5000 })
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
        <div class="total-text">
          Total:
          <span class="total-price">{{ totalPrice }}</span>
          <span class="before-discount">{{ oldPrice }}</span>
        </div>
      </div>
    </template>
  </DataTable>
  <Form @submit="promoSubmit" v-if="!isBagEmpty" class="promo">
    <InputText name="promo" placeholder="I have a promo code"></InputText>
    <Button
      icon="pi pi-check"
      severity="secondary"
      aria-label="Promo"
      :size="'small'"
      type="submit"
      class="promo-button"
    ></Button>
  </Form>
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
.promo {
  align-self: flex-end;
  display: grid;
  gap: 10px;
  grid-template-columns: 4fr 1fr;
  width: 30%;
}
.promo-button {
  width: 100%;
}
.before-discount {
  text-align: end;
  text-decoration: line-through;
  font-size: 20px;
  padding-left: 5px;
}
</style>
