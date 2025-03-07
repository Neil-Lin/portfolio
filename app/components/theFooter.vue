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
            :to="switchLocalePath(loc.code)"
            :title="$t('action.switch') + loc.name"
          >
            {{ loc.name }}
          </nuxt-link>
        </span>
      </template>
      <span>&copy; copyright</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
const switchLocalePath = useSwitchLocalePath();
const { locales } = useI18n();
const supportedLocales = locales.value as Array<LocaleObject>;
</script>

<style scoped>
footer {
  .footer-container {
    padding: 1rem 0.5rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
    color: oklch(var(--color-gray-700));
    border-top: 1px solid oklch(var(--border-color) / 0.5);
    background-color: oklch(var(--color-white));
    @media screen and (width <= 768px) {
      flex-direction: column;
    }
  }
}
</style>
