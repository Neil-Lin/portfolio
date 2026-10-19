<template>
  <div ref="root" class="attr-demo demo">
    <p class="demo__label">
      {{ kind === "progress" ? text.progressLabel : text.ratingLabel }}
    </p>

    <template v-if="kind === 'progress'">
      <fieldset class="demo__options">
        <legend>{{ text.modeLegend }}</legend>
        <label class="demo__option">
          <input
            v-model="mode"
            type="radio"
            :name="`${uid}-mode`"
            value="attr"
          />
          <span>{{ text.modeAttr }}</span>
        </label>
        <label class="demo__option">
          <input v-model="mode" type="radio" :name="`${uid}-mode`" value="js" />
          <span>{{ text.modeJs }}</span>
        </label>
      </fieldset>
      <label v-if="mode === 'js'" class="demo__option">
        <input v-model="forget" type="checkbox" />
        <span>{{ text.forget }}</span>
      </label>

      <div class="dialog-demo__controls">
        <button type="button" class="dialog-demo__close" @click="step(-10)">
          {{ text.minus }}
        </button>
        <button type="button" class="dialog-demo__close" @click="step(10)">
          {{ text.plus }}
        </button>
      </div>

      <!-- 新寫法：只更新 aria-valuenow，填色長度由 CSS 的 attr() 讀同一個值 -->
      <div
        class="attr-progress"
        :class="{ 'is-js': mode === 'js' }"
        role="progressbar"
        :aria-label="text.progressName"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="ariaNow"
        :style="fallbackStyle"
      >
        <span
          ref="fill"
          class="attr-progress__fill"
          :style="mode === 'js' ? { width: `${jsWidth}%` } : undefined"
        ></span>
      </div>

      <dl class="attr-demo__readout" :class="{ 'is-mismatch': mismatch }">
        <div>
          <dt>{{ text.visual }}</dt>
          <dd>{{ visual === null ? "—" : `${visual}%` }}</dd>
        </div>
        <div>
          <dt>{{ text.aria }}</dt>
          <dd>
            <code>aria-valuenow="{{ ariaNow }}"</code>
          </dd>
        </div>
      </dl>
      <p class="attr-demo__verdict">
        {{ mismatch ? text.mismatch : text.match }}
      </p>
    </template>

    <template v-else>
      <ul class="attr-rating__list">
        <li v-for="item in ratings" :key="item.name">
          <span>{{ item.name }}</span>
          <!-- 星星的長度讀 aria-valuenow，報讀軟體讀到的也是同一個值 -->
          <span
            class="attr-rating"
            role="meter"
            :aria-label="text.ratingName(item.name)"
            aria-valuemin="0"
            aria-valuemax="5"
            :aria-valuenow="item.value"
            :aria-valuetext="text.ratingText(item.value)"
            :style="supported === false ? { '--now': item.value } : undefined"
          ></span>
          <span class="attr-rating__value" aria-hidden="true">{{
            item.value
          }}</span>
        </li>
      </ul>
    </template>

    <p class="demo__status">{{ modeText }}</p>
    <p class="demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：用 attr() 讀 ARIA 屬性決定外觀，讓「看到的」和「報讀軟體讀到的」只有一個來源
// 用法：::attr-aria-demo{kind="progress"} 或 ::attr-aria-demo{kind="rating"}
const props = defineProps<{ kind: "progress" | "rating" }>();

const { locale } = useI18n();
const uid = useDemoId("aad");
const root = ref<HTMLElement | null>(null);
const fill = ref<HTMLElement | null>(null);

const supported = ref<boolean | null>(null);
const mode = ref<"attr" | "js">("attr");
const forget = ref(false);
const value = ref(40); // 實際進度
const ariaNow = ref(40); // 寫進 aria-valuenow 的值
const jsWidth = ref(40); // 舊寫法另外寫的寬度
const visual = ref<number | null>(null); // 實際量到的填色比例

