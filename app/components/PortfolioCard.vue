<template>
  <nuxt-link
    v-if="clickable && to"
    :to="to"
    :title="title"
    :target="external ? '_blank' : undefined"
    class="portfolio-link"
  >
    <slot />
  </nuxt-link>
  <div v-else class="portfolio-link portfolio-link--disabled">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  clickable: boolean;
  to?: string | object;
  title?: string;
  external?: boolean;
}>();
</script>
