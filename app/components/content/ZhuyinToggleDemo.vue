<template>
  <div
    class="zhuyin-demo demo"
    :class="{ 'is-on': on }"
    :style="{ '--zhuyin-demo-font': `'${FONT_FAMILY}'` }"
  >
    <p class="demo__label">{{ text.label }}</p>

    <p>
      <button
        type="button"
        class="btn zhuyin-demo__toggle"
        :aria-pressed="on ? 'true' : 'false'"
        @click="toggle"
      >
        <!-- 勾號只給看得到的人，按鈕名稱保持不變，狀態交給 aria-pressed -->
        <span v-if="on" aria-hidden="true">✓ </span>{{ text.toggle }}
      </button>
    </p>

    <section class="zhuyin-demo__block" :aria-labelledby="`${uid}-ruby`">
      <h3 :id="`${uid}-ruby`" class="zhuyin-demo__title">
        {{ text.rubyTitle }}
      </h3>
      <!-- 逐字各包一個 <ruby>：Chromium 只把每個 <ruby> 的第一個注音當描述，整句包一個會只剩第一個字 -->
      <p class="zhuyin-demo__story zhuyin-demo__ruby" lang="zh-Hant-TW">
        <template v-for="(item, i) in story" :key="i"
          ><ruby v-if="item.zhuyin"
            >{{ item.char }}<rt aria-hidden="true">{{ item.zhuyin }}</rt></ruby
          ><template v-else>{{ item.char }}</template></template
        >
      </p>
    </section>

    <section class="zhuyin-demo__block" :aria-labelledby="`${uid}-font`">
      <h3 :id="`${uid}-font`" class="zhuyin-demo__title">
        {{ text.fontTitle }}
      </h3>
      <!-- 「銀行」的「行」後面接 U+E01E1，在注音字型選到 ㄏㄤˊ；沒開注音時選擇符看不見 -->
      <p class="zhuyin-demo__story zhuyin-demo__font" lang="zh-Hant-TW">
        {{ fontStory }}
      </p>
    </section>

    <p class="demo__status">{{ statusText }}</p>
    <p class="zhuyin-demo__note">{{ text.note }}</p>
    <p class="demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：按一下顯示注音，同時比較 HTML ruby 與注音字型（bpmfvs）
// 用法：::zhuyin-toggle-demo
// 字型是 Bpmf Huninn（OFL-1.1）只含本範例用字的子集，第一次打開注音才載入
const FONT_URL = "/vendor/bpmf-huninn/5.3.1/bpmf-huninn-demo-subset.woff2";
const FONT_FAMILY = "Bpmf Huninn Demo";
const VS_HANG = "\u{E01E1}"; // 「行」的第二個讀音 ㄏㄤˊ

const uid = useDemoId("zhuyin");

// 故事內容（兩種做法共用），zhuyin 是 ruby 用的注音
const story = [
  { char: "小", zhuyin: "ㄒㄧㄠˇ" },
  { char: "明", zhuyin: "ㄇㄧㄥˊ" },
  { char: "走", zhuyin: "ㄗㄡˇ" },
  { char: "過", zhuyin: "ㄍㄨㄛˋ" },
  { char: "銀", zhuyin: "ㄧㄣˊ" },
  { char: "行", zhuyin: "ㄏㄤˊ", vs: VS_HANG },
  { char: "，" },
  { char: "看", zhuyin: "ㄎㄢˋ" },
  { char: "見", zhuyin: "ㄐㄧㄢˋ" },
  { char: "很", zhuyin: "ㄏㄣˇ" },
  { char: "多", zhuyin: "ㄉㄨㄛ" },
  { char: "行", zhuyin: "ㄒㄧㄥˊ" },
  { char: "人", zhuyin: "ㄖㄣˊ" },
  { char: "。" },
];
const fontStory = story.map((s) => s.char + (s.vs ?? "")).join("");

type FontState = "idle" | "loading" | "loaded" | "failed";
const on = ref(false);
const fontState = ref<FontState>("idle");

const messages = {
  "zh-Hant-TW": {
    label:
      "互動範例：按一下顯示注音，比較 HTML ruby 與注音字型。兩種做法同時切換。",
    toggle: "顯示注音",
    rubyTitle: "做法一：HTML ruby（瀏覽器預設，注音在字的上方）",
    fontTitle: "做法二：注音字型（注音在字的右側）",
    status: {
      idle: "注音字型還沒載入，第一次打開注音才會下載",
      loading: "注音字型載入中",
      loaded: "注音字型已載入（本範例只含用到的字，約 6 KB）",
      failed: "注音字型載入失敗，做法二只會顯示國字",
    },
    note: "兩種做法的 HTML 裡都是同一段國字。ruby 的注音寫在 <rt> 裡，並加上 aria-hidden；注音字型的注音畫在字形裡，「銀行」的「行」後面多一個看不見的選擇符，用來選 ㄏㄤˊ 這個讀音。",
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    label:
      "Live demo: press the button to show Zhuyin, comparing HTML ruby with a Zhuyin font. Both switch at the same time.",
    toggle: "Show Zhuyin",
    rubyTitle: "Approach 1: HTML ruby (browser default, Zhuyin above)",
    fontTitle: "Approach 2: Zhuyin font (Zhuyin to the right)",
    status: {
      idle: "The Zhuyin font isn't loaded yet; it downloads the first time you turn Zhuyin on",
      loading: "Loading the Zhuyin font",
      loaded:
        "Zhuyin font loaded (this demo only includes the characters it uses, about 6 KB)",
      failed:
        "The Zhuyin font failed to load, so approach 2 shows only the characters",
    },
    note: "Both approaches have the same Chinese text in the HTML. Ruby puts the Zhuyin in <rt> with aria-hidden; the Zhuyin font draws it inside the glyphs, and the 行 in 銀行 is followed by an invisible selector that picks the ㄏㄤˊ reading.",
    print: "This is an interactive demo. Try it on the web page.",
  },
};

const text = useDemoText(messages);
const statusText = computed(() => text.value.status[fontState.value]);

// 第一次打開才載入注音字型，沒打開的人不用下載
async function loadFont() {
  if (fontState.value !== "idle") return;
  fontState.value = "loading";
  try {
    const face = new FontFace(FONT_FAMILY, `url(${FONT_URL}) format("woff2")`);
    await face.load();
    document.fonts.add(face);
    fontState.value = "loaded";
  } catch {
    fontState.value = "failed";
  }
}

function toggle() {
  on.value = !on.value;
  if (on.value) loadFont();
}
</script>
