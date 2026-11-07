<template>
  <div class="rif-demo demo">
    <p class="demo__label">{{ text.label }}</p>

    <fieldset class="demo__options">
      <legend>{{ text.sizingLegend }}</legend>
      <label v-for="s in sizings" :key="s" class="demo__option">
        <input
          v-model="sizing"
          type="radio"
          :name="`${uid}-sizing`"
          :value="s"
        />
        <code>frame-sizing: {{ s }}</code>
      </label>
    </fieldset>

    <fieldset class="demo__options">
      <legend>{{ text.widthLegend }}</legend>
      <label v-for="w in widths" :key="w" class="demo__option">
        <input v-model="width" type="radio" :name="`${uid}-width`" :value="w" />
        <span>{{ text.widths[w] }}</span>
      </label>
    </fieldset>

    <label class="demo__option">
      <input v-model="auto" type="checkbox" />
      <span>{{ text.auto }}</span>
    </label>

    <div class="rif-demo__stage" :class="`is-${width}`">
      <iframe
        ref="frame"
        class="rif-demo__frame"
        :class="{ 'is-content': sizing === 'content-height' }"
        :title="text.frameTitle"
        :srcdoc="srcdoc"
        @load="onFrameLoad"
      />
    </div>

    <dl class="attr-demo__readout" :class="{ 'is-mismatch': clipped }">
      <div>
        <dt>{{ text.frameHeight }}</dt>
        <dd>{{ frameHeight }}px</dd>
      </div>
      <div>
        <dt>{{ text.contentHeight }}</dt>
        <dd>{{ contentHeight }}px</dd>
      </div>
      <div>
        <dt>{{ text.clippedLabel }}</dt>
        <dd>{{ clipped ? text.clippedYes : text.no }}</dd>
      </div>
    </dl>

    <p class="demo__status">{{ modeText }}</p>
    <p class="demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：iframe 高度跟著內容（frame-sizing + requestResize），檢查內容變動後會不會被擠到框內捲動
// 用法：::responsive-iframe-demo
type Sizing = "auto" | "content-height";
type Width = "full" | "narrow";

const uid = useDemoId("rif");
const frame = ref<HTMLIFrameElement | null>(null);

const sizings: Sizing[] = ["auto", "content-height"];
const widths: Width[] = ["full", "narrow"];

const sizing = ref<Sizing>("content-height");
const width = ref<Width>("full");
const auto = ref(false);
const supported = ref<boolean | null>(null);
const frameHeight = ref(0);
const contentHeight = ref(0);
const clipped = ref(false);

