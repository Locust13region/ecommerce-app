<script setup lang="ts">
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import { useAuth } from '@/composables/useAuth'
import { ref } from 'vue'
import type { Address } from '@/interfaces/signUpFormInterfaces'
import type {
  BaseAddress,
  ClientResponse,
  Customer,
  /*MyCustomerUpdateAction,*/
} from '@commercetools/platform-sdk'
// import { Button, InputText, Message } from 'primevue'

import ChangePasswordForm from './changePasswordForm.vue'
import PersonalInfoForm from './personalInfoForm.vue'

// const userData = reactive({
//   firstName: '',
//   lastName: '',
//   dateOfBirth: '',
//   email: '',
// })

const { getApiRoot } = useAuth()

const billingAddressesHolder = ref<BaseAddress[]>([])
const shippingAddressesHolder = ref<BaseAddress[]>([])
const defaultBillingAddress: Address = {}
const defaultShippingAddress: Address = {}

function getCustomerData(response: ClientResponse) {
  const customerData: Customer = response.body
  const addressesList: BaseAddress[] = customerData.addresses
  const defaultBillingId = customerData.defaultBillingAddressId
  const defaultShippingId = customerData.defaultShippingAddressId
  // userData.firstName = customerData.firstName || ''
  // userData.lastName = customerData.lastName || ''
  // userData.dateOfBirth = customerData.dateOfBirth || ''
  // userData.email = customerData.email || ''
  let billingIDs: string[] = []
  let shippingIDs: string[] = []
  if (customerData.billingAddressIds) {
    billingIDs = customerData.billingAddressIds
  }
  if (customerData.shippingAddressIds) {
    shippingIDs = customerData.shippingAddressIds
  }
  addressesList.forEach((address: BaseAddress) => {
    if (address.id) {
      if (address.id === defaultShippingId) {
        Object.assign(defaultShippingAddress, address)
      }
      if (address.id === defaultBillingId) {
        Object.assign(defaultBillingAddress, address)
      }
      if (billingIDs.includes(address.id) && address.id !== defaultBillingId) {
        billingAddressesHolder.value.push(address)
      }
      if (shippingIDs.includes(address.id) && address.id !== defaultShippingId) {
        shippingAddressesHolder.value.push(address)
      }
    }
  })
}

getApiRoot()
  .me()
  .get()
  .execute()
  .then((res) => {
    getCustomerData(res)
  })
</script>

<template>
  <div class="card">
    <Tabs value="personal" scrollable>
      <TabList>
        <Tab value="personal">Personal Information</Tab>
        <Tab value="billing-address">Billing Address</Tab>
        <Tab value="shipping-address">Shipping Address</Tab>
        <Tab value="change-password">Change Password</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="personal">
          <PersonalInfoForm></PersonalInfoForm>
        </TabPanel>
        <TabPanel value="billing-address">
          <section class="billing-addresses">
            <div class="default-billing address">
              <h2 class="address-title">Default address</h2>
              <p>City:</p>
              <p>{{ defaultBillingAddress.city }}</p>
              <p>Street Name:</p>
              <p>{{ defaultBillingAddress.streetName }}</p>
              <p>Street Number:</p>
              <p>{{ defaultBillingAddress.streetNumber }}</p>
              <p>Country:</p>
              <p>{{ defaultBillingAddress.country }}</p>
              <p>ZIP/Postal Code:</p>
              <p>{{ defaultBillingAddress.postalCode }}</p>
            </div>
            <div
              class="billing-address address"
              v-for="address in billingAddressesHolder"
              :key="address.id"
            >
              <p>City:</p>
              <p>{{ address.city }}</p>
              <p>Street Name:</p>
              <p>{{ address.streetName }}</p>
              <p>Street Number:</p>
              <p>{{ address.streetNumber }}</p>
              <p>Country:</p>
              <p>{{ address.country }}</p>
              <p>ZIP/Postal Code:</p>
              <p>{{ address.postalCode }}</p>
            </div>
          </section>
        </TabPanel>
        <TabPanel value="shipping-address">
          <section class="shipping-addresses">
            <div class="default-shipping address">
              <h2 class="address-title">Default address</h2>
              <p>City:</p>
              <p>{{ defaultShippingAddress.city }}</p>
              <p>Street Name:</p>
              <p>{{ defaultShippingAddress.streetName }}</p>
              <p>Street Number:</p>
              <p>{{ defaultShippingAddress.streetNumber }}</p>
              <p>Country:</p>
              <p>{{ defaultShippingAddress.country }}</p>
              <p>ZIP/Postal Code:</p>
              <p>{{ defaultShippingAddress.postalCode }}</p>
            </div>
            <div
              class="shipping-address address"
              v-for="address in shippingAddressesHolder"
              :key="address.id"
            >
              <p>City:</p>
              <p>{{ address.city }}</p>
              <p>Street Name:</p>
              <p>{{ address.streetName }}</p>
              <p>Street Number:</p>
              <p>{{ address.streetNumber }}</p>
              <p>Country:</p>
              <p>{{ address.country }}</p>
              <p>ZIP/Postal Code:</p>
              <p>{{ address.postalCode }}</p>
            </div>
          </section>
        </TabPanel>
        <TabPanel value="change-password">
          <ChangePasswordForm></ChangePasswordForm>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>
<style scoped>
.shipping-addresses,
.billing-addresses {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 50px 0;
}
.address {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 30%;
  min-width: 150px;
  gap: 10px 0;
  border-top: 1px solid white;
}
.address-title {
  grid-column: span 2;
  border-bottom: 1px solid white;
}
</style>
