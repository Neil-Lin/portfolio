<template>
  <div ref="root" class="until-found-demo until-found-compare">
    <p class="until-found-demo__label">{{ text.label }}</p>

    <div class="until-found-compare__grid">
      <section
        v-for="(item, i) in items"
        :key="item.key"
        class="until-found-compare__item"
        :class="`is-${item.key}`"
        :aria-labelledby="`${uid}-${item.key}-title`"
      >
        <h4 :id="`${uid}-${item.key}-title`" class="until-found-compare__title">
          {{ item.title }}
        </h4>
        <code class="until-found-compare__code">{{ item.code }}</code>
        <!-- 關鍵字用 ::after 顯示：偽元素內容搜尋不到，才不會跟面板裡的字搶第一個符合結果；
             報讀軟體仍會唸出 CSS 產生的內容 -->
        <p class="until-found-compare__keyword" :data-keyword="item.keyword">
          {{ text.keyword }}
        </p>
        <button
          type="button"
          class="until-found-demo__toggle"
          :aria-expanded="open[i] ? 'true' : 'false'"
          :aria-controls="`${uid}-${item.key}`"
          @click="toggle(i)"
        >
          {{ open[i] ? text.collapse : text.expand }}
        </button>
        <div
          :id="`${uid}-${item.key}`"
          class="until-found-compare__panel"
          :class="{
            'is-height-collapsed': item.key === 'height' && !open[i],
            'uf-reset': item.key === 'reset',
          }"
          :hidden.attr="panelHidden(item.key, i)"
        >
          <p>{{ item.sentence }}</p>
        </div>
        <p
          class="until-found-compare__status"
          :class="{ 'is-found': found[i] }"
        >
          {{ found[i] ? text.found : open[i] ? text.opened : text.closed }}
        </p>
      </section>
    </div>

    <button type="button" class="until-found-demo__reset" @click="collapseAll">
      {{ text.reset }}
    </button>
    <p class="popover-demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：四種收合方式並排，讓讀者自己按 Ctrl+F 測試哪些搜得到
// 用法：::until-found-compare
const { locale } = useI18n();
const root = ref<HTMLElement | null>(null);
const uid = usePopoverDemoId("ufc");

type Key = "hidden" | "height" | "until" | "reset";

const messages = {
  "zh-Hant-TW": {
    label: "互動範例：按 Ctrl+F（Mac 是 ⌘+F）搜尋各區塊標示的關鍵字",
    keyword: "要搜尋的關鍵字：",
    expand: "展開",
    collapse: "收合",
    closed: "狀態：收合中",
    opened: "狀態：已展開",
    found: "狀態：被搜尋找到，自動展開了！",
    reset: "全部收合，再試一次",
    print: "此處為互動範例，請在網頁上操作。",
    items: {
      hidden: {
        title: "hidden",
        sentence: "這段用 hidden 藏起來，裡面有海獺。",
        keyword: "海獺",
      },
      height: {
        title: "height: 0",
        sentence: "這段用高度 0 藏起來，裡面有企鵝。",
        keyword: "企鵝",
      },
      until: {
        title: 'hidden="until-found"',
        sentence: "這段用 until-found 藏起來，裡面有長頸鹿。",
        keyword: "長頸鹿",
      },
      reset: {
        title: "until-found ＋ 常見 reset",
        sentence:
          "這段用 until-found 藏起來，但被 reset 蓋掉了，裡面有無尾熊。",
        keyword: "無尾熊",
      },
    },
  },
  en: {
    label:
      "Live demo: press Ctrl+F (⌘+F on Mac) and search for each block's keyword",
    keyword: "Keyword to search: ",
    expand: "Expand",
    collapse: "Collapse",
    closed: "State: collapsed",
    opened: "State: expanded",
    found: "State: found by search and expanded!",
    reset: "Collapse all and try again",
    print: "This is an interactive demo. Try it on the web page.",
    items: {
      hidden: {
        title: "hidden",
        sentence: "This one is hidden with hidden, and it contains an otter.",
        keyword: "otter",
      },
      height: {
        title: "height: 0",
        sentence:
          "This one is hidden with a height of 0, and it contains a penguin.",
        keyword: "penguin",
      },
      until: {
        title: 'hidden="until-found"',
        sentence:
          "This one is hidden with until-found, and it contains a giraffe.",
        keyword: "giraffe",
      },
      reset: {
        title: "until-found + a common reset",
        sentence:
          "This one uses until-found, but a reset overrides it, and it contains a koala.",
        keyword: "koala",
      },
    },
  },
} as const;

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);

const codeOf: Record<Key, string> = {
  hidden: "<div hidden>",
  height: "height: 0; overflow: hidden",
  until: '<div hidden="until-found">',
  reset: "[hidden] { display: none !important }",
};

const keys: Key[] = ["hidden", "height", "until", "reset"];
const items = computed(() =>
  keys.map((key) => ({ key, code: codeOf[key], ...text.value.items[key] })),
);

const open = ref([false, false, false, false]);
const found = ref([false, false, false, false]);

function panelHidden(key: Key, i: number) {
  if (open.value[i] || key === "height") return undefined;
  return key === "hidden" ? "" : "until-found";
}

function toggle(i: number) {
  open.value[i] = !open.value[i];
  if (!open.value[i]) found.value[i] = false;
}

function collapseAll() {
  open.value = [false, false, false, false];
  found.value = [false, false, false, false];
}

let controller: AbortController | null = null;
onMounted(() => {
  controller = new AbortController();
  keys.forEach((key, i) => {
    document.getElementById(`${uid}-${key}`)?.addEventListener(
      "beforematch",
      () => {
        open.value[i] = true;
        found.value[i] = true;
      },
      { signal: controller!.signal },
    );
  });
});
onBeforeUnmount(() => controller?.abort());
</script>
