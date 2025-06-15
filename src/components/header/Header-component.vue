<script setup lang="ts">
import { Button, OverlayBadge } from 'primevue'
import Divider from 'primevue/divider'
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
    <nav>
      <RouterLink to="/">
        <img alt="logo" class="logo" src="@/assets/books.png" width="50" height="50" />
      </RouterLink>
      <Divider class="divider" layout="vertical" />
      <RouterLink to="/about">Team</RouterLink>
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
        variant="outlined"
        class="button-to-bag"
        @click="router.push('/bag')"
        v-if="user.isLoggedIn"
      >
        <template #default>
          <OverlayBadge :value="bag.items.length.toString()" severity="contrast">
            <i class="pi pi-shopping-bag" style="font-size: 1rem" />
          </OverlayBadge>
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

.button-to-bag,
.button-to-profile-page,
.button-to-logout {
  height: 43px;
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
  .button-to-bag,
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
