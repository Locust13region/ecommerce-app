<script setup lang="ts">
import SignUpForm from '@/components/signUp/SignUpForm.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="about">
    <h1>You are new here? Create your account!</h1>
    <p>After creating your account, you'll be logged into the store.</p>
    <p>Already have an account? <RouterLink to="/login">Login</RouterLink></p>

    <SignUpForm />
  </div>
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
