<script setup lang="ts">
import Paginator from 'primevue/paginator'
import { ref } from 'vue'

const props = defineProps<{
  totalRecords: number
  rows: number
  currentPage: number
}>()

const currentPage = ref(props.currentPage)
</script>

<template>
  <div class="paginator-container">
    <Paginator
      v-model:page="currentPage"
      :rows="props.rows"
      :totalRecords="props.totalRecords"
      :showFirstLastIcon="true"
      :showPageLinks="true"
      :pageLinkSize="5"
      class="paginator"
    />
  </div>
</template>
