<template>
  <div class="stretch-demo dialog-demo">
    <p class="dialog-demo__label">{{ text.label }}</p>

    <div class="stretch-demo__controls">
      <fieldset class="position-try-demo__options">
        <legend>{{ text.element }}</legend>
        <label v-for="t in tags" :key="t" class="until-found-faq__sync">
          <input v-model="tag" type="radio" :name="`${uid}-tag`" :value="t" />
          <code>&lt;{{ t }}&gt;</code>
        </label>
      </fieldset>
      <fieldset class="position-try-demo__options">
        <legend>width</legend>
        <label v-for="v in widths" :key="v" class="until-found-faq__sync">
          <input
            v-model="width"
            type="radio"
            :name="`${uid}-width`"
            :value="v"
          />
          <code>{{ v }}</code>
        </label>
      </fieldset>
    </div>

    <label class="position-try-demo__range">
      <span>margin</span>
      <input v-model.number="margin" type="range" min="0" max="40" step="4" />
      <output>{{ margin }}px</output>
    </label>

    <!-- 虛線是容器的邊界；外層留了右側空間並裁切，溢出的部分看得到，但不會讓整頁橫向捲動 -->
    <div class="stretch-demo__stage">
      <div ref="box" class="stretch-demo__box">
        <div
          v-if="tag === 'div'"
          ref="target"
          class="stretch-demo__target"
          :style="targetStyle"
        >
          {{ text.content }}
        </div>
        <button
          v-else-if="tag === 'button'"
          ref="target"
          type="button"
          class="stretch-demo__target"
          :style="targetStyle"
        >
          {{ text.button }}
        </button>
        <input
          v-else
          ref="target"
          type="text"
          class="stretch-demo__target"
          :style="targetStyle"
          :aria-label="text.input"
          :placeholder="text.input"
        />
      </div>
    </div>

    <p
      class="stretch-demo__result"
      :class="overflow > 0 ? 'is-over' : 'is-fit'"
    >
      {{ resultText }}
    </p>

    <p class="focusgroup-demo__mode">{{ modeText }}</p>
    <p class="popover-demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：有 margin 的元素用 width: 100%、calc()、stretch 撐滿容器，比較會不會溢出
// 用法：::stretch-demo
type Tag = "div" | "button" | "input";
type Width = "auto" | "100%" | "calc(100% - 32px)" | "stretch";

const { locale } = useI18n();
const uid = usePopoverDemoId("std");
const box = ref<HTMLElement | null>(null);
const target = ref<HTMLElement | null>(null);

const tags: Tag[] = ["div", "button", "input"];
const widths: Width[] = ["auto", "100%", "calc(100% - 32px)", "stretch"];
const tag = ref<Tag>("div");
const width = ref<Width>("100%");
const margin = ref(16);
const overflow = ref(0);
const gap = ref(0);
const supported = ref<boolean | null>(null);

const messages = {
  "zh-Hant-TW": {
    label:
      "互動範例：元素有左右 margin，換不同的 width 寫法，看會不會撐出容器（虛線）",
    element: "元素",
    content: "這是一個有 margin、邊框和 padding 的區塊",
    button: "送出",
    input: "電子郵件",
    over: (n: number) => `溢出容器 ${n}px`,
    fit: "剛好塞滿容器，沒有溢出",
    short: (n: number) => `沒有溢出，但離容器右邊還空了 ${n}px`,
    native: "你的瀏覽器支援 width: stretch",
    fallback: "你的瀏覽器不支援 width: stretch，選它時會被當成無效，退回 auto",
    detecting: "偵測中（需要 JavaScript）",
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    label:
      "Live demo: the element has left and right margins. Switch the width value and see whether it overflows the container (dashed line)",
    element: "Element",
    content: "A block with margin, a border and padding",
    button: "Submit",
    input: "Email",
    over: (n: number) => `Overflows the container by ${n}px`,
    fit: "Fills the container exactly, no overflow",
    short: (n: number) =>
      `No overflow, but ${n}px short of the container's right edge`,
    native: "Your browser supports width: stretch",
    fallback:
      "Your browser doesn't support width: stretch, so choosing it is treated as invalid and falls back to auto",
    detecting: "Detecting (requires JavaScript)",
    print: "This is an interactive demo. Try it on the web page.",
  },
};

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);

const targetStyle = computed(() => ({
  width: width.value,
  marginInline: `${margin.value}px`,
}));

const resultText = computed(() =>
  overflow.value > 0
    ? text.value.over(overflow.value)
    : gap.value > 1
      ? text.value.short(gap.value)
      : text.value.fit,
);

const modeText = computed(() =>
  supported.value === null
    ? text.value.detecting
    : supported.value
      ? text.value.native
      : text.value.fallback,
);

// 量元素的 margin 外緣和容器內緣的距離：正的是溢出，負的是還有空間
async function measure() {
  await nextTick();
  const el = target.value;
  const container = box.value;
  if (!el || !container) return;
  const cs = getComputedStyle(container);
  const inner =
    container.getBoundingClientRect().right -
    parseFloat(cs.paddingRight) -
    parseFloat(cs.borderRightWidth);
  const outer =
    el.getBoundingClientRect().right +
    parseFloat(getComputedStyle(el).marginRight);
  const diff = Math.round(outer - inner);
  overflow.value = Math.max(0, diff);
  gap.value = Math.max(0, -diff);
}

watch([tag, width, margin], measure);

onMounted(() => {
  supported.value = CSS.supports("width: stretch");
  measure();
  window.addEventListener("resize", measure);
});
onBeforeUnmount(() => window.removeEventListener("resize", measure));
</script>
