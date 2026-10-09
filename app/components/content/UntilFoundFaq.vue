<template>
  <div class="until-found-demo until-found-faq">
    <p class="until-found-demo__label">{{ text.label }}</p>

    <label class="until-found-faq__sync">
      <input v-model="sync" type="checkbox" />
      {{ text.sync }}
    </label>

    <div class="until-found-faq__list">
      <div v-for="(item, i) in items" :key="i" class="until-found-faq__item">
        <h4 class="until-found-faq__question">
          <button
            :id="`${uid}-q${i}`"
            type="button"
            :aria-expanded="open[i] ? 'true' : 'false'"
            :aria-controls="`${uid}-a${i}`"
            @click="toggle(i)"
          >
            <span>{{ item.q }}</span>
            <code aria-hidden="true">aria-expanded="{{ open[i] }}"</code>
          </button>
        </h4>
        <div
          :id="`${uid}-a${i}`"
          class="until-found-faq__answer"
          role="region"
          :aria-labelledby="`${uid}-q${i}`"
          :hidden.attr="open[i] ? undefined : 'until-found'"
        >
          <p :id="`${uid}-a${i}-detail`">{{ item.a }}</p>
        </div>
      </div>
    </div>

    <p class="until-found-faq__links">
      {{ text.deepLinks }}
      <a :href="`#${uid}-a2-detail`">{{ text.deepLink }}</a>
    </p>

    <div class="popover-lab__log-head">
      <p :id="`${uid}-log-title`" class="popover-lab__log-title">
        {{ text.logTitle }}
      </p>
      <button type="button" class="popover-demo__close" @click="collapseAll">
        {{ text.reset }}
      </button>
    </div>
    <ol class="popover-lab__log" :aria-labelledby="`${uid}-log-title`">
      <li v-if="!entries.length" class="is-empty">{{ text.empty }}</li>
      <li v-for="entry in entries" :key="entry.id">
        <span class="popover-lab__time">{{ entry.time }}</span>
        <span :class="`is-${entry.kind}`">{{ entry.kind }}</span>
        <span>{{ entry.message }}</span>
      </li>
    </ol>
    <p class="popover-demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：until-found 的 FAQ 範例，附 beforematch 事件紀錄、
// 深層連結，以及「不同步 aria-expanded」的錯誤示範開關
// 用法：::until-found-faq
const { locale } = useI18n();
const uid = usePopoverDemoId("uff");

const messages = {
  "zh-Hant-TW": {
    label: "互動範例：常見問答",
    sync: "收到 beforematch 時同步 aria-expanded（取消勾選看看錯誤示範）",
    deepLinks: "深層連結：",
    deepLink: "直接連到第 3 題答案裡的段落",
    logTitle: "事件紀錄（最新在最上面）",
    empty: "還沒有事件。試試 Ctrl+F 搜尋答案裡的字，或點上面的連結。",
    reset: "全部收合",
    print: "此處為互動範例，請在網頁上操作。",
    found: "被找到，瀏覽器移除了 hidden：",
    paren: ["（", "）"],
    synced: "已同步 aria-expanded=true",
    notSynced: "沒有同步，按鈕還是 aria-expanded=false",
    toggled: (open: boolean) => (open ? "按鈕展開：" : "按鈕收合："),
    items: [
      {
        q: "退貨期限是多久？",
        a: "收到商品後 7 天內都可以申請退貨，商品需保持完整包裝。",
      },
      {
        q: "可以開立統一編號嗎？",
        a: "可以，結帳時在發票欄位填入 8 碼統一編號即可。",
      },
      {
        q: "運費怎麼計算？",
        a: "單筆訂單滿 1,000 元免運費，未滿則酌收 80 元物流處理費。",
      },
    ],
  },
  en: {
    label: "Live demo: FAQ",
    sync: "Sync aria-expanded on beforematch (uncheck to see the broken version)",
    deepLinks: "Deep link: ",
    deepLink: "jump straight to a paragraph inside answer 3",
    logTitle: "Event log (newest first)",
    empty:
      "No events yet. Try Ctrl+F for a word in an answer, or use the link above.",
    reset: "Collapse all",
    print: "This is an interactive demo. Try it on the web page.",
    found: "found, the browser removed hidden: ",
    paren: [" (", ")"],
    synced: "synced aria-expanded=true",
    notSynced: "not synced, the button still says aria-expanded=false",
    toggled: (open: boolean) =>
      open ? "expanded by button: " : "collapsed by button: ",
    items: [
      {
        q: "How long do I have to return an item?",
        a: "You can request a return within 7 days of delivery, as long as the item is in its original packaging.",
      },
      {
        q: "Can I get a company invoice?",
        a: "Yes. Enter your company tax ID in the invoice field at checkout.",
      },
      {
        q: "How is shipping calculated?",
        a: "Orders over $30 ship free; smaller orders have a flat $3 handling fee.",
      },
    ],
  },
};

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);
const items = computed(() => text.value.items);

const open = ref([false, false, false]);
const sync = ref(true);

interface Entry {
  id: number;
  time: string;
  kind: string;
  message: string;
}
const MAX_ENTRIES = 30;
const entries = ref<Entry[]>([]);
let nextId = 0;

function addEntry(kind: string, message: string) {
  const time = new Date().toLocaleTimeString(
    locale.value === "en" ? "en-US" : "zh-TW",
    { hour12: false },
  );
  entries.value = [
    { id: nextId++, time, kind, message },
    ...entries.value,
  ].slice(0, MAX_ENTRIES);
}

// 用元件狀態決定展開與否，不用 el.hidden = !el.hidden：
// 收合時 el.hidden 是字串 "until-found"，那樣切換一次就會變回一般的 hidden
function toggle(i: number) {
  open.value[i] = !open.value[i];
  addEntry("app", `${text.value.toggled(open.value[i])}${items.value[i]?.q}`);
}

function collapseAll() {
  open.value = [false, false, false];
  // 不同步時，瀏覽器移除的 hidden 不會因為狀態沒變而被加回去，手動補上
  items.value.forEach((_, i) => {
    document
      .getElementById(`${uid}-a${i}`)
      ?.setAttribute("hidden", "until-found");
  });
}

let controller: AbortController | null = null;
onMounted(() => {
  controller = new AbortController();
  items.value.forEach((item, i) => {
    document.getElementById(`${uid}-a${i}`)?.addEventListener(
      "beforematch",
      () => {
        if (sync.value) open.value[i] = true;
        addEntry(
          "beforematch",
          `${text.value.found}${item.q}${text.value.paren[0]}${sync.value ? text.value.synced : text.value.notSynced}${text.value.paren[1]}`,
        );
      },
      { signal: controller!.signal },
    );
  });
});
onBeforeUnmount(() => controller?.abort());
</script>
