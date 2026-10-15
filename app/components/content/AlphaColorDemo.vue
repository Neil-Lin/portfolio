<template>
  <div class="alpha-demo dialog-demo">
    <p class="dialog-demo__label">{{ text.label }}</p>

    <fieldset class="position-try-demo__options alpha-demo__formats">
      <legend>{{ text.format }}</legend>
      <label v-for="f in formats" :key="f.key" class="until-found-faq__sync">
        <input
          v-model="formatKey"
          type="radio"
          :name="`${uid}-fmt`"
          :value="f.key"
        />
        <span>{{ f.name }}</span>
      </label>
    </fieldset>

    <label class="position-try-demo__range">
      <span>{{ text.alpha }}</span>
      <input v-model.number="alpha" type="range" min="0" max="100" step="5" />
      <output>{{ alpha }}%</output>
    </label>

    <dl class="alpha-demo__code">
      <div>
        <dt>{{ text.source }}</dt>
        <dd>
          <code>--c: {{ format.value }};</code>
        </dd>
      </div>
      <div>
        <dt>{{ text.written }}</dt>
        <dd>
          <code>color: alpha(from var(--c) / {{ alpha }}%);</code>
        </dd>
      </div>
      <div>
        <dt>{{ text.computed }}</dt>
        <dd>
          <code>{{ computedValue || "—" }}</code>
        </dd>
      </div>
    </dl>

    <div class="alpha-demo__grid">
      <figure
        v-for="bg in backgrounds"
        :key="bg.key"
        class="alpha-demo__panel"
        :style="{ backgroundColor: bg.color, color: BASE }"
      >
        <figcaption :style="{ color: bg.label }">{{ bg.name }}</figcaption>
        <p
          :ref="(el) => setSample(bg.key, el)"
          class="alpha-demo__sample"
          :style="sampleStyle"
        >
          {{ text.sample }}
        </p>
        <p class="alpha-demo__ratio" :style="{ color: bg.label }">
          {{ ratioText(bg.key) }}
        </p>
      </figure>
    </div>

    <p v-if="format.note" class="alpha-demo__note">{{ format.note }}</p>
    <p class="focusgroup-demo__mode">{{ modeText }}</p>
    <p class="popover-demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：同一個紫色用各種色彩寫法存在變數裡，用 alpha() 調透明度，
// 看計算後的值長什麼樣子，以及疊在亮底、暗底時的對比
// 用法：::alpha-color-demo
// 對比的算法：在 1×1 的 canvas 上先塗底色、再塗半透明色，讀出合成後的顏色，再依 WCAG 公式計算
type BgKey = "light" | "dark";

const BASE = "#7c3aed";

const { locale } = useI18n();
const uid = usePopoverDemoId("acd");
const formatKey = ref("oklch");
const alpha = ref(100); // 從不透明開始，往下拉才看得到對比不足
const computedValue = ref(""); // getComputedStyle 算出來的 color 值
const ratios = ref<Partial<Record<BgKey, number>>>({});
const supported = ref<boolean | null>(null);
const samples = new Map<BgKey, HTMLElement>();

function setSample(key: BgKey, el: unknown) {
  if (el instanceof HTMLElement) samples.set(key, el);
}

const messages = {
  "zh-Hant-TW": {
    label: "互動範例：同一個紫色，換不同的寫法存進變數，再用 alpha() 調透明度",
    format: "原本的色彩寫法",
    alpha: "透明度",
    source: "變數",
    written: "寫法",
    computed: "瀏覽器計算後的值",
    sample: "Aa 範例文字",
    light: "白色背景",
    dark: "深色背景",
    ratio: (r: string, text: boolean, ui: boolean) =>
      `對比 ${r}:1 · 一般文字 4.5:1 ${text ? "✓ 通過" : "✗ 不足"} · 大字與元件 3:1 ${ui ? "✓ 通過" : "✗ 不足"}`,
    named: "具名色彩 rebeccapurple 是另一個紫色，所以對比會跟其他寫法不同。",
    current: "currentColor 取的是這個區塊的文字顏色，範例裡設定成同一個紫色。",
    transparent:
      "transparent 其實是「全透明的黑色」，用 alpha() 調成 50% 會變成半透明黑，不是半透明的紫色。",
    native: "你的瀏覽器支援 alpha()",
    fallback:
      "你的瀏覽器不支援 alpha()，範例改用相對色彩語法 rgb(from … r g b / …) 呈現，效果相同",
    detecting: "偵測中（需要 JavaScript）",
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    label:
      "Live demo: the same purple written in different formats in a variable, with its transparency changed by alpha()",
    format: "Original color format",
    alpha: "Opacity",
    source: "Variable",
    written: "Declaration",
    computed: "Computed value",
    sample: "Aa sample text",
    light: "White background",
    dark: "Dark background",
    ratio: (r: string, text: boolean, ui: boolean) =>
      `Contrast ${r}:1 · Normal text 4.5:1 ${text ? "✓ pass" : "✗ fail"} · Large text & UI 3:1 ${ui ? "✓ pass" : "✗ fail"}`,
    named:
      "The named color rebeccapurple is a different purple, so its contrast differs from the others.",
    current:
      "currentColor takes this block's text color, which the demo sets to the same purple.",
    transparent:
      'transparent is really "fully transparent black", so alpha() at 50% gives half-transparent black, not half-transparent purple.',
    native: "Your browser supports alpha()",
    fallback:
      "Your browser doesn't support alpha(), so the demo uses relative color syntax rgb(from … r g b / …) instead, with the same result",
    detecting: "Detecting (requires JavaScript)",
    print: "This is an interactive demo. Try it on the web page.",
  },
};

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);

