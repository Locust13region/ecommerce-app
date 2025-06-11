<script setup lang="ts">
import { Button } from 'primevue'
import Divider from 'primevue/divider'
import router from '@/router'
import { useAuth } from '@/composables/useAuth'
import { useUserStateStore } from '@/stores/userState'
import MegaMenu from '@/components/MegaMenu/MegaMenu.vue'
import type { MegaMenuItem } from '@/interfaces/catalogInterfaces'
import { onMounted, ref } from 'vue'
import { transformCategoriesToMegaMenu } from '@/services/Catalog/ParseCategoriesToMegaMenu/parseCategoriesToMegaMenu'
import { useCategoriesStore } from '@/composables/useCategoryStore'

const user = useUserStateStore()
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
})
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">
        <img alt="logo" class="logo" src="@/assets/books.png" width="50" height="50" />
      </RouterLink>
      <Divider class="divider" layout="vertical" />
      <RouterLink to="/about">About Us</RouterLink>
      <Divider class="divider" layout="vertical" />
      <MegaMenu :model="navMenuItems" :class="'header-megamenu'" />
      <Button
        class="button-to-signup"
        severity="secondary"
        label="Sign Up"
        @click="router.push('/signup')"
        v-if="!user.isLoggedIn"
      />
      <Button class="button-to-login" @click="router.push('/login')" v-if="!user.isLoggedIn">
        <template #default>
          <span class="button-label-full pi pi-sign-in"> Login</span>
          <span class="button-label-short pi pi-sign-in" />
        </template>
      </Button>
      <Button
        class="button-to-profile-page"
        icon="pi pi-user"
        severity="secondary"
        label="Profile"
        @click="router.push('/profile')"
        v-if="user.isLoggedIn"
      >
        <template #default>
          <span class="button-label-full pi pi-user"> Profile</span>
          <span class="button-label-short pi pi-user" />
        </template>
      </Button>
      <Button class="button-to-logout" @click="logoutHandler" v-if="user.isLoggedIn">
        <template #default>
          <span class="button-label-full pi pi-sign-out"> Logout</span>
          <span class="button-label-short pi pi-sign-out" />
        </template>
      </Button>
    </nav>
  </header>
</template>

<style scoped>
header {
  line-height: 1.5;
  margin-top: 2rem;
}

nav {
  margin-top: 1rem;
  padding: 1rem 1rem 1rem 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  display: block;
  margin: auto;
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
  height: 100%;
}

.button-label-short {
  display: none;
}

.button-to-signup,
.button-to-profile-page {
  margin-left: auto;
  max-width: 8rem;
}

.button-to-login,
.button-to-logout {
  margin-left: 1rem;
  max-width: 8rem;
}

@media (width < 36rem) {
  nav {
    justify-content: space-between;
    padding: 1rem 0;
  }

  .divider {
    display: none;
  }

  nav a,
  nav .link {
    padding: 0;
  }

  .button-to-signup,
  .button-to-profile-page,
  .button-to-login,
  .button-to-logout {
    margin: 0;
  }

  .button-label-full {
    display: none;
  }

  .button-label-short {
    display: inline;
  }
}
</style>
