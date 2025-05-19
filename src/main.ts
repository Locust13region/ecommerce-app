import 'primeicons/primeicons.css'
import './assets/base.css'
import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { MainPreset } from './services/theme/preset'
import App from './App.vue'
import router from './router'
import ToastService from 'primevue/toastservice'
import { useUserStateStore } from '@/stores/userState'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
export const user = useUserStateStore()

router.beforeEach(async (to /*, from*/) => {
  //TODO: replace isLogined with state
  const isLoggedIn = Boolean(localStorage['commercetools-isLogined']) || false
  if ((to.name === 'login' || to.name === 'signup') && isLoggedIn) {
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
