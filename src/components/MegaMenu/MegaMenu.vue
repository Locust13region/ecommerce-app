<template>
  <MegaMenu
    :model="menuItems"
    orientation="horizontal"
    class="custom-megamenu"
    :class="props.classProp"
  />
</template>

<script setup lang="ts">
import { ref, watch, onUpdated } from 'vue'
import MegaMenu from 'primevue/megamenu'
import type { MegaMenuItem } from '@/interfaces/catalogInterfaces'
import router from '@/router'

const props = defineProps<{
  model: MegaMenuItem[]
  classProp?: string
}>()

const menuItems = ref<MegaMenuItem[]>(props.model)

watch(
  () => props.model,
  (newVal) => {
    menuItems.value = newVal
  },
)

onUpdated(async () => {
  // const categories = await fetchCategories()
  // menuItems.value = await transformCategoriesToMegaMenuForNavigation(categories, 'en-US')
  // await console.log()

  const menuListItems = document.querySelectorAll('.p-megamenu-root-list > .p-megamenu-item')

  menuListItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      item.classList.add('p-megamenu-item-active')
    })
    item.addEventListener('mouseleave', () => {
      item.classList.remove('p-megamenu-item-active')
    })
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
</script>
<style>
.p-megamenu {
  border-color: transparent !important;
  border-left: 1px solid var(--color-border);
  padding: 0px;
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
</style>
