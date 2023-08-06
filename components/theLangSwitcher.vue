<template>
  <div class="lang-switcher">
    <span>
      <span id="lang-text" class="visually-hidden">
        {{ $t("name.language") }}
      </span>
      🌐
    </span>
    <select aria-labelledby="lang-text" @change="onLocaleChanged">
      <option
        v-for="loc in supportedLocales"
        :key="loc.code"
        :value="loc.code"
        :selected="locale === loc.code"
      >
        {{ loc.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
// https://phrase.com/blog/posts/nuxt-js-tutorial-i18n/
// Used for type casting
import { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables";

// Get active locale and supported locales
const { locale, locales } = useI18n();
// Cast to avoid TypeScript errors in template
const supportedLocales = locales.value as Array<LocaleObject>;

// const router = useRouter();
const switchLocalePath = useSwitchLocalePath();

// When the visitor selects a new locale, route to
// to the new locale's path e.g. /en-CA/foo → /ar-EG/foo
async function onLocaleChanged(event: Event) {
  const target = event.target as HTMLInputElement;

  // switchLocalePath('ar-EG') will return Arabic equivalent
  // for the *current* URL path e.g. if we're at /en-CA/about,
  // switchLocalePath('ar-EG') will return '/ar-EG/about'
  // router.push({ path: switchLocalePath(target.value) });
  await navigateTo({ path: switchLocalePath(target.value) });
}
</script>
