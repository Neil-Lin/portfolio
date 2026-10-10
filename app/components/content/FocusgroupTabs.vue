<template>
  <div ref="root" class="focusgroup-demo dialog-demo">
    <p class="dialog-demo__label">{{ text.label }}</p>

    <label class="until-found-faq__sync">
      <input v-model="useStart" type="checkbox" />
      <span><code>focusgroupstart</code>{{ text.toggle }}</span>
    </label>

    <div class="focusgroup-demo__stage is-column">
      <button type="button" class="dialog-demo__close">
        {{ text.before }}
      </button>

      <div class="focusgroup-tabs">
        <!-- 換設定時重建整組，讓「記住的位置」歸零，才看得出第一次進來停在哪 -->
        <div
          :key="`${useStart}`"
          ref="tablist"
          class="focusgroup-tabs__list"
          focusgroup="tablist"
          role="tablist"
          :aria-label="text.name"
        >
          <button
            v-for="(tab, i) in tabs"
            :id="`${uid}-tab-${i}`"
            :key="tab.key"
            type="button"
            role="tab"
            class="focusgroup-tabs__tab"
            :aria-selected="selected === i ? 'true' : 'false'"
            :aria-controls="`${uid}-panel-${i}`"
            :focusgroupstart="useStart && selected === i ? '' : undefined"
            @focus="selected = i"
            @click="selected = i"
          >
            {{ tab.title }}
          </button>
        </div>
        <div
          v-for="(tab, i) in tabs"
          :id="`${uid}-panel-${i}`"
          :key="tab.key"
          role="tabpanel"
          class="focusgroup-tabs__panel"
          :aria-labelledby="`${uid}-tab-${i}`"
          tabindex="0"
          :hidden="selected !== i"
        >
          {{ tab.body }}
        </div>
      </div>
    </div>
    <p class="focusgroup-demo__mode">{{ result }}</p>
    <p class="popover-demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：focusgroup="tablist" 第一次 Tab 進來，停在第一個頁籤還是「選取中」的頁籤
// 用法：::focusgroup-tabs
const { locale } = useI18n();
const uid = usePopoverDemoId("fgt");
const root = ref<HTMLElement | null>(null);
const tablist = ref<HTMLElement | null>(null);
const useStart = ref(false);
// 預設選取第二個頁籤，才看得出差別
const selected = ref(1);
const firstEntry = ref<string | null>(null);

const messages = {
  "zh-Hant-TW": {
    label:
      "互動範例：預設選取的是「規格」。從「前面的按鈕」按一次 Tab，看焦點落在哪個頁籤",
    toggle: "（讓選取中的頁籤當入口）",
    before: "前面的按鈕",
    name: "產品資訊",
    tabs: [
      { key: "intro", title: "介紹", body: "介紹的內容。" },
      { key: "spec", title: "規格", body: "規格的內容。" },
      { key: "review", title: "評價", body: "評價的內容。" },
    ],
    result: (t: string | null) =>
      t ? `第一次 Tab 進來，焦點落在「${t}」` : "還沒從外面 Tab 進來。",
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    label:
      'Live demo: "Specs" is selected by default. Press Tab once from "Button before" and see which tab gets focus',
    toggle: " (use the selected tab as the entry point)",
    before: "Button before",
    name: "Product info",
    tabs: [
      { key: "intro", title: "Overview", body: "Overview content." },
      { key: "spec", title: "Specs", body: "Specs content." },
      { key: "review", title: "Reviews", body: "Reviews content." },
    ],
    result: (t: string | null) =>
      t
        ? `On the first Tab in, focus landed on "${t}"`
        : "You haven't tabbed in from outside yet.",
    print: "This is an interactive demo. Try it on the web page.",
  },
};

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);
const tabs = computed(() => text.value.tabs);
const result = computed(() => text.value.result(firstEntry.value));

let controller: AbortController | null = null;
function setup() {
  controller?.abort();
  controller = new AbortController();
  const el = tablist.value;
  if (!el) return;
  const { signal } = controller;
  let entered = false;
  if (!supportsFocusgroup()) {
    applyFocusgroupFallback(
      el,
      {
        type: "tablist",
        start: () =>
          useStart.value
            ? el.querySelector<HTMLElement>('[aria-selected="true"]')
            : null,
      },
      signal,
    );
  }
  // 記錄「從外面第一次 Tab 進來」落在哪個頁籤
  el.addEventListener(
    "focusin",
    (e) => {
      if (entered || el.contains(e.relatedTarget as Node)) return;
      entered = true;
      firstEntry.value = (e.target as HTMLElement).textContent?.trim() ?? null;
    },
    { signal, capture: true },
  );
}

watch(useStart, async () => {
  selected.value = 1;
  firstEntry.value = null;
  await nextTick();
  setup();
});

onMounted(setup);
onBeforeUnmount(() => controller?.abort());
</script>
