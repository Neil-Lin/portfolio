<template>
  <footer>
    <nuxt-link id="ak-footer" to="#ak-footer" :title="$t('shortcut.footer')" accesskey="Z" name="ak-footer">
      :::
    </nuxt-link>
    <nuxt-link :to="switchLocalePath('zh-Hant-TW')">繁體中文</nuxt-link>
    <nuxt-link :to="switchLocalePath('en')">English</nuxt-link>
    2023 &copy; copyright
  </footer>
</template>

<script setup lang="ts">
const switchLocalePath = useSwitchLocalePath()
</script>
