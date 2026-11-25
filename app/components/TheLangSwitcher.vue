<template>
  <div class="lang-switcher">
    <span>
      <span id="lang-text" class="visually-hidden">
        {{ $t("words.language") }}
      </span>
      <span aria-hidden="true">🌐</span>
      <span class="visually-hidden">{{ $t("words.changeByFilter") }}</span>
    </span>
    <select aria-labelledby="lang-text" @change="onLocaleChanged">
      <option
        v-for="loc in supportedLocales"
        :key="loc.code"
        :value="loc.code"
        :lang="loc.language"
        :selected="locale === loc.code"
      >
        {{ loc.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n();

const { resolve, supportedLocales } = await useLocaleSwitch();

async function onLocaleChanged(event: Event) {
  const target = event.target as HTMLSelectElement;
  const code = target.value as "zh-Hant-TW" | "en";
  await navigateTo({ path: resolve(code) });
}
</script>
