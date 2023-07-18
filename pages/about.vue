<template>
  <div class="page">
    <div :class="['page-aside', mobileMenuStatus ? 'page-aside--open' : '']">
      <button
        type="button"
        class="btn-close-mobile-menu"
        @click="handleCloseMobileMenuBtn"
      >
        {{ $t("action.closeMenu") }}
      </button>
      <TheAside />
    </div>
    <main class="page-container">
      <button
        type="button"
        class="btn-open-mobile-menu"
        @click="handleToggleMobileMenuBtn"
      >
        <span>{{ $t("name.menu") }}</span>
      </button>
      <AkContainer />
      <TheBreadcrumb :page-title="pageTitle" :page-link="`${route.path}`" />
      <h2>{{ pageTitle }}</h2>
      <article>
        <section>
          <h3>{{ $t("name.intro") }}</h3>
          <i18n-t keypath="page.about.p1" tag="p" scope="global">
            <br />
          </i18n-t>
        </section>
        <section>
          <div class="flex-list">
            <div>
              <h4 class="flex-list-title">{{ $t("name.programming") }}</h4>
              <ul>
                <li>HTML5</li>
                <li>CSS/SCSS</li>
                <li>Javascript/jQuery</li>
                <li>Vue/Nuxt</li>
                <li>Version Control</li>
              </ul>
            </div>
            <div>
              <h4 class="flex-list-title">{{ $t("name.promote") }}</h4>
              <ul>
                <li>
                  <nuxt-link
                    to="https://ithelp.ithome.com.tw/users/20152260/ironman/5614"
                    :title="
                      $t('action.goTo') +
                      $t('des.ithomeA11y') +
                      $t('action.openWindow')
                    "
                    target="_blank"
                    ref="noreferrer noopener"
                  >
                    Accessibility
                  </nuxt-link>
                </li>
                <li>Data visualization</li>
                <li>DesignOps/Design System</li>
                <li>OKR/GCSM</li>
                <li>Scrum</li>
                <li>SEO</li>
              </ul>
            </div>
            <div>
              <h4 class="flex-list-title">{{ $t("name.tools") }}</h4>
              <ul>
                <li>Figma</li>
                <li>VScode</li>
                <li>Sourcetree</li>
                <li>Wordpress</li>
              </ul>
            </div>
          </div>
        </section>
        <section>
          <i18n-t keypath="page.about.p2" tag="p" scope="global">
            <template #link>
              <nuxt-link
                to="https://github.com/Neil-Lin/portfolio"
                :title="$t('action.goTo') + 'Github' + $t('action.openWindow')"
                target="_blank"
                ref="noreferrer noopener"
              >
                Github
              </nuxt-link>
            </template>
          </i18n-t>
        </section>
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const runtimeConfig = useRuntimeConfig();
const pageTitle = ref(t("mainMenu.about"));
const pageDescription = ref(t("des.about"));
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

const {
  mobileMenuStatus,
  handleToggleMobileMenuBtn,
  handleCloseMobileMenuBtn,
} = useMobileMenuBtn();
</script>
