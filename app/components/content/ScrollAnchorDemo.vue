<template>
  <div ref="root" class="scroll-anchor-demo dialog-demo">
    <p class="dialog-demo__label">{{ text.label }}</p>

    <div class="scroll-anchor-demo__options">
      <label class="until-found-faq__sync">
        <input v-model="anchorOff" type="checkbox" />
        <span><code>overflow-anchor: none</code>{{ text.off }}</span>
      </label>
      <label class="until-found-faq__sync">
        <input v-model="reserve" type="checkbox" />
        <span>{{ text.reserve }}</span>
      </label>
    </div>

    <div class="dialog-demo__controls">
      <button type="button" class="dialog-demo__close" @click="scrollToTarget">
        {{ text.toTarget }}
      </button>
      <button type="button" class="dialog-demo__close" @click="scrollToTop">
        {{ text.toTop }}
      </button>
      <button
        type="button"
        class="dialog-demo__trigger"
        :disabled="loading"
        @click="load"
      >
        {{ loading ? text.loading : text.load }}
      </button>
      <button type="button" class="dialog-demo__close" @click="reset">
        {{ text.reset }}
      </button>
    </div>

    <!-- 可捲動的區塊要能用鍵盤聚焦、要有名稱（WCAG 2.1.1、axe scrollable-region-focusable） -->
    <div
      ref="box"
      class="scroll-anchor-demo__box"
      :class="{ 'is-off': anchorOff }"
      role="region"
      :aria-label="text.boxName"
      tabindex="0"
    >
      <div
        class="scroll-anchor-demo__slot"
        :class="{ 'is-reserved': reserve && !loaded }"
      >
        <p v-if="loaded" class="scroll-anchor-demo__banner">
          {{ text.banner }}
        </p>
      </div>
      <p
        v-for="n in 12"
        :key="n"
        :ref="(el) => n === TARGET && setTarget(el)"
        class="scroll-anchor-demo__para"
        :class="{ 'is-target': n === TARGET }"
      >
        {{ text.para(n) }}
      </p>
    </div>

    <p class="scroll-anchor-demo__readout">{{ readout }}</p>
    <p class="popover-demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：上方內容晚到時，捲動錨定會不會讓你正在讀的段落留在原位
// 用法：::scroll-anchor-demo
const TARGET = 5;
const DELAY = 1500;

const { locale } = useI18n();
const root = ref<HTMLElement | null>(null);
const box = ref<HTMLElement | null>(null);
let target: HTMLElement | null = null;
const setTarget = (el: unknown) => {
  if (el instanceof HTMLElement) target = el;
};

const anchorOff = ref(false);
const reserve = ref(false);
const loading = ref(false);
const loaded = ref(false);
const moved = ref<number | null>(null);
let timer: ReturnType<typeof setTimeout> | undefined;

const messages = {
  "zh-Hant-TW": {
    label:
      "互動範例：先「捲到第 5 段」，再按「模擬慢慢載入」，看紫色那段會不會被推走",
    off: "（關掉捲動錨定）",
    reserve: "先幫晚到的內容預留空間（骨架畫面）",
    toTarget: "捲到第 5 段",
    toTop: "捲回最上面",
    load: "模擬慢慢載入（1.5 秒後出現）",
    loading: "載入中…",
    reset: "重設",
    boxName: "示範文章",
    banner: "晚到的內容：想像這是一張沒設尺寸的圖片或一則廣告",
    para: (n: number) =>
      n === TARGET
        ? `第 ${n} 段：你正在讀這一段。`
        : `第 ${n} 段：這是一段示範文字，假裝你正在讀一篇長文章。`,
    idle: "還沒載入。",
    result: (px: number) =>
      px === 0
        ? "載入完成：第 5 段留在原位，沒有移動。"
        : `載入完成：第 5 段被往下推了 ${px} px。`,
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    label:
      'Live demo: first "Scroll to paragraph 5", then press "Simulate slow loading" and watch whether the purple paragraph gets pushed away',
    off: " (turn scroll anchoring off)",
    reserve: "Reserve space for the late content first (a skeleton)",
    toTarget: "Scroll to paragraph 5",
    toTop: "Scroll back to the top",
    load: "Simulate slow loading (appears after 1.5s)",
    loading: "Loading…",
    reset: "Reset",
    boxName: "Sample article",
    banner: "Late content: imagine an image with no size set, or an ad",
    para: (n: number) =>
      n === TARGET
        ? `Paragraph ${n}: this is the one you're reading.`
        : `Paragraph ${n}: sample text, pretending you're reading a long article.`,
    idle: "Nothing loaded yet.",
    result: (px: number) =>
      px === 0
        ? "Loaded: paragraph 5 stayed where it was."
        : `Loaded: paragraph 5 was pushed down by ${px} px.`,
    print: "This is an interactive demo. Try it on the web page.",
  },
};

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);

const readout = computed(() =>
  moved.value === null ? text.value.idle : text.value.result(moved.value),
);

const nextFrame = () =>
  new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );

// 第 5 段相對於捲動區塊頂端的位置
const targetTop = () =>
  target && box.value
    ? target.getBoundingClientRect().top - box.value.getBoundingClientRect().top
    : 0;

function scrollToTarget() {
  if (!target || !box.value) return;
  box.value.scrollTop += targetTop() - 16;
}

function scrollToTop() {
  if (box.value) box.value.scrollTop = 0;
}

function load() {
  if (loading.value || loaded.value) return;
  loading.value = true;
  moved.value = null;
  timer = setTimeout(async () => {
    const before = targetTop();
    loaded.value = true;
    loading.value = false;
    await nextFrame();
    moved.value = Math.round(targetTop() - before);
    if (root.value) announce(root.value, readout.value);
  }, DELAY);
}

function reset() {
  clearTimeout(timer);
  loading.value = false;
  loaded.value = false;
  moved.value = null;
  scrollToTop();
}

onMounted(() => {
  if (root.value) prepareAnnouncer(root.value);
});
onBeforeUnmount(() => clearTimeout(timer));
</script>
