<template>
  <div class="tdi-demo demo">
    <p class="demo__label">{{ text.label }}</p>

    <fieldset class="demo__options">
      <legend>{{ text.modeLegend }}</legend>
      <label v-for="m in modes" :key="m" class="demo__option">
        <input v-model="mode" type="radio" :name="`${uid}-mode`" :value="m" />
        <span>
          {{ text.modes[m] }}
          <code>{{ code[m] }}</code>
        </span>
      </label>
    </fieldset>

    <label class="demo__option">
      <input v-model="focusToo" type="checkbox" />
      <span>{{ text.focusToo }} <code>:focus-visible</code></span>
    </label>
    <label class="demo__option">
      <input v-model="reduced" type="checkbox" />
      <span>{{ text.reduced }} <code>prefers-reduced-motion</code></span>
    </label>

    <p
      class="tdi-demo__text"
      :class="[`is-${mode}`, { 'is-focus': focusToo, 'is-reduced': reduced }]"
    >
      {{ text.before }}
      <a ref="link" :href="text.href" class="tdi-demo__link">
        {{ text.linkText }}</a
      >{{ text.after }}
    </p>

    <dl class="attr-demo__readout" :class="{ 'is-mismatch': fails }">
      <div>
        <dt>{{ text.restLabel }}</dt>
        <dd>{{ restText }}</dd>
      </div>
      <div>
        <dt>{{ text.contrastLabel }}</dt>
        <dd>{{ contrast }}:1</dd>
      </div>
      <div>
        <dt>{{ text.focusLabel }}</dt>
        <dd>{{ focusText }}</dd>
      </div>
      <div>
        <dt>{{ text.verdictLabel }}</dt>
        <dd>{{ fails ? text.fail : text.pass }}</dd>
      </div>
    </dl>

    <p class="tdi-demo__subhead">{{ text.autoHeading }}</p>
    <label class="demo__option">
      <input v-model="autoInset" type="checkbox" />
      <code>text-decoration-inset: auto</code>
    </label>
    <p class="tdi-demo__names" :class="{ 'is-auto': autoInset }">
      {{ text.namesBefore }}<u>{{ text.name1 }}</u
      ><u>{{ text.name2 }}</u
      >{{ text.namesAfter }}
    </p>

    <p class="demo__status">{{ modeText }}</p>
    <p class="demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：text-decoration-inset 做連結底線動畫，檢查一般狀態下連結還能不能和文字區分；另示範 auto 讓相鄰的專名號分開
// 用法：::text-decoration-inset-demo
type Mode = "hidden" | "trim" | "extend";

const uid = useDemoId("tdi");
const link = ref<HTMLElement | null>(null);

const modes: Mode[] = ["hidden", "trim", "extend"];
const code: Record<Mode, string> = {
  hidden: "50% → 0",
  trim: "0.3em → 0",
  extend: "0 → -0.15em",
};

const mode = ref<Mode>("hidden");
const focusToo = ref(false);
const reduced = ref(false);
const autoInset = ref(true);
const supported = ref<boolean | null>(null);
const contrast = ref("—");
const restLength = ref<number | null>(null);
const linkWidth = ref(0);

