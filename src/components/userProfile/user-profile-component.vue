<script setup lang="ts">
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import ChangePasswordForm from './changePasswordForm.vue'
import PersonalInfoForm from './personalInfoForm.vue'
import BillingAddresses from './BillingAddresses.vue'
import ShippingAddresses from './ShippingAddresses.vue'
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
        <TabPanel value="billing-address"> <BillingAddresses></BillingAddresses> </TabPanel>
        <TabPanel value="shipping-address"><ShippingAddresses></ShippingAddresses> </TabPanel>
        <TabPanel value="change-password">
          <ChangePasswordForm></ChangePasswordForm>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>
