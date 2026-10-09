<template>
  <div ref="root" class="text-autospace-demo dialog-demo">
    <p class="dialog-demo__label">{{ text.label }}</p>

    <div class="text-autospace-demo__grid">
      <figure
        v-for="cell in cells"
        :key="cell.key"
        class="text-autospace-demo__cell"
        :class="cell.on ? 'is-on' : 'is-off'"
      >
        <figcaption>
          <code>text-autospace: {{ cell.on ? "normal" : "no-autospace" }}</code>
          <span>{{ cell.spaced ? text.spaced : text.unspaced }}</span>
        </figcaption>
        <p lang="zh-Hant" class="text-autospace-demo__sample">
          {{ cell.spaced ? sampleSpaced : sampleUnspaced }}
        </p>
        <!-- 量寬度用：不換行的隱藏複本，畫面上的那段可以自由換行 -->
        <span
          :ref="(el) => setSample(cell.key, el)"
          lang="zh-Hant"
          class="text-autospace-demo__ruler"
          >{{ cell.spaced ? sampleSpaced : sampleUnspaced }}</span
        >
        <p class="text-autospace-demo__width">
          {{ widths[cell.key] ? text.width(widths[cell.key]!) : text.pending }}
        </p>
      </figure>
    </div>

    <p class="text-autospace-demo__hint">{{ text.hint }}</p>
    <p class="popover-demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：text-autospace 開關 × 有沒有手打空白，四格並排比較
// 用法：::text-autospace-compare
type Key = "off-unspaced" | "on-unspaced" | "off-spaced" | "on-spaced";

const { locale } = useI18n();

// 範例文字固定用中文：text-autospace 處理的就是中文與英數之間的間距
const sampleUnspaced = "我用Chrome 141測試text-autospace，間距只有0.125em。";
const sampleSpaced = "我用 Chrome 141 測試 text-autospace，間距只有 0.125em。";

const cells: { key: Key; on: boolean; spaced: boolean }[] = [
  { key: "off-unspaced", on: false, spaced: false },
  { key: "on-unspaced", on: true, spaced: false },
  { key: "off-spaced", on: false, spaced: true },
  { key: "on-spaced", on: true, spaced: true },
];

const messages = {
  "zh-Hant-TW": {
    label: "互動範例：同一句話，左邊關閉、右邊開啟；上排沒打空白、下排有打空白",
    unspaced: "沒打空白",
    spaced: "有手打空白",
    width: (w: string) => `這一行的寬度：${w} px`,
    pending: "寬度測量中（需要 JavaScript）",
    hint: "試試看：選取右上那一格的文字，複製貼到記事本，會發現沒有多出任何空白。",
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    label:
      "Live demo: the same sentence, off on the left and on on the right; the top row has no typed spaces, the bottom row does",
    unspaced: "No typed spaces",
    spaced: "Spaces typed by hand",
    width: (w: string) => `Width of this line: ${w} px`,
    pending: "Measuring width (requires JavaScript)",
    hint: "Try it: select the text in the top-right box, copy it and paste it into a text editor. No extra spaces come along.",
    print: "This is an interactive demo. Try it on the web page.",
  },
};

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);

const samples = new Map<Key, HTMLElement>();
function setSample(key: Key, el: unknown) {
  if (el instanceof HTMLElement) samples.set(key, el);
}

const widths = ref<Partial<Record<Key, string>>>({});

function measure() {
  const next: Partial<Record<Key, string>> = {};
  samples.forEach((el, key) => {
    next[key] = el.getBoundingClientRect().width.toFixed(1);
  });
  widths.value = next;
}

onMounted(async () => {
  // 網頁字型載入後寬度會變，等字型好了再量
  await document.fonts?.ready;
  measure();
  window.addEventListener("resize", measure);
});
onBeforeUnmount(() => window.removeEventListener("resize", measure));
</script>