const messages = {
  "zh-Hant-TW": {
    label:
      "互動範例：切換連結底線的寫法，再用滑鼠移上去、或用 Tab 移到連結上，看一般狀態下還分不分得出這是連結",
    modeLegend: "連結底線的寫法（一般 → hover）",
    modes: {
      hidden: "平常藏起來，hover 才出現",
      trim: "平常兩端內縮，hover 展開",
      extend: "平常完整，hover 往外延伸",
    },
    focusToo: "鍵盤焦點也套用 hover 的效果",
    reduced: "模擬減少動態",
    before: "詳細的支援度可以看",
    linkText: "現代 CSS 與 HTML 技巧整理清單",
    href: "/blog/css-techniques-checklist/",
    after: "，裡面每一項都附上版本。",
    restLabel: "一般狀態的底線",
    noLine: "看不到（長度 0）",
    lineLength: (px: number, total: number) => `${px}px（連結寬 ${total}px）`,
    fullLine: "完整（瀏覽器不支援 inset）",
    contrastLabel: "連結和周圍文字的顏色對比",
    focusLabel: "鍵盤焦點時底線會變化嗎？",
    yes: "會",
    no: "不會，只有滑鼠移上去才有變化",
    noSupport: "不會（瀏覽器不支援，底線不會變）",
    verdictLabel: "WCAG 1.4.1（不只靠顏色）",
    pass: "通過：一般狀態就有底線",
    fail: "不通過：一般狀態只能靠顏色辨識，對比又低於 3:1（失敗技術 F73）",
    autoHeading: "專名號：相鄰的兩個人名",
    namesBefore: "這次的講者是",
    name1: "王小明",
    name2: "李美華",
    namesAfter: "兩位。",
    native: "你的瀏覽器支援 text-decoration-inset",
    fallback:
      "你的瀏覽器不支援 text-decoration-inset：底線一律完整顯示，不會被藏起來，兩個人名的專名號也會連成一條線",
    detecting: "偵測中（需要 JavaScript）",
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    label:
      "Live demo: switch how the link underline is styled, then hover the link or Tab to it, and see whether you can still tell it's a link at rest",
    modeLegend: "Link underline (at rest → hover)",
    modes: {
      hidden: "Hidden at rest, appears on hover",
      trim: "Trimmed at both ends at rest, full on hover",
      extend: "Full at rest, extends outward on hover",
    },
    focusToo: "Apply the hover effect to keyboard focus too",
    reduced: "Simulate reduced motion",
    before: "For detailed support, see the ",
    linkText: "Modern CSS & HTML Cheat Sheet",
    href: "/en/blog/css-techniques-checklist/",
    after: ", which lists versions for every item.",
    restLabel: "Underline at rest",
    noLine: "Not visible (length 0)",
    lineLength: (px: number, total: number) =>
      `${px}px (link is ${total}px wide)`,
    fullLine: "Full (your browser doesn't support inset)",
    contrastLabel: "Color contrast between the link and surrounding text",
    focusLabel: "Does the underline change on keyboard focus?",
    yes: "Yes",
    no: "No, it only changes on mouse hover",
    noSupport: "No (not supported, so the underline never changes)",
    verdictLabel: "WCAG 1.4.1 (not color alone)",
    pass: "Pass: the underline is there at rest",
    fail: "Fail: at rest it's identifiable by color alone, with contrast under 3:1 (failure F73)",
    autoHeading: "Proper noun marks: two adjacent names",
    namesBefore: "This time's speakers are ",
    name1: "Wang Xiaoming",
    name2: "Li Meihua",
    namesAfter: ".",
    native: "Your browser supports text-decoration-inset",
    fallback:
      "Your browser doesn't support text-decoration-inset: underlines always show in full, so they can't be hidden, and the two names share one line",
    detecting: "Detecting (requires JavaScript)",
    print: "This is an interactive demo. Try it on the web page.",
  },
};

const text = useDemoText(messages);

const modeText = computed(() =>
  supported.value === null
    ? text.value.detecting
    : supported.value
      ? text.value.native
      : text.value.fallback,
);

// 各寫法在一般狀態下的 inset（跟 demos.css 一致），用來算底線長度
const restInset: Record<Mode, { value: number; unit: "%" | "em" }> = {
  hidden: { value: 50, unit: "%" },
  trim: { value: 0.3, unit: "em" },
  extend: { value: 0, unit: "em" },
};

function measure() {
  const el = link.value;
  if (!el) return;
  const width = el.getBoundingClientRect().width;
  linkWidth.value = Math.round(width);
  if (!supported.value) {
    restLength.value = null;
  } else {
    const r = restInset[mode.value];
    const fontSize = parseFloat(getComputedStyle(el).fontSize);
    const each = r.unit === "%" ? (width * r.value) / 100 : r.value * fontSize;
    restLength.value = Math.max(0, Math.round(width - each * 2));
  }
  contrast.value = ratio(
    getComputedStyle(el).color,
    getComputedStyle(el.parentElement!).color,
  ).toFixed(2);
}

const restText = computed(() =>
  restLength.value === null
    ? text.value.fullLine
    : restLength.value === 0
      ? text.value.noLine
      : text.value.lineLength(restLength.value, linkWidth.value),
);
const focusText = computed(() =>
  supported.value === false
    ? text.value.noSupport
    : focusToo.value
      ? text.value.yes
      : text.value.no,
);
// 一般狀態看不到底線，且連結和文字的對比不到 3:1：只能靠顏色辨識
const fails = computed(
  () => restLength.value === 0 && parseFloat(contrast.value) < 3,
);

// 顏色對比（WCAG 2 相對亮度）：用 canvas 把任何 CSS 顏色轉成 sRGB
let ctx: CanvasRenderingContext2D | null = null;
function toRgb(color: string) {
  if (!ctx) {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    ctx = c.getContext("2d", { willReadFrequently: true });
  }
  if (!ctx) return [0, 0, 0];
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  return Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3));
}
function luminance(rgb: number[]) {
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}
function ratio(a: string, b: string) {
  const la = luminance(toRgb(a));
  const lb = luminance(toRgb(b));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

watch([mode, text], () => nextTick(measure));

let observer: ResizeObserver | null = null;
let darkQuery: MediaQueryList | null = null;
onMounted(() => {
  supported.value = featureDetectors["text-decoration-inset"]!.detect();
  measure();
  if (link.value) {
    observer = new ResizeObserver(measure);
    observer.observe(link.value);
  }
  darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  darkQuery.addEventListener("change", measure);
});
onBeforeUnmount(() => {
  observer?.disconnect();
  darkQuery?.removeEventListener("change", measure);
});
</script>
