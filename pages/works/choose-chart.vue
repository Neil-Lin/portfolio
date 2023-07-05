<template>
  <div>
    <akContainer />
    <theBreadcrumb :page-title="pageTitle" :page-link="`${route.path}`" />
    <h2>{{ pageTitle }}</h2>
    <article>
      <section>
        <figure>
          <img src="/images/choose-chart-thumbnail.webp" alt="Choose 蛛思介紹頁" />
          <figcaption>Choose 蛛思介紹頁</figcaption>
        </figure>
      </section>
      <section>
        <h3>概要</h3>
        <p>
          蛛思輿情分析平台，網羅海量新聞、社群資料，成為您最貼心的小助手，協助您：觀測特定主題的關鍵趨勢、進行活動與企劃的概
          念發想，以及即時處理公關危機。可供公關、行銷、品牌顧問、媒體代理商、廣告代理商等相關業者使用。
        </p>
        <p>本篇僅介紹 Choose 蛛思輿情分析的資料視覺化</p>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">目標</h4>
            <ul>
              <li>快速掌握目標內容與五大面向</li>
              <li>快速掌握五大面向項目與目標內容相關程度</li>
              <li>快速掌握項目內容間的相關程度</li>
              <li>資料視覺化圖表</li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">角色</h4>
            <ul>
              <li>UI Designer</li>
              <li>UX Designer</li>
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
        <h3>一、熱詞影響力診斷圖</h3>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">學習領域知識</h4>
            <ul>
              <li>什麼是輿情分析？</li>
              <li>什麼是資料視覺化？</li>
              <li>目標資料有什麼內容？</li>
              <li>觀察分析競品圖表</li>
            </ul>
          </div>
        </div>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">產出</h4>
            <p>熱詞影響力診斷圖(以下資料僅為模擬設計圖，非真實數據)</p>
            <figure>
              <img src="/images/choose-chart-hotkeywords.webp" alt="熱詞影響力診斷圖" loading="lazy" />
              <figcaption>熱詞影響力診斷圖</figcaption>
            </figure>
            <figure>
              <img
                src="/images/choose-chart-hotkeywords-hover.webp"
                alt="熱詞影響力診斷圖-目標相關性"
                loading="lazy"
              />
              <figcaption>熱詞影響力診斷圖-目標相關性</figcaption>
            </figure>
            <figure>
              <img src="/images/choose-chart-hotkeywords-detail.webp" alt="熱詞影響力診斷圖-分類" loading="lazy" />
              <figcaption>熱詞影響力診斷圖-分類</figcaption>
            </figure>
            <figure>
              <img
                src="/images/choose-chart-hotkeywords-detail-hover.webp"
                alt="熱詞影響力診斷圖-分類項目相關性"
                loading="lazy"
              />
              <figcaption>熱詞影響力診斷圖-分類項目相關性</figcaption>
            </figure>
          </div>
        </div>
        <h3>二、主題、項目與聲量比較圖</h3>
        <p>coming soon...</p>
        <h3>三、詞彙萃取圖</h3>
        <p>coming soon...</p>
      </section>
      <section>
        <h3>相關連結</h3>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">網站</h4>
            <ol>
              <li>
                <nuxt-link
                  to="https://choose.blueplanet.com.tw/intro/"
                  title="前往 Choose 蛛思介紹頁(另開視窗)"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  Choose 蛛思介紹頁
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  to="https://choose.blueplanet.com.tw/lab"
                  title="前往 Choose Choose 蛛思蛛思熱詞影響力診斷體驗(另開視窗)"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  Choose 蛛思蛛思熱詞影響力診斷體驗
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
const pageTitle = ref('Choose 蛛思 - 資料視覺化')
const pageDescription = ref('蛛思輿情分析平台，網羅海量新聞、社群資料，成為您最貼心的小助手，協助您：觀測特定主題的關鍵趨勢、進行活動與企劃的概 念發想，以及即時處理公關危機。可供公關、行銷、品牌顧問、媒體代理商、廣告代理商等相關業者使用。')
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
