<template>
  <nav aria-label="breadcrumb" class="breadcrumb">
    <ul>
      <li>
        <nuxt-link to="/">首頁</nuxt-link>
      </li>
      <li>
        <nuxt-link :to="pageLink">{{ pageTitle }}</nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps({
  pageTitle: {
    type: String,
    required: true
  },
  pageLink: {
    type: String,
    required: true
  }
})
</script>
