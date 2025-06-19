import 'primeicons/primeicons.css'
import './assets/base.css'
import './assets/main.css'
import { createApp } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { MainPreset } from './services/theme/preset'
import App from './App.vue'
import router from './router'
import ToastService from 'primevue/toastservice'
import { initializeClient } from './api/api-root'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
setActivePinia(pinia)
initializeClient()

router.beforeEach(async (to /*, from*/) => {
  const isLoggedIn = Boolean(localStorage['commercetools-isLoggedIn']) || false
  if ((to.name === 'login' || to.name === 'signup') && isLoggedIn) {
    return {
      name: 'home',
    }
  }
  if ((to.name === 'profile' || to.name === 'bag') && !isLoggedIn) {
    return {
      name: 'home',
    }
  }
})

app.use(PrimeVue, {
  theme: {
    preset: MainPreset,
    options: {
      prefix: 'p',
    },
  },
})

app.use(router)
app.use(ToastService)
app.mount('#app')
