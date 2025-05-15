import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Material from '@primeuix/themes/material'

import App from './App.vue'
import router from './router'
import { createAnonymousClient } from './api/api-root'

createAnonymousClient()

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Material,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false,
    },
  },
})
app.use(createPinia())
app.use(router)

app.mount('#app')
