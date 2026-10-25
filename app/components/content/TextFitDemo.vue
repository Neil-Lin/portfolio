<template>
  <div class="text-fit-demo demo">
    <p class="demo__label">{{ text.label }}</p>

    <div class="text-fit-demo__controls">
      <fieldset class="demo__options">
        <legend>{{ text.scenario }}</legend>
        <label v-for="s in scenarios" :key="s" class="demo__option">
          <input
            v-model="scenario"
            type="radio"
            :name="`${uid}-scenario`"
            :value="s"
          />
          {{ text.scenarios[s] }}
        </label>
      </fieldset>
      <fieldset class="demo__options">
        <legend>text-fit</legend>
        <label v-for="m in modes[scenario]" :key="m.id" class="demo__option">
          <input
            v-model="mode"
            type="radio"
            :name="`${uid}-mode`"
            :value="m.id"
          />
          <code>{{ m.css }}</code>
        </label>
      </fieldset>
    </div>

    <label class="demo__range">
      <span>{{ text.width }}</span>
      <input
        v-model.number="width"
        type="range"
        min="160"
        max="720"
        step="10"
      />
      <output>{{ width }}px</output>
    </label>

    <label class="demo__option">
      <input v-model="bigText" type="checkbox" />
      {{ text.bigText }}
    </label>

    <button
      v-if="scenario === 'wrap'"
      type="button"
      class="text-fit-demo__find"
      @click="findOverflow"
    >
      {{ text.find }}
    </button>

    <!-- 虛線是容器的邊界；外層裁切，撐破容器的部分看得到，但不會讓整頁橫向捲動 -->
    <div
      class="text-fit-demo__stage"
      :class="{ 'is-big': bigText }"
      :style="{ '--tf-width': `${width}px` }"
    >
      <div ref="box" class="text-fit-demo__box" :class="`is-${mode}`">
        <p v-if="scenario === 'hero'" ref="target" class="text-fit-demo__hero">
          {{ text.hero }}
        </p>
        <p
          v-else-if="scenario === 'wrap'"
          ref="target"
          class="text-fit-demo__hero"
        >
          {{ text.wrap }}
        </p>
        <div v-else class="text-fit-demo__buttons">
          <button type="button" class="text-fit-demo__button">
            {{ text.button }}
          </button>
          <button
            ref="target"
            type="button"
            class="text-fit-demo__button"
            lang="de"
          >
            In den Warenkorb legen
          </button>
        </div>
      </div>
    </div>

    <p v-if="scenario === 'wrap' && findText" class="text-fit-demo__found">
      {{ findText }}
    </p>
    <p
      class="text-fit-demo__result"
      :class="overflow > 0 ? 'is-over' : 'is-fit'"
    >
      {{ resultText }}
    </p>

    <p class="demo__status">{{ modeText }}</p>
    <p class="demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：text-fit 的放大、縮小，以及「使用者調大字級」「換行時撐破容器」的實測
// 用法：::text-fit-demo
type Scenario = "hero" | "button" | "wrap";
type Mode =
  "none" | "grow" | "grow-safe" | "shrink" | "shrink-safe" | "grow-lines";

const uid = useDemoId("tfd");
const box = ref<HTMLElement | null>(null);
const target = ref<HTMLElement | null>(null);

const scenarios: Scenario[] = ["hero", "button", "wrap"];
// 每個寫法對應 CSS 裡的一個 class（.is-grow 等），這裡的 css 只是顯示用的文字
const modes: Record<Scenario, { id: Mode; css: string }[]> = {
  hero: [
    { id: "none", css: "none" },
    { id: "grow", css: "grow" },
    { id: "grow-safe", css: "grow per-line-all 200%" },
  ],
  button: [
    { id: "none", css: "none" },
    { id: "shrink", css: "shrink" },
    { id: "shrink-safe", css: "shrink 80% + @container" },
  ],
  wrap: [
    { id: "grow", css: "grow" },
    { id: "grow-lines", css: "grow per-line-all" },
  ],
};

const scenario = ref<Scenario>("hero");
const mode = ref<Mode>("grow");
const width = ref(720);
const bigText = ref(false);
const overflow = ref(0);
const naturalOverflow = ref(0);
const scale = ref(1);
const basePx = ref(0);
const supported = ref<boolean | null>(null);
const findResult = ref<number | null | undefined>(undefined);

