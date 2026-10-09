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
// 文章頁會 provide 一個計數器，依出現順序替程式碼區塊編號：
// role="region" 是地標，同一頁多個「程式碼區塊: css」會分不出來（axe landmark-unique）
const counter = inject("codeBlockCounter", null);
const index = counter ? ++counter.n : null;
const ariaLabel = computed(() => {
  const base = locale.value === "en" ? "Code block" : "程式碼區塊";
  const numbered = index ? `${base} ${index}` : base;
  return props.language ? `${numbered}: ${props.language}` : numbered;
});
</script>

<style>
pre code .line {
  display: block;
}
</style>
