<template>
  <div class="carousel-demo dialog-demo">
    <p class="dialog-demo__label">{{ text.label }}</p>

    <au-carousel
      class="carousel-au"
      :aria-label="text.name"
      :data-text-roledescription="text.roledescription"
      :data-text-pagination="text.pagination"
      :data-text-instructions="text.instructions"
      :data-text-prev="text.prev"
      :data-text-next="text.next"
      :data-dot-template="text.dot"
      :data-live-template="text.live"
    >
      <div
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
      </div>
    </au-carousel>
    <p class="popover-demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：Accesserty UI Kit 的 <au-carousel>，跟原生 CSS 輪播對照
// 元件檔案放在 public/vendor/accesserty-ui-kit/<版本>/carousel.js（MIT），只在瀏覽器端載入。
// 用法：::carousel-au-demo
const AU_CAROUSEL_SRC = "/vendor/accesserty-ui-kit/2.0.2/carousel.js";

const { locale } = useI18n();
const slides = computed(() => carouselDemoSlides(locale.value));
const saved = reactive<Record<string, boolean>>({});

const messages = {
  "zh-Hant-TW": {
    label: "互動範例：Accesserty UI Kit 的 <au-carousel>，內容和上面完全一樣",
    name: "旅遊行程（UI Kit）",
    roledescription: "輪播",
    pagination: "選擇投影片",
    instructions: "用方向鍵在投影片之間移動。",
    prev: "上一張",
    next: "下一張",
    dot: "{title}，第 {current} 張，共 {total} 張",
    live: "{title}，第 {current} 張，共 {total} 張",
    save: (title: string) => `收藏${title}`,
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    label:
      "Live demo: <au-carousel> from Accesserty UI Kit, with exactly the same content",
    name: "Travel plans (UI Kit)",
    roledescription: "carousel",
    pagination: "Choose a slide",
    instructions: "Use the arrow keys to move between slides.",
    prev: "Previous slide",
    next: "Next slide",
    dot: "{title}, {current} of {total}",
    live: "{title}, slide {current} of {total}",
    save: (title: string) => `Save ${title}`,
    print: "This is an interactive demo. Try it on the web page.",
  },
};

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);

onMounted(() => {
  if (customElements.get("au-carousel")) return;
  if (document.querySelector(`script[src="${AU_CAROUSEL_SRC}"]`)) return;
  const script = document.createElement("script");
  script.src = AU_CAROUSEL_SRC;
  document.head.append(script);
});
</script>
