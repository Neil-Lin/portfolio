<template>
  <NuxtLayout name="default" aria-live="polite" :aria-busy="loading">
    <main class="page">
      <akContainer />
      <h2>{{ t("error.title") }}</h2>
      <p>{{ t("error.errorCode") }}：{{ error.statusCode }}</p>
      <div v-if="error.statusCode === 404">
        <p>
          {{ t("error.notFound") }}
        </p>
      </div>
      <div v-else>
        <p>{{ error.message }}</p>
      </div>
    </main>
  </NuxtLayout>
</template>

<script setup>
const { t } = useI18n();
defineProps({
  error: Object,
});

onBeforeUnmount(() => {
  clearError({ redirect: "/" });
});
</script>
