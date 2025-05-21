<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderComponent from '@/components/header/Header-component.vue'
import Toast from 'primevue/toast'
</script>

<template>
  <HeaderComponent />
  <RouterView />
  <Toast />
</template>