const messages = {
  "zh-Hant-TW": {
    label:
      "互動範例：iframe 裡是一份常見問題。展開問題、套用文字間距，或把寬度改窄，看 iframe 會不會跟著長高；沒跟上時，內容會被擠到框內捲動",
    sizingLegend: "iframe 的寫法",
    widthLegend: "iframe 寬度",
    widths: {
      full: "100%",
      narrow: "320px（相當於 1280px 寬的畫面放大 400%）",
    },
    auto: "子頁內容變動時自動呼叫 requestResize()（ResizeObserver）",
    frameTitle: "常見問題（內嵌頁面）",
    frameHeight: "iframe 高度",
    contentHeight: "內容高度",
    clippedLabel: "有內容被擠到框內捲動嗎？",
    clippedYes: "有，要在框內捲動才看得到",
    no: "沒有",
    native: "你的瀏覽器支援 frame-sizing：iframe 高度由瀏覽器依內容決定",
    fallback:
      "你的瀏覽器不支援 frame-sizing，選 content-height 時，範例改用 JavaScript 讀內容高度、設定 iframe 高度（跨來源時要用 postMessage）",
    detecting: "偵測中（需要 JavaScript）",
    print: "此處為互動範例，請在網頁上操作。",
    lang: "zh-Hant-TW",
    heading: "常見問題",
    spacing: "套用文字間距（WCAG 1.4.12）",
    notify: "通知父頁更新高度：requestResize()",
    faqs: [
      [
        "可以退貨嗎？",
        "收到商品 7 天內可以申請退貨。商品要保持完整，包含配件、贈品和原包裝。退貨申請送出後，我們會在 3 個工作天內聯絡你安排收件。",
      ],
      [
        "運費怎麼算？",
        "單筆訂單滿 1,000 元免運費，未滿收 80 元。離島和偏遠地區另計，結帳時會顯示實際金額。",
      ],
      [
        "可以開統一編號嗎？",
        "可以。結帳時在發票欄位填寫統一編號和公司抬頭，電子發票會寄到你的電子郵件。",
      ],
    ],
  },
  en: {
    label:
      "Live demo: the iframe holds an FAQ. Expand a question, apply text spacing, or make it narrower, and see whether the iframe grows to match; when it doesn't, content gets pushed into a scroll area inside the frame",
    sizingLegend: "How the iframe is styled",
    widthLegend: "iframe width",
    widths: {
      full: "100%",
      narrow: "320px (a 1280px-wide screen zoomed to 400%)",
    },
    auto: "Call requestResize() automatically when the content changes (ResizeObserver)",
    frameTitle: "FAQ (embedded page)",
    frameHeight: "iframe height",
    contentHeight: "Content height",
    clippedLabel: "Is any content pushed into a scroll area inside the frame?",
    clippedYes: "Yes, you have to scroll inside the frame to see it",
    no: "No",
    native:
      "Your browser supports frame-sizing: the browser sizes the iframe to its content",
    fallback:
      "Your browser doesn't support frame-sizing, so with content-height the demo reads the content height with JavaScript and sets the iframe height (cross-origin, you'd need postMessage)",
    detecting: "Detecting (requires JavaScript)",
    print: "This is an interactive demo. Try it on the web page.",
    lang: "en",
    heading: "FAQ",
    spacing: "Apply text spacing (WCAG 1.4.12)",
    notify: "Tell the parent to update: requestResize()",
    faqs: [
      [
        "Can I return an item?",
        "You can request a return within 7 days of receiving it. The item must be complete, including accessories, gifts, and the original packaging. Once you submit a request, we'll contact you within 3 business days to arrange pickup.",
      ],
      [
        "How much is shipping?",
        "Orders of 1,000 or more ship free; otherwise shipping is 80. Outlying islands and remote areas cost extra, and the exact amount is shown at checkout.",
      ],
      [
        "Can I get a company invoice?",
        "Yes. Enter your company's tax ID and name in the invoice fields at checkout, and the e-invoice will be emailed to you.",
      ],
    ],
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

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

// 內嵌頁面（srcdoc 和父頁同源，allow-origins='self' 就能用）
// 顏色由父頁量好後傳進去，深淺色主題才會一致
const colors = ref({ fg: "CanvasText", bg: "Canvas", accent: "LinkText" });
const srcdoc = computed(() => {
  const t = text.value;
  const c = colors.value;
  const faqs = (t.faqs as [string, string][])
    .map(
      ([q, a]) =>
        `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`,
    )
    .join("");
  return `<!doctype html><html lang="${t.lang}"><head>
<meta charset="utf-8">
<meta name="responsive-embedded-sizing" content="allow-origins='self'">
<title>${esc(t.heading)}</title>
<style>
:root{color:${c.fg};background:${c.bg};font:1rem/1.6 system-ui,sans-serif}
body{margin:0;padding:1rem}
h2{margin:0 0 .75rem;font-size:1.125rem}
details{border-block-end:1px solid currentColor;padding-block:.5rem}
summary{cursor:pointer;font-weight:700}
p{margin:.5rem 0 0}
.actions{display:flex;flex-wrap:wrap;gap:.5rem;margin-block-start:1rem}
button{font:inherit;padding:.375rem .75rem;border:2px solid ${c.accent};border-radius:.375rem;background:transparent;color:inherit;cursor:pointer}
:focus-visible{outline:3px solid ${c.accent};outline-offset:2px}
.spacing *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}
.spacing p{margin-block-end:2em!important}
</style></head><body>
<h2>${esc(t.heading)}</h2>${faqs}
<div class="actions">
<button type="button" id="spacing" aria-pressed="false">${esc(t.spacing)}</button>
<button type="button" id="notify">${esc(t.notify)}</button>
</div>
<script>
document.getElementById("spacing").addEventListener("click", (e) => {
  const on = document.documentElement.classList.toggle("spacing");
  e.currentTarget.setAttribute("aria-pressed", String(on));
});
document.getElementById("notify").addEventListener("click", () => {
  if (typeof window.requestResize === "function") {
    try { window.requestResize(); } catch (err) {}
  } else {
    parent.postMessage({ type: "rif-height", height: Math.ceil(document.documentElement.getBoundingClientRect().height) }, parent.location.origin);
  }
});
${"<"}/script>
</body></html>`;
});

let childObserver: ResizeObserver | null = null;
let darkQuery: MediaQueryList | null = null;
let frameObserver: ResizeObserver | null = null;

// 讀數：iframe 高度、內容高度、內容是否超出 iframe（要在框內捲動）
function measure() {
  const f = frame.value;
  const root = f?.contentDocument?.documentElement;
  if (!f || !root) return;
  frameHeight.value = Math.round(f.getBoundingClientRect().height);
  contentHeight.value = root.scrollHeight;
  clipped.value = root.scrollHeight > root.clientHeight + 1;
}

// 子頁內容變動時要做的事
function onChildResize() {
  const win = frame.value?.contentWindow as
    (Window & { requestResize?: () => void }) | null;
  if (auto.value && win) {
    if (supported.value) {
      try {
        win.requestResize?.();
      } catch {
        // 子頁沒有加 meta 時會丟 NotAllowedError
      }
    } else {
      applyFallbackHeight();
    }
  }
  requestAnimationFrame(measure);
}

// 不支援時的備援：用內容高度設定 iframe 高度
function applyFallbackHeight(height?: number) {
  const f = frame.value;
  const root = f?.contentDocument?.documentElement;
  if (!f || !root) return;
  if (supported.value || sizing.value !== "content-height") {
    f.style.removeProperty("height");
    return;
  }
  // scrollHeight 不會小於 iframe 的可視高度，內容變少時縮不回去，所以量 <html> 本身的高度
  const h = height ?? Math.ceil(root.getBoundingClientRect().height);
  // 再加上 iframe 的邊框
  f.style.height = `${h + f.offsetHeight - f.clientHeight}px`;
}

function onFrameLoad() {
  const win = frame.value?.contentWindow as (Window & typeof globalThis) | null;
  const doc = frame.value?.contentDocument;
  if (!win || !doc?.body) return;
  childObserver?.disconnect();
  // 用子頁自己的 ResizeObserver 觀察內容
  childObserver = new win.ResizeObserver(onChildResize);
  childObserver.observe(doc.body);
  applyFallbackHeight();
  measure();
}

function onMessage(e: MessageEvent) {
  if (e.source !== frame.value?.contentWindow) return;
  if (e.data?.type === "rif-height") applyFallbackHeight(e.data.height);
  requestAnimationFrame(measure);
}

watch(sizing, () => {
  applyFallbackHeight();
  requestAnimationFrame(measure);
});
watch(auto, (on) => {
  if (on) onChildResize();
});

function readColors() {
  const el = frame.value?.parentElement;
  if (!el) return;
  const cs = getComputedStyle(el);
  const accent = getComputedStyle(el).getPropertyValue("--pd-c").trim();
  const next = {
    fg: cs.color,
    bg: cs.backgroundColor,
    accent: accent ? `oklch(${accent})` : cs.color,
  };
  // 顏色真的變了才更新（srcdoc 一變，iframe 就會重新載入）
  const c = colors.value;
  if (next.fg !== c.fg || next.bg !== c.bg || next.accent !== c.accent) {
    colors.value = next;
  }
}

onMounted(() => {
  supported.value = featureDetectors["frame-sizing"]!.detect();
  readColors();
  // 系統切換深淺色時，iframe 裡的顏色也要跟著換
  darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  darkQuery.addEventListener("change", readColors);
  window.addEventListener("message", onMessage);
  if (frame.value) {
    frameObserver = new ResizeObserver(() => requestAnimationFrame(measure));
    frameObserver.observe(frame.value);
  }
});
onBeforeUnmount(() => {
  window.removeEventListener("message", onMessage);
  childObserver?.disconnect();
  frameObserver?.disconnect();
  darkQuery?.removeEventListener("change", readColors);
});
</script>
