<template>
  <footer>
    <nuxt-link id="ak-footer" to="#ak-footer" :title="$t('shortcut.footer')" accesskey="Z" name="ak-footer">
      :::
    </nuxt-link>
    <ul v-if="supportedLocales.length != 0" class="lang-list">
      <li v-for="loc in supportedLocales" :key="loc.code">
        <nuxt-link :to="switchLocalePath(loc.code)">{{ loc.name }}</nuxt-link>
      </li>
    </ul>
    2023 &copy; copyright
  </footer>
</template>

<script setup lang="ts">
const switchLocalePath = useSwitchLocalePath()
import { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables"
// Get active locale and supported locales
const { locale, locales } = useI18n()
// Cast to avoid TypeScript errors in template
const supportedLocales = locales.value as Array<LocaleObject>
</script>
