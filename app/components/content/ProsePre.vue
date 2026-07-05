<template>
  <pre
    :class="$props.class"
    tabindex="0"
    role="region"
    :aria-label="ariaLabel"
  ><slot /></pre>
</template>

<script setup>
// 覆寫 MDC 預設 ProsePre：讓可水平捲動的程式碼區塊能被鍵盤 focus 捲動
// （WCAG 2.1.1 / axe scrollable-region-focusable），並提供可存取名稱。
const props = defineProps({
  code: { type: String, default: "" },
  language: { type: String, default: null },
  filename: { type: String, default: null },
  highlights: { type: Array, default: () => [] },
  meta: { type: String, default: null },
  class: { type: String, default: null },
});

const { locale } = useI18n();
const ariaLabel = computed(() => {
  const base = locale.value === "en" ? "Code block" : "程式碼區塊";
  return props.language ? `${base}: ${props.language}` : base;
});
</script>

<style>
pre code .line {
  display: block;
}
</style>
