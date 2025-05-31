<script setup lang="ts">
import DatePicker from 'primevue/datepicker'
import { Button, InputText, Message } from 'primevue'
import { personalDataValidator } from '@/services/PersonalDataValidator/PersonalDataValidator'
import { Form, FormField, type FormSubmitEvent } from '@primevue/forms'
import { useToast } from 'primevue/usetoast'
import type { ClientResponse, Customer, MyCustomerUpdateAction } from '@commercetools/platform-sdk'
import { saveChanges } from '@/services/saveChanges/saveChanges'
import { reactive, ref } from 'vue'
import { getCustomer } from '@/services/saveChanges/getCustomer'

const toast = useToast()
const flagEditMode = ref(false)
const userData = reactive({
  firstName: '',
  lastName: '',
  dateOfBirth: null as Date | null,
  email: '',
})

function getCustomerData(response: ClientResponse) {
  const customerData: Customer = response.body
  userData.firstName = customerData.firstName || ''
  userData.lastName = customerData.lastName || ''
  userData.dateOfBirth = customerData.dateOfBirth ? new Date(customerData.dateOfBirth) : null
  userData.email = customerData.email || ''
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

function switchToEditMode() {
  flagEditMode.value = true
}

function switchToReadMode() {
  flagEditMode.value = false
}

getCustomer(getCustomerData).catch((error) => {
  if (error instanceof Error) {
    toast.add({ severity: 'error', summary: `${error.message}`, life: 5000 })
  }
})
</script>
<template>
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
      <p v-if="!flagEditMode">
        {{
          `${userData.dateOfBirth?.getFullYear()}-${(Number(userData.dateOfBirth?.getMonth()) + 1)?.toString().padStart(2, '0')}-${userData.dateOfBirth?.getDate()?.toString().padStart(2, '0')}`
        }}
      </p>
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
          >{{ userData.dateOfBirth }}</DatePicker
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
      severity="contrast"
      @click="switchToEditMode"
      raised
    >
      <span class="pi pi-pencil"></span>
      Edit</Button
    >
    <div class="control-buttons">
      <Button
        v-if="flagEditMode"
        severity="danger"
        @click="switchToReadMode"
        class="cancel-button"
        raised
        ><span class="pi pi-times"></span> Cancel</Button
      >
      <Button v-if="flagEditMode" severity="success" class="save-button" type="submit" raised
        ><span class="pi pi-check"></span> Save</Button
      >
    </div>
  </Form>
</template>
<style lang="css" scoped>
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
input,
.input-date-of-birth {
  width: 100%;
}
.edit-button,
.save-button,
.cancel-button {
  min-width: 180px;
}
.control-buttons {
  display: flex;
  gap: 0 10px;
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
