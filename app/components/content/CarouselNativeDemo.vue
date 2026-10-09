<template>
  <div class="carousel-demo dialog-demo">
    <p class="dialog-demo__label">{{ text.label }}</p>

    <!-- 按鈕與導覽點都是 CSS 產生的偽元素；替代文字用 attr() 讀這裡的 data-*，才能切換語系 -->
    <ul
      class="carousel-native"
      :aria-label="text.name"
      :data-prev="text.prev"
      :data-next="text.next"
    >
      <li
        v-for="slide in slides"
        :key="slide.key"
        class="carousel-demo__slide"
        :data-title="slide.title"
      >
        <h4>{{ slide.title }}</h4>
        <p>{{ slide.body }}</p>
        <button
          type="button"
          class="dialog-demo__close"
          :aria-pressed="saved[slide.key] ? 'true' : 'false'"
          @click="saved[slide.key] = !saved[slide.key]"
        >
          {{ text.save(slide.title) }}
        </button>
      </li>
    </ul>
    <p class="carousel-demo__fallback">{{ text.fallback }}</p>
    <p class="popover-demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：只用 CSS 做的輪播（::scroll-marker、::scroll-button()）
// 用法：::carousel-native-demo
const { locale } = useI18n();
const slides = computed(() => carouselDemoSlides(locale.value));
const saved = reactive<Record<string, boolean>>({});

const messages = {
  "zh-Hant-TW": {
    label: "互動範例：原生 CSS 輪播，沒有寫任何 JavaScript",
    name: "旅遊行程（原生 CSS）",
    prev: "上一張",
    next: "下一張",
    save: (title: string) => `收藏${title}`,
    fallback:
      "你的瀏覽器不支援 ::scroll-marker，這裡只會是一排可以左右捲動的卡片。",
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    label: "Live demo: a native CSS carousel with no JavaScript at all",
    name: "Travel plans (native CSS)",
    prev: "Previous slide",
    next: "Next slide",
    save: (title: string) => `Save ${title}`,
    fallback:
      "Your browser doesn't support ::scroll-marker, so this is just a row of cards you can scroll sideways.",
    print: "This is an interactive demo. Try it on the web page.",
  },
};

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);
</script>