// 同一個紫色（#7c3aed）換算成各種寫法；具名色彩、currentColor、transparent 是特例
const formats = computed(() => [
  { key: "hex", name: "Hex", value: "#7c3aed" },
  {
    key: "named",
    name: locale.value === "en" ? "Named" : "具名色彩",
    value: "rebeccapurple",
    note: text.value.named,
  },
  { key: "rgb", name: "rgb()", value: "rgb(124 58 237)" },
  { key: "hsl", name: "hsl()", value: "hsl(262 83% 58%)" },
  { key: "hwb", name: "hwb()", value: "hwb(262 23% 7%)" },
  { key: "oklch", name: "oklch()", value: "oklch(54.1% 0.247 293)" },
  { key: "oklab", name: "oklab()", value: "oklab(54.1% 0.096 -0.227)" },
  { key: "lab", name: "lab()", value: "lab(42.2 57 -80.6)" },
  { key: "lch", name: "lch()", value: "lch(42.2 98.7 305.3)" },
  {
    key: "p3",
    name: "color(display-p3)",
    value: "color(display-p3 0.453 0.242 0.895)",
  },
  {
    key: "current",
    name: "currentColor",
    value: "currentColor",
    note: text.value.current,
  },
  {
    key: "transparent",
    name: "transparent",
    value: "transparent",
    note: text.value.transparent,
  },
]);

const format = computed(
  () =>
    formats.value.find((f) => f.key === formatKey.value) ?? formats.value[0]!,
);

const backgrounds = computed(() => [
  {
    key: "light" as const,
    name: text.value.light,
    color: "#ffffff",
    label: "#1a1a1a",
  },
  {
    key: "dark" as const,
    name: text.value.dark,
    color: "#121212",
    label: "#f2f2f2",
  },
]);

const sampleStyle = computed(() => {
  const v = format.value.value;
  const value =
    supported.value === false
      ? `rgb(from ${v} r g b / ${alpha.value}%)`
      : `alpha(from ${v} / ${alpha.value}%)`;
  return { color: value, borderColor: value };
});

const modeText = computed(() =>
  supported.value === null
    ? text.value.detecting
    : supported.value
      ? text.value.native
      : text.value.fallback,
);

function ratioText(key: BgKey) {
  const r = ratios.value[key];
  if (r === undefined) return "—";
  return text.value.ratio(r.toFixed(2), r >= 4.5, r >= 3);
}

function luminance([r, g, b]: number[]) {
  const ch = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r!) + 0.7152 * ch(g!) + 0.0722 * ch(b!);
}

let ctx: CanvasRenderingContext2D | null = null;
function composite(bg: string, fg: string) {
  ctx ??= document
    .createElement("canvas")
    .getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1, 1);
  ctx.fillStyle = fg;
  ctx.fillRect(0, 0, 1, 1);
  return [...ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)];
}

async function measure() {
  await nextTick();
  const next: Partial<Record<BgKey, number>> = {};
  for (const bg of backgrounds.value) {
    const el = samples.get(bg.key);
    if (!el) continue;
    const fg = getComputedStyle(el).color;
    if (bg.key === "light") computedValue.value = fg;
    const mixed = composite(bg.color, fg);
    const base = composite(bg.color, bg.color);
    if (!mixed || !base) continue;
    const l1 = luminance(mixed);
    const l2 = luminance(base);
    next[bg.key] = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }
  ratios.value = next;
}

watch([formatKey, alpha, supported, locale], measure);

onMounted(() => {
  supported.value = CSS.supports("color: alpha(from red / 50%)");
  measure();
});
</script>
