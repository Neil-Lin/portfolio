<template>
  <div class="sat-demo demo">
    <p class="demo__label">{{ text.label }}</p>

    <fieldset class="demo__options">
      <legend>{{ text.mode }}</legend>
      <label v-for="m in modes" :key="m" class="demo__option">
        <input v-model="mode" type="radio" :name="`${uid}-mode`" :value="m" />
        <code>{{ code[m] }}</code>
      </label>
    </fieldset>

    <label class="demo__option">
      <input v-model="padded" type="checkbox" />
      <span>
        {{ text.padding }}
        <code>scroll-padding-inline-start</code>
      </span>
    </label>

    <!-- 表格外框：只左右捲動。role、名稱、tabindex 讓鍵盤和報讀軟體都能操作 -->
    <div
      ref="wrap"
      class="sat-demo__wrap"
      :class="[`is-${mode}`, { 'is-padded': padded }]"
      role="group"
      :aria-labelledby="captionId"
      tabindex="0"
      @focusin="measure"
      @scroll.passive="measure"
    >
      <table class="sat-demo__table">
        <caption :id="captionId">
          {{
            text.caption
          }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ text.product }}</th>
            <th v-for="m in months" :key="m" scope="col">
              {{ text.month(m) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p">
            <th scope="row">{{ text.productName(p) }}</th>
            <td v-for="m in months" :key="m">
              <button
                type="button"
                class="sat-demo__cell"
                :aria-label="text.cellLabel(p, m, value(p, m))"
                @click="pick(p, m)"
              >
                {{ value(p, m) }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <dl class="attr-demo__readout" :class="{ 'is-mismatch': covered }">
      <div>
        <dt>{{ text.focus }}</dt>
        <dd>{{ focusText }}</dd>
      </div>
      <div>
        <dt>{{ text.covered }}</dt>
        <dd>{{ coveredText }}</dd>
      </div>
    </dl>
    <p class="sat-demo__picked" role="status">{{ picked }}</p>

    <p class="demo__status">{{ modeText }}</p>
    <p class="demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：表頭黏在頁面頂端、第一欄黏在表格左邊（單軸捲動容器），並檢查焦點有沒有被固定的欄列蓋住
// 用法：::single-axis-table-demo
type Mode = "old" | "new";

const uid = useDemoId("sat");
const captionId = `${uid}-caption`;
const wrap = ref<HTMLElement | null>(null);

const modes: Mode[] = ["old", "new"];
const code: Record<Mode, string> = {
  old: "overflow-x: auto",
  new: "overflow-x: auto; overflow-y: clip",
};
const mode = ref<Mode>("new");
const padded = ref(false);
const supported = ref<boolean | null>(null);
const focusCell = ref<{ p: number; m: number } | null>(null);
const covered = ref(false);
const picked = ref("");

const products = Array.from({ length: 12 }, (_, i) => i + 1);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
// 固定的假資料（不用亂數，伺服器和瀏覽器渲染結果才會一致）
const value = (p: number, m: number) => ((p * 37 + m * 53) % 900) + 100;

const messages = {
  "zh-Hant-TW": {
    label:
      "互動範例：先往下捲頁面，看表頭會不會黏在頂端；再用 Tab、Shift+Tab 在表格裡移動，看焦點會不會被第一欄蓋住",
    mode: "表格外框的寫法",
    padding: "加上",
    caption: "2026 年各產品每月業績（萬元）",
    product: "產品",
    month: (m: number) => `${m} 月`,
    productName: (p: number) => `產品 ${String(p).padStart(2, "0")}`,
    cellLabel: (p: number, m: number, v: number) =>
      `產品 ${String(p).padStart(2, "0")}，${m} 月，${v} 萬元`,
    picked: (p: number, m: number, v: number) =>
      `產品 ${String(p).padStart(2, "0")} 的 ${m} 月業績：${v} 萬元`,
    focus: "目前焦點",
    noFocus: "（焦點不在表格的按鈕上）",
    covered: "焦點被固定的表頭或第一欄蓋住了嗎？",
    yes: "是，看不到焦點",
    no: "否",
    native: "你的瀏覽器支援單軸捲動容器",
    fallback:
      "你的瀏覽器不支援單軸捲動容器，overflow-y: clip 會被當成 hidden，兩種寫法看起來會一樣：表頭不會黏在頁面頂端",
    detecting: "偵測中（需要 JavaScript）",
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    label:
      "Live demo: scroll the page down to see whether the header sticks to the top, then move through the table with Tab and Shift+Tab to see whether focus ends up hidden under the first column",
    mode: "How the table wrapper is styled",
    padding: "Add",
    caption: "Monthly sales by product, 2026 (in thousands)",
    product: "Product",
    month: (m: number) =>
      new Date(2026, m - 1, 1).toLocaleString("en", { month: "short" }),
    productName: (p: number) => `Product ${String(p).padStart(2, "0")}`,
    cellLabel: (p: number, m: number, v: number) =>
      `Product ${String(p).padStart(2, "0")}, ${new Date(2026, m - 1, 1).toLocaleString("en", { month: "long" })}, ${v} thousand`,
    picked: (p: number, m: number, v: number) =>
      `Product ${String(p).padStart(2, "0")}, ${new Date(2026, m - 1, 1).toLocaleString("en", { month: "long" })}: ${v} thousand`,
    focus: "Current focus",
    noFocus: "(focus isn't on a button in the table)",
    covered: "Is focus hidden under the sticky header or first column?",
    yes: "Yes, focus can't be seen",
    no: "No",
    native: "Your browser supports single-axis scroll containers",
    fallback:
      "Your browser doesn't support single-axis scroll containers: overflow-y: clip is treated as hidden, so both options look the same and the header doesn't stick to the top of the page",
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

const focusText = computed(() =>
  focusCell.value
    ? text.value.picked(
        focusCell.value.p,
        focusCell.value.m,
        value(focusCell.value.p, focusCell.value.m),
      )
    : text.value.noFocus,
);
const coveredText = computed(() =>
  focusCell.value ? (covered.value ? text.value.yes : text.value.no) : "—",
);

function pick(p: number, m: number) {
  picked.value = text.value.picked(p, m, value(p, m));
}

// 焦點所在的按鈕，和固定的表頭、同一列的列標題有沒有重疊
function overlaps(a: DOMRect, b: DOMRect) {
  return (
    Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 &&
    Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1
  );
}

function measure() {
  const active = document.activeElement;
  if (
    !wrap.value ||
    !(active instanceof HTMLElement) ||
    !active.classList.contains("sat-demo__cell") ||
    !wrap.value.contains(active)
  ) {
    focusCell.value = null;
    covered.value = false;
    return;
  }
  const cell = active.closest("td") as HTMLTableCellElement;
  const row = cell.parentElement as HTMLTableRowElement;
  focusCell.value = { p: row.sectionRowIndex + 1, m: cell.cellIndex };
  const box = active.getBoundingClientRect();
  const head = wrap.value.querySelector("thead")!.getBoundingClientRect();
  const rowHeader = row.querySelector("th")!.getBoundingClientRect();
  covered.value = overlaps(box, head) || overlaps(box, rowHeader);
}

// 表頭固定在頁面頂端時，避開網站頁首（往上捲時才出現的那條）
useSiteHeaderOffset(wrap, "--sat-top");

// 頁面捲動時，表頭可能蓋過焦點，也要重新量
function onWindowScroll() {
  if (focusCell.value) measure();
}

onMounted(() => {
  supported.value = featureDetectors["single-axis-scroll"]!.detect();
  window.addEventListener("scroll", onWindowScroll, { passive: true });
  document.addEventListener("focusout", onFocusOut);
});
function onFocusOut() {
  // 等焦點移到新元素後再量
  requestAnimationFrame(measure);
}
onBeforeUnmount(() => {
  window.removeEventListener("scroll", onWindowScroll);
  document.removeEventListener("focusout", onFocusOut);
});
</script>
