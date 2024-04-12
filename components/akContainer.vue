<template>
  <a
    ref="focusableLink"
    id="ak-container"
    href="#ak-container"
    :title="$t('shortcut.mainContent')"
    accesskey="C"
  >
    :::
  </a>
</template>

<script setup lang="ts">
const focusableLink = ref<HTMLAnchorElement | null>(null);

onMounted(() => {
  if (focusableLink.value) {
    focusableLink.value.focus();
  }
});
</script>
