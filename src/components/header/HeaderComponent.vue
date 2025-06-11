<script setup lang="ts">
import { Button } from 'primevue'
import router from '@/router'
import { useAuth } from '@/composables/useAuth'
import { useUserStateStore } from '@/stores/userState'
import MegaMenu from '@/components/MegaMenu/MegaMenu.vue'
import type { MegaMenuItem } from '@/interfaces/catalogInterfaces'
import { onMounted, ref } from 'vue'
import { transformCategoriesToMegaMenu } from '@/services/Catalog/ParseCategoriesToMegaMenu/parseCategoriesToMegaMenu'
import { useCategoriesStore } from '@/composables/useCategoryStore'
import { useBagStateStore } from '@/stores/bagStates'
import { useShoppingBag } from '@/composables/useShoppingBag'

const user = useUserStateStore()
const bag = useBagStateStore()
const { getBag, getItemsList } = useShoppingBag()
const { logout } = useAuth()

function logoutHandler() {
  logout()
  router.push('/login')
}

const categoriesStore = useCategoriesStore()

const navMenuItems = ref<MegaMenuItem[]>([])

onMounted(async () => {
  await categoriesStore.loadCategories()
  navMenuItems.value = transformCategoriesToMegaMenu(categoriesStore.categories, 'en-US', false)
  await getBag()
  const itemsInBag = await getItemsList()
  if (itemsInBag.length !== 0) {
    bag.setItems(itemsInBag)
  }
})
</script>

<template>
  <header>
    <img alt="logo" class="logo" src="@/assets/books.png" width="50" height="50" />

    <div class="wrapper">
      <nav>
        <RouterLink to="/"> <span class="pi pi-home"></span> Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <MegaMenu :model="navMenuItems" :class="'header-megamenu'" />
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
        <Button
          class="button-to-bag"
          @click="router.push('/bag')"
          v-if="user.isLoggedIn"
          :badge="bag.items.length.toString()"
          badgeSeverity="contrast"
          variant="outlined"
          icon="pi pi-shopping-bag"
        >
        </Button>
        <Button class="button-to-login" @click="router.push('/login')" v-if="!user.isLoggedIn">
          <span class="pi pi-sign-in"></span>
          Login
        </Button>
        <Button
          class="button-to-profile-page"
          severity="secondary"
          @click="router.push('/profile')"
          v-if="user.isLoggedIn"
          icon="pi pi-user"
        >
        </Button>
        <Button
          class="button-to-logout"
          @click="logoutHandler"
          v-if="user.isLoggedIn"
          icon="pi pi-sign-out"
        >
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

nav a,
nav .link {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-left: 1px solid var(--color-border);
  height: 100%;
}

nav a:first-of-type {
  border: 0;
}

.auth {
  display: flex;
  flex-wrap: wrap;
  min-width: 170px;
  gap: 10px;
  justify-content: center;
}

.button-to-signup,
.button-to-login {
  width: 45%;
  min-width: 100px;
}
.button-to-bag,
.button-to-profile-page,
.button-to-logout {
  height: 43px;
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
    flex-wrap: nowrap;
  }
}
</style>
