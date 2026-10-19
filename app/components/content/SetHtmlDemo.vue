<template>
  <div class="sethtml-demo demo">
    <p class="demo__label">{{ text.label }}</p>

    <label class="sethtml-demo__input">
      <span>{{ text.input }}</span>
      <textarea v-model="source" rows="8" spellcheck="false"></textarea>
    </label>

    <fieldset class="demo__options">
      <legend>{{ text.mode }}</legend>
      <label v-for="m in modes" :key="m" class="demo__option">
        <input v-model="mode" type="radio" :name="`${uid}-mode`" :value="m" />
        <code>{{ modeCode[m] }}</code>
      </label>
    </fieldset>

    <div class="sethtml-demo__result" aria-live="polite">
      <p class="sethtml-demo__summary">{{ summary }}</p>
      <ul v-if="removed.length" class="sethtml-demo__removed">
        <li v-for="item in removed" :key="item">
          <code>{{ item }}</code>
        </li>
      </ul>
    </div>

    <p class="sethtml-demo__title">{{ text.output }}</p>
    <pre
      class="sethtml-demo__output"
      tabindex="0"
      :aria-label="text.output"
    ><code>{{ output || "—" }}</code></pre>

    <p class="demo__status">{{ modeText }}</p>
    <p class="demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：把一段含 ARIA 的 HTML 交給 setHTML()，比較預設、空設定、自訂允許清單會清掉什麼
// 用法：::set-html-demo
// 輸入只用 DOMParser（不執行任何程式）和 setHTML()（會清掉危險內容）處理，輸出只以文字顯示，不會插入頁面
type Mode = "default" | "empty" | "allow";

const { locale } = useI18n();
const uid = useDemoId("shd");
const modes: Mode[] = ["default", "empty", "allow"];
const mode = ref<Mode>("default");
const output = ref("");
const removed = ref<string[]>([]);
const supported = ref<boolean | null>(null);

const SAMPLE = `<button type="button" aria-expanded="false" aria-controls="menu">選單</button>
<ul id="menu" role="list">
  <li><a href="/about" aria-current="page">關於我</a></li>
</ul>
<img src="/images/avatar.webp" alt="Neil 的頭像">
<label for="q">搜尋</label>
<input id="q" type="search" aria-describedby="hint">
<p id="hint">輸入關鍵字</p>
<div role="status" aria-live="polite">已儲存</div>
<a href="javascript:alert(1)" onclick="alert(2)">危險連結</a>`;

const source = ref(SAMPLE);

// 自訂允許清單：用 new Sanitizer() 取得預設清單，再加上常用的互動元素和無障礙屬性。
// 直接傳 { elements, attributes } 會「取代」預設清單，ul、li、p 這些都會不見
const ALLOW = {
  elements: ["button", "img", "label", "input", "details", "summary"],
  attributes: [
    "id",
    "role",
    "type",
    "for",
    "src",
    "alt",
    "href",
    "aria-label",
    "aria-labelledby",
    "aria-describedby",
    "aria-expanded",
    "aria-controls",
    "aria-current",
    "aria-live",
    "aria-hidden",
  ],
};

const modeCode = computed(() => ({
  default: "setHTML(html)",
  empty: "setHTML(html, { sanitizer: {} })",
  allow:
    locale.value === "en"
      ? "setHTML(html, { sanitizer: defaults + allowlist })"
      : "setHTML(html, { sanitizer: 預設 + 允許清單 })",
}));

const messages = {
  "zh-Hant-TW": {
    label:
      "互動範例：同一段 HTML 交給 setHTML()，比較三種設定會清掉什麼。可以自己修改輸入的 HTML",
    input: "輸入的 HTML",
    mode: "設定",
    output: "setHTML() 之後的 HTML",
    nothing: "沒有任何東西被清掉。",
    count: (n: number) => `被清掉的元素和屬性（共 ${n} 種）：`,
    native: "你的瀏覽器支援 setHTML()",
    fallback:
      "你的瀏覽器不支援 setHTML()，這個範例無法執行，可以先看文章裡的實測結果",
    detecting: "偵測中（需要 JavaScript）",
    print: "此處為互動範例，請在網頁上操作。",
    el: "元素",
    attr: "屬性",
  },
  en: {
    label:
      "Live demo: give the same HTML to setHTML() and compare what three settings remove. You can edit the input HTML",
    input: "Input HTML",
    mode: "Setting",
    output: "HTML after setHTML()",
    nothing: "Nothing was removed.",
    count: (n: number) =>
      `Elements and attributes removed (${n} ${n === 1 ? "kind" : "kinds"}):`,
    native: "Your browser supports setHTML()",
    fallback:
      "Your browser doesn't support setHTML(), so this demo can't run; the test results in the post still apply",
    detecting: "Detecting (requires JavaScript)",
    print: "This is an interactive demo. Try it on the web page.",
    el: "element",
    attr: "attribute",
  },
};

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);

const modeText = computed(() =>
  supported.value === null
    ? text.value.detecting
    : supported.value
      ? text.value.native
      : text.value.fallback,
);

const summary = computed(() =>
  !output.value && !removed.value.length
    ? ""
    : removed.value.length
      ? text.value.count(removed.value.length)
      : text.value.nothing,
);

// 列出一段 DOM 裡出現過的元素和屬性名稱
function inventory(root: ParentNode) {
  const found = new Set<string>();
  root.querySelectorAll("*").forEach((el) => {
    found.add(`<${el.localName}>`);
    for (const a of el.attributes) found.add(a.name);
  });
  return found;
}

type SetHTML = (html: string, options?: { sanitizer?: unknown }) => void;

function run() {
  if (!supported.value) return;
  // DOMParser 解析出來的文件不會執行任何程式，只用來比對
  const parsed = new DOMParser().parseFromString(source.value, "text/html");
  const before = inventory(parsed.body);

  const box = document.createElement("div");
  const setHTML = (box as unknown as { setHTML: SetHTML }).setHTML.bind(box);
  if (mode.value === "default") setHTML(source.value);
  else if (mode.value === "empty") setHTML(source.value, { sanitizer: {} });
  else {
    const SanitizerCtor = (
      window as unknown as {
        Sanitizer: new () => {
          allowElement: (n: string) => void;
          allowAttribute: (n: string) => void;
        };
      }
    ).Sanitizer;
    const sanitizer = new SanitizerCtor();
    ALLOW.elements.forEach((n) => sanitizer.allowElement(n));
    ALLOW.attributes.forEach((n) => sanitizer.allowAttribute(n));
    setHTML(source.value, { sanitizer });
  }

  const after = inventory(box);
  removed.value = [...before].filter((x) => !after.has(x));
  output.value = box.innerHTML.trim();
}

watch([source, mode], run);

onMounted(() => {
  supported.value = "setHTML" in Element.prototype;
  run();
});
</script>
