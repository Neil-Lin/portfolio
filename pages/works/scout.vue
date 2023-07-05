<template>
  <div>
    <akContainer />
    <theBreadcrumb :page-title="pageTitle" :page-link="`${route.path}`" />
    <h2>{{ pageTitle }}</h2>
    <article>
      <section>
        <figure>
          <img src="/images/scout-thumbnail.webp" alt="ΣCOUT 實告 簡介" />
          <figcaption>ΣCOUT 實告 簡介</figcaption>
        </figure>
      </section>
      <section>
        <h3>概要</h3>
        <p>
          國內首創第一個商業履歷查詢服務，結合多樣化的 OPENDATA
          並綜整各種網路非結構化商業資料，能夠迅速掌握全臺灣公司行號的商業實績。
        </p>
        <p>
          可廣泛用於工商徵信、商業授信等業務，大幅提升資料蒐集、驗證等工作流程的效率，更降低所需耗費的時間及人力成本。協助迅速偵測商業合作夥伴、競業對手或借貸對象之資訊，透過具有公信力的資料集，將商業營運事實揭露相告。
        </p>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">目標</h4>
            <ul>
              <li>建立「公司的履歷」形象</li>
              <li>設定產品個性</li>
              <li>企業搜尋界的 Google</li>
              <li>資料視覺化圖表(實質受益人、股權結構表、一般圖表)</li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">角色</h4>
            <ul>
              <li>UI Designer</li>
              <li>切版</li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">工具</h4>
            <ul>
              <li>Figma</li>
            </ul>
          </div>
        </div>
      </section>
      <section>
        <h3>過程</h3>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">觀察類似產品介面</h4>
            <ul>
              <li>104</li>
              <li>CakeResume</li>
              <li>Yourator</li>
              <li>Wanted</li>
              <li>企查查</li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">學習領域知識</h4>
            <ul>
              <li>什麼是 KYC？</li>
              <li>什麼是工商徵信、商業授信？</li>
              <li>什麼人需要查詢公司？</li>
            </ul>
          </div>
        </div>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">產出</h4>
            <p>（系統畫面與資訊視覺化圖表不適合公開，僅展示部分特色畫面）</p>
            <div class="flex-list">
              <div>
                <figure>
                  <img src="/images/scout-landingpage-dark.webp" alt="Landing Page(dark)" loading="lazy" />
                  <figcaption>Landing Page(dark)</figcaption>
                </figure>
              </div>
              <div>
                <figure>
                  <img src="/images/scout-landingpage-light.webp" alt="Landing Page(light)" loading="lazy" />
                  <figcaption>Landing Page(light)</figcaption>
                </figure>
              </div>
            </div>
            <figure>
              <img src="/images/scout-404.webp" alt="ΣCOUT 404 page" loading="lazy" />
              <figcaption>ΣCOUT 404 page</figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section>
        <h3>相關連結</h3>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">網站</h4>
            <ol>
              <li>
                <nuxt-link
                  to="https://scout.blueplanet.com.tw/"
                  title="前往 ΣCOUT 實告(另開視窗)"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  ΣCOUT 實告
                </nuxt-link>
              </li>
            </ol>
          </div>
        </div>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const pageTitle = ref('ΣCOUT 實告')
const pageDescription = ref(
  '國內首創商業履歷查詢服務，結合逾 300 種OPENDATA及網路公開資料來源，掌握全臺公司的商業實績，迅速偵測商業合作夥伴、競業對手之資訊，揭露商業價值以實相告。'
)
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
</script>