const messages = {
  "zh-Hant-TW": {
    label:
      "互動範例：調整容器寬度（虛線）、切換寫法，看文字實際被放大或縮小到多大",
    scenario: "情境",
    scenarios: {
      hero: "活動主視覺標語",
      button: "多語系按鈕",
      wrap: "會換行的標題",
    } as Record<Scenario, string>,
    width: "容器寬度",
    bigText: "模擬使用者把瀏覽器預設字級調大一倍",
    find: "找出會撐破容器的寬度",
    hero: "週年慶全館五折",
    wrap: "週年慶全館商品五折起限時三天",
    button: "加入購物車",
    size: (px: number, base: number, pct: number) =>
      `實際字級約 ${px}px，是設定字級 ${base}px 的 ${pct}%`,
    over: (n: number) => `，超出容器 ${n}px`,
    found: (w: number) => `已切到 ${w}px：第一行撐破了容器`,
    notFound: "在 160～720px 之間沒有重現，可能是字型或瀏覽器版本不同",
    native: "你的瀏覽器支援 text-fit",
    fallback: "你的瀏覽器不支援 text-fit，文字會維持原本的字級",
    detecting: "偵測中（需要 JavaScript）",
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    label:
      "Live demo: resize the container (dashed line) and switch values to see how much the text is actually scaled",
    scenario: "Scenario",
    scenarios: {
      hero: "Campaign headline",
      button: "Translated button",
      wrap: "Wrapping headline",
    } as Record<Scenario, string>,
    width: "Container width",
    bigText: "Simulate a user doubling the browser's default font size",
    find: "Find a width that overflows",
    hero: "Anniversary Sale",
    wrap: "Anniversary sale: everything half price for three days",
    button: "Add to cart",
    size: (px: number, base: number, pct: number) =>
      `Rendered at about ${px}px, ${pct}% of the ${base}px font size`,
    over: (n: number) => `, overflowing the container by ${n}px`,
    found: (w: number) => `Switched to ${w}px: the first line overflows`,
    notFound:
      "Not reproduced between 160 and 720px; the font or browser version may differ",
    native: "Your browser supports text-fit",
    fallback:
      "Your browser doesn't support text-fit, so the text keeps its original size",
    detecting: "Detecting (requires JavaScript)",
    print: "This is an interactive demo. Try it on the web page.",
  },
};

const text = useDemoText(messages);

const resultText = computed(() => {
  if (!basePx.value) return "";
  const px = Math.round(basePx.value * scale.value);
  let out = text.value.size(
    px,
    Math.round(basePx.value),
    Math.round(scale.value * 100),
  );
  if (overflow.value > 0) out += text.value.over(overflow.value);
  return out;
});

const findText = computed(() =>
  findResult.value === undefined
    ? ""
    : findResult.value === null
      ? text.value.notFound
      : text.value.found(findResult.value),
);

const modeText = computed(() =>
  supported.value === null
    ? text.value.detecting
    : supported.value
      ? text.value.native
      : text.value.fallback,
);

// 量每一行文字的寬度與高度（同一行可能被拆成好幾個矩形，依 top 合併）
function lines(el: HTMLElement) {
  const range = document.createRange();
  range.selectNodeContents(el);
  const result: {
    left: number;
    right: number;
    width: number;
    height: number;
  }[] = [];
  let lastTop: number | null = null;
  for (const rect of range.getClientRects()) {
    const top = Math.round(rect.top);
    if (top !== lastTop) {
      result.push({
        left: rect.left,
        right: rect.right,
        width: rect.width,
        height: rect.height,
      });
      lastTop = top;
    } else {
      const line = result[result.length - 1]!;
      line.left = Math.min(line.left, rect.left);
      line.right = Math.max(line.right, rect.right);
      line.width = line.right - line.left;
    }
  }
  return result;
}

// text-fit 不會改變 font-size 的計算值，所以比較「有 text-fit」與「暫時拿掉 text-fit」的行高，換算實際縮放倍率
function measure() {
  const el = target.value;
  const container = box.value;
  if (!el || !container) return;
  const fitted = lines(el);
  const previous = el.style.getPropertyValue("text-fit");
  el.style.setProperty("text-fit", "none");
  const natural = lines(el);
  el.style.setProperty("text-fit", previous);
  if (!fitted.length || !natural.length) return;
  // 單行時用寬度比例（shrink 縮小時行高不會跟著變小，用行高會量不準）；多行時換行位置不同，改用行高
  scale.value =
    fitted.length === 1 && natural.length === 1
      ? fitted[0]!.width / natural[0]!.width
      : fitted[0]!.height / natural[0]!.height;
  basePx.value = parseFloat(getComputedStyle(el).fontSize);
  const edge = el.tagName === "BUTTON" ? el : container;
  const right =
    edge.getBoundingClientRect().right -
    parseFloat(getComputedStyle(edge).paddingRight);
  const over = (ls: { right: number }[]) =>
    Math.max(0, Math.round(Math.max(...ls.map((l) => l.right)) - right));
  overflow.value = over(fitted);
  naturalOverflow.value = over(natural);
}

// 換行時預設的 consistent 在某些寬度會讓第一行撐破容器；寬度跟字型有關，所以讓瀏覽器自己掃一遍
async function findOverflow() {
  mode.value = "grow";
  await nextTick();
  for (let w = 160; w <= 720; w += 10) {
    width.value = w;
    await nextTick();
    measure();
    // 不用 text-fit 也會溢出的寬度（單字本身比容器寬）不算
    if (overflow.value > 0 && naturalOverflow.value === 0) {
      findResult.value = w;
      return;
    }
  }
  findResult.value = null;
}

watch(scenario, (s) => {
  mode.value = modes[s][1]!.id;
});
watch([scenario, mode], () => {
  findResult.value = undefined;
});
watch([scenario, mode, width, bigText], async () => {
  await nextTick();
  measure();
});

onMounted(() => {
  supported.value = CSS.supports("text-fit: grow");
  measure();
  window.addEventListener("resize", measure);
  // 網頁字型載入後字寬會變，再量一次
  document.fonts?.ready.then(measure);
});
onBeforeUnmount(() => window.removeEventListener("resize", measure));
</script>
