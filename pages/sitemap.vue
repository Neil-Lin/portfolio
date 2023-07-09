<template>
  <div class="page">
    <div :class="['page-aside', mobileMenuStatus ? 'page-aside--open' : '']">
      <button class="btn-close-mobile-menu" @click="handleCloseMobileMenuBtn">{{ $t('action.closeMenu') }}</button>
      <theAside />
    </div>
    <main class="page-container">
      <button class="btn-open-mobile-menu" @click="handleToggleMobileMenuBtn">
        <span>{{ $t('name.menu') }}</span>
      </button>
      <akContainer />
      <theBreadcrumb :page-title="pageTitle" :page-link="`${route.path}`" />
      <h1>{{ pageTitle }}</h1>
      <h2>{{ pageTitle }}</h2>
      <article>
        <section>
          <h3>{{ $t('name.websiteBlocksAndShortcutKeys') }}</h3>
          <i18n-t keypath="page.sitemap.p1" tag="p" scope="global"><br /></i18n-t>
          <i18n-t keypath="page.sitemap.p2" tag="p" scope="global">
            <template #n>
              <br />
            </template>
            <template #keyU>
              <kbd>Alt</kbd>+<kbd>U</kbd>
            </template>
            <template #keyC>
              <kbd>Alt</kbd>+<kbd>C</kbd>
            </template>
            <template #keyZ>
              <kbd>Alt</kbd>+<kbd>Z</kbd>
            </template>
          </i18n-t>
          <i18n-t keypath="page.sitemap.p3" tag="p" scope="global">
            <template #n>
              <br />
            </template>
            <template #firefoxKeyExample>
              <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>{{ $t('name.shortcutLetter') }}</kbd>
            </template>
            <template #firefoxKeyExample2>
              <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>C</kbd>
            </template>
            <template #macKeyExample>
              <kbd>Control</kbd>+<kbd>Option</kbd>+<kbd>{{ $t('name.shortcutLetter') }}</kbd>
            </template>
          </i18n-t>
          <div class="table-scroll-h">
            <table>
              <i18n-t keypath="page.sitemap.tableCaption" tag="caption" scope="global">
                <template #link>
                  <nuxt-link
                    to="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey"
                    :title="$t('action.goTo') + $t('des.a11yrefrerence') + $t('action.openWindow')"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {{ $t('name.source') }}
                  </nuxt-link>
                </template>
              </i18n-t>
              <tbody>
                <tr>
                  <th scope="col">{{ $t('browser') }}/{{ $t('os') }}</th>
                  <th scope="col">Windows</th>
                  <th scope="col">Linux</th>
                  <th scope="col">Mac</th>
                </tr>
                <tr>
                  <th scope="row">Firefox</th>
                  <td colspan="2"><kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>{{ $t('name.shortcutLetter') }}</kbd></td>
                  <td>
                    Firefox 57 {{ $t('name.versionAbove') }}: <kbd>Control</kbd> + <kbd>Option</kbd> +
                    <kbd>{{ $t('name.shortcutLetter') }}</kbd> {{ $t('name.or') }} <kbd>Control</kbd> + <kbd>Alt</kbd> +
                    <kbd>{{ $t('name.shortcutLetter') }}</kbd><br />
                    Firefox 14 {{ $t('name.versionAbove') }}: <kbd>Control</kbd> + <kbd>Alt</kbd> + <kbd>{{ $t('name.shortcutLetter') }}</kbd
                    ><br />
                    Firefox 13 {{ $t('name.versionBelow') }}: <kbd>Control</kbd> + <kbd>{{ $t('name.shortcutLetter') }}</kbd>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Internet Explorer</th>
                  <td rowspan="3">
                    <kbd>Alt</kbd> + <kbd>{{ $t('name.shortcutLetter') }}</kbd><br />
                    <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>{{ $t('name.shortcutLetter') }}</kbd>
                  </td>
                  <td colspan="2"></td>
                </tr>
                <tr>
                  <th scope="row">Edge</th>
                  <td></td>
                  <td rowspan="3">
                    <kbd>Control</kbd> + <kbd>Option</kbd> + <kbd>{{ $t('name.shortcutLetter') }}</kbd><br />
                    <kbd>Control</kbd> + <kbd>Option</kbd> + <kbd>Shift</kbd> + <kbd>{{ $t('name.shortcutLetter') }}</kbd>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Google Chrome</th>
                  <td><kbd>Alt</kbd> + <kbd>{{ $t('name.shortcutLetter') }}</kbd></td>
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
            <template #keyLeftRight>
              <kbd>←</kbd> <kbd>→</kbd>
            </template>
            <template #keyUpDown>
              <kbd>↑</kbd> <kbd>↓</kbd>
            </template>
            <template #keyTab>
              <kbd>Tab</kbd>
            </template>
            <template #keyShiftTab>
              <kbd>Shift</kbd> + <kbd>Tab</kbd>
            </template>
          </i18n-t>
        </section>
        <section>
          <h3>{{ $t('name.sitemap') }}</h3>
          <div class="flex-list">
            <ol>
              <li>
                <nuxt-link :to="localePath('/')" :title="$t('action.goTo') + $t('action.goToHomePage')">{{ $t('name.home') }}</nuxt-link>
              </li>
              <li>
                <nuxt-link :to="localePath('/sitemap')" :title="$t('action.goTo') + $t('mainMenu.sitemap')">{{ $t('mainMenu.sitemap') }}</nuxt-link>
              </li>
              <li>
                <nuxt-link :to="localePath('/about')" :title="$t('action.goTo') + $t('mainMenu.about')">{{ $t('mainMenu.about') }}</nuxt-link>
              </li>
              <li>
                <nuxt-link
                  to="https://medium.com/@neil-lin"
                  :title="$t('action.goTo') + 'Medium' + $t('action.openWindow')"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  Medium
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  to="https://dribbble.com/Neil_lin"
                  :title="$t('action.goTo') + 'Dribbble' + $t('action.openWindow')"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  Dribbble
                </nuxt-link>
              </li>
              <template v-for="(item, idx) in workList" :key="idx">
                <li v-if="item.disabled !== true">
                  <nuxt-link :to="localePath(item.link)" :title="$t('action.goTo') + `${item.name}`">{{ item.name }}</nuxt-link>
                </li>
              </template>
            </ol>
          </div>
        </section>
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const runtimeConfig = useRuntimeConfig()
const pageTitle = ref(t('mainMenu.sitemap'))
const pageDescription = ref(t('des.sitemap'))
const route = useRoute()

useHead({
  title: pageTitle,
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: pageDescription.value
    },
    { hid: 'og:url', property: 'og:url', content: runtimeConfig.public.baseUrl + route.path },
    {
      hid: 'og:title',
      property: 'og:title',
      content: pageTitle.value + ' - ' + t('website.name')
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: pageDescription.value
    },
    {
      hid: 'twitter:url',
      name: 'twitter:url',
      content: runtimeConfig.public.baseUrl + route.path
    },
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: pageTitle.value + ' - ' + t('website.name')
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: pageDescription.value
    }
  ]
})

const { mobileMenuStatus, handleToggleMobileMenuBtn, handleCloseMobileMenuBtn } = useMobileMenuBtn()

const { workList } = useWorkList()
</script>
