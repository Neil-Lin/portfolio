<template>
  <div class="port-list-blcok">
    <TheHeader />
    <nuxt-link
      id="ak-container"
      to="#ak-container"
      title="中央內容區塊"
      accesskey="C"
      name="ak-container"
      v-if="route.path === '/'"
    >
      :::
    </nuxt-link>
    <theWorkList />
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
</script>
