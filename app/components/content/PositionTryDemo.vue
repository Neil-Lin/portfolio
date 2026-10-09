<template>
  <div ref="root" class="position-try-demo dialog-demo">
    <p class="dialog-demo__label">{{ text.label }}</p>

    <div
      class="position-try-demo__stage"
      :style="{ '--x': x, '--y': y }"
      aria-hidden="true"
    >
      <span class="position-try-demo__anchor">{{ text.anchor }}</span>
      <span
        :key="resetKey"
        ref="tip"
        class="position-try-demo__tip"
        :class="[`is-${option}`, { 'is-order': order }]"
      >
        {{ text.tip }}
      </span>
    </div>

    <p class="position-try-demo__readout">{{ readout }}</p>

    <div class="position-try-demo__controls">
      <label class="position-try-demo__range">
        <span>{{ text.x }}</span>
        <input v-model.number="x" type="range" min="0" max="100" step="1" />
      </label>
      <label class="position-try-demo__range">
        <span>{{ text.y }}</span>
        <input v-model.number="y" type="range" min="0" max="100" step="1" />
      </label>
    </div>

    <fieldset class="position-try-demo__options">
      <legend>{{ text.legend }}</legend>
      <label
        v-for="item in optionList"
        :key="item.value"
        class="until-found-faq__sync"
      >
        <input v-model="option" type="radio" :name="uid" :value="item.value" />
        <span
          >{{ item.label.before
          }}<code v-if="item.label.code">{{ item.label.code }}</code
          >{{ item.label.after }}</span
        >
      </label>
    </fieldset>

    <label class="until-found-faq__sync">
      <input v-model="order" type="checkbox" />
      <span><code>position-try-order: most-height</code>{{ text.order }}</span>
    </label>

    <button type="button" class="dialog-demo__close" @click="reshow">
      {{ text.reset }}
    </button>

    <p class="position-try-demo__code-title">{{ text.codeTitle }}</p>
    <pre class="position-try-demo__code"><code>{{ code }}</code></pre>
    <p class="popover-demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：移動錨點，觀察 position-try-fallbacks 在空間不夠時怎麼換位置
// 用法：::position-try-demo
type Option = "none" | "flip" | "custom";
type Side = "top" | "bottom" | "left" | "right";

const { locale } = useI18n();
const root = ref<HTMLElement | null>(null);
const tip = ref<HTMLElement | null>(null);
const uid = usePopoverDemoId("ptd");

const x = ref(50);
const y = ref(50);
const option = ref<Option>("flip");
const order = ref(false);
const resetKey = ref(0);
const side = ref<Side | null>(null);
const overflow = ref(false);
const supported = ref<boolean | null>(null);

const messages = {
  "zh-Hant-TW": {
    label: "互動範例：用滑桿移動錨點，看提示框空間不夠時會怎麼做",
    anchor: "錨點",
    tip: "提示框",
    x: "錨點水平位置",
    y: "錨點垂直位置",
    legend: "空間不夠時的備案（position-try-fallbacks）",
    options: {
      none: { before: "不設定", code: "", after: "" },
      flip: { before: "", code: "flip-block", after: "（上下翻面）" },
      custom: {
        before: "自訂 ",
        code: "@position-try",
        after: "：依序試右、下、左",
      },
    },
    order: "（上下哪邊空間大就放哪邊）",
    reset: "重新顯示提示框（清掉瀏覽器記住的位置）",
    sides: { top: "上方", bottom: "下方", left: "左邊", right: "右邊" },
    readout: (s: string, cut: boolean) =>
      `提示框目前在錨點的${s}${cut ? "，而且超出範圍被切掉了" : ""}`,
    pending: "提示框位置偵測中（需要 JavaScript）",
    unsupported: "你的瀏覽器不支援錨點定位，這個範例無法運作。",
    codeTitle: "目前套用的 CSS",
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    label:
      "Live demo: move the anchor with the sliders and watch what the tooltip does when it runs out of room",
    anchor: "Anchor",
    tip: "Tooltip",
    x: "Anchor horizontal position",
    y: "Anchor vertical position",
    legend: "Fallbacks when there isn't room (position-try-fallbacks)",
    options: {
      none: { before: "None", code: "", after: "" },
      flip: { before: "", code: "flip-block", after: " (flip top and bottom)" },
      custom: {
        before: "Custom ",
        code: "@position-try",
        after: ": try right, bottom, then left",
      },
    },
    order: " (use whichever side, top or bottom, has more room)",
    reset: "Show the tooltip again (clears the remembered position)",
    sides: {
      top: "above",
      bottom: "below",
      left: "left of",
      right: "right of",
    },
    readout: (s: string, cut: boolean) =>
      `The tooltip is ${s} the anchor${cut ? ", and it's cut off" : ""}`,
    pending: "Detecting the tooltip position (requires JavaScript)",
    unsupported:
      "Your browser doesn't support anchor positioning, so this demo won't work.",
    codeTitle: "The CSS currently applied",
    print: "This is an interactive demo. Try it on the web page.",
  },
};

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);

