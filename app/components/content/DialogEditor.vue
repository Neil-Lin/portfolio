<template>
  <div ref="root" class="dialog-demo">
    <p class="dialog-demo__label">{{ text.label }}</p>

    <div class="dialog-demo__controls">
      <button
        type="button"
        class="dialog-demo__trigger is-modal"
        :commandfor="dialogId"
        command="show-modal"
      >
        {{ text.open }}
      </button>
    </div>
    <p class="dialog-demo__saved">
      {{ text.savedLabel }}<strong>{{ saved || text.empty }}</strong>
    </p>

    <dialog
      :id="dialogId"
      ref="dialog"
      class="dialog-demo__dialog"
      :aria-labelledby="`${dialogId}-title`"
      @cancel="onCancel"
      @close="onClose"
    >
      <form method="dialog" class="dialog-demo__form">
        <h4 :id="`${dialogId}-title`">{{ text.title }}</h4>
        <label :for="`${dialogId}-note`">{{ text.field }}</label>
        <textarea
          :id="`${dialogId}-note`"
          ref="field"
          v-model="draft"
          rows="3"
          autofocus
        ></textarea>

        <div
          v-if="confirming"
          ref="confirmBox"
          class="dialog-demo__confirm"
          tabindex="-1"
          role="group"
          :aria-labelledby="`${dialogId}-confirm`"
        >
          <p :id="`${dialogId}-confirm`">{{ text.confirm }}</p>
          <div class="dialog-demo__actions">
            <button
              type="button"
              class="dialog-demo__close"
              @click="keepEditing"
            >
              {{ text.keep }}
            </button>
            <button
              type="button"
              class="dialog-demo__close is-danger"
              @click="discard"
            >
              {{ text.discard }}
            </button>
          </div>
        </div>

        <div v-else class="dialog-demo__actions">
          <button
            type="button"
            class="dialog-demo__close"
            :commandfor="dialogId"
            command="request-close"
          >
            {{ text.cancel }}
          </button>
          <button
            type="submit"
            value="save"
            class="dialog-demo__trigger is-modal"
          >
            {{ text.save }}
          </button>
        </div>
      </form>
    </dialog>

    <DialogEventLog :entries="entries" :title="text.logTitle" @clear="clear" />
    <p class="popover-demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：request-close + cancel 攔下未儲存的關閉，form method="dialog" 回傳值
// 用法：::dialog-editor
const { locale } = useI18n();
const root = ref<HTMLElement | null>(null);
const dialog = ref<HTMLDialogElement | null>(null);
const field = ref<HTMLTextAreaElement | null>(null);
const confirmBox = ref<HTMLElement | null>(null);
const dialogId = usePopoverDemoId("ded");
const { entries, add, clear } = useEventLog();
useDialogCommandFallback(root);

const messages = {
  "zh-Hant-TW": {
    label: "互動範例：輸入一些文字後，按「取消」或 Esc 試試",
    open: "編輯備註",
    savedLabel: "目前儲存的備註：",
    empty: "（還沒有）",
    title: "編輯備註",
    field: "備註內容",
    cancel: "取消",
    save: "儲存",
    confirm: "還有沒儲存的修改，確定要放棄嗎？",
    keep: "繼續編輯",
    discard: "放棄修改",
    logTitle: "事件紀錄（最新在最上面）",
    print: "此處為互動範例，請在網頁上操作。",
    cancelBlocked: "有未儲存的修改，preventDefault() 攔下關閉",
    cancelAllowed: "沒有修改，允許關閉",
    closed: (v: string, focus: string) =>
      `returnValue = "${v}"，焦點回到：${focus}`,
  },
  en: {
    label: "Live demo: type something, then press Cancel or Escape",
    open: "Edit note",
    savedLabel: "Saved note: ",
    empty: "(none yet)",
    title: "Edit note",
    field: "Note",
    cancel: "Cancel",
    save: "Save",
    confirm: "You have unsaved changes. Discard them?",
    keep: "Keep editing",
    discard: "Discard changes",
    logTitle: "Event log (newest first)",
    print: "This is an interactive demo. Try it on the web page.",
    cancelBlocked: "unsaved changes, preventDefault() blocked the close",
    cancelAllowed: "no changes, close allowed",
    closed: (v: string, focus: string) =>
      `returnValue = "${v}", focus returned to: ${focus}`,
  },
};

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);

const saved = ref("");
const draft = ref("");
const confirming = ref(false);
const dirty = computed(() => draft.value !== saved.value);

function onCancel(e: Event) {
  if (dirty.value) {
    e.preventDefault();
    confirming.value = true;
    add("cancel", text.value.cancelBlocked);
    // 確認區塊出現後把焦點移過去，報讀軟體才會唸出提示
    nextTick(() => confirmBox.value?.focus());
  } else {
    add("cancel", text.value.cancelAllowed);
  }
}

function keepEditing() {
  confirming.value = false;
  nextTick(() => field.value?.focus());
}

function discard() {
  confirming.value = false;
  dialog.value?.close("discard");
}

function onClose() {
  const value = dialog.value?.returnValue ?? "";
  if (value === "save") saved.value = draft.value;
  else draft.value = saved.value;
  confirming.value = false;
  if (dialog.value) dialog.value.returnValue = "";
  requestAnimationFrame(() =>
    add(
      "close",
      text.value.closed(
        value,
        describeFocus(document.activeElement, locale.value === "en"),
      ),
    ),
  );
}
</script>
