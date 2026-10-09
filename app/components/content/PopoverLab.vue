<template>
  <div ref="root" class="popover-lab">
    <div class="popover-lab__controls">
      <button
        :id="`${uid}-menu-btn`"
        type="button"
        class="popover-demo__trigger is-auto"
        :commandfor="`${uid}-menu`"
        command="toggle-popover"
        :style="`anchor-name: --${uid}-menu-btn`"
      >
        {{ text.menu }}
      </button>
      <button
        type="button"
        class="popover-demo__trigger is-manual"
        @click="showToast"
      >
        {{ text.showToast }}
      </button>
    </div>

    <p class="popover-demo__print">{{ text.print }}</p>

    <div class="popover-lab__log-head">
      <p :id="`${uid}-log-title`" class="popover-lab__log-title">
        {{ text.logTitle }}
      </p>
      <button
        type="button"
        class="popover-demo__close"
        :disabled="!entries.length"
        @click="entries = []"
      >
        {{ text.clear }}
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

    <!-- auto 選單：項目上的提示是 hint，打開提示不會關掉選單 -->
    <div
      :id="`${uid}-menu`"
      ref="menu"
      popover="auto"
      class="popover-demo__pop is-auto is-below popover-lab__menu"
      :data-anchor="`${uid}-menu-btn`"
      :style="`position-anchor: --${uid}-menu-btn`"
      :data-kind="'auto'"
      :data-name="text.menu"
    >
      <button
        v-for="item in items"
        :id="item.btnId"
        :key="item.id"
        type="button"
        :data-tip="item.id"
        :aria-describedby="item.id"
        :style="`anchor-name: --${item.btnId}`"
        @click="runAction(item.label)"
      >
        {{ item.label }}
      </button>
    </div>
    <div
      v-for="item in items"
      :id="item.id"
      :key="item.id"
      popover="hint"
      role="tooltip"
      class="popover-demo__pop is-tip is-above"
      :data-anchor="item.btnId"
      :style="`position-anchor: --${item.btnId}`"
      data-kind="hint"
      :data-name="`${text.tipPrefix}${item.label}`"
    >
      {{ item.tip }}
    </div>

    <div
      :id="`${uid}-toast`"
      ref="toast"
      popover="manual"
      class="popover-demo__pop is-manual popover-lab__toast"
      data-kind="manual"
      :data-name="text.toastName"
    >
      <span>{{ text.toast }}</span>
      <button
        type="button"
        class="popover-demo__close"
        :commandfor="`${uid}-toast`"
        command="hide-popover"
      >
        {{ text.close }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：auto 選單 + hint 提示 + manual 通知的綜合實驗，附 toggle 事件紀錄
// 用法：::popover-lab
const { locale } = useI18n();

const root = ref<HTMLElement | null>(null);
const menu = ref<HTMLElement | null>(null);
const toast = ref<HTMLElement | null>(null);
const uid = usePopoverDemoId("pl");

const messages = {
  "zh-Hant-TW": {
    menu: "檔案選單",
    showToast: "顯示 toast",
    toast: "已儲存變更",
    toastName: "toast 通知",
    close: "關閉",
    clear: "清除紀錄",
    logTitle: "事件紀錄（最新在最上面）",
    empty: "還沒有事件。按上面的按鈕試試。",
    print: "此處為互動範例，請在網頁上操作。",
    tipPrefix: "提示：",
    opened: "打開",
    closed: "關閉",
    run: "執行：",
    items: [
      { label: "複製", tip: "Ctrl+C" },
      { label: "重新命名", tip: "F2" },
      { label: "刪除", tip: "刪除後可在 30 天內從垃圾桶復原" },
    ],
  },
  en: {
    menu: "File menu",
    showToast: "Show toast",
    toast: "Changes saved",
    toastName: "toast",
    close: "Close",
    clear: "Clear log",
    logTitle: "Event log (newest first)",
    empty: "No events yet. Try the buttons above.",
    print: "This is an interactive demo. Try it on the web page.",
    tipPrefix: "tooltip: ",
    opened: "opened",
    closed: "closed",
    run: "ran: ",
    items: [
      { label: "Copy", tip: "Ctrl+C" },
      { label: "Rename", tip: "F2" },
      { label: "Delete", tip: "Deleted items stay in the trash for 30 days" },
    ],
  },
} as const;

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);

const items = computed(() =>
  text.value.items.map((item, i) => ({
    id: `${uid}-tip-${i}`,
    btnId: `${uid}-item-${i}`,
    label: item.label,
    tip: item.tip,
  })),
);

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

usePopoverDemo(root, (pop, open) => {
  const state = open ? text.value.opened : text.value.closed;
  addEntry(pop.dataset.kind ?? "", `${pop.dataset.name} ${state}`);
});

function runAction(label: string) {
  addEntry("app", `${text.value.run}${label}`);
  menu.value?.hidePopover();
  document.getElementById(`${uid}-menu-btn`)?.focus();
}

function showToast() {
  if (toast.value && !toast.value.matches(":popover-open")) {
    toast.value.showPopover();
  }
}
</script>
