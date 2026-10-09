<template>
  <div ref="root" class="dialog-demo">
    <p class="dialog-demo__label">{{ text.label }}</p>

    <div class="dialog-demo__controls">
      <button
        v-for="item in items"
        :key="item.value"
        type="button"
        class="dialog-demo__trigger"
        :commandfor="`${uid}-${item.value}`"
        command="show-modal"
      >
        <code>closedby="{{ item.value }}"</code>
      </button>
    </div>

    <dialog
      v-for="item in items"
      :id="`${uid}-${item.value}`"
      :key="item.value"
      class="dialog-demo__dialog"
      :closedby="item.value"
      :aria-labelledby="`${uid}-${item.value}-title`"
      @cancel="add('cancel', `${item.value}: ${text.cancel}`)"
      @close="add('close', `${item.value}: ${text.closed}`)"
    >
      <h4 :id="`${uid}-${item.value}-title`">
        <code>closedby="{{ item.value }}"</code>
      </h4>
      <p>{{ item.body }}</p>
      <button
        type="button"
        class="dialog-demo__close"
        :commandfor="`${uid}-${item.value}`"
        command="close"
      >
        {{ text.close }}
      </button>
    </dialog>

    <DialogEventLog :entries="entries" :title="text.logTitle" @clear="clear" />
    <p class="popover-demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：closedby 三種值的差別
// 用法：::dialog-closed-by
const { locale } = useI18n();
const root = ref<HTMLElement | null>(null);
const uid = usePopoverDemoId("dcb");
const { entries, add, clear } = useEventLog();
useDialogCommandFallback(root);

const messages = {
  "zh-Hant-TW": {
    label: "互動範例：打開之後，試試點對話框外面的半透明背景，以及按 Esc",
    close: "關閉",
    cancel: "收到關閉請求（cancel 事件）",
    closed: "已關閉（close 事件）",
    logTitle: "事件紀錄（最新在最上面）",
    print: "此處為互動範例，請在網頁上操作。",
    body: {
      any: "點背景、按 Esc、按關閉按鈕，三種都能關掉我。",
      closerequest:
        "按 Esc 或關閉按鈕可以關掉我，點背景沒反應。這也是 modal 的預設行為。",
      none: "只有關閉按鈕能關掉我，點背景、按 Esc 都沒用。",
    },
  },
  en: {
    label:
      "Live demo: after opening one, try clicking the dimmed backdrop and pressing Escape",
    close: "Close",
    cancel: "close request received (cancel event)",
    closed: "closed (close event)",
    logTitle: "Event log (newest first)",
    print: "This is an interactive demo. Try it on the web page.",
    body: {
      any: "Clicking the backdrop, pressing Escape or using the Close button all close me.",
      closerequest:
        "Escape or the Close button closes me; clicking the backdrop does nothing. This is also the default for modals.",
      none: "Only the Close button closes me. Clicking the backdrop or pressing Escape does nothing.",
    },
  },
};

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);

const values = ["any", "closerequest", "none"] as const;
const items = computed(() =>
  values.map((value) => ({ value, body: text.value.body[value] })),
);
</script>
