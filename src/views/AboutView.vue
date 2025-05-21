<script setup lang="ts">
import Button from 'primevue/button'
import { useToast } from 'primevue'

import { useRouter } from 'vue-router'

const router = useRouter()

const toast = useToast()
const goToMain = async () => {
  await toast.add({
    severity: 'info',
    summary: 'Info',
    detail: 'Redirecting to main page...',
    life: 3000,
  })
  await router.push({ path: '/' })
}
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <Button
      variant="outlined"
      size="small"
      severity="info"
      label="Go to main page"
      @click="goToMain"
    />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
}
</style>
