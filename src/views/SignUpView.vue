<script setup lang="ts">
import signUp from '@/components/signUp/SignUpForm.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="about">
    <h1>You are new here? Create your account!</h1>
    <p>
      After creating your account, you'll be able to log in on the
      <RouterLink to="/">login</RouterLink> page.
    </p>

    <signUp />
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
