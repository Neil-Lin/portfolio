<template>
  <nav aria-label="breadcrumbs" class="breadcrumbs">
    <ul>
      <li v-for="(item, index) in list" :key="index">
        <nuxt-link
          v-if="item.link"
          :to="localePath(item.link)"
          :title="item.title"
        >
          {{ item.title }}
        </nuxt-link>
        <span v-else>{{ item.title }}</span>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const props = defineProps({
  list: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.breadcrumbs {
  ul {
    display: block;
    overflow: auto;
    white-space: nowrap;
  }
  li {
    display: inline-block;
    vertical-align: middle;
    margin-right: 1rem;
    text-transform: capitalize;
    &:not(&:last-child) {
      &:after {
        content: "/";
        margin-left: 1rem;
      }
    }
  }
}
</style>
