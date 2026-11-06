<template>
  <div class="hic-demo demo">
    <p class="demo__label">{{ text.label }}</p>

    <label class="demo__range">
      <span>{{ text.angle }}</span>
      <input v-model.number="angle" type="range" min="-20" max="20" step="5" />
      <output>{{ angle }}°</output>
    </label>

    <fieldset v-if="supported" class="demo__options">
      <legend>{{ text.hideLegend }}</legend>
      <label v-for="m in methods" :key="m" class="demo__option">
        <input v-model="method" type="radio" :name="`${uid}-hide`" :value="m" />
        <span v-if="m === 'none'">{{ text.none }}</span>
        <code v-else>{{ code[m] }}</code>
      </label>
    </fieldset>

    <!--
      支援時：內容放在 <canvas content="drawable"> 裡，只畫「訂閱卡片」，「進階設定」不畫。
      不支援（或還沒偵測完）時：同樣的內容用一般 HTML 顯示，不放進 canvas。
      不支援的瀏覽器會把 canvas 子元素當成看不見的備援內容，但仍然可以 Tab 進去，所以不能直接沿用。
    -->
    <component
      :is="supported ? 'canvas' : 'div'"
      ref="stage"
      class="hic-demo__stage"
      :class="{ 'is-canvas': supported }"
      :content="supported ? 'drawable' : undefined"
      @focusin="updateFocus"
      @focusout="onFocusOut"
    >
      <form
        ref="card"
        class="hic-demo__card"
        :drawable="supported ? '' : undefined"
        @submit.prevent="subscribe"
      >
        <p class="hic-demo__title">{{ text.cardTitle }}</p>
        <label :for="`${uid}-email`">{{ text.email }}</label>
        <input
          :id="`${uid}-email`"
          v-model="email"
          type="email"
          autocomplete="email"
          :placeholder="text.placeholder"
        />
        <button type="submit" class="hic-demo__button">
          {{ text.submit }}
        </button>
      </form>

      <!-- 沒有畫出來的內容（例如切換前的另一個畫面），隱藏方式由上方選項決定 -->
      <div
        v-if="supported"
        class="hic-demo__card hic-demo__panel"
        :drawable="supported ? '' : undefined"
        :hidden="method === 'hidden' || undefined"
        :inert="method === 'inert' || undefined"
        :aria-hidden="method === 'aria-hidden' ? 'true' : undefined"
      >
        <p class="hic-demo__title">{{ text.panelTitle }}</p>
        <button type="button" class="hic-demo__button">
          {{ text.clear }}
        </button>
      </div>
    </component>

    <dl class="attr-demo__readout" :class="{ 'is-mismatch': focusLost }">
      <div>
        <dt>{{ text.focusLabel }}</dt>
        <dd>{{ focusText }}</dd>
      </div>
      <div v-if="supported">
        <dt>{{ text.tabLabel }}</dt>
        <dd>{{ tabbable ? text.yes : text.no }}</dd>
      </div>
      <div v-if="supported">
        <dt>{{ text.srLabel }}</dt>
        <dd>{{ readable[method] ? text.yes : text.no }}</dd>
      </div>
    </dl>
    <p v-if="supported" class="hic-demo__note">{{ text.srNote }}</p>
    <p class="hic-demo__status" role="status">{{ status }}</p>

    <p class="demo__status">{{ modeText }}</p>
    <p class="demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：HTML-in-Canvas 的無障礙。卡片畫進 canvas（可旋轉），另一塊內容不畫，比較隱藏方式的差別
// 用法：::html-in-canvas-demo
type Method = "hidden" | "inert" | "aria-hidden" | "none";

const uid = useDemoId("hic");
const stage = ref<HTMLElement | null>(null);
const card = ref<HTMLElement | null>(null);

const methods: Method[] = ["hidden", "inert", "aria-hidden", "none"];
const code: Record<Method, string> = {
  hidden: "hidden",
  inert: "inert",
  "aria-hidden": 'aria-hidden="true"',
  none: "",
};
// 沒畫出來的內容，報讀軟體讀不讀得到：Chrome 157 實測（JavaScript 無法讀取無障礙樹，這裡是對照表）
const readable: Record<Method, boolean> = {
  hidden: false,
  inert: true,
  "aria-hidden": false,
  none: true,
};

const angle = ref(-10);
const method = ref<Method>("none");
const email = ref("");
const status = ref("");
const supported = ref<boolean | null>(null);
const focusWhere = ref<"card" | "panel" | null>(null);

