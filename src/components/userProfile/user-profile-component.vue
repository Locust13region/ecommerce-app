<script setup lang="ts">
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import { useAuth } from '@/composables/useAuth'
import { reactive, ref } from 'vue'
import type { Address } from '@/interfaces/signUpFormInterfaces'
import type {
  BaseAddress,
  ClientResponse,
  Customer,
  MyCustomerUpdateAction,
} from '@commercetools/platform-sdk'
import { Button, InputText, Message } from 'primevue'
import { personalDataValidator } from '@/services/PersonalDataValidator/PersonalDataValidator'
import { Form, FormField, type FormSubmitEvent } from '@primevue/forms'
import { useToast } from 'primevue/usetoast'
import { saveChanges } from '@/services/saveChanges/saveChanges'
import DatePicker from 'primevue/datepicker'
import ChangePasswordForm from './changePasswordForm.vue'

const userData = reactive({
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  email: '',
})
const toast = useToast()
const { getApiRoot } = useAuth()
const flagEditMode = ref(false)

const billingAddressesHolder = ref<BaseAddress[]>([])
const shippingAddressesHolder = ref<BaseAddress[]>([])
const defaultBillingAddress: Address = {}
const defaultShippingAddress: Address = {}

function getCustomerData(response: ClientResponse) {
  const customerData: Customer = response.body
  const addressesList: BaseAddress[] = customerData.addresses
  const defaultBillingId = customerData.defaultBillingAddressId
  const defaultShippingId = customerData.defaultShippingAddressId
  userData.firstName = customerData.firstName || ''
  userData.lastName = customerData.lastName || ''
  userData.dateOfBirth = customerData.dateOfBirth || ''
  userData.email = customerData.email || ''
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

function switchToEditMode() {
  flagEditMode.value = true
}
function switchToReadMode() {
  flagEditMode.value = false
}

async function onSubmit(event: FormSubmitEvent) {
  if (event.valid) {
    const eventData = event.states
    const actions: MyCustomerUpdateAction[] = []
    if (eventData.firstName.value) {
      const name = eventData.firstName.value
      actions.push({ action: 'setFirstName', firstName: name })
    }
    if (eventData.lastName.value) {
      const name = eventData.lastName.value
      actions.push({ action: 'setLastName', lastName: name })
    }
    if (eventData.dateOfBirth.value) {
      let date = eventData.dateOfBirth.value
      if (date instanceof Date) {
        const dateObj = date
        date = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`
      }
      actions.push({ action: 'setDateOfBirth', dateOfBirth: date })
    }
    if (eventData.email.value) {
      const email = eventData.email.value
      actions.push({ action: 'changeEmail', email: email })
    }
    try {
      await saveChanges(actions)
      switchToReadMode()
      toast.add({ severity: 'success', summary: 'Changes saved', life: 5000 })
    } catch (error) {
      if (error instanceof Error) {
        toast.add({ severity: 'error', summary: `${error.message}`, life: 5000 })
      }
    }
  }
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
          <section class="personal">
            <Form
              v-slot="$form"
              @submit="onSubmit"
              :initialValues="userData"
              :resolver="personalDataValidator"
              class="edit-form"
            >
              <div class="name">
                <p>Name:</p>
                <p v-if="!flagEditMode">{{ userData.firstName }}</p>
                <FormField>
                  <InputText
                    v-if="flagEditMode"
                    class="input-first-name"
                    name="firstName"
                    v-model="userData.firstName"
                  />
                  <Message
                    class="validation-error-message"
                    v-if="$form.firstName?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                  >
                    {{ $form.firstName.error?.message }}
                  </Message>
                </FormField>
              </div>
              <div class="surname">
                <p>Surname:</p>
                <p v-if="!flagEditMode">{{ userData.lastName }}</p>
                <FormField>
                  <InputText
                    v-if="flagEditMode"
                    class="input-last-name"
                    name="lastName"
                    v-model="userData.lastName"
                  ></InputText>
                  <Message
                    class="validation-error-message"
                    v-if="$form.lastName?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                  >
                    {{ $form.lastName.error?.message }}
                  </Message>
                </FormField>
              </div>
              <div class="email">
                <p>Email:</p>
                <p v-if="!flagEditMode">{{ userData.email }}</p>
                <FormField>
                  <InputText
                    v-if="flagEditMode"
                    class="input-email"
                    name="email"
                    v-model="userData.email"
                  ></InputText>
                  <Message
                    class="validation-error-message"
                    v-if="$form.email?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                  >
                    {{ $form.email.error?.message }}
                  </Message>
                </FormField>
              </div>
              <div class="birthDate">
                <p>Date of birth:</p>
                <p v-if="!flagEditMode">{{ userData.dateOfBirth }}</p>
                <FormField>
                  <DatePicker
                    v-if="flagEditMode"
                    class="input-date-of-birth"
                    name="dateOfBirth"
                    v-model="userData.dateOfBirth"
                    dateFormat="yy-mm-dd"
                    :manualInput="false"
                    showIcon
                    iconDisplay="input"
                    >{{ userData.dateOfBirth.value }}</DatePicker
                  >
                  <Message
                    class="validation-error-message"
                    v-if="$form.dateOfBirth?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                  >
                    {{ $form.dateOfBirth.error?.message }}
                  </Message>
                </FormField>
              </div>
              <Button
                v-if="!flagEditMode"
                class="edit-button"
                severity="secondary"
                @click="switchToEditMode"
                raised
              >
                <span class="pi pi-pencil"></span>
                Edit</Button
              >
              <Button
                v-if="flagEditMode"
                severity="secondary"
                @click="switchToReadMode"
                class="cancel-button"
                raised
                ><span class="pi pi-times"></span> Cancel</Button
              >
              <Button
                v-if="flagEditMode"
                severity="secondary"
                class="save-button"
                type="submit"
                raised
                ><span class="pi pi-check"></span> Save</Button
              >
            </Form>
          </section>
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
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 10px 0;
}
.name,
.surname,
.birthDate,
.email {
  display: grid;
  grid-template-columns: 1fr 2fr;
  width: 100%;
  min-width: 180px;
  align-items: center;
  justify-content: space-between;
}
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
input,
.input-date-of-birth {
  width: 100%;
}
.edit-button,
.save-button,
.cancel-button {
  min-width: 180px;
}

@media (min-width: 550px) {
  .name,
  .surname,
  .birthDate,
  .email {
    width: 50%;
  }
  .edit-button,
  .save-button,
  .cancel-button {
    min-width: 150px;
    width: fit-content;
  }
}
</style>
