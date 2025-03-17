<template>
  <main class="page page--narrow">
    <div class="page-container">
      <theBreadcrumbs :list="breadCrumbsList" />
      <akContainer />
      <h2>{{ pageTitle }}</h2>
      <section>
        <h3>{{ $t("words.websiteBlocksAndShortcutKeys") }}</h3>
        <i18n-t keypath="page.sitemap.p1" tag="p" scope="global"><br /></i18n-t>
        <i18n-t keypath="page.sitemap.p2" tag="p" scope="global">
          <template #n>
            <br />
          </template>
          <template #keyU> <kbd>Alt</kbd>+<kbd>U</kbd> </template>
          <template #keyC> <kbd>Alt</kbd>+<kbd>C</kbd> </template>
          <template #keyZ> <kbd>Alt</kbd>+<kbd>Z</kbd> </template>
        </i18n-t>
        <i18n-t keypath="page.sitemap.p3" tag="p" scope="global">
          <template #n>
            <br />
          </template>
          <template #firefoxKeyExample>
            <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>{{
              $t("words.shortcutLetter")
            }}</kbd>
          </template>
          <template #firefoxKeyExample2>
            <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>C</kbd>
          </template>
          <template #macKeyExample>
            <kbd>Control</kbd>+<kbd>Option</kbd>+<kbd>{{
              $t("words.shortcutLetter")
            }}</kbd>
          </template>
        </i18n-t>
        <div
          ref="checkScrollable"
          class="table-scroll-h"
          :tabindex="tabIndex"
          role="group"
          aria-labelledby="caption"
        >
          <table>
            <caption id="caption">
              <nuxt-link
                to="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey"
                :title="`${$t('action.goTo')} ${$t('des.a11yrefrerence')} ${$t('action.openWindow')}`"
                target="_blank"
              >
                <span>{{ $t("page.sitemap.tableCaption") }}</span>
              </nuxt-link>
              <small v-show="tabIndex === 0"
                >({{ $t("action.scrollHorizontalToSeeMore") }})</small
              >
            </caption>
            <tbody>
              <tr>
                <th scope="col">
                  {{ $t("words.browser") }}/{{ $t("words.os") }}
                </th>
                <th scope="col">Windows</th>
                <th scope="col">Linux</th>
                <th scope="col">Mac</th>
              </tr>
              <tr>
                <th scope="row">Firefox</th>
                <td colspan="2">
                  <kbd>Alt</kbd> + <kbd>Shift</kbd> +
                  <kbd>{{ $t("words.shortcutLetter") }}</kbd>
                </td>
                <td>
                  Firefox 57 {{ $t("words.versionAbove") }}:
                  <kbd>Control</kbd> + <kbd>Option</kbd> +
                  <kbd>{{ $t("words.shortcutLetter") }}</kbd>
                  {{ $t("words.or") }} <kbd>Control</kbd> + <kbd>Alt</kbd> +
                  <kbd>{{ $t("words.shortcutLetter") }}</kbd
                  ><br />
                  Firefox 14 {{ $t("words.versionAbove") }}:
                  <kbd>Control</kbd> + <kbd>Alt</kbd> +
                  <kbd>{{ $t("words.shortcutLetter") }}</kbd
                  ><br />
                  Firefox 13 {{ $t("words.versionBelow") }}:
                  <kbd>Control</kbd> +
                  <kbd>{{ $t("words.shortcutLetter") }}</kbd>
                </td>
              </tr>
              <tr>
                <th scope="row">Internet Explorer</th>
                <td rowspan="3">
                  <kbd>Alt</kbd> + <kbd>{{ $t("words.shortcutLetter") }}</kbd
                  ><br />
                  <kbd>Alt</kbd> + <kbd>Shift</kbd> +
                  <kbd>{{ $t("words.shortcutLetter") }}</kbd>
                </td>
                <td colspan="2"></td>
              </tr>
              <tr>
                <th scope="row">Edge</th>
                <td></td>
                <td rowspan="3">
                  <kbd>Control</kbd> + <kbd>Option</kbd> +
                  <kbd>{{ $t("words.shortcutLetter") }}</kbd
                  ><br />
                  <kbd>Control</kbd> + <kbd>Option</kbd> + <kbd>Shift</kbd> +
                  <kbd>{{ $t("words.shortcutLetter") }}</kbd>
                </td>
              </tr>
              <tr>
                <th scope="row">Google Chrome</th>
                <td>
                  <kbd>Alt</kbd> + <kbd>{{ $t("words.shortcutLetter") }}</kbd>
                </td>
              </tr>
              <tr>
                <th scope="row">Safari</th>
                <td colspan="2"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <i18n-t keypath="page.sitemap.p4" tag="p" scope="global">
          <template #n>
            <br />
          </template>
          <template #keyLeftRight> <kbd>←</kbd> <kbd>→</kbd> </template>
          <template #keyUpDown> <kbd>↑</kbd> <kbd>↓</kbd> </template>
          <template #keyTab>
            <kbd>Tab</kbd>
          </template>
          <template #keyShiftTab> <kbd>Shift</kbd> + <kbd>Tab</kbd> </template>
        </i18n-t>
      </section>
      <section>
        <h3>{{ $t("words.sitemap") }}</h3>
        <div class="sitemap-list">
          <ol>
            <li>
              <nuxt-link
                :to="localePath('/')"
                :title="$t('action.goTo') + $t('action.goToHomePage')"
              >
                {{ $t("words.home") }}
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                :to="localePath('/sitemap')"
                :title="$t('action.goTo') + $t('mainMenu.sitemap')"
              >
                {{ $t("mainMenu.sitemap") }}
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                :to="localePath('/products')"
                :title="$t('action.goTo') + $t('mainMenu.products')"
              >
                {{ $t("mainMenu.products") }}
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                :to="localePath('/projects')"
                :title="$t('action.goTo') + $t('mainMenu.projects')"
              >
                {{ $t("mainMenu.projects") }}
              </nuxt-link>
            </li>
            <li>
              <nuxt-link
                :to="localePath('/blog')"
                :title="$t('action.goTo') + $t('mainMenu.blog')"
              >
                {{ $t("mainMenu.blog") }}
              </nuxt-link>
            </li>
          </ol>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const runtimeConfig = useRuntimeConfig();
