import { defineStore } from 'pinia'

export const useUserStateStore = defineStore('user', {
  state: () => ({
    isLoggedIn: Boolean(localStorage['commercetools-isLoggedIn']) || false,
  }),
  actions: {
    loginState() {
      this.isLoggedIn = true
      localStorage.setItem('commercetools-isLoggedIn', 'true')
    },
    logoutState() {
      this.isLoggedIn = false
      localStorage.removeItem('commercetools-isLoggedIn')
    },
  },
})
