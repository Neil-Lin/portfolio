<template>
  <div class="sizes-auto-demo demo">
    <p class="demo__label">{{ text.label }}</p>

    <fieldset class="demo__options">
      <legend>sizes</legend>
      <label v-for="m in modes" :key="m" class="demo__option">
        <input v-model="mode" type="radio" :name="`${uid}-mode`" :value="m" />
        <code>{{ modeLabel(m) }}</code>
      </label>
    </fieldset>
    <label class="demo__option">
      <input v-model="eager" type="checkbox" />
      <span>{{ text.eager }}</span>
    </label>

    <label class="demo__range">
      <span>{{ text.width }}</span>
      <input
        v-model.number="width"
        type="range"
        min="150"
        max="700"
        step="10"
      />
      <output>{{ width }}px</output>
    </label>

    <div class="sizes-auto-demo__stage">
      <img
        :key="renderKey"
        ref="img"
        :loading="eager ? undefined : 'lazy'"
        :sizes="sizesAttr"
        :srcset="srcset"
        :src="withKey(SRC)"
        v-bind="imageSize(SRC)"
        :style="{ inlineSize: `${width}px` }"
        :alt="text.alt"
        @load="measure"
      />
    </div>

    <dl class="attr-demo__readout sizes-auto-demo__readout">
      <div>
        <dt>{{ text.need }}</dt>
        <dd>{{ shown }} × {{ dpr }} = {{ Math.round(shown * dpr) }}px</dd>
      </div>
      <div>
        <dt>{{ text.picked }}</dt>
        <dd>{{ picked ?? "—" }}</dd>
      </div>
      <div>
        <dt>{{ text.bytes }}</dt>
        <dd>{{ bytes === null ? "—" : `${bytes} KB` }}</dd>
      </div>
    </dl>

    <p class="sizes-auto-demo__candidates">
      {{ text.candidates }}<code>480w</code>、<code>960w</code>、<code
        >1280w</code
      >
    </p>
    <p class="demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：同一張圖有 480／960／1280 三個寬度，比較不寫 sizes 和 sizes="auto" 時瀏覽器挑哪一個
// 用法：::sizes-auto-demo
// 每次改設定都換一個查詢字串重新載入，避免瀏覽器直接沿用快取裡比較大的那張
type Mode = "none" | "auto";

const SRC = "/images/youth-taipei-thumbnail.webp";

const uid = useDemoId("sad2");
const img = ref<HTMLImageElement | null>(null);
const modes: Mode[] = ["none", "auto"];
const mode = ref<Mode>("none");
const eager = ref(false);
const width = ref(300);
const dpr = ref(1);
// 圖片實際排版出來的寬度（手機上可能比滑桿的值窄）
const shown = ref(300);
const picked = ref<string | null>(null);
const bytes = ref<number | null>(null);
const renderKey = ref(0);

const messages = {
  "zh-Hant-TW": {
    label:
      "互動範例：同一張圖準備了三個寬度，調整圖片寬度，看瀏覽器挑哪一個檔案",
    none: "不寫 sizes（等於 100vw）",
    eager: '拿掉 loading="lazy"（模擬首屏的圖）',
    width: "圖片在畫面上的寬度",
    alt: "臺北市青年局網站的首頁截圖",
    need: "需要的像素（寬度 × 螢幕倍率）",
    picked: "瀏覽器挑的檔案",
    bytes: "檔案大小",
    candidates: "可以挑的寬度：",
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    label:
      "Live demo: the same image in three widths. Change the image width and see which file the browser picks",
    none: "No sizes (same as 100vw)",
    eager: 'Remove loading="lazy" (simulating an above-the-fold image)',
    width: "Image width on screen",
    alt: "Screenshot of the Taipei City Youth Department home page",
    need: "Pixels needed (width × device pixel ratio)",
    picked: "File the browser picked",
    bytes: "File size",
    candidates: "Available widths: ",
    print: "This is an interactive demo. Try it on the web page.",
  },
};

const text = useDemoText(messages);

function modeLabel(m: Mode) {
  return m === "auto" ? 'sizes="auto"' : text.value.none;
}

const sizesAttr = computed(() => (mode.value === "auto" ? "auto" : undefined));

function withKey(url: string) {
  return `${url}?demo=${renderKey.value}`;
}

const srcset = computed(() =>
  (imageSrcset(SRC) ?? "")
    .split(", ")
    .map((entry) => {
      const [url, w] = entry.split(" ");
      return `${withKey(url!)} ${w}`;
    })
    .join(", "),
);

function measure() {
  const el = img.value;
  if (!el?.currentSrc) return;
  shown.value = Math.round(el.getBoundingClientRect().width);
  const url = new URL(el.currentSrc);
  picked.value = url.pathname.split("/").pop() ?? null;
  const entry = performance.getEntriesByName(el.currentSrc).at(-1) as
    PerformanceResourceTiming | undefined;
  bytes.value = entry?.encodedBodySize
    ? Math.round(entry.encodedBodySize / 102.4) / 10
    : null;
}

// 改設定後重新建立圖片，讓瀏覽器重新挑一次
let timer: ReturnType<typeof setTimeout> | undefined;
watch([mode, eager, width], () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    picked.value = null;
    bytes.value = null;
    renderKey.value++;
  }, 250);
});

onMounted(() => {
  dpr.value = Math.round(window.devicePixelRatio * 100) / 100;
  measure();
});
onBeforeUnmount(() => clearTimeout(timer));
</script>
