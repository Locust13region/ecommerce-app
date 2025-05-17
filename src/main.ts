import 'primeicons/primeicons.css'
import './assets/base.css'
import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { MainPreset } from './composables/preset'
import App from './App.vue'
import router from './router'
import ToastService from 'primevue/toastservice'

const app = createApp(App)

router.beforeEach(async (to /*, from*/) => {
  //TODO: replace isLogined with state
  const isLogined = Boolean(localStorage['commercetools-isLogined']) || false
  if ((to.name === 'login' || to.name === 'signup') && isLogined) {
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

app.use(createPinia())
app.use(router)
app.use(ToastService)
app.mount('#app')

app.use(ToastService)
