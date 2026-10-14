<template>
  <h2 class="portfolio-title">{{ title }}</h2>
  <div class="portfolio-content">
    <img
      v-if="imageSrc"
      :loading="fetchpriority === 'high' ? undefined : 'lazy'"
      :fetchpriority="fetchpriority"
      decoding="async"
      :sizes="fetchpriority === 'high' ? FIRST_SIZES : `auto, ${CARD_SIZES}`"
      :srcset="imageSrcset(imageSrc)"
      :src="imageSrc"
      :alt="imageAlt ?? ''"
      class="portfolio-img"
    />
    <div v-if="intro" class="portfolio-intro">
      <p>{{ intro }}</p>
    </div>
  </div>
  <div class="portfolio-footer">
    <span class="visually-hidden">{{ $t("words.relatedTags") }}：</span>
    <span class="tag">
      <span class="visually-hidden">{{ $t("words.startToEnd") }}：</span>
      {{ yearLabel }}
    </span>
    <span
      v-if="platform.includes('web') || platform.includes('app')"
      class="visually-hidden"
      >{{ $t("words.platformType") }}：</span
    >
    <span v-if="platform.includes('web')" class="tag">Web</span>
    <span v-if="platform.includes('app')" class="tag">App</span>
    <span v-if="roles.length > 0" class="visually-hidden">
      {{ $t("words.roles") }}：
    </span>
    <span v-for="(role, index) in roles" :key="index" class="tag">{{
      role
    }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  intro?: string;
  yearLabel: string;
  platform: string[];
  roles: string[];
  fetchpriority?: "high";
}>();

// 卡片在畫面上的寬度（實測）：手機約 100vw - 160px，平板單欄約 62vw；
// 桌機第一張大卡約 66～72vw，其餘約 28～33vw。
// lazy 的圖用 sizes="auto" 讓瀏覽器照實際寬度挑，後面的值只給不支援 auto 的瀏覽器用。
// 第一張圖不是 lazy，auto 不會生效（連後面的備案也會被忽略），所以要另外手寫。
// 屬性順序有意義：在瀏覽器端建立圖片時，Vue 依序設定屬性，src 一設定就會開始挑檔案，
// 所以 loading、sizes、srcset 要寫在 src 前面，不然會用預設的 100vw 先抓一張大圖。
const CARD_SIZES =
  "(width <= 768px) calc(100vw - 160px), (width <= 1024px) 62vw, 33vw";
const FIRST_SIZES =
  "(width <= 768px) calc(100vw - 160px), (width <= 1024px) 62vw, 72vw";
</script>
