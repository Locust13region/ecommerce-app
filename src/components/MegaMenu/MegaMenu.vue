<template>
  <MegaMenu
    :model="menuItems"
    orientation="horizontal"
    class="custom-megamenu"
    :class="[{ active: isActive }, props.classProp]"
  />
</template>

<script setup lang="ts">
import { ref, watch, onUpdated, computed, onUnmounted } from 'vue'
import MegaMenu from 'primevue/megamenu'
import type { MegaMenuItem } from '@/interfaces/catalogInterfaces'
import router from '@/router'
import { useRoute } from 'vue-router'

const props = defineProps<{
  model: MegaMenuItem[]
  classProp?: string
}>()

const route = useRoute()

const menuItems = ref<MegaMenuItem[]>(props.model)
const isActive = computed(() => route.path.includes('/catalog'))

watch(
  () => props.model,
  (newVal) => {
    menuItems.value = newVal
  },
)

const setActive = (item: Element) => {
  item.classList.add('p-megamenu-item-active')
}

const clearActive = (item: Element) => {
  item.classList.remove('p-megamenu-item-active')
}

onUpdated(async () => {
  const menuListItems = document.querySelectorAll('.p-megamenu-root-list > .p-megamenu-item')

  menuListItems.forEach((item) => {
    item.addEventListener('mouseenter', () => setActive(item))
    item.addEventListener('mouseleave', () => clearActive(item))
  })

  const subMenus = document.querySelectorAll('.p-megamenu-submenu .p-megamenu-submenu-label')
  subMenus.forEach((item) => {
    const labelContent = item.textContent
    if (labelContent) {
      const link = document.createElement('a')
      link.classList.add('p-megamenu-item-link')
      const href = labelContent?.toLowerCase().split(' ').join('-') || ''
      link.href = `/catalog/${href}`
      link.textContent = labelContent
      item.textContent = ''
      item.append(link)
    }
  })

  const megaMenuLinks = document.querySelectorAll('.p-megamenu-root-list a')

  megaMenuLinks.forEach((item) => {
    item.addEventListener('click', (event) => {
      event.preventDefault()
      router.push((item as HTMLAnchorElement).pathname)
    })
  })
})

onUnmounted(() => {
  const menuListItems = document.querySelectorAll('.p-megamenu-root-list > .p-megamenu-item')

  menuListItems.forEach((item) => {
    item.removeEventListener('mouseenter', () => setActive(item))
    item.removeEventListener('mouseleave', () => clearActive(item))
  })

  const megaMenuLinks = document.querySelectorAll('.p-megamenu-root-list a')

  megaMenuLinks.forEach((item) => {
    item.removeEventListener('click', (event) => {
      event.preventDefault()
      router.push((item as HTMLAnchorElement).pathname)
    })
  })
})
</script>
<style>
nav .header-megamenu.p-megamenu {
  border-color: transparent;
  padding: 0px;
}

.catalog-menu .p-megamenu {
  border-color: transparent;
}

.p-megamenu-submenu .p-megamenu-submenu-label {
  padding: 0px;
}

li.p-megamenu-submenu-label .p-megamenu-item-link:hover {
  color: white;
}

nav .p-megamenu-submenu .p-megamenu-item .p-megamenu-item-link .p-megamenu-item-label {
  margin-left: 10%;
}

nav
  .header-megamenu.p-megamenu:not(.active)
  .p-megamenu-root-list
  > .p-megamenu-item
  > .p-megamenu-item-content
  > .p-megamenu-item-link
  > .p-megamenu-item-label {
  color: var(--marked-text);
}

.p-megamenu.p-megamenu-mobile .p-megamenu-root-list {
  width: auto;
}
</style>
