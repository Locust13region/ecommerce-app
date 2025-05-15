<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import Button from 'primevue/button'

const { login, logout, isAuthenticated } = useAuth()

const email = 'a-g@proton.com'
const password = '1qaz2wsx'

const tryLogin = async () => {
  await login(email, password)
  console.log('isAuthenticated?', isAuthenticated())
}
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
  <Button variant="outlined" size="small" severity="success" label="User login" @click="tryLogin" />
  <!-- <Button variant="outlined" size="small" severity="info" label="Get User Info" @click="getUserInfo" /> -->
  <Button variant="outlined" size="small" severity="danger" label="User Logout" @click="logout" />
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
}
</style>
