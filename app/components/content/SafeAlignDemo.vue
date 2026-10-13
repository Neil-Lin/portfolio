<template>
  <div class="safe-align-demo dialog-demo">
    <p class="dialog-demo__label">
      {{ kind === "card" ? text.cardLabel : text.chipsLabel }}
    </p>

    <fieldset class="position-try-demo__options">
      <legend>{{ kind === "card" ? "align-items" : "justify-content" }}</legend>
      <label v-for="v in values" :key="v" class="until-found-faq__sync">
        <input v-model="align" type="radio" :name="`${uid}-align`" :value="v" />
        <code>{{ v }}</code>
      </label>
    </fieldset>

    <label v-if="kind === 'card'" class="position-try-demo__range">
      <span>{{ text.zoom }}</span>
      <input v-model.number="zoom" type="range" min="100" max="300" step="25" />
      <output>{{ zoom }}%</output>
    </label>

    <!-- 模擬的畫面：固定大小的捲動容器 -->
    <div
      ref="screen"
      class="safe-align-demo__screen"
      :class="`is-${kind}`"
      :style="
        kind === 'card' ? { alignItems: align } : { justifyContent: align }
      "
      role="region"
      :aria-label="kind === 'card' ? text.screenCard : text.screenChips"
      tabindex="0"
      @focusin="measure"
      @focusout="measure"
      @scroll.passive="measure"
    >
      <div
        v-if="kind === 'card'"
        ref="target"
        class="safe-align-demo__card"
        :style="{ fontSize: `${zoom / 100}rem` }"
      >
        <button ref="first" type="button" class="safe-align-demo__back">
          {{ text.back }}
        </button>
        <p class="safe-align-demo__title">{{ text.title }}</p>
        <p>{{ text.body }}</p>
        <button type="button" class="dialog-demo__close">
          {{ text.submit }}
        </button>
      </div>
      <template v-else>
        <button
          v-for="(tag, i) in tags"
          :key="tag"
          :ref="(el) => i === 0 && setFirst(el)"
          type="button"
          class="safe-align-demo__chip"
        >
          {{ tag }}
        </button>
      </template>
    </div>

    <dl class="attr-demo__readout" :class="{ 'is-mismatch': (cut ?? 0) > 0 }">
      <div>
        <dt>{{ kind === "card" ? text.cutTop : text.cutStart }}</dt>
        <dd>{{ cut === null ? "—" : `${cut} px` }}</dd>
      </div>
      <div>
        <dt>{{ text.focus }}</dt>
        <dd>{{ focusText }}</dd>
      </div>
    </dl>
    <p class="attr-demo__verdict">{{ verdict }}</p>

    <p class="focusgroup-demo__mode">{{ modeText }}</p>
    <p class="popover-demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：置中的內容放不下時，center 會往兩邊溢出，start 那一側捲不到；safe center 會改成靠起點
// 用法：::safe-align-demo{kind="card"} 或 ::safe-align-demo{kind="chips"}
const props = defineProps<{ kind: "card" | "chips" }>();

const { locale } = useI18n();
const uid = usePopoverDemoId("sad");
const screen = ref<HTMLElement | null>(null);
const target = ref<HTMLElement | null>(null);
const first = ref<HTMLElement | null>(null);

const values = ["center", "safe center"] as const;
const align = ref<(typeof values)[number]>("center");
const zoom = ref(props.kind === "card" ? 200 : 100);
const cut = ref<number | null>(null); // 起點那一側被切掉、捲不到的長度
const focusState = ref<"none" | "visible" | "hidden">("none");
const supported = ref<boolean | null>(null);

function setFirst(el: unknown) {
  if (el instanceof HTMLElement) first.value = el;
}

