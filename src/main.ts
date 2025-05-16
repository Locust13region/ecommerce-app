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
      50: '{purple.50}',
      100: '{purple.100}',
      200: '{purple.200}',
      300: '{purple.300}',
      400: '{purple.400}',
      500: '{purple.500}',
      600: '{purple.600}',
      700: '{purple.700}',
      800: '{purple.800}',
      900: '{purple.900}',
      950: '{purple.950}',
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

router.beforeEach(async (to /*, from*/) => {
  //TODO: replace isLogined with state
  const isLogined = localStorage['commercetools-isLogined'] || false
  if (to.name === 'login' && isLogined) {
    return {
      name: 'home',
    }
  }
})

app.use(createPinia())
app.use(router)
app.use(ToastService)
app.mount('#app')