const optionList = computed(() =>
  (["none", "flip", "custom"] as const).map((value) => ({
    value,
    label: text.value.options[value],
  })),
);

const readout = computed(() => {
  if (supported.value === false) return text.value.unsupported;
  if (!side.value) return text.value.pending;
  return text.value.readout(text.value.sides[side.value], overflow.value);
});

const code = computed(() => {
  const lines = [
    ".tip {",
    "  position-anchor: --anchor;",
    "  position-area: top;",
    "  margin-bottom: 8px;",
  ];
  if (option.value === "flip")
    lines.push("  position-try-fallbacks: flip-block;");
  if (option.value === "custom")
    lines.push("  position-try-fallbacks: --right, --bottom, --left;");
  if (order.value) lines.push("  position-try-order: most-height;");
  lines.push("}");
  if (option.value === "custom") {
    lines.push(
      "",
      "@position-try --right {",
      "  position-area: right;",
      "  margin: 0 0 0 8px;",
      "}",
      "@position-try --bottom {",
      "  position-area: bottom;",
      "  margin: 8px 0 0;",
      "}",
      "@position-try --left {",
      "  position-area: left;",
      "  margin: 0 8px 0 0;",
      "}",
    );
  }
  return lines.join("\n");
});

// 位置要等瀏覽器排版完（兩個 frame）才量得到
const nextFrame = () =>
  new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );

let announceReady = false;

async function measure() {
  await nextFrame();
  const tipEl = tip.value;
  const stage = tipEl?.parentElement;
  const anchor = stage?.querySelector(".position-try-demo__anchor");
  if (!tipEl || !stage || !anchor) return;
  const t = tipEl.getBoundingClientRect();
  const a = anchor.getBoundingClientRect();
  const s = stage.getBoundingClientRect();
  const next: Side =
    t.bottom <= a.top + 1
      ? "top"
      : t.top >= a.bottom - 1
        ? "bottom"
        : t.right <= a.left + 1
          ? "left"
          : "right";
  overflow.value =
    t.top < s.top - 1 ||
    t.bottom > s.bottom + 1 ||
    t.left < s.left - 1 ||
    t.right > s.right + 1;
  // 只在位置真的換邊時通知報讀軟體，拖動滑桿時才不會一直唸
  if (announceReady && side.value && next !== side.value && root.value) {
    side.value = next;
    announce(root.value, readout.value);
  } else {
    side.value = next;
  }
}

// 重新建立提示框元素，等於關掉再打開：瀏覽器會清掉記住的「上一次成功的位置」，重新挑一次
function reshow() {
  resetKey.value++;
}

// 換備案設定時也重新顯示，讓新設定馬上依目前位置重新挑
watch([option, order], reshow);
watch([x, y, resetKey, locale], measure);

onMounted(() => {
  supported.value = CSS.supports("position-try-fallbacks: flip-block");
  if (!supported.value) return;
  prepareAnnouncer(root.value!);
  measure().then(() => {
    announceReady = true;
  });
  window.addEventListener("resize", measure);
});
onBeforeUnmount(() => window.removeEventListener("resize", measure));
</script>
