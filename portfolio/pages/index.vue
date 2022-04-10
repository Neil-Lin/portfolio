<template>
  <button @click="enableCustomLayout">Update layout</button>
</template>

<script setup>
  const route = useRoute()

  function enableCustomLayout () {
    route.meta.layout = "custom"
  }

  definePageMeta({
    layout: "default",
  });
</script>
