<template>
  <div ref="root" class="focusgroup-demo dialog-demo">
    <p class="dialog-demo__label">{{ text.label }}</p>

    <fieldset class="position-try-demo__options">
      <legend>{{ text.typeLegend }}</legend>
      <label v-for="item in types" :key="item" class="until-found-faq__sync">
        <input
          v-model="type"
          type="radio"
          :name="`${uid}-type`"
          :value="item"
        />
        <code>{{ item }}</code>
      </label>
    </fieldset>
    <div class="focusgroup-demo__mods">
      <label class="until-found-faq__sync">
        <input v-model="wrap" type="checkbox" />
        <span><code>wrap</code>{{ text.wrap }}</span>
      </label>
      <label class="until-found-faq__sync">
        <input v-model="nomemory" type="checkbox" />
        <span><code>nomemory</code>{{ text.nomemory }}</span>
      </label>
    </div>

    <pre class="position-try-demo__code"><code>{{ code }}</code></pre>

    <p class="focusgroup-demo__mode">{{ modeText }}</p>

    <div class="focusgroup-demo__stage">
      <button type="button" class="dialog-demo__close">
        {{ text.before }}
      </button>
      <!-- 換設定時用 key 重建，讓「記住的位置」歸零 -->
      <div
        :key="groupKey"
        ref="group"
        class="focusgroup-demo__group"
        :class="`is-${layout}`"
        :focusgroup="attr"
        :aria-label="text.groupName"
      >
        <button
          v-for="n in 4"
          :key="n"
          type="button"
          class="dialog-demo__close"
        >
          {{ text.item(n) }}
        </button>
      </div>
      <button type="button" class="dialog-demo__close">
        {{ text.after }}
      </button>
    </div>

    <div class="focusgroup-demo__log">
      <p class="focusgroup-demo__log-title">{{ text.logTitle }}</p>
      <ol>
        <li v-for="(entry, i) in log" :key="i">{{ entry }}</li>
      </ol>
    </div>
    <p class="popover-demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：切換 focusgroup 的類型與修飾詞，用鍵盤操作看焦點怎麼移動
// 不支援時改用 JavaScript roving tabindex 模擬（app/composables/useFocusgroupFallback.ts）
// 用法：::focusgroup-lab
const { locale } = useI18n();
const uid = usePopoverDemoId("fgl");
const root = ref<HTMLElement | null>(null);
const group = ref<HTMLElement | null>(null);

const types = Object.keys(FOCUSGROUP_BEHAVIORS) as FocusgroupType[];
const type = ref<FocusgroupType>("toolbar");
const wrap = ref(false);
const nomemory = ref(false);
const supported = ref<boolean | null>(null);
const log = ref<string[]>([]);

const messages = {
  "zh-Hant-TW": {
    label:
      "互動範例：選一種類型，從「前面的按鈕」按 Tab 進去，再用方向鍵、Home、End 試試看",
    typeLegend: "focusgroup 的類型",
    wrap: "（到頭尾時繞回；toolbar、listbox 以外的類型本來就會繞回）",
    nomemory: "（Tab 回來時不記得上次的位置）",
    before: "前面的按鈕",
    after: "後面的按鈕",
    groupName: "示範群組",
    item: (n: number) => `項目 ${n}`,
    native: "目前使用：瀏覽器原生的 focusgroup",
    fallback:
      "你的瀏覽器不支援 focusgroup，目前使用 JavaScript 模擬（roving tabindex）",
    pending: "偵測中（需要 JavaScript）",
    logTitle: "按鍵紀錄（最新在最上面）",
    logEntry: (key: string, target: string) => `${key} → ${target}`,
    stay: "沒有移動",
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    label:
      'Live demo: pick a type, Tab in from "Button before", then try the arrow keys, Home and End',
    typeLegend: "focusgroup type",
    wrap: " (wrap around at the ends; types other than toolbar and listbox already wrap)",
    nomemory: " (don't remember the last item when tabbing back)",
    before: "Button before",
    after: "Button after",
    groupName: "Demo group",
    item: (n: number) => `Item ${n}`,
    native: "Using: the browser's native focusgroup",
    fallback:
      "Your browser doesn't support focusgroup, so this uses a JavaScript fallback (roving tabindex)",
    pending: "Detecting (requires JavaScript)",
    logTitle: "Key log (newest first)",
    logEntry: (key: string, target: string) => `${key} → ${target}`,
    stay: "didn't move",
    print: "This is an interactive demo. Try it on the web page.",
  },
};

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);

// wrap 只在該類型預設不繞回時才有意義
const effectiveWrap = computed(
  () => FOCUSGROUP_BEHAVIORS[type.value].wrap || wrap.value,
);
const attr = computed(() =>
  [
    type.value,
    wrap.value && !FOCUSGROUP_BEHAVIORS[type.value].wrap ? "wrap" : "",
    nomemory.value ? "nomemory" : "",
  ]
    .filter(Boolean)
    .join(" "),
);
const code = computed(
  () =>
    `<div focusgroup="${attr.value}" aria-label="…">\n  <button>…</button>\n  …\n</div>`,
);
const layout = computed(() =>
  FOCUSGROUP_BEHAVIORS[type.value].inline ? "row" : "column",
);
const groupKey = computed(() => attr.value);

const modeText = computed(() =>
  supported.value === null
    ? text.value.pending
    : supported.value
      ? text.value.native
      : text.value.fallback,
);

let controller: AbortController | null = null;
function setup() {
  controller?.abort();
  controller = new AbortController();
  const el = group.value;
  if (!el) return;
  const { signal } = controller;
  if (!supported.value) {
    applyFocusgroupFallback(
      el,
      { type: type.value, wrap: effectiveWrap.value, memory: !nomemory.value },
      signal,
    );
  }
  // 紀錄按鍵與焦點落點：keydown 記下按了什麼，焦點真的移動時（focusin）記落點；
  // 放開按鍵時焦點還沒動，就記「沒有移動」
  const KEYS = [
    "Tab",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Home",
    "End",
  ];
  let pending: string | null = null;
  const push = (entry: string) => {
    log.value = [entry, ...log.value].slice(0, 6);
  };
  const r = root.value;
  if (!r) return;
  r.addEventListener(
    "keydown",
    (e) => {
      if (!KEYS.includes(e.key)) return;
      pending = e.shiftKey && e.key === "Tab" ? "Shift+Tab" : e.key;
    },
    // 捕獲階段：JavaScript 後備會在 keydown 裡直接移動焦點，要比它先記下按鍵
    { signal, capture: true },
  );
  document.addEventListener(
    "focusin",
    (e) => {
      if (!pending) return;
      push(
        text.value.logEntry(
          pending,
          (e.target as HTMLElement).textContent?.trim() ?? "",
        ),
      );
      pending = null;
    },
    { signal },
  );
  r.addEventListener(
    "keyup",
    () => {
      if (!pending) return;
      push(text.value.logEntry(pending, text.value.stay));
      pending = null;
    },
    { signal },
  );
}

watch(groupKey, async () => {
  log.value = [];
  await nextTick();
  setup();
});

onMounted(() => {
  supported.value = supportsFocusgroup();
  setup();
});
onBeforeUnmount(() => controller?.abort());
</script>
