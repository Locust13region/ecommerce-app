<script setup lang="ts">
import { ref } from 'vue'
import type { Address } from '@/interfaces/signUpFormInterfaces'
import type {
  BaseAddress,
  ClientResponse,
  Customer,
  MyCustomerUpdateAction,
} from '@commercetools/platform-sdk'
import { Button, InputText, Message, Select, useToast } from 'primevue'
import { Form, FormField, type FormSubmitEvent } from '@primevue/forms'
import Card from 'primevue/card'
import { personalDataValidator } from '@/services/PersonalDataValidator/PersonalDataValidator'
import { countriesSelect } from '@/consts/signUpFormConsts'
import { saveChanges } from '@/services/saveChanges/saveChanges'
import { getCustomer } from '@/services/saveChanges/getCustomer'

const toast = useToast()
const billingAddressesHolder = ref<BaseAddress[]>([])
const defaultAddressHolder = ref<BaseAddress[]>([])
const addNewAddressMode = ref(false)
const currentEditField = ref()
const defaultValueForCountrySelector = ref()

function getCustomerAddresses(response: ClientResponse) {
  const customerData: Customer = response.body
  const addressesList: BaseAddress[] = customerData.addresses
  const defaultBillingId = customerData.defaultBillingAddressId
  let billingIDs: string[] = []

  if (customerData.billingAddressIds) {
    billingIDs = customerData.billingAddressIds
  }
  addressesList.forEach((address: BaseAddress) => {
    if (address.id) {
      if (address.id === defaultBillingId) {
        defaultAddressHolder.value.push(address)
      }
      if (billingIDs.includes(address.id) && address.id !== defaultBillingId) {
        billingAddressesHolder.value.push(address)
      }
    }
  })
}

function addNewAddressHandler() {
  addNewAddressMode.value = !addNewAddressMode.value
}
async function saveNewAddress(event: FormSubmitEvent) {
  try {
    if (event.valid) {
      const newAddress: Address = {
        city: event.states.city.value,
        country: event.states.country.value.code,
        streetName: event.states.streetName.value,
        streetNumber: event.states.streetNumber.value,
        postalCode: event.states.postalCode.value,
      }

      const actionAddAddress: MyCustomerUpdateAction = { action: 'addAddress', address: newAddress }
      const res = await saveChanges([actionAddAddress])
      const newAddressId = res.body.addresses[res.body.addresses.length - 1].id
      const actionAddId: MyCustomerUpdateAction = {
        action: 'addBillingAddressId',
        addressId: newAddressId,
      }
      await saveChanges([actionAddId])
      const addressObj = Object.assign({ id: newAddressId }, newAddress)
      billingAddressesHolder.value.push(addressObj)
      toast.add({
        severity: 'success',
        summary: `Add ${newAddress.country}, ${newAddress.city}, ${newAddress.streetName}, ${newAddress.streetNumber} in billing addresses`,
        life: 5000,
      })
      addNewAddressHandler()
      event.reset()
    }
  } catch (error) {
    if (error instanceof Error) {
      toast.add({ severity: 'error', summary: `${error.message}`, life: 5000 })
    }
  }
}
async function deleteAddress(id: string) {
  try {
    const changes: MyCustomerUpdateAction[] = []
    changes.push({ action: 'removeBillingAddressId', addressId: id })
    changes.push({ action: 'removeAddress', addressId: id })
    await saveChanges(changes)
    billingAddressesHolder.value = billingAddressesHolder.value.filter((elem) => elem.id !== id)
  } catch (error) {
    if (error instanceof Error) {
      toast.add({ severity: 'error', summary: `${error.message}`, life: 5000 })
    }
  }
}
async function setDefaultAddress(id: string) {
  try {
    const currentDefaultAddress = defaultAddressHolder.value[0]
    const newDefaultAddress = billingAddressesHolder.value.find((address) => address.id === id)

    billingAddressesHolder.value.push(currentDefaultAddress)
    defaultAddressHolder.value.pop()
    defaultAddressHolder.value.push(newDefaultAddress as BaseAddress)
    billingAddressesHolder.value = billingAddressesHolder.value.filter((elem) => elem.id !== id)

    await saveChanges([{ action: 'setDefaultBillingAddress', addressId: id }])
    toast.add({
      severity: 'success',
      summary: `New default address saved`,
      life: 3000,
    })
  } catch (error) {
    if (error instanceof Error) {
      toast.add({ severity: 'error', summary: `${error.message}`, life: 5000 })
    }
  }
}
function editAddressHandler(id: string) {
  currentEditField.value = id
}
function setDefaultValueForCountrySelect(countryCode: string) {
  defaultValueForCountrySelector.value = countriesSelect.value.find(
    (obj) => obj.code === countryCode,
  )
}
async function editAddress(event: FormSubmitEvent) {
  try {
    if (event.valid) {
      const newAddress: Address = {
        city: event.states.city.value,
        country: event.states.country.value.code,
        streetName: event.states.streetName.value,
        streetNumber: event.states.streetNumber.value,
        postalCode: event.states.postalCode.value,
      }

      const actionChangeAddress: MyCustomerUpdateAction = {
        action: 'changeAddress',
        addressId: event.states.id.value,
        address: newAddress,
      }
      await saveChanges([actionChangeAddress])
      editAddressHandler('')

      if (event.states.id.value === defaultAddressHolder.value[0].id) {
        defaultAddressHolder.value.pop()
        const editedAddress: BaseAddress = Object.assign({ id: event.states.id.value }, newAddress)
        defaultAddressHolder.value.push(editedAddress)
      } else {
        billingAddressesHolder.value = billingAddressesHolder.value.filter(
          (address) => address.id !== event.states.id.value,
        )
        const editedAddress: BaseAddress = Object.assign({ id: event.states.id.value }, newAddress)
        billingAddressesHolder.value.push(editedAddress)
      }
      toast.add({
        severity: 'success',
        summary: `Address changed`,
        life: 5000,
      })
    }
  } catch (error) {
    if (error instanceof Error) {
      toast.add({ severity: 'error', summary: `${error.message}`, life: 5000 })
    }
  }
}
getCustomer(getCustomerAddresses).catch((error) => {
  if (error instanceof Error) {
    toast.add({ severity: 'error', summary: `${error.message}`, life: 5000 })
  }
})
</script>

