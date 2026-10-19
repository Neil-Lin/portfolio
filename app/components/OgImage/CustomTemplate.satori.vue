<template>
  <div
    style="
      height: 630px;
      background-color: #fafafa;
      font-family: &quot;Noto Sans TC&quot;, sans-serif;
    "
  >
    <img
      v-if="imagePath"
      :src="imagePath"
      :alt="`${props.title}封面照`"
      style="width: 100%; height: 100%; object-fit: cover"
    />

    <div
      v-else
      style="
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      "
    >
      <img
        src="@/assets/images/sitename.svg"
        style="
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          object-fit: cover;
        "
      />
      <!-- position: relative 讓文字畫在絕對定位的浮水印上面（新版 satori 依 CSS 規範的繪製順序）；
           font-weight 要寫數字：og-image 7 依模板決定要下載哪些字重，寫 bold 會只下載 400 -->
      <!-- 標題依長度縮小字級；標題、描述的行數有上限，超出以「…」截斷，長標題（多半是英文）才不會超出畫面 -->
      <div
        style="
          position: relative;
          display: block;
          font-weight: 700;
          line-height: 1.3;
          color: #222;
          padding: 0 4rem;
        "
        :style="{
          fontSize: `${titleLayout.size}px`,
          lineClamp: titleLayout.lines,
        }"
      >
        {{ displayTitle }}
      </div>
      <div
        style="
          position: relative;
          display: block;
          margin-top: 1rem;
          font-size: 2rem;
          line-height: 1.5;
          color: #565656;
          padding: 0 4rem;
        "
        :style="{ lineClamp: descriptionLines }"
      >
        {{ displayDescription }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  imagePath: {
    type: String,
    default: "",
  },
});

// Noto Sans TC 的 ’ 是全形字，英文的 It’s 會變成「It’ s」；夾在英文字母中間的換成直的 '
const straightenApostrophes = (text: string) =>
  text.replace(/(?<=[A-Za-z])’(?=[A-Za-z])/g, "'");
const displayTitle = computed(() => straightenApostrophes(props.title));
const displayDescription = computed(() =>
  straightenApostrophes(props.description),
);

// 依標題長度選字級與行數上限：64、56、48px 都最多 3 行，還放不下就用 44px、最多 4 行，
// 再長才靠 line-clamp 截斷。中日韓文字約 1em 寬、英數約 0.58em（估算值，留 10% 餘裕）；
// 文字區寬度 1200 - 左右 padding 64 × 2 = 1072px
const TEXT_WIDTH = 1072;
const TITLE_LAYOUTS = [
  { size: 64, lines: 3 },
  { size: 56, lines: 3 },
  { size: 48, lines: 3 },
  { size: 44, lines: 4 },
];
const titleEms = computed(() =>
  [...displayTitle.value].reduce(
    (sum, char) =>
      sum + (/[\u2e80-\u9fff\uf900-\ufaff\uff00-\uffef]/.test(char) ? 1 : 0.58),
    0,
  ),
);
const titleLayout = computed(
  () =>
    TITLE_LAYOUTS.find(
      ({ size, lines }) => titleEms.value * size <= TEXT_WIDTH * lines * 0.9,
    ) ?? TITLE_LAYOUTS.at(-1)!,
);
// 標題佔的行數少，描述就多留幾行（2～4 行）
const descriptionLines = computed(() => {
  const titleLines = Math.ceil(
    (titleEms.value * titleLayout.value.size) / (TEXT_WIDTH * 0.9),
  );
  return Math.min(
    4,
    Math.max(2, 6 - Math.min(titleLines, titleLayout.value.lines)),
  );
});
</script>
