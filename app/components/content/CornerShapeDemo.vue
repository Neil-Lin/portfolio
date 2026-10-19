<template>
  <div
    class="cs-demo demo"
    :class="{ 'is-legacy': legacy, 'is-forced': forced }"
  >
    <p class="demo__label">{{ text.label }}</p>

    <fieldset class="demo__options">
      <legend>{{ text.mode }}</legend>
      <label class="demo__option">
        <input
          v-model="legacy"
          type="radio"
          :name="`${uid}-mode`"
          :value="false"
        />
        <span>corner-shape</span>
      </label>
      <label class="demo__option">
        <input
          v-model="legacy"
          type="radio"
          :name="`${uid}-mode`"
          :value="true"
        />
        <span>{{ text.legacy }}</span>
      </label>
    </fieldset>

    <label class="demo__option cs-demo__forced">
      <input v-model="forced" type="checkbox" />
      <span>{{ text.forced }}</span>
    </label>

    <p class="cs-demo__hint">{{ text.hint }}</p>

    <div class="cs-demo__grid">
      <figure class="cs-demo__card">
        <figcaption>{{ text.icon }}</figcaption>
        <div class="cs-demo__stage">
          <button
            type="button"
            class="cs-demo__icon"
            :aria-label="text.iconLabel"
          >
            <span aria-hidden="true">N</span>
          </button>
        </div>
        <code>{{
          legacy ? "mask: url(squircle.svg);" : "corner-shape: squircle;"
        }}</code>
      </figure>

      <figure class="cs-demo__card">
        <figcaption>{{ text.coupon }}</figcaption>
        <div class="cs-demo__stage">
          <div class="cs-demo__coupon">
            <p class="cs-demo__coupon-info">
              <strong>{{ text.couponTitle }}</strong>
              <span>{{ text.couponDate }}</span>
            </p>
            <button type="button" class="cs-demo__coupon-btn">
              {{ text.couponBtn }}
            </button>
          </div>
        </div>
        <code>{{
          legacy
            ? "mask: radial-gradient(…);"
            : "corner-shape: round scoop scoop round;"
        }}</code>
      </figure>

      <figure class="cs-demo__card">
        <figcaption>{{ text.steps }}</figcaption>
        <div class="cs-demo__stage">
          <ol
            :id="`${uid}-steps`"
            class="cs-demo__steps"
            :aria-label="text.stepsLabel"
          >
            <li v-for="(s, i) in text.stepNames" :key="s">
              <a
                :href="`#${uid}-steps`"
                :aria-current="i === 1 ? 'step' : undefined"
                @click.prevent
                >{{ s }}</a
              >
            </li>
          </ol>
        </div>
        <code>{{
          legacy ? "clip-path: polygon(…);" : "corner-shape: bevel;"
        }}</code>
      </figure>

      <figure class="cs-demo__card">
        <figcaption>{{ text.hud }}</figcaption>
        <div class="cs-demo__stage cs-demo__stage--dark">
          <button type="button" class="cs-demo__hud">START</button>
        </div>
        <code>{{
          legacy ? "clip-path: polygon(…);" : "corner-shape: bevel;"
        }}</code>
      </figure>
    </div>

    <p class="demo__status">{{ modeText }}</p>
    <p class="demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：四個常見設計（App 圖示方圓角、優惠券缺口、結帳步驟箭頭、切角按鈕），
// 比較 corner-shape 和以前的 clip-path／mask 寫法，用鍵盤看焦點外框會不會被切掉
// 用法：::corner-shape-demo
// 樣式在 components.css；「模擬強制色彩模式」只是把背景換成 Canvas、文字和邊框換成 CanvasText
const { locale } = useI18n();
const uid = useDemoId("csd");
const legacy = ref(false);
const forced = ref(false);
const supported = ref<boolean | null>(null);

const messages = {
  "zh-Hant-TW": {
    label: "互動範例：四個常見的設計，比較 corner-shape 和以前的寫法",
    mode: "寫法",
    legacy: "以前的寫法（clip-path／mask）",
    forced: "模擬強制色彩模式（背景移除，只剩文字和邊框）",
    hint: "用 Tab 鍵移到每個按鈕和連結上，比較焦點外框；切到「以前的寫法」，外框會被切掉。",
    icon: "App 圖示的方圓角",
    iconLabel: "開啟 App",
    coupon: "優惠券的半圓缺口",
    couponTitle: "滿千折百",
    couponDate: "有效至 12/31",
    couponBtn: "領取",
    steps: "結帳流程的箭頭步驟",
    stepsLabel: "結帳步驟",
    stepNames: ["購物車", "填寫資料", "付款"],
    hud: "遊戲風格的切角按鈕",
    native: "你的瀏覽器支援 corner-shape",
    fallback:
      "你的瀏覽器不支援 corner-shape，形狀會退回一般的圓角，「以前的寫法」仍然可以比較",
    detecting: "偵測中（需要 JavaScript）",
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    label:
      "Live demo: four common designs, comparing corner-shape with the old techniques",
    mode: "Technique",
    legacy: "The old way (clip-path / mask)",
    forced:
      "Simulate forced colors (backgrounds removed, only text and borders left)",
    hint: 'Tab to each button and link to compare the focus outline; switch to "the old way" and the outline gets clipped.',
    icon: "Squircle app icon",
    iconLabel: "Open app",
    coupon: "Coupon with notches",
    couponTitle: "$10 off",
    couponDate: "Orders $100+, until 12/31",
    couponBtn: "Claim",
    steps: "Checkout step arrows",
    stepsLabel: "Checkout steps",
    stepNames: ["Cart", "Details", "Payment"],
    hud: "Game-style cut-corner button",
    native: "Your browser supports corner-shape",
    fallback:
      'Your browser doesn\'t support corner-shape, so the shapes fall back to ordinary rounded corners; you can still compare "the old way"',
    detecting: "Detecting (requires JavaScript)",
    print: "This is an interactive demo. Try it on the web page.",
  },
};

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);

const modeText = computed(() =>
  supported.value === null
    ? text.value.detecting
    : supported.value
      ? text.value.native
      : text.value.fallback,
);

onMounted(() => {
  supported.value = CSS.supports("corner-shape: bevel");
});
</script>
