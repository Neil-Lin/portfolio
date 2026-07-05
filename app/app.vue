<template>
  <div>
    <NuxtPwaAssets />
    <div v-if="loading" class="loading">
      <div class="loading-container">
        <div class="loader"></div>
      </div>
    </div>
    <NuxtLayout name="default" :aria-busy="loading">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();
const loading = ref(false);
nuxtApp.hook("page:start", () => {
  loading.value = true;
});
nuxtApp.hook("page:finish", () => {
  loading.value = false;
});
</script>
