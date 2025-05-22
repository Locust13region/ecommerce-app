<script setup lang="ts">
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import { useAuth } from '@/composables/useAuth'
import { ref } from 'vue'

const userData = ref({
  firstName: '',
  lastName: '',
  birthDate: '',
})
const addresses = ref('')
const { getApiRoot } = useAuth()
getApiRoot()
  .me()
  .get()
  .execute()
  .then((res) => {
    console.log(res.body)
    const response = res.body
    userData.value.firstName = response.firstName
    userData.value.lastName = response.lastName
    userData.value.birthDate = response.dateOfBirth
    addresses.value = response.addresses
    console.log(addresses.value.length)
  })
</script>

<template>
  <div class="card">
    <Tabs value="personal" scrollable>
      <TabList>
        <Tab value="personal">Personal Information</Tab>
        <Tab value="billing-address">Billing Address</Tab>
        <Tab value="shipping-address">Shipping Address</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="personal" class="personal">
          <div class="name">
            <p>Name:</p>
            <p>{{ userData.firstName }}</p>
          </div>
          <div class="surname">
            <p>Surname:</p>
            <p>{{ userData.lastName }}</p>
          </div>
          <div class="birthDate">
            <p>Date of birth:</p>
            <p>{{ userData.birthDate }}</p>
          </div>
        </TabPanel>
        <TabPanel value="billing-address">
          <p class="m-0">Sed ut</p>
        </TabPanel>
        <TabPanel value="shipping-address">
          <p class="m-0">At</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>
<style scoped>
.name,
.surname,
.birthDate {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 20%;
  min-width: 200px;
}
</style>
