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

<style scoped>
.breadcrumb {
  padding: 1rem 0;
  & ul {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  & li {
    &:not(:last-of-type) {
      &:after {
        content: '/';
        margin-left: 0.5rem;
      }
    }
    &:last-of-type {
      & a {
        color: oklch(var(--color-black));
      }
    }
  }
}
</style>
