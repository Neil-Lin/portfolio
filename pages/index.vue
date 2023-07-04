<template>
  <main class="page page--index">
    <div class="page-aside">
      <theAside />
    </div>
    <h2 class="visually-hidden">{{ pageTitle }}</h2>
  </main>
</template>

<script setup lang="ts">
const { t } = useI18n()
const pageTitle = ref(t('name.home'))

useHead({
  title: pageTitle,
})
</script>
