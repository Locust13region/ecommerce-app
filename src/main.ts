import 'primeicons/primeicons.css'
import './assets/base.css'
import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Material from '@primeuix/themes/material'
import App from './App.vue'
import router from './router'
import { definePreset } from '@primeuix/themes'
import ToastService from 'primevue/toastservice'

const app = createApp(App)
const MainPreset = definePreset(Material, {
  semantic: {
    primary: {
      50: '{indigo.50}',
      100: '{indigo.100}',
      200: '{indigo.200}',
      300: '{indigo.300}',
      400: '{indigo.400}',
      500: '{indigo.500}',
      600: '{indigo.600}',
      700: '{indigo.700}',
      800: '{indigo.800}',
      900: '{indigo.900}',
      950: '{indigo.950}',
    },
  },
})

app.use(PrimeVue, {
  theme: {
    preset: MainPreset,
    options: {
      prefix: 'p',
    },
  },
})
app.use(createPinia())
app.use(router)
app.use(ToastService)
app.mount('#app')
