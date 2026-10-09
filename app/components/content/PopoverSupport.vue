<template>
  <div class="popover-support">
    <p class="popover-support__title">{{ text.title }}</p>
    <ul class="popover-support__list">
      <li v-for="item in items" :key="item.name">
        <code>{{ item.name }}</code>
        <span :class="stateClass(item.ok)">{{ stateText(item.ok) }}</span>
      </li>
    </ul>
    <p v-if="support?.popover && !support.hint" class="popover-support__notice">
      {{ text.hintFallback }}
    </p>
    <p v-if="support && !support.popover" class="popover-support__notice">
      {{ text.noPopover }}
    </p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：偵測讀者瀏覽器的 popover 相關支援度
const { locale } = useI18n();

const messages = {
  "zh-Hant-TW": {
    title: "你的瀏覽器支援度",
    yes: "✓ 支援",
    no: "✕ 不支援",
    pending: "偵測中（需要 JavaScript）",
    hintFallback:
      '你的瀏覽器不認得 popover="hint"，會把它當成 manual：不能點外面關閉，也不會互相關閉。下方範例已補上 Esc 關閉，讓提示仍可關閉。',
    noPopover:
      "你的瀏覽器不支援 Popover API，下方範例無法操作，可以改用新版 Chrome、Edge、Firefox 或 Safari 開啟。",
  },
  en: {
    title: "Your browser's support",
    yes: "✓ Supported",
    no: "✕ Not supported",
    pending: "Detecting (requires JavaScript)",
    hintFallback:
      "Your browser doesn't recognize popover=\"hint\" and treats it as manual: no light dismiss, and hints don't close each other. The demos below add Escape handling so the tooltips can still be dismissed.",
    noPopover:
      "Your browser doesn't support the Popover API, so the demos below won't work. Try a recent version of Chrome, Edge, Firefox or Safari.",
  },
} as const;

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);

const support = ref<PopoverSupport | null>(null);
onMounted(() => {
  support.value = detectPopoverSupport();
});

const items = computed(() => [
  { name: "Popover API", ok: support.value?.popover },
  { name: 'popover="hint"', ok: support.value?.hint },
  { name: "Anchor Positioning", ok: support.value?.anchor },
  { name: "interestfor", ok: support.value?.interest },
]);

const stateText = (ok: boolean | undefined) =>
  ok === undefined ? text.value.pending : ok ? text.value.yes : text.value.no;
const stateClass = (ok: boolean | undefined) =>
  ok === undefined ? "is-pending" : ok ? "is-yes" : "is-no";
</script>
