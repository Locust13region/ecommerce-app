<script setup lang="ts">
// import signUp from '@/components/signUp/signUp-component.vue'
import { RouterLink } from 'vue-router'
import loginComponent from '@/components/login/login-component.vue'
</script>

<template>
  <div class="login">
    <h1>Login to your account</h1>
    <p>
      Have not an account yet? You can create it on
      <RouterLink to="/signup">registration</RouterLink> page.
    </p>
    <loginComponent></loginComponent>
  </div>
</template>

<style>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  align-self: flex-start;
}
@media (min-width: 1024px) {
  .login {
    padding-top: 100px;
  }
}
</style>
