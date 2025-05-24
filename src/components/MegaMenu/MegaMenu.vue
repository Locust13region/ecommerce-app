<template>
  <MegaMenu :model="menuItems" orientation="horizontal" class="custom-megamenu" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MegaMenu from 'primevue/megamenu'
import type { MegaMenuItem } from '@/interfaces/catalogInterfaces'
import { fetchCategories } from '@/services/Catalog/GetCategories/fetchCategories'
import { transformCategoriesToMegaMenu } from '@/services/Catalog/ParseCategoriesToMegaMenu/parseCategoriesToMegaMenu'

const menuItems = ref<MegaMenuItem[]>([])

onMounted(async () => {
  const categories = await fetchCategories()
  menuItems.value = await transformCategoriesToMegaMenu(categories, 'en-US')
  await console.log()

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
    const link = document.createElement('a')
    link.classList.add('p-megamenu-item-link')
    link.href = labelContent?.toLowerCase().split(' ').join('-') || ''
    link.textContent = labelContent
    item.textContent = ''
    item.append(link)
  })
})
</script>
<style scoped>
.p-megamenu {
  border-color: transparent;
  border-left: 1px solid var(--color-border);
  padding: 0px;
}
</style>