const messages = {
  "zh-Hant-TW": {
    cardLabel:
      "互動範例：把「放大倍率」調高，比較 center 和 safe center，再試著往上捲",
    chipsLabel:
      "互動範例：可以左右捲動的標籤列，比較 center 和 safe center，再試著往左捲",
    zoom: "放大倍率",
    screenCard: "模擬的畫面：登入卡片",
    screenChips: "模擬的畫面：標籤列",
    back: "← 返回",
    title: "登入你的帳號",
    body: "放大之後，卡片比畫面還高。用 center 置中時，上面多出來的部分會跑到畫面外，而且捲不上去。",
    submit: "登入",
    tags: [
      "全部",
      "CSS",
      "HTML",
      "無障礙",
      "JavaScript",
      "Vue",
      "Nuxt",
      "設計",
    ],
    cutTop: "上方被切掉、捲不到的高度",
    cutStart: "左邊被切掉、捲不到的寬度",
    focus: "第一個按鈕得到焦點時",
    focusNone: "請按 Tab 移到範例裡的第一個按鈕",
    focusVisible: "看得到",
    focusHidden: "在畫面外，看不到",
    ok: "內容完整，捲動就能看到全部。",
    bad: "有一部分內容捲不到。鍵盤使用者 Tab 到那裡，也看不到焦點在哪。",
    native: "你的瀏覽器支援 safe 關鍵字",
    fallback:
      "你的瀏覽器不支援 safe 關鍵字，選 safe center 時整條宣告會無效，退回預設的起點對齊",
    pending: "偵測中（需要 JavaScript）",
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    cardLabel:
      'Live demo: turn up "Zoom", compare center with safe center, then try scrolling up',
    chipsLabel:
      "Live demo: a horizontally scrolling tag list; compare center with safe center, then try scrolling left",
    zoom: "Zoom",
    screenCard: "Simulated screen: sign-in card",
    screenChips: "Simulated screen: tag list",
    back: "← Back",
    title: "Sign in",
    body: "Zoomed in, the card is taller than the screen. With center, the top goes off screen and can't be scrolled to.",
    submit: "Sign in",
    tags: [
      "All",
      "CSS",
      "HTML",
      "Accessibility",
      "JavaScript",
      "Vue",
      "Nuxt",
      "Design",
    ],
    cutTop: "Height cut off at the top, unreachable",
    cutStart: "Width cut off on the left, unreachable",
    focus: "When the first button has focus",
    focusNone: "Press Tab to move to the first button in the demo",
    focusVisible: "Visible",
    focusHidden: "Off screen, not visible",
    ok: "Nothing is lost; scrolling reaches all of it.",
    bad: "Part of the content can't be reached. Keyboard users who Tab there can't see where focus is either.",
    native: "Your browser supports the safe keyword",
    fallback:
      "Your browser doesn't support the safe keyword, so safe center makes the whole declaration invalid and it falls back to start alignment",
    pending: "Detecting (requires JavaScript)",
    print: "This is an interactive demo. Try it on the web page.",
  },
};

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);
const tags = computed(() => text.value.tags);

const focusText = computed(() =>
  focusState.value === "none"
    ? text.value.focusNone
    : focusState.value === "visible"
      ? text.value.focusVisible
      : text.value.focusHidden,
);
const verdict = computed(() =>
  cut.value === null ? "" : cut.value > 0 ? text.value.bad : text.value.ok,
);
const modeText = computed(() =>
  supported.value === null
    ? text.value.pending
    : supported.value
      ? text.value.native
      : text.value.fallback,
);

async function measure() {
  await nextTick();
  const box = screen.value;
  if (!box) return;
  const b = box.getBoundingClientRect();
  const border = props.kind === "card" ? box.clientTop : box.clientLeft;
  // 「捲不到」= 捲到最起點時，內容的起點仍在容器起點之前
  if (props.kind === "card") {
    const t = target.value?.getBoundingClientRect();
    if (t)
      cut.value = Math.max(
        0,
        Math.round(b.top + border - (t.top + box.scrollTop)),
      );
  } else {
    const f = first.value?.getBoundingClientRect();
    if (f)
      cut.value = Math.max(
        0,
        Math.round(b.left + border - (f.left + box.scrollLeft)),
      );
  }
  const btn = first.value;
  if (btn && document.activeElement === btn) {
    const r = btn.getBoundingClientRect();
    const hidden =
      r.bottom <= b.top + box.clientTop ||
      r.right <= b.left + box.clientLeft ||
      r.top < b.top + box.clientTop - 1 ||
      r.left < b.left + box.clientLeft - 1;
    focusState.value = hidden ? "hidden" : "visible";
  } else {
    focusState.value = "none";
  }
}

watch([align, zoom], measure);

onMounted(() => {
  supported.value = CSS.supports("align-items: safe center");
  measure();
  window.addEventListener("resize", measure);
});
onBeforeUnmount(() => window.removeEventListener("resize", measure));
</script>
