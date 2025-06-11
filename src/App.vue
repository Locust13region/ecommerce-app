<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderComponent from '@/components/header/HeaderComponent.vue'
import PromoBanner from './components/PromoBanner/PromoBanner.vue'
import FooterComponent from './components/FooterComponent/FooterComponent.vue'
import Toast from 'primevue/toast'
</script>

<template>
  <PromoBanner />
  <HeaderComponent />
  <RouterView />
  <Toast />
  <FooterComponent />
</template>
