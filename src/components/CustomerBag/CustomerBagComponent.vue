<script setup lang="ts">
import type { CartUpdateAction } from '@commercetools/platform-sdk'
import { Button, useToast } from 'primevue'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { updateBag } from '@/services/CustomerBag/updateBag'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { useBagStateStore } from '../../stores/bagStates'
import { useAuth } from '@/composables/useAuth'

const toast = useToast()
const bag = useBagStateStore()

async function deleteItemHandler(lineId: string) {
  try {
    await updateBag([{ action: 'removeLineItem', lineItemId: lineId }])
    toast.add({ severity: 'success', summary: `Item deleted`, life: 5000 })
  } catch (error) {
    if (error instanceof Error) {
      toast.add({ severity: 'error', summary: `${error.message}`, life: 5000 })
    }
  }
}
async function changeQuantityHandler(lineId: string, newQuantity: number) {
  try {
    await updateBag([
      {
        action: 'changeLineItemQuantity',
        lineItemId: lineId,
        quantity: newQuantity,
      },
    ])
  } catch (error) {
    if (error instanceof Error) {
      toast.add({ severity: 'error', summary: `${error.message}`, life: 5000 })
    }
  }
}
async function clearBag() {
  try {
    if (bag.items.length !== 0) {
      const actionArray: CartUpdateAction[] = []
      bag.items.map((item) => {
        actionArray.push({
          action: 'removeLineItem',
          lineItemId: item.id,
        })
      })
      await updateBag(actionArray)
    }
    toast.add({ severity: 'success', summary: 'Bag is empty', life: 5000 })
  } catch (error) {
    if (error instanceof Error) {
      toast.add({ severity: 'error', summary: `${error.message}`, life: 5000 })
    }
  }
}
async function promoSubmit(event: FormSubmitEvent) {
  const { getApiRoot } = useAuth()
  const input = event.states.promo.value
  const promoResponse = await getApiRoot().discountCodes().get().execute()
  const promoItems = promoResponse.body.results
  const promoList: string[] = []
  promoItems.forEach((promo) => promoList.push(promo.code))

  if (input) {
    if (promoList.includes(input)) {
      await updateBag([
        {
          action: 'addDiscountCode',
          code: input,
        },
      ])

      if (bag.isPromoUsed) {
        toast.add({ severity: 'warn', summary: 'You already used a promo code', life: 5000 })
      } else {
        bag.promoUsed()
        toast.add({ severity: 'success', summary: 'Promo code is activated', life: 5000 })
      }
    } else {
      toast.add({ severity: 'error', summary: 'Invalid promo code', life: 5000 })
    }
  }
}
</script>

<template>
  <DataTable stripedRows :value="bag.items" :size="'small'" tableStyle="min-width: 50rem">
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
            @click="changeQuantityHandler(data.id, data.quantity - 1)"
          />
          <h4>{{ data.quantity }}</h4>
          <Button
            icon="pi pi-plus"
            severity="secondary"
            aria-label="plus"
            :size="'small'"
            @click="changeQuantityHandler(data.id, data.quantity + 1)"
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
          @click="deleteItemHandler(data.id)"
        />
      </template>
    </Column>
    <template #footer>
      <div class="table-footer">
        <Button
          label="Clear bag"
          icon="pi pi-trash"
          severity="contrast"
          aria-label="Delete"
          :size="'small'"
          @click="clearBag"
          class="clear-bag-button"
        >
        </Button>
        <Form @submit="promoSubmit" class="promo">
          <InputText name="promo" placeholder="I have a promo code" class="promo-input"></InputText>
          <Button
            icon="pi pi-check"
            severity="secondary"
            aria-label="Promo"
            :size="'small'"
            type="submit"
            class="promo-button"
          ></Button>
        </Form>
      </div>
    </template>
  </DataTable>
  <div class="total">
    Total:
    <span class="total-price">{{ bag.total }}</span>
    <span class="before-discount">{{ bag.oldPrice }}</span>
  </div>
</template>
<style lang="css" scoped>
.total {
  display: flex;
  justify-content: end;
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
  display: grid;
  gap: 10px;
  grid-template-columns: 2fr 1fr;
}
.promo-button {
  width: 100%;
}
.promo-input {
  width: 170px;
}
.table-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
}
.before-discount {
  text-align: end;
  text-decoration: line-through;
  font-size: 23px;
  padding-left: 5px;
}
</style>
