<template>
  <nav aria-label="breadcrumb" class="breadcrumb">
    <ul>
      <li>
        <nuxt-link :to="localePath('/')">{{ $t('name.home') }}</nuxt-link>
      </li>
      <li>
        <nuxt-link :to="localePath(pageLink)">{{ pageTitle }}</nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
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
