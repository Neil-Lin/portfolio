<template>
  <div class="feature-support">
    <p class="feature-support__title">{{ text.title }}</p>
    <ul class="feature-support__list">
      <li v-for="item in items" :key="item.key">
        <code>{{ item.name }}</code>
        <span :class="stateClass(item.ok)">{{ stateText(item.ok) }}</span>
      </li>
    </ul>
    <p v-if="hasMissing && notice" class="feature-support__notice">
      {{ notice }}
    </p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：偵測讀者瀏覽器是否支援指定特性
// 用法：::feature-support{features="until-found,details-name" notice="不支援時的提醒"}
const props = defineProps<{
  features: string;
  notice?: string;
}>();

const { locale } = useI18n();

const messages = {
  "zh-Hant-TW": {
    title: "你的瀏覽器支援度",
    yes: "✓ 支援",
    no: "✕ 不支援",
    pending: "偵測中（需要 JavaScript）",
  },
  en: {
    title: "Your browser's support",
    yes: "✓ Supported",
    no: "✕ Not supported",
    pending: "Detecting (requires JavaScript)",
  },
} as const;

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);

const keys = computed(() =>
  props.features
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean),
);

const detected = ref<Record<string, boolean> | null>(null);
onMounted(() => {
  detected.value = Object.fromEntries(
    detectFeatures(keys.value).map((item) => [item.key, item.ok]),
  );
});

const items = computed(() =>
  keys.value.map((key) => ({
    key,
    name: featureDetectors[key]?.name ?? key,
    ok: detected.value?.[key],
  })),
);

const hasMissing = computed(() =>
  items.value.some((item) => item.ok === false),
);

const stateText = (ok: boolean | undefined) =>
  ok === undefined ? text.value.pending : ok ? text.value.yes : text.value.no;
const stateClass = (ok: boolean | undefined) =>
  ok === undefined ? "is-pending" : ok ? "is-yes" : "is-no";
</script>