const pageTitle = ref(t("mainMenu.sitemap"));
const pageDescription = ref(t("des.sitemap"));
const route = useRoute();

useHead({
  title: pageTitle,
  meta: [
    {
      hid: "description",
      name: "description",
      content: pageDescription.value,
    },
    {
      hid: "og:url",
      property: "og:url",
      content: runtimeConfig.public.baseUrl + route.path,
    },
    {
      hid: "og:title",
      property: "og:title",
      content: pageTitle.value + " - " + t("website.name"),
    },
    {
      hid: "og:description",
      property: "og:description",
      content: pageDescription.value,
    },
    {
      hid: "twitter:url",
      name: "twitter:url",
      content: runtimeConfig.public.baseUrl + route.path,
    },
    {
      hid: "twitter:title",
      name: "twitter:title",
      content: pageTitle.value + " - " + t("website.name"),
    },
    {
      hid: "twitter:description",
      name: "twitter:description",
      content: pageDescription.value,
    },
  ],
});

const breadCrumbsList = computed(() => [
  {
    link: "/",
    title: t("action.goToHomePage"),
  },
  {
    link: "",
    title: t("mainMenu.sitemap"),
  },
]);

const checkScrollable = ref<HTMLElement | null>(null);
const tabIndex = ref();
const checkTabAble = () => {
  if (
    checkScrollable.value!["scrollWidth"] > 0 &&
    checkScrollable.value!["scrollWidth"] >
      checkScrollable.value!["clientWidth"]
  ) {
    tabIndex.value = 0;
  } else {
    tabIndex.value = null;
  }
};
onMounted(() => {
  checkTabAble();
  window.addEventListener("resize", checkTabAble);
});
</script>

<style scoped>
.sitemap-list {
  a {
    text-transform: capitalize;
  }
}
</style>
