<template>
  <div class="if-fn-demo dialog-demo">
    <p class="dialog-demo__label">{{ text.label }}</p>

    <fieldset class="position-try-demo__options">
      <legend>{{ text.size }}</legend>
      <label v-for="s in sizes" :key="s" class="until-found-faq__sync">
        <input v-model="size" type="radio" :name="`${uid}-size`" :value="s" />
        <code>--size: {{ s }}</code>
      </label>
    </fieldset>

    <fieldset class="position-try-demo__options">
      <legend>{{ text.prefs }}</legend>
      <label class="until-found-faq__sync">
        <input v-model="motion" type="checkbox" />
        <span>{{ text.motion }}</span>
      </label>
      <label class="until-found-faq__sync">
        <input v-model="contrast" type="checkbox" />
        <span>{{ text.contrast }}</span>
      </label>
    </fieldset>

    <fieldset class="position-try-demo__options">
      <legend>{{ text.ring }}</legend>
      <label v-for="r in rings" :key="r" class="until-found-faq__sync">
        <input v-model="ring" type="radio" :name="`${uid}-ring`" :value="r" />
        <span>{{ text.rings[r] }}</span>
      </label>
    </fieldset>

    <div
      class="if-fn-demo__stage"
      :data-ring="ring"
      :style="{
        '--size': size,
        '--sim-motion': motion ? 'reduce' : 'none',
        '--sim-contrast': contrast ? 'more' : 'none',
      }"
    >
      <button ref="btn" type="button" class="if-fn-demo__btn">
        {{ text.button }}
      </button>
      <span ref="probe" class="if-fn-demo__probe" hidden></span>
    </div>
    <p class="if-fn-demo__hint">{{ text.hint }}</p>

    <dl class="alpha-demo__code" aria-live="polite">
      <div v-for="row in rows" :key="row.label">
        <dt>{{ row.label }}</dt>
        <dd>
          <code>{{ row.value || "—" }}</code>
          <strong v-if="row.warn" class="if-fn-demo__warn">{{
            row.warn
          }}</strong>
        </dd>
      </div>
    </dl>

    <p class="focusgroup-demo__mode">{{ modeText }}</p>
    <p class="popover-demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：用 if() 和 @function 寫一顆按鈕，切換尺寸和模擬的使用者偏好，看計算後的值
// 用法：::if-function-demo
// 樣式（@function --if-demo-target、--if-demo-ring 和 if() 規則）在 components.css
// 「減少動態」「提高對比」是用自訂屬性模擬，系統真的開啟這兩個偏好時也會套用
type Size = "small" | "medium" | "large";
type Ring = "else" | "none";

const { locale } = useI18n();
const uid = usePopoverDemoId("ifn");
const sizes: Size[] = ["small", "medium", "large"];
const rings: Ring[] = ["else", "none"];
const size = ref<Size>("small");
const motion = ref(false);
const contrast = ref(false);
const ring = ref<Ring>("else");
const btn = ref<HTMLButtonElement | null>(null);
const probe = ref<HTMLElement | null>(null);
const values = ref({ height: "", padding: "", duration: "", outline: "" });
const supported = ref<boolean | null>(null);

const messages = {
  "zh-Hant-TW": {
    label:
      "互動範例：同一顆按鈕的樣式都用 if() 和 @function 寫成，切換設定看計算後的值",
    size: "按鈕尺寸",
    prefs: "模擬使用者偏好",
    motion: "減少動態（prefers-reduced-motion）",
    contrast: "提高對比（prefers-contrast）",
    ring: "焦點外框的寫法",
    rings: { else: "if() 有寫 else", none: "if() 沒寫 else" },
    button: "範例按鈕",
    hint: "用 Tab 鍵移到範例按鈕上，可以看到實際的焦點外框；滑鼠移上去可以看到轉場。",
    height: "最小高度（--if-demo-target() 保證至少 24px）",
    padding: "左右內距",
    duration: "轉場時間",
    outline: "焦點外框",
    small: "原本寫 16px，被函式拉到 24px",
    lost: "焦點外框不見了",
    native: "你的瀏覽器支援 if() 和 @function",
    fallback: "你的瀏覽器不支援 if()，按鈕改用固定樣式，數值不會隨設定改變",
    detecting: "偵測中（需要 JavaScript）",
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    label:
      "Live demo: every style on this button is written with if() and @function. Change the settings to see the computed values",
    size: "Button size",
    prefs: "Simulated user preferences",
    motion: "Reduce motion (prefers-reduced-motion)",
    contrast: "More contrast (prefers-contrast)",
    ring: "How the focus outline is written",
    rings: { else: "if() with else", none: "if() without else" },
    button: "Sample button",
    hint: "Tab to the sample button to see its real focus outline; hover over it to see the transition.",
    height: "Minimum height (--if-demo-target() guarantees at least 24px)",
    padding: "Inline padding",
    duration: "Transition duration",
    outline: "Focus outline",
    small: "Written as 16px, raised to 24px by the function",
    lost: "The focus outline is gone",
    native: "Your browser supports if() and @function",
    fallback:
      "Your browser doesn't support if(), so the button uses fixed styles and the values don't change",
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

const rows = computed(() => [
  {
    label: text.value.height,
    value: values.value.height,
    warn: supported.value && size.value === "small" ? text.value.small : "",
  },
  { label: text.value.padding, value: values.value.padding, warn: "" },
  { label: text.value.duration, value: values.value.duration, warn: "" },
  {
    label: text.value.outline,
    value: values.value.outline,
    warn: values.value.outline.startsWith("none") ? text.value.lost : "",
  },
]);

// 焦點外框只在 :focus-visible 時出現，所以另外用一個隱藏的探針元素套同一條規則來讀值
function read() {
  if (!btn.value || !probe.value) return;
  const b = getComputedStyle(btn.value);
  const r = getComputedStyle(probe.value);
  values.value = {
    height: b.minHeight,
    padding: b.paddingInlineStart,
    duration: b.transitionDuration,
    outline:
      r.outlineStyle === "none"
        ? "none"
        : `${r.outlineStyle} ${r.outlineWidth}`,
  };
}

watch([size, motion, contrast, ring], () => nextTick(read));

onMounted(() => {
  supported.value = CSS.supports("color: if(else: red)");
  read();
});
</script>
