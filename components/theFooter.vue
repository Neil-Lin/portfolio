<template>
  <footer>
    <a
      id="ak-footer"
      href="#ak-footer"
      :title="$t('shortcut.footer')"
      accesskey="Z"
    >
      :::
    </a>
    <template v-if="supportedLocales.length != 0">
      <span v-for="loc in supportedLocales" :key="loc.code">
        <nuxt-link
          :to="switchLocalePath(loc.code)"
          :title="$t('action.switch') + loc.name"
        >
          {{ loc.name }}
        </nuxt-link>
      </span>
    </template>
    <span>&copy; 2023 copyright</span>
  </footer>
</template>

<script setup lang="ts">
import type { LocaleObject } from '@nuxtjs/i18n';

const switchLocalePath = useSwitchLocalePath();
// import type { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables";
// Get active locale and supported locales
const { locales } = useI18n();
// Cast to avoid TypeScript errors in template
const supportedLocales = locales.value as Array<LocaleObject>;
</script>
