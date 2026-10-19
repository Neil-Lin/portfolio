<template>
  <NuxtLayout name="default">
    <main class="page">
      <AkContainer />
      <h1>{{ t("error.title") }}</h1>
      <p>{{ t("error.errorCode") }}：{{ status }}</p>
      <div v-if="status === 404">
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

<script setup lang="ts">
import type { NuxtError } from "#app";

const { t } = useI18n();
const localePath = useLocalePath();

const props = defineProps<{
  error: NuxtError;
}>();

// Nuxt 5 改用 status／statusText；statusCode 保留給舊的錯誤物件
const status = computed(() => props.error.status ?? props.error.statusCode ?? 500);

useSeoMeta({
  robots: () =>
    status.value >= 400
      ? "noindex, follow"
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
});

onBeforeUnmount(() => {
  // 依目前語系導回對應首頁（英文頁錯誤不再被導回中文首頁）
  clearError({ redirect: localePath("/") });
});
</script>
