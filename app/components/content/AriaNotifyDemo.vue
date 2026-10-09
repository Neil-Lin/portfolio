<template>
  <div ref="root" class="aria-notify-demo dialog-demo">
    <p class="dialog-demo__label">{{ text.label }}</p>

    <label class="until-found-faq__sync">
      <input v-model="forceFallback" type="checkbox" />
      {{ text.force }}
    </label>

    <div class="dialog-demo__controls">
      <button
        ref="cartBtn"
        type="button"
        class="dialog-demo__trigger"
        @click="addToCart"
      >
        {{ text.cart }}
      </button>
      <button
        ref="payBtn"
        type="button"
        class="dialog-demo__trigger"
        @click="payFailed"
      >
        {{ text.pay }}
      </button>
      <span lang="en">
        <button
          ref="enBtn"
          type="button"
          class="dialog-demo__trigger"
          @click="englishNotice"
        >
          Add to wishlist
        </button>
      </span>
      <button
        type="button"
        class="dialog-demo__trigger is-modal"
        :commandfor="`${uid}-dialog`"
        command="show-modal"
      >
        {{ text.openDialog }}
      </button>
    </div>
    <p class="dialog-demo__saved">{{ text.cartCount(cart) }}</p>

    <dialog
      :id="`${uid}-dialog`"
      class="dialog-demo__dialog"
      :aria-labelledby="`${uid}-dialog-title`"
    >
      <h4 :id="`${uid}-dialog-title`">{{ text.dialogTitle }}</h4>
      <p>{{ text.dialogBody }}</p>
      <div class="dialog-demo__actions">
        <button
          type="button"
          class="dialog-demo__close"
          :commandfor="`${uid}-dialog`"
          command="close"
        >
          {{ text.close }}
        </button>
        <button
          ref="copyBtn"
          type="button"
          class="dialog-demo__trigger is-modal"
          @click="copied"
        >
          {{ text.copy }}
        </button>
      </div>
    </dialog>

    <DialogEventLog :entries="entries" :title="text.logTitle" @clear="clear" />
    <p class="popover-demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：ariaNotify() 與 live region 後備的對照範例
// 用法：::aria-notify-demo
const { locale } = useI18n();
const root = ref<HTMLElement | null>(null);
const cartBtn = ref<HTMLElement | null>(null);
const payBtn = ref<HTMLElement | null>(null);
const enBtn = ref<HTMLElement | null>(null);
const copyBtn = ref<HTMLElement | null>(null);
const uid = usePopoverDemoId("anr");
const { entries, add, clear } = useEventLog();
useDialogCommandFallback(root);

const messages = {
  "zh-Hant-TW": {
    label:
      "互動範例：打開報讀軟體（Mac 的 VoiceOver 是 ⌘+F5）再按按鈕，下方紀錄會列出送出了什麼",
    force: "強制改用 aria-live 後備（模擬不支援 ariaNotify 的瀏覽器）",
    cart: "加入購物車",
    pay: "模擬付款失敗",
    openDialog: "打開對話框",
    cartCount: (n: number) => `購物車：${n} 件（連按幾次，每次都應該被唸出來）`,
    cartMsg: (n: number) => `已加入購物車，目前 ${n} 件`,
    payMsg: "付款失敗，請重新確認卡號",
    dialogTitle: "分享連結",
    dialogBody:
      "按「複製連結」後，就算焦點沒有移動，報讀軟體也會唸出「已複製」。",
    copy: "複製連結",
    copyMsg: "已複製連結",
    close: "關閉",
    logTitle: "通知紀錄（最新在最上面）",
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    label:
      "Live demo: turn on a screen reader (VoiceOver on Mac is ⌘+F5), then press the buttons. The log shows what was sent",
    force:
      "Force the aria-live fallback (simulates a browser without ariaNotify)",
    cart: "Add to cart",
    pay: "Simulate a failed payment",
    openDialog: "Open dialog",
    cartCount: (n: number) =>
      `Cart: ${n} item(s) (press it a few times; each press should be announced)`,
    cartMsg: (n: number) => `Added to cart, ${n} item(s) now`,
    payMsg: "Payment failed, please check your card number",
    dialogTitle: "Share link",
    dialogBody:
      "Press Copy link and the screen reader announces it, even though focus doesn't move.",
    copy: "Copy link",
    copyMsg: "Link copied",
    close: "Close",
    logTitle: "Announcement log (newest first)",
    print: "This is an interactive demo. Try it on the web page.",
  },
};

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);

const cart = ref(0);
const forceFallback = ref(false);

// 強制後備：暫時把元素的 ariaNotify 遮掉，讓 announce() 走 live region
function send(
  el: HTMLElement | null,
  message: string,
  priority: AnnouncePriority = "normal",
) {
  if (!el) return;
  if (forceFallback.value) {
    Object.defineProperty(el, "ariaNotify", {
      value: undefined,
      configurable: true,
    });
  }
  const via = announce(el, message, priority);
  if (forceFallback.value) delete (el as { ariaNotify?: unknown }).ariaNotify;
  const where =
    via === "live-region" && el.closest("dialog[open]")
      ? "live-region（dialog）"
      : via;
  add(
    via === "ariaNotify" ? "notify" : "live",
    `${message} → ${where}${priority === "high" ? " (priority: high)" : ""}`,
  );
}

function addToCart() {
  cart.value++;
  send(cartBtn.value, text.value.cartMsg(cart.value));
}

function payFailed() {
  send(payBtn.value, text.value.payMsg, "high");
}

function englishNotice() {
  // 按鈕外層是 lang="en"，元素版 ariaNotify 會用英文發音
  send(enBtn.value, "Added to wishlist");
}

function copied() {
  // 真的複製網址；有些環境不允許寫入剪貼簿，失敗就略過，範例重點在播報
  navigator.clipboard?.writeText(location.href).catch(() => {});
  send(copyBtn.value, text.value.copyMsg);
}
</script>
