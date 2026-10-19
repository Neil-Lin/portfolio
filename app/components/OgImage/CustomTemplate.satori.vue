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
      <!-- position: relative 讓文字畫在絕對定位的浮水印上面（新版 satori 依 CSS 規範的繪製順序） -->
      <div
        style="
          position: relative;
          font-weight: bold;
          font-size: 4rem;
          color: #222;
          padding: 0 4rem;
        "
      >
        {{ title }}
      </div>
      <div
        style="
          position: relative;
          font-size: 2rem;
          color: #565656;
          padding: 0 4rem;
        "
      >
        {{ description }}
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
</script>
