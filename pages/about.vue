<template>
  <div class="page">
    <div :class="['page-aside', mobileMenuStatus ? 'page-aside--open' : '']">
      <button class="btn-close-mobile-menu" @click="handleCloseMobileMenuBtn">關閉選單</button>
      <theAside />
    </div>
    <main class="page-container">
      <button class="btn-open-mobile-menu" @click="handleToggleMobileMenuBtn">
        <span>選單</span>
      </button>
      <akContainer />
      <theBreadcrumb :page-title="pageTitle" :page-link="`${route.path}`" />
      <h2>{{ pageTitle }}</h2>
      <article>
        <section>
          <h3>簡介</h3>
          <p>
            2013 踏入網頁設計領域，執行政府專案、企業專案、公司產品開發維護等各類型 Web 與 App
            設計與切版。近年深感無障礙網頁設計的重要性，遂開始專注在網頁的「通用設計」領域。
          </p>
          <p>設計理念始終遵循 「 win-win 」 、達成「平衡」的結果。</p>
        </section>
        <section>
          <div class="flex-list">
            <div>
              <h4 class="flex-list-title">程式</h4>
              <ul>
                <li>HTML5</li>
                <li>CSS/SCSS</li>
                <li>Javascript/jQuery</li>
                <li>Vue/Nuxt</li>
                <li>Version Control</li>
              </ul>
            </div>
            <div>
              <h4 class="flex-list-title">推廣</h4>
              <ul>
                <li>
                  <nuxt-link
                    to="https://ithelp.ithome.com.tw/users/20152260/ironman/5614"
                    title="前往 iT 邦幫忙 2022 iThome 鐵人賽自我挑戰組，無障礙網頁設計大叔日記系列(另開視窗)"
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
              <h4 class="flex-list-title">常用工具</h4>
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
          <p>
            此作品集是以 Nuxt3 切版，Github Page 建置，可在
            <nuxt-link
              to="https://github.com/Neil-Lin/portfolio"
              title="前往 Neil 作品集 Github 頁面(另開視窗)"
              target="_blank"
              ref="noreferrer noopener"
            >
              Github
            </nuxt-link>
            查看原始碼。
          </p>
        </section>
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const pageTitle = ref('我的技能')
const pageDescription = ref('暸解  Neil 的網頁設計技能')
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
      content: pageTitle.value + ' - ' + runtimeConfig.public.websiteName
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
      content: pageTitle.value + ' - ' + runtimeConfig.public.websiteName
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: pageDescription.value
    }
  ]
})

const { mobileMenuStatus, handleToggleMobileMenuBtn, handleCloseMobileMenuBtn } = useMobileMenuBtn()
</script>
