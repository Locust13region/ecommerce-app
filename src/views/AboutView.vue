<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { ref } from 'vue'
import Button from 'primevue/button'

const { login, logout, getApiRoot, isAuthenticated } = useAuth()

const email = ref('a-g@proton.com')
const password = ref('1qaz2wsx')

const tryLogin = async () => {
  await login(email.value, password.value)
  console.log('isAuthenticated?', isAuthenticated())
}

const getUserInfo = async () => {
  const apiRoot = getApiRoot()
  if (apiRoot) {
    try {
      const response = await apiRoot.me().get().execute()
      console.log('User Info:', response.body)
    } catch (error) {
      console.error('Failed to get user info:', error)
    }
  } else {
    console.warn('apiRoot is not available')
  }
}
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
  <Button variant="outlined" size="small" severity="success" label="User login" @click="tryLogin" />
  <Button
    variant="outlined"
    size="small"
    severity="info"
    label="Get User Info"
    @click="getUserInfo"
  />
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
