<template>
  <div class="sym-demo demo">
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

    <label v-if="mode === 'check'" class="demo__option">
      <input v-model="withText" type="checkbox" />
      <span>{{ text.withText }}</span>
    </label>

    <ul class="sym-demo__list" :class="`is-${mode}`">
      <li v-for="item in text.items" :key="item">
        {{ item
        }}<template v-if="mode === 'check' && withText">{{
          text.boughtSuffix
        }}</template>
      </li>
    </ul>

    <dl class="attr-demo__readout" :class="{ 'is-mismatch': lost }">
      <div>
        <dt>{{ text.nowLabel }}</dt>
        <dd>
          {{
            supported === false && mode !== "speakas"
              ? text.fallbackMarker
              : now[mode]
          }}
        </dd>
      </div>
      <div>
        <dt>{{ text.voLabel }}</dt>
        <dd>{{ text.vo[mode] }}</dd>
      </div>
      <div>
        <dt>{{ text.specLabel }}</dt>
        <dd>{{ text.spec[mode] }}</dd>
      </div>
      <div>
        <dt>{{ text.meaningLabel }}</dt>
        <dd>{{ meaningText }}</dd>
      </div>
    </dl>
    <p class="sym-demo__note">{{ text.note }}</p>

    <p class="demo__status">{{ modeText }}</p>
    <p class="demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：symbols() 自訂清單符號，比較報讀軟體現在拿到的標記和規格要求的念法
// 用法：::symbols-demo
type Mode = "cyclic" | "symbolic" | "check" | "speakas";

const uid = useDemoId("sym");

const modes: Mode[] = ["cyclic", "symbolic", "check", "speakas"];
const code: Record<Mode, string> = {
  cyclic: 'symbols(cyclic "◆" "◇")',
  symbolic: 'symbols("◆")',
  check: 'symbols(cyclic "✓")',
  speakas: "@counter-style + speak-as: bullets",
};
// Chromium 157、159 實測：無障礙樹裡清單標記的文字（JavaScript 讀不到無障礙樹，這裡是對照表）
const now: Record<Mode, string> = {
  cyclic: "◆",
  symbolic: "◆",
  check: "✓",
  speakas: "◆",
};

const mode = ref<Mode>("cyclic");
const withText = ref(false);
const supported = ref<boolean | null>(null);

const messages = {
  "zh-Hant-TW": {
    label:
      "互動範例：切換清單符號的寫法，比較報讀軟體現在拿到的標記，以及規格要求的念法",
    modeLegend: "清單符號的寫法",
    modes: {
      cyclic: "裝飾用，寫 cyclic",
      symbolic: "裝飾用，沒寫類型",
      check: "用 ✓ 表示「已買」",
      speakas: "用 @counter-style 指定念法",
    },
    withText: "把「已買」寫進文字",
    items: ["蘋果", "香蕉", "牛奶"],
    boughtSuffix: "（已買）",
    nowLabel: "Chromium 現在交給報讀軟體的標記",
    fallbackMarker: "•（你的瀏覽器不支援，退回預設圓點）",
    voLabel: "VoiceOver（Chrome）實測念法",
    vo: {
      cyclic: "念出「… diamond」，每一項都念",
      symbolic: "念出「… diamond」，每一項都念",
      check: "完全不念 ✓",
      speakas: "還是念出「… diamond」，speak-as 沒有作用",
    },
    specLabel: "規格要求的念法（瀏覽器照規格實作後）",
    spec: {
      cyclic: "項目符號（例如「圓點」）",
      symbolic: "數字：1、2、3",
      check: "項目符號：✓ 的意思不見了",
      speakas: "項目符號",
    },
    meaningLabel: "符號的意思有傳達出去嗎？",
    decorative: "符號只是裝飾，不需要傳達",
    lostText:
      "沒有：VoiceOver（Chrome）實測完全不念 ✓，照規格又會變成一般項目符號",
    keptText: "有：「已買」寫在文字裡，不靠符號",
    note: "「現在交給報讀軟體的標記」與「規格要求的念法」是 Chromium 157、159 的實測結果（後者用旗標開啟規格行為），網頁程式讀不到無障礙樹，所以不會隨你的瀏覽器改變。VoiceOver 念法是在 macOS 搭配 Chrome 實測，其他報讀軟體和瀏覽器可能不同。",
    native: "你的瀏覽器支援 symbols()",
    fallback:
      "你的瀏覽器不支援 symbols()：整條宣告會被忽略，清單退回預設的圓點",
    detecting: "偵測中（需要 JavaScript）",
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    label:
      "Live demo: switch how the list markers are written, and compare the marker screen readers get today with how the spec says it should be read",
    modeLegend: "How the list markers are written",
    modes: {
      cyclic: "Decorative, with cyclic",
      symbolic: "Decorative, no type",
      check: "✓ meaning “bought”",
      speakas: "@counter-style with speak-as",
    },
    withText: "Put “bought” in the text",
    items: ["Apples", "Bananas", "Milk"],
    boughtSuffix: " (bought)",
    nowLabel: "Marker Chromium gives screen readers today",
    fallbackMarker:
      "• (not supported in your browser, so it falls back to the default bullet)",
    voLabel: "What VoiceOver (Chrome) reads, tested",
    vo: {
      cyclic: "“… diamond”, for every item",
      symbolic: "“… diamond”, for every item",
      check: "Nothing: ✓ isn't read",
      speakas: "Still “… diamond”; speak-as has no effect",
    },
    specLabel: "How the spec says to read it (once browsers implement it)",
    spec: {
      cyclic: "As a bullet",
      symbolic: "As numbers: 1, 2, 3",
      check: "As a bullet: the meaning of ✓ is lost",
      speakas: "As a bullet",
    },
    meaningLabel: "Does the symbol's meaning get across?",
    decorative: "The symbol is decorative; there's nothing to convey",
    lostText:
      "No: in tests VoiceOver (Chrome) doesn't read ✓ at all, and per the spec it becomes a plain bullet",
    keptText: "Yes: “bought” is in the text, not just the symbol",
    note: "“Marker Chromium gives screen readers today” and “How the spec says to read it” are test results from Chromium 157 and 159 (the latter with a flag that turns on the spec behavior). Page scripts can't read the accessibility tree, so these don't change with your browser. The VoiceOver results were tested on macOS in Chrome; other screen readers and browsers may differ.",
    native: "Your browser supports symbols()",
    fallback:
      "Your browser doesn't support symbols(): the whole declaration is ignored and the list falls back to the default bullet",
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

// 用 ✓ 表示狀態，卻沒有把狀態寫進文字：意思只靠符號
const lost = computed(() => mode.value === "check" && !withText.value);
const meaningText = computed(() =>
  mode.value !== "check"
    ? text.value.decorative
    : withText.value
      ? text.value.keptText
      : text.value.lostText,
);

onMounted(() => {
  supported.value = featureDetectors.symbols!.detect();
});
</script>
