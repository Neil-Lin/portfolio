<template>
  <div class="port-list-blcok">
    <theHeader />
    <akContainer v-if="route.path === '/'" />
    <theWorkList />
    <theFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
</script>