const messages = {
  "zh-Hant-TW": {
    label:
      "互動範例：只有「訂閱電子報」卡片畫進 canvas，「進階設定」沒有畫出來。用 Tab 在卡片裡移動，再切換下方的隱藏方式，看焦點會不會跑到看不見的地方",
    angle: "卡片旋轉角度",
    hideLegend: "沒畫出來的「進階設定」怎麼隱藏",
    none: "不處理",
    cardTitle: "訂閱電子報",
    email: "電子郵件",
    placeholder: "name@example.com",
    submit: "訂閱",
    panelTitle: "進階設定（沒有畫出來）",
    clear: "清除所有資料",
    focusLabel: "目前焦點",
    focusCard: "卡片裡（看得到）",
    focusPanel: "沒畫出來的「進階設定」裡：看不到焦點",
    focusNone: "（焦點不在範例裡）",
    tabLabel: "用 Tab 進得去「進階設定」嗎？",
    srLabel: "報讀軟體讀得到「進階設定」嗎？",
    yes: "是",
    no: "否",
    srNote:
      "「報讀軟體讀得到嗎」是 Chrome 157 的實測結果，網頁程式讀不到無障礙樹，所以這一欄不會隨瀏覽器即時改變。",
    subscribed: (v: string) =>
      v ? `已送出：${v}（範例，不會真的寄出）` : "請先輸入電子郵件",
    native: "你的瀏覽器支援 HTML-in-Canvas：卡片是畫在 canvas 上的",
    fallback:
      "你的瀏覽器不支援 HTML-in-Canvas，範例改用一般 HTML 顯示，不放進 canvas",
    detecting: "偵測中（需要 JavaScript）",
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    label:
      "Live demo: only the “Newsletter” card is drawn into the canvas; “Advanced settings” is not drawn. Move through the card with Tab, then switch the hiding method below to see whether focus ends up somewhere you can't see",
    angle: "Card rotation",
    hideLegend: "How the undrawn “Advanced settings” is hidden",
    none: "Nothing",
    cardTitle: "Newsletter",
    email: "Email",
    placeholder: "name@example.com",
    submit: "Subscribe",
    panelTitle: "Advanced settings (not drawn)",
    clear: "Clear all data",
    focusLabel: "Current focus",
    focusCard: "In the card (visible)",
    focusPanel: "In the undrawn “Advanced settings”: focus can't be seen",
    focusNone: "(focus isn't in the demo)",
    tabLabel: "Can Tab reach “Advanced settings”?",
    srLabel: "Can screen readers read “Advanced settings”?",
    yes: "Yes",
    no: "No",
    srNote:
      "“Can screen readers read it” is from testing in Chrome 157. Page scripts can't read the accessibility tree, so this column doesn't change live with your browser.",
    subscribed: (v: string) =>
      v
        ? `Submitted: ${v} (demo only, nothing is sent)`
        : "Enter an email address first",
    native:
      "Your browser supports HTML-in-Canvas: the card is drawn on a canvas",
    fallback:
      "Your browser doesn't support HTML-in-Canvas, so the demo shows plain HTML instead of a canvas",
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

// hidden、inert 會把內容移出 Tab 順序；aria-hidden 和不處理都不會
const tabbable = computed(
  () => method.value === "aria-hidden" || method.value === "none",
);
const focusLost = computed(() => focusWhere.value === "panel");
const focusText = computed(() =>
  focusWhere.value === "card"
    ? text.value.focusCard
    : focusWhere.value === "panel"
      ? text.value.focusPanel
      : text.value.focusNone,
);

function subscribe() {
  status.value = text.value.subscribed(email.value);
}

function updateFocus() {
  const active = document.activeElement;
  if (!stage.value || !active || !stage.value.contains(active)) {
    focusWhere.value = null;
  } else {
    focusWhere.value = card.value?.contains(active) ? "card" : "panel";
  }
}
function onFocusOut() {
  requestAnimationFrame(updateFocus);
}

// ---- 畫進 canvas（只在支援時）----
type DrawableCanvas = HTMLCanvasElement & {
  requestPaint: () => void;
  onpaint: ((event: Event) => void) | null;
};
type ElementDrawingContext = CanvasRenderingContext2D & {
  drawElementImage: (element: Element, dx: number, dy: number) => void;
};
let observer: ResizeObserver | null = null;
let scale = 1; // 每個 CSS 像素對應幾個 canvas 格線像素

function setupCanvas() {
  const canvas = stage.value as DrawableCanvas | null;
  if (!canvas) return;
  const ctx = canvas.getContext("2d") as ElementDrawingContext | null;
  if (!ctx) return;

  canvas.onpaint = () => {
    if (!card.value) return;
    ctx.reset();
    // drawElementImage 的位置和大小用 canvas 格線像素，CSS 像素要乘上 scale
    const w = card.value.offsetWidth * scale;
    const h = card.value.offsetHeight * scale;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((angle.value * Math.PI) / 180);
    // 2D 會自動更新幾何資訊：點擊、焦點框位置、無障礙的位置都跟著旋轉後的卡片
    ctx.drawElementImage(card.value, -w / 2, -h / 2);
  };

  // canvas 格線對齊裝置像素，避免模糊；使用者縮放頁面時也會重新計算
  observer = new ResizeObserver(([entry]) => {
    if (!entry) return;
    const dpc = entry.devicePixelContentBoxSize?.[0];
    const cssWidth = entry.contentRect.width;
    canvas.width = dpc
      ? dpc.inlineSize
      : Math.round(cssWidth * window.devicePixelRatio);
    canvas.height = dpc
      ? dpc.blockSize
      : Math.round(entry.contentRect.height * window.devicePixelRatio);
    scale = cssWidth ? canvas.width / cssWidth : 1;
    canvas.requestPaint();
  });
  const supportsDpc =
    typeof ResizeObserverEntry !== "undefined" &&
    "devicePixelContentBoxSize" in ResizeObserverEntry.prototype;
  observer.observe(
    canvas,
    supportsDpc ? { box: "device-pixel-content-box" } : {},
  );
}

watch(angle, () => (stage.value as DrawableCanvas | null)?.requestPaint?.());

onMounted(async () => {
  supported.value = featureDetectors["html-in-canvas"]!.detect();
  if (supported.value) {
    await nextTick();
    setupCanvas();
  }
});
onBeforeUnmount(() => observer?.disconnect());
</script>
