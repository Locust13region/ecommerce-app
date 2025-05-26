<script setup lang="ts">
import { Button } from 'primevue'
import router from '@/router'
import { useAuth } from '@/composables/useAuth'
import { useUserStateStore } from '@/stores/userState'
import MegaMenu from '@/components/MegaMenu/MegaMenu.vue'
import type { MegaMenuItem } from '@/interfaces/catalogInterfaces'
import { onMounted, ref } from 'vue'
import { fetchCategories } from '@/services/Catalog/FetchCategories/fetchCategories'
import { transformCategoriesToMegaMenu } from '@/services/Catalog/ParseCategoriesToMegaMenu/parseCategoriesToMegaMenu'
import { useCategoriesStore } from '@/stores/categoryStore.ts'

const user = useUserStateStore()
const { logout } = useAuth()

function logoutHandler() {
  logout()
  router.push('/login')
}

const categoriesStore = useCategoriesStore()

const navMenuItems = ref<MegaMenuItem[]>([])

onMounted(async () => {
  const categories = await fetchCategories()
  navMenuItems.value = transformCategoriesToMegaMenu(categories, 'en-US', false)
  categoriesStore.loadCategories()
})
</script>

<template>
  <header>
    <img alt="logo" class="logo" src="@/assets/books.png" width="50" height="50" />

    <div class="wrapper">
      <nav>
        <RouterLink to="/" class="pi pi-home"> Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <!-- <RouterLink to="/catalog">Catalog</RouterLink> -->
        <MegaMenu :model="navMenuItems" :class="'header'" />
      </nav>
      <div class="auth">
        <Button
          class="button-to-signup"
          severity="secondary"
          @click="router.push('/signup')"
          v-if="!user.isLoggedIn"
        >
          Sign Up
        </Button>
        <Button class="button-to-login" @click="router.push('/login')" v-if="!user.isLoggedIn">
          <span class="pi pi-sign-in"></span>
          Login
        </Button>
        <Button class="button-to-logout" @click="logoutHandler" v-if="user.isLoggedIn">
          <span class="pi pi-sign-out"></span>
          Logout
        </Button>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

header .wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 50%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.auth {
  display: flex;
  /* min-width: 170px; */
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    margin-top: 1rem;
    max-height: max-content;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    flex-wrap: wrap;
    width: 80%;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 0;
  }

  .auth {
    justify-content: space-between;
    align-items: center;
    /* width: 20%; */
    width: 35%;
  }
}
</style>
