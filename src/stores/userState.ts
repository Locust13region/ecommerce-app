// import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStateStore = defineStore('user', {
  state: () => ({
    isLoggedIn: Boolean(localStorage['commercetools-isLoggedIn']) || false,
  }),
  actions: {
    loginState() {
      this.isLoggedIn = true
    },
    logoutState() {
      this.isLoggedIn = false
    },
  },
})
