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
    <div class="footer-container">
      <template v-if="supportedLocales.length != 0">
        <span v-for="loc in supportedLocales" :key="loc.code">
          <nuxt-link
            :to="resolve(loc.code)"
            :title="$t('action.switch') + loc.name"
          >
            <span class="visually-hidden">{{ $t("action.switch") }}</span>
            {{ loc.name }}
          </nuxt-link>
        </span>
      </template>
      <span>&copy; Neil</span>
      <ClientOnly fallback-tag="span">
        <span>
          {{ $t("words.updateDay") }}：
          <span aria-hidden="true">{{ formattedDate }}</span>
          <span v-if="locale === 'en'" class="visually-hidden">
            {{ formattedDateEn }}
          </span>
          <span v-else class="visually-hidden">{{ formattedDateZh }}</span>
        </span>
      </ClientOnly>
      <div>
        <nuxt-link
          to="https://accessibility.moda.gov.tw/Applications/Detail?category=20250820134645"
          :title="t('words.openNewWindowToA11yCheckPage')"
          target="_blank"
          class="a11y-img"
        >
          <img
            src="@/assets/images/a11y-aa.svg"
            width="88"
            height="31"
            :alt="t('words.passA11yTWBadge')"
          />
        </nuxt-link>
      </div>
      <div>&#8599; {{ t("words.aboutExternalWebsite") }}</div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { resolve } = useLocaleSwitch();
const { t, locales, locale } = useI18n();

type LocaleItem = { code: "zh-Hant-TW" | "en"; name: string };
const supportedLocales = locales.value as LocaleItem[];

const runtimeConfig = useRuntimeConfig();
const buildDateStr = (runtimeConfig.public.buildDate as string) || "2025-01-01";
const [yearStr, monthStr, dayStr] = buildDateStr.split("-");
// Ensure parsing is safe; fallback to 0 if undefined (though with valid date string it won't be)
const year = Number(yearStr);
const month = Number(monthStr);
const day = Number(dayStr);
const buildDate = new Date(year, month - 1, day);

const formattedDate = buildDateStr;
const formattedDateEn = buildDate.toLocaleDateString("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const formattedDateZh = buildDate.toLocaleDateString("zh-TW", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
</script>

<style scoped>
footer {
  .footer-container {
    padding: 1rem 0.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    color: oklch(var(--footer-color));
    border-top: 1px solid oklch(var(--border-color) / 0.5);
    background-color: oklch(var(--footer-bg));
    @media screen and (width <= 768px) {
      flex-direction: column;
    }
  }
}

.a11y-img {
  display: inline-block;
}
</style>
