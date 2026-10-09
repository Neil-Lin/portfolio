<template>
  <div ref="root" class="dialog-demo">
    <p class="dialog-demo__label">{{ text.label }}</p>

    <div class="dialog-demo__controls">
      <button type="button" class="dialog-demo__trigger" @click="openPlain">
        {{ text.openPlain }}
      </button>
      <button
        type="button"
        class="dialog-demo__trigger is-modal"
        :commandfor="`${uid}-modal`"
        command="show-modal"
      >
        {{ text.openModal }}
      </button>
    </div>

    <div class="dialog-demo__background">
      <p>{{ text.background }}</p>
      <button type="button" class="dialog-demo__counter" @click="count++">
        {{ text.counter(count) }}
      </button>
    </div>

    <dialog
      :id="`${uid}-plain`"
      ref="plain"
      class="dialog-demo__dialog"
      :aria-labelledby="`${uid}-plain-title`"
      @close="onClose(text.plainName)"
    >
      <h4 :id="`${uid}-plain-title`">{{ text.plainTitle }}</h4>
      <p>{{ text.plainBody }}</p>
      <button
        type="button"
        class="dialog-demo__close"
        :commandfor="`${uid}-plain`"
        command="close"
      >
        {{ text.close }}
      </button>
    </dialog>

    <dialog
      :id="`${uid}-modal`"
      class="dialog-demo__dialog"
      :aria-labelledby="`${uid}-modal-title`"
      @close="onClose(text.modalName)"
    >
      <h4 :id="`${uid}-modal-title`">{{ text.modalTitle }}</h4>
      <p>{{ text.modalBody }}</p>
      <button
        type="button"
        class="dialog-demo__close"
        :commandfor="`${uid}-modal`"
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
// 部落格文章用：show()（非 modal）與 show-modal 的差別
// 用法：::dialog-modal-compare
const { locale } = useI18n();
const root = ref<HTMLElement | null>(null);
const plain = ref<HTMLDialogElement | null>(null);
const uid = usePopoverDemoId("dmc");
const count = ref(0);
const { entries, add, clear } = useEventLog();
useDialogCommandFallback(root);

const messages = {
  "zh-Hant-TW": {
    label: "互動範例：show() 與 show-modal",
    openPlain: "用 show() 打開（非 modal）",
    openModal: "用 show-modal 打開（modal）",
    background:
      "這裡代表對話框後面的頁面。打開對話框後，試著按 Tab，或點這個按鈕：",
    counter: (n: number) => `背景按鈕（被按了 ${n} 次）`,
    plainName: "非 modal",
    modalName: "modal",
    plainTitle: "我是非 modal 的對話框",
    plainBody:
      "背景還能點、Tab 會跑到後面的頁面、按 Esc 關不掉，也沒有半透明背景。",
    modalTitle: "我是 modal 對話框",
    modalBody:
      "背景被鎖住了，Tab 只會在對話框裡移動，按 Esc 可以關閉，關閉後焦點會回到打開我的按鈕。",
    close: "關閉",
    logTitle: "事件紀錄（最新在最上面）",
    opened: "打開，焦點移到：",
    closed: "關閉，焦點回到：",
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    label: "Live demo: show() vs show-modal",
    openPlain: "Open with show() (non-modal)",
    openModal: "Open with show-modal (modal)",
    background:
      "This stands for the page behind the dialog. With a dialog open, try pressing Tab, or clicking this button:",
    counter: (n: number) => `Background button (clicked ${n} times)`,
    plainName: "non-modal",
    modalName: "modal",
    plainTitle: "I'm a non-modal dialog",
    plainBody:
      "The background is still clickable, Tab moves to the page behind, Escape doesn't close me, and there's no backdrop.",
    modalTitle: "I'm a modal dialog",
    modalBody:
      "The background is locked, Tab stays inside the dialog, Escape closes it, and focus returns to the button that opened me.",
    close: "Close",
    logTitle: "Event log (newest first)",
    opened: "opened, focus moved to: ",
    closed: "closed, focus returned to: ",
    print: "This is an interactive demo. Try it on the web page.",
  },
};

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);

const describe = (el: Element | null) =>
  describeFocus(el, locale.value === "en");

function openPlain() {
  if (plain.value && !plain.value.open) plain.value.show();
}

function onClose(name: string) {
  // 關閉後瀏覽器才把焦點移回去，等下一個 frame 再記錄
  requestAnimationFrame(() =>
    add(
      "close",
      `${name} ${text.value.closed}${describe(document.activeElement)}`,
    ),
  );
}

let controller: AbortController | null = null;
onMounted(() => {
  controller = new AbortController();
  // modal 由 command 打開，沒有 click handler 可以接，統一用 toggle 事件記錄開啟
  (
    [
      ["plain", "show"],
      ["modal", "show-modal"],
    ] as const
  ).forEach(([key, kind]) => {
    document.getElementById(`${uid}-${key}`)?.addEventListener(
      "toggle",
      (e) => {
        if ((e as ToggleEvent).newState !== "open") return;
        const name =
          key === "plain" ? text.value.plainName : text.value.modalName;
        add(
          kind,
          `${name} ${text.value.opened}${describe(document.activeElement)}`,
        );
      },
      { signal: controller!.signal },
    );
  });
});
onBeforeUnmount(() => controller?.abort());
</script>
