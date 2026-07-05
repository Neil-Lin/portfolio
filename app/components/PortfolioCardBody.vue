<template>
  <h3 class="portfolio-title">{{ title }}</h3>
  <div class="portfolio-content">
    <img
      v-if="imageSrc"
      :src="imageSrc"
      :alt="imageAlt ?? ''"
      class="portfolio-img"
      :fetchpriority="fetchpriority"
      :loading="fetchpriority === 'high' ? undefined : 'lazy'"
      decoding="async"
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
</script>