const messages = {
  "zh-Hant-TW": {
    progressLabel:
      "互動範例：按「+10」「−10」，比較畫面上的長度和報讀軟體讀到的數值",
    ratingLabel: "互動範例：星星的長度直接讀 aria-valuenow",
    modeLegend: "更新方式",
    modeAttr: "新寫法：只更新 aria-valuenow，長度由 CSS attr() 讀取",
    modeJs: "舊寫法：JavaScript 分別更新寬度和 aria-valuenow",
    forget: "模擬程式漏改了 aria-valuenow（只改了寬度）",
    minus: "−10",
    plus: "+10",
    progressName: "上傳進度",
    visual: "畫面上的長度",
    aria: "報讀軟體讀到的",
    match: "兩邊一致。",
    mismatch: "兩邊不一致：看得到的進度和聽到的進度不同。",
    ratingName: (name: string) => `${name}的評分`,
    ratingText: (v: number) => `${v} 顆星，滿分 5 顆`,
    native: "你的瀏覽器支援帶型別的 attr()，CSS 直接讀屬性",
    fallback:
      "你的瀏覽器不支援帶型別的 attr()，目前用 JavaScript 把數值複製到 CSS 變數",
    pending: "偵測中（需要 JavaScript）",
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    progressLabel:
      'Live demo: press "+10" and "−10" and compare the length on screen with the value a screen reader gets',
    ratingLabel: "Live demo: the star length reads aria-valuenow directly",
    modeLegend: "How it updates",
    modeAttr: "New way: only update aria-valuenow; CSS attr() reads the length",
    modeJs:
      "Old way: JavaScript updates the width and aria-valuenow separately",
    forget: "Simulate the code forgetting to update aria-valuenow (width only)",
    minus: "−10",
    plus: "+10",
    progressName: "Upload progress",
    visual: "Length on screen",
    aria: "What a screen reader gets",
    match: "They match.",
    mismatch:
      "They don't match: the progress you see and the progress you hear differ.",
    ratingName: (name: string) => `${name} rating`,
    ratingText: (v: number) => `${v} out of 5 stars`,
    native:
      "Your browser supports typed attr(), so CSS reads the attribute directly",
    fallback:
      "Your browser doesn't support typed attr(), so JavaScript copies the value into a CSS variable",
    pending: "Detecting (requires JavaScript)",
    print: "This is an interactive demo. Try it on the web page.",
  },
};

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);

const ratings = computed(() =>
  locale.value === "en"
    ? [
        { name: "Kyoto", value: 4.5 },
        { name: "Osaka", value: 3.5 },
        { name: "Nara", value: 2 },
      ]
    : [
        { name: "京都", value: 4.5 },
        { name: "大阪", value: 3.5 },
        { name: "奈良", value: 2 },
      ],
);

const modeText = computed(() =>
  supported.value === null
    ? text.value.pending
    : supported.value
      ? text.value.native
      : text.value.fallback,
);

// 不支援時的後備：把 aria-valuenow 複製成 CSS 變數（CSS 裡的 @supports 會在支援時改用 attr()）
const fallbackStyle = computed(() =>
  supported.value === false && mode.value === "attr"
    ? { "--now": ariaNow.value }
    : undefined,
);

const mismatch = computed(
  () => visual.value !== null && Math.abs(visual.value - ariaNow.value) > 1,
);

async function measure() {
  await nextTick();
  const el = fill.value;
  const bar = el?.parentElement;
  if (!el || !bar) return;
  visual.value = Math.round(
    (el.getBoundingClientRect().width / bar.getBoundingClientRect().width) *
      100,
  );
}

function step(delta: number) {
  value.value = Math.min(100, Math.max(0, value.value + delta));
  if (mode.value === "attr") {
    ariaNow.value = value.value;
  } else {
    jsWidth.value = value.value;
    if (!forget.value) ariaNow.value = value.value;
  }
  measure();
}

// 換模式時重新對齊，從一致的狀態開始
watch([mode, forget], () => {
  jsWidth.value = value.value;
  ariaNow.value = value.value;
  measure();
});

onMounted(() => {
  supported.value = CSS.supports("width: attr(data-x type(<length>))");
  if (props.kind === "progress") measure();
});
</script>