<template>
  <section class="billing-addresses">
    <Card class="default address" v-for="address in defaultAddressHolder" :key="address.id">
      <template #title>Default Address</template>
      <template #content>
        <p v-if="currentEditField !== address.id">
          {{
            `${address.country}, ${address.city}, ${address.streetName}, ${address.streetNumber}, ZIP ${address.postalCode}`
          }}
        </p>
        <Form
          v-if="currentEditField === address.id"
          v-slot="$form"
          @submit="editAddress"
          :initialValues="address"
          :resolver="personalDataValidator"
          class="edit-form"
        >
          <FormField name="id"></FormField>
          <FormField name="country" :initialValue="defaultValueForCountrySelector">
            <Select
              :options="countriesSelect"
              optionLabel="name"
              placeholder="Select a Country"
              :manualInput="false"
              class="select-country-input"
            ></Select>
            <Message
              class="validation-error-message"
              v-if="$form.country?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.country.error?.message }}</Message
            >
          </FormField>
          <FormField>
            <InputText class="input-city" name="city" placeholder="Enter city" />
            <Message
              class="validation-error-message"
              v-if="$form.city?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.city.error?.message }}
            </Message>
          </FormField>
          <FormField>
            <InputText class="input-street" name="streetName" placeholder="Enter street name" />
            <Message
              class="validation-error-message"
              v-if="$form.street?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.street.error?.message }}
            </Message>
          </FormField>
          <FormField>
            <InputText
              class="input-street-number"
              name="streetNumber"
              placeholder="Enter street number"
            />
            <Message
              class="validation-error-message"
              v-if="$form.streetNumber?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.streetNumber.error?.message }}
            </Message>
          </FormField>
          <FormField>
            <InputText
              class="input-postal-code"
              name="postalCode"
              placeholder="Enter postal code/ZIP"
            />
            <Message
              class="validation-error-message"
              v-if="$form.postalCode?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.postalCode.error?.message }}
            </Message>
          </FormField>
          <div class="control-buttons">
            <Button label="Save" severity="success" outlined type="submit" class="w-full"
              ><span class="pi pi-check"></span
            ></Button>
            <Button label="Cancel" severity="danger" class="w-full" @click="editAddressHandler('')"
              ><span class="pi pi-times"></span
            ></Button>
          </div>
        </Form>
      </template>
      <template #footer>
        <div class="control-buttons" v-if="currentEditField !== address.id">
          <Button
            label="Edit"
            severity="contrast"
            outlined
            class="w-full"
            @click="
              () => {
                editAddressHandler(address.id || '')
                setDefaultValueForCountrySelect(address.country)
              }
            "
            ><span class="pi pi-pencil"></span
          ></Button>
        </div>
      </template>
    </Card>
    <h2>Other addresses</h2>
    <Card v-for="address in billingAddressesHolder" :key="address.id" class="address">
      <template #content>
        <h4 v-if="currentEditField !== address.id">
          {{
            `${address.country}, ${address.city}, ${address.streetName}, ${address.streetNumber}, ZIP ${address.postalCode}`
          }}
        </h4>
        <Form
          v-if="currentEditField === address.id"
          v-slot="$form"
          @submit="editAddress"
          :initialValues="address"
          :resolver="personalDataValidator"
          class="edit-form"
        >
          <FormField name="id"></FormField>
          <FormField name="country" :initialValue="defaultValueForCountrySelector">
            <Select
              :options="countriesSelect"
              optionLabel="name"
              placeholder="Select a Country"
              :manualInput="false"
              class="select-country-input"
            ></Select>
            <Message
              class="validation-error-message"
              v-if="$form.country?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.country.error?.message }}</Message
            >
          </FormField>
          <FormField>
            <InputText class="input-city" name="city" placeholder="Enter city" />
            <Message
              class="validation-error-message"
              v-if="$form.city?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.city.error?.message }}
            </Message>
          </FormField>
          <FormField>
            <InputText class="input-street" name="streetName" placeholder="Enter street name" />
            <Message
              class="validation-error-message"
              v-if="$form.street?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.street.error?.message }}
            </Message>
          </FormField>
          <FormField>
            <InputText
              class="input-street-number"
              name="streetNumber"
              placeholder="Enter street number"
            />
            <Message
              class="validation-error-message"
              v-if="$form.streetNumber?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.streetNumber.error?.message }}
            </Message>
          </FormField>
          <FormField>
            <InputText
              class="input-postal-code"
              name="postalCode"
              placeholder="Enter postal code/ZIP"
            />
            <Message
              class="validation-error-message"
              v-if="$form.postalCode?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.postalCode.error?.message }}
            </Message>
          </FormField>
          <div class="control-buttons">
            <Button label="Save" severity="success" outlined type="submit" class="w-full"
              ><span class="pi pi-check"></span
            ></Button>
            <Button label="Cancel" severity="danger" class="w-full" @click="editAddressHandler('')"
              ><span class="pi pi-times"></span
            ></Button>
          </div>
        </Form>
      </template>
      <template #footer>
        <div class="control-buttons" v-if="currentEditField !== address.id">
          <Button
            class="set-as-default-button"
            raised
            @click="
              () => {
                if (address.id) {
                  setDefaultAddress(address.id)
                }
              }
            "
            ><span class="pi pi-bookmark"> </span><span class="text">Set as default</span></Button
          >
          <Button
            label="Edit"
            severity="contrast"
            outlined
            class="w-full"
            @click="
              () => {
                editAddressHandler(address.id || '')
                setDefaultValueForCountrySelect(address.country)
              }
            "
            ><span class="pi pi-pencil"></span
          ></Button>
          <Button
            label="Delete"
            severity="danger"
            class="w-full"
            @click="
              () => {
                if (address.id) {
                  deleteAddress(address.id)
                }
              }
            "
            ><span class="pi pi-trash"></span
          ></Button>
        </div>
      </template>
    </Card>
    <Card class="add-address address">
      <template #title> Add new billing address</template>
      <template #content>
        <Form
          v-if="addNewAddressMode"
          v-slot="$form"
          @submit="saveNewAddress"
          :resolver="personalDataValidator"
          class="edit-form"
        >
          <FormField name="country">
            <Select
              :options="countriesSelect"
              optionLabel="name"
              placeholder="Select a Country"
              :manualInput="false"
              class="select-country-input"
            ></Select>
            <Message
              class="validation-error-message"
              v-if="$form.country?.invalid"
              severity="error"
              size="small"
              variant="simple"
              >{{ $form.country.error?.message }}</Message
            >
          </FormField>
          <FormField>
            <InputText class="input-city" name="city" placeholder="Enter city" />
            <Message
              class="validation-error-message"
              v-if="$form.city?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.city.error?.message }}
            </Message>
          </FormField>
          <FormField>
            <InputText class="input-street" name="streetName" placeholder="Enter street name" />
            <Message
              class="validation-error-message"
              v-if="$form.street?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.street.error?.message }}
            </Message>
          </FormField>
          <FormField>
            <InputText
              class="input-street-number"
              name="streetNumber"
              placeholder="Enter street number"
            />
            <Message
              class="validation-error-message"
              v-if="$form.streetNumber?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.streetNumber.error?.message }}
            </Message>
          </FormField>
          <FormField>
            <InputText
              class="input-postal-code"
              name="postalCode"
              placeholder="Enter postal code/ZIP"
            />
            <Message
              class="validation-error-message"
              v-if="$form.postalCode?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.postalCode.error?.message }}
            </Message>
          </FormField>
          <div class="control-buttons">
            <Button label="Save" severity="success" outlined type="submit" class="w-full"
              ><span class="pi pi-check"></span
            ></Button>
            <Button label="Cancel" severity="danger" class="w-full" @click="addNewAddressHandler"
              ><span class="pi pi-times"></span
            ></Button>
          </div>
        </Form>
      </template>
      <template #footer>
        <Button
          label="Add"
          severity="contrast"
          outlined
          class="w-full"
          v-if="!addNewAddressMode"
          @click="addNewAddressHandler"
          ><span class="pi pi-plus"></span
        ></Button>
      </template>
    </Card>
  </section>
</template>
<style scoped>
.billing-addresses {
  display: flex;
  flex-direction: column;
  gap: 5px 0;
}
.address {
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.064);
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 10px 0;
}

input,
.select-country-input {
  width: 100%;
}
.control-buttons {
  display: flex;
  gap: 0 10px;
}
@media (min-width: 700px) {
  input,
  .select-country-input {
    width: 50%;
  }
}
</style>
