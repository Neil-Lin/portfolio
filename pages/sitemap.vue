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
      <h2>{{ pageTitle }}</h2>
      <article>
        <section>
          <h3>網站區塊與快捷鍵</h3>
          <p>
            本網站依無障礙網頁設計原則建置，網站的主要內容分為三大區塊：<br />
            1. 頁首區塊、2.主要內容、3.頁尾區塊。<br /><br />
            本網站的快速鍵(Accesskey)設定如下：
          </p>
          <p>
            <kbd>Alt</kbd>+<kbd>U</kbd>：頁首區塊，個人介紹。<br />
            <kbd>Alt</kbd>+<kbd>C</kbd>：主要內容。<br />
            <kbd>Alt</kbd>+<kbd>Z</kbd>：頁尾區塊，含語言切換。<br />
          </p>
          <p>
            如果您的瀏覽器是
            Firefox，快速鍵的使用方法為<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>快速鍵字母</kbd>，例如
            <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>C</kbd> 會跳至網頁主要內容，以此類推。<br />
          </p>
          <p>
            另外，如果您是 MAC 用戶，快速鍵的使用方法為<kbd>Control</kbd>+<kbd>Option</kbd>+<kbd
              >快速鍵字母</kbd
            ><br />
          </p>
          <p>若以上方式皆無法使用，建議可以檢查是不是有自訂的快速鍵影響。</p>
          <table>
            <caption>
              各作業系統與瀏覽器快速鍵參考表：
              <nuxt-link
                to="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey"
                :title="$t('action.goTo') + $t('des.a11yrefrerence') + $t('action.openWindow')"
                target="_blank"
                rel="noreferrer noopener"
              >
                參考來源
              </nuxt-link>
            </caption>
            <tbody>
              <tr>
                <th scope="col">瀏覽器/作業系統</th>
                <th scope="col">Windows</th>
                <th scope="col">Linux</th>
                <th scope="col">Mac</th>
              </tr>
              <tr>
                <th scope="row">Firefox</th>
                <td colspan="2"><kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>快速鍵字母</kbd></td>
                <td>
                  Firefox 57 版本以上: <kbd>Control</kbd> + <kbd>Option</kbd> +
                  <kbd>快速鍵字母</kbd> 或 <kbd>Control</kbd> + <kbd>Alt</kbd> +
                  <kbd>快速鍵字母</kbd><br />
                  Firefox 14 版本以上: <kbd>Control</kbd> + <kbd>Alt</kbd> + <kbd>快速鍵字母</kbd
                  ><br />
                  Firefox 13 版本以下: <kbd>Control</kbd> + <kbd>快速鍵字母</kbd>
                </td>
              </tr>
              <tr>
                <th scope="row">Internet Explorer</th>
                <td rowspan="3">
                  <kbd>Alt</kbd> + <kbd>快速鍵字母</kbd><br />
                  <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>快速鍵字母</kbd>
                </td>
                <td colspan="2">無</td>
              </tr>
              <tr>
                <th scope="row">Edge</th>
                <td>無</td>
                <td rowspan="3">
                  <kbd>Control</kbd> + <kbd>Option</kbd> + <kbd>快速鍵字母</kbd><br />
                  <kbd>Control</kbd> + <kbd>Option</kbd> + <kbd>Shift</kbd> + <kbd>快速鍵字母</kbd>
                </td>
              </tr>
              <tr>
                <th scope="row">Google Chrome</th>
                <td><kbd>Alt</kbd> + <kbd>快速鍵字母</kbd></td>
              </tr>
              <tr>
                <th scope="row">Safari</th>
                <td colspan="2">無</td>
              </tr>
            </tbody>
          </table>
          <p>※ 當本網站項目頁籤無法以滑鼠點選時，您可利用以下鍵盤操作方式瀏覽資料：</p>
          <p>
            <kbd>←</kbd> <kbd>→</kbd> 或 <kbd>↑</kbd> <kbd>↓</kbd>：按左右鍵或上下鍵移動標籤順序。
          </p>
          <p>
            <kbd>Tab</kbd>：停留於該標籤後，可利用
            <kbd>Tab</kbd> 鍵跳至內容瀏覽該筆資料，遇到單選按鈕(radio)時請配合使用 <kbd>←</kbd>
            <kbd>→</kbd> 或 <kbd>↑</kbd> <kbd>↓</kbd> 鍵移動項目順序。
          </p>
          <p>
            <kbd>Shift</kbd> + <kbd>Tab</kbd>：按 <kbd>Shift</kbd> +
            <kbd>Tab</kbd> 可往回跳至上一筆資料；當跳回至標籤項目時您可繼續利用 <kbd>←</kbd>
            <kbd>→</kbd> 或 <kbd>↑</kbd> <kbd>↓</kbd> 鍵移動標籤順序。
          </p>
        </section>
        <section>
          <h3>網站地圖</h3>
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
