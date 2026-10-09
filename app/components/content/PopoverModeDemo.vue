<template>
  <div ref="root" class="popover-demo" :class="`is-${mode}`">
    <p class="popover-demo__label">
      <code>popover="{{ mode }}"</code> {{ text.live }}
    </p>

    <div class="popover-demo__controls">
      <template v-if="mode === 'hint'">
        <button
          v-for="tip in tips"
          :id="tip.btnId"
          :key="tip.id"
          type="button"
          class="popover-demo__trigger"
          :data-tip="tip.id"
          :aria-describedby="tip.id"
          :style="`anchor-name: --${tip.btnId}`"
        >
          {{ tip.label }}
        </button>
      </template>
      <template v-else>
        <button
          v-for="panel in panels"
          :id="panel.btnId"
          :key="panel.id"
          type="button"
          class="popover-demo__trigger"
          :popovertarget="panel.id"
          :style="`anchor-name: --${panel.btnId}`"
        >
          {{ panel.label }}
        </button>
      </template>
    </div>

    <p class="popover-demo__print">{{ text.print }}</p>

    <template v-if="mode === 'hint'">
      <div
        v-for="tip in tips"
        :id="tip.id"
        :key="tip.id"
        popover="hint"
        role="tooltip"
        class="popover-demo__pop is-tip is-above"
        :data-anchor="tip.btnId"
        :style="`position-anchor: --${tip.btnId}`"
      >
        {{ tip.content }}
      </div>
    </template>
    <template v-else>
      <div
        v-for="panel in panels"
        :id="panel.id"
        :key="panel.id"
        :popover.attr="mode"
        class="popover-demo__pop"
        :class="[`is-${mode}`, panel.placement]"
        :data-anchor="panel.btnId"
        :style="`position-anchor: --${panel.btnId}`"
      >
        <span>{{ panel.content }}</span>
        <button
          v-if="mode === 'manual'"
          type="button"
          class="popover-demo__close"
          :popovertarget="panel.id"
          popovertargetaction="hide"
        >
          {{ text.close }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：單一 popover 模式的互動範例
// 用法：::popover-mode-demo{mode="auto"}  （auto / manual / hint）
const props = defineProps<{ mode: "auto" | "manual" | "hint" }>();

const { locale } = useI18n();
const root = ref<HTMLElement | null>(null);
usePopoverDemo(root);

const uid = usePopoverDemoId("pd");

const messages = {
  "zh-Hant-TW": {
    live: "互動範例",
    close: "關閉",
    print: "此處為互動範例，請在網頁上操作。",
    open: (name: string) => `開啟面板 ${name}`,
    content: {
      auto: (name: string) =>
        `我是 auto 面板 ${name}。打開另一個面板，或點外面、按 Esc，我就會關閉。`,
      manual: (name: string) =>
        `我是 manual 面板 ${name}。點外面、按 Esc 都關不掉，要按「關閉」。`,
    },
    tips: [
      { label: "儲存", content: "也可以按 Ctrl+S 儲存" },
      { label: "匯出格式", content: "支援 PDF、PNG、SVG" },
    ],
  },
  en: {
    live: "live demo",
    close: "Close",
    print: "This is an interactive demo. Try it on the web page.",
    open: (name: string) => `Open panel ${name}`,
    content: {
      auto: (name: string) =>
        `I'm auto panel ${name}. Open the other panel, click outside or press Escape and I'll close.`,
      manual: (name: string) =>
        `I'm manual panel ${name}. Clicking outside or pressing Escape won't close me. Use Close.`,
    },
    tips: [
      { label: "Save", content: "You can also press Ctrl+S" },
      { label: "Export formats", content: "PDF, PNG and SVG are supported" },
    ],
  },
} as const;

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);

const panels = computed(() =>
  props.mode === "hint"
    ? []
    : ["A", "B"].map((name, i) => ({
        id: `${uid}-${name.toLowerCase()}`,
        // manual 的 A、B 會同時開著：一上一下才不會互相蓋住關閉按鈕
        placement: i === 1 && props.mode === "manual" ? "is-above" : "is-below",
        btnId: `${uid}-${name.toLowerCase()}-btn`,
        label: text.value.open(name),
        content: text.value.content[props.mode as "auto" | "manual"](name),
      })),
);

const tips = computed(() =>
  text.value.tips.map((tip, i) => ({
    id: `${uid}-tip-${i}`,
    btnId: `${uid}-tip-${i}-btn`,
    label: tip.label,
    content: tip.content,
  })),
);
</script>
