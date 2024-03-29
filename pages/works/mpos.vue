<template>
  <div>
    <akContainer />
    <theBreadcrumb :page-title="pageTitle" :page-link="`${route.path}`" />
    <h2>{{ pageTitle }}</h2>
    <div class="page-content">
      <section>
        <figure>
          <img src="/images/KSI-mpos-thumbnail.webp" alt="KSI mPOS 簡介" />
          <figcaption>KSI mPOS 簡介</figcaption>
        </figure>
      </section>
      <section>
        <h3>概要</h3>
        <p>
          KSI mPOS 是一款行動版餐飲 POS
          系統，擁有多台平板分流、開立電子發票、快速點餐與商品內容客製化等功能，無論你人在哪裡，都能不受限的利用平板為顧客服務，輕鬆提升服務水準，獲取顧客好評。
        </p>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">目標</h4>
            <ul>
              <li>
                2016 年製作新版 APP，提高餐飲業在前場有更好的使用、管理流程。
              </li>
              <li>快、快、快，第一線點餐要快！</li>
              <li>任何時間點都可以編輯訂單內容。</li>
              <li>快速取得會員資訊並回饋。</li>
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
              <li>Sketch app</li>
              <li>Zeplin</li>
              <li>Flinto</li>
              <li>Illustrator</li>
              <li>4ourth Mobile Touch Template</li>
            </ul>
          </div>
        </div>
      </section>
      <section>
        <h3>過程</h3>
        <h4 class="flex-list-title">學習領域知識</h4>
        <ol>
          <li>什麼是 POS 系統？</li>
          <li>舊版 POS 系統的優缺點為何？</li>
          <li>與後台和 CRM 的關係又是為何？</li>
          <li>有哪些硬體設備？</li>
        </ol>
        <figure>
          <img
            src="/images/KSI-mpos-domain-knowhow.webp"
            alt="學習領域知識"
            loading="lazy"
          />
          <figcaption>學習領域知識</figcaption>
        </figure>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">人物誌</h4>
            <ol>
              <li>Grace / 17 / 飲料店前場點餐、結帳與收銀</li>
              <li>痛點：舊版眼花撩亂、操作步驟多且不符合邏輯</li>
              <li>目標：快、易用、好管理</li>
            </ol>
          </div>
          <div>
            <h4 class="flex-list-title">觀察</h4>
            <ol>
              <li>在尖峰時刻點餐必須很快就處理完畢。</li>
              <li>常常發生修改訂單的狀況。</li>
              <li>各種優惠方案、付費方式。</li>
              <li>查詢會員資訊。</li>
            </ol>
          </div>
        </div>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">研究</h4>
            <p>研究當時適合當餐飲業用的平板，作為日後設計版面之依據。</p>
            <figure>
              <img
                src="/images/device-situation-tablet.webp"
                alt="裝置與手勢"
                loading="lazy"
              />
              <figcaption>裝置與手勢</figcaption>
            </figure>
            <p>跨公司、跨團隊遠端溝通，一步步解析尋找舊版未被提及的痛點</p>
            <figure>
              <img
                src="/images/KSI-mpos-pain.webp"
                alt="挖掘痛點"
                loading="lazy"
              />
              <figcaption>挖掘痛點</figcaption>
            </figure>
            <p>因應新需求找出新操作模式，幫助使用者快速找出歷史紀錄</p>
            <figure>
              <img
                src="/images/KSI-mpos-discuss.webp"
                alt="發想新操作模式"
                loading="lazy"
              />
              <figcaption>發想新操作模式</figcaption>
            </figure>
            <p>Wireframe</p>
            <figure>
              <img
                src="/images/KSI-mpos-wireframe.webp"
                alt="wireframe"
                loading="lazy"
              />
              <figcaption>
                藉由 Wireframe 密集討論，找出最符合情境、最有效率的方案。
              </figcaption>
            </figure>
          </div>
        </div>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">設計稿</h4>
            <ol>
              <li>
                使用 Zeplin 與工程師溝通並製作符合原生 APP
                規範的圖片，避免無法正確傳達設計。
              </li>
              <li>使用 Flinto 製作動畫，輔助工程師理解操作行為緣由與過場。</li>
              <li>
                與視覺設計師合作，設計出即便是在前場混亂的情況，也要能即時掌握資訊。
              </li>
            </ol>
            <figure>
              <img
                src="/images/KSI-mpos-mockup.webp"
                alt="設計稿"
                loading="lazy"
              />
              <figcaption>設計稿</figcaption>
            </figure>
          </div>
        </div>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">Flinto 動畫模擬</h4>
            <p>
              （影片內標誌與內容只是為了模擬操作情形，與該品牌與商品無關。）
            </p>
            <video controls style="width: 100%; height: auto">
              <source src="/video/KSI-mpos-main.mp4" type="video/mp4" />
              請使用現代且最新版本的瀏覽器，以享受最佳觀看體驗，謝謝。
            </video>
            <br />
            <video controls style="width: 100%; height: auto">
              <source src="/video/KSI-mpos-login.mp4" type="video/mp4" />
              請使用現代且最新版本的瀏覽器，以享受最佳觀看體驗，謝謝。
            </video>
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
                  to="https://pos.ksi.com.tw/Home/MPOS"
                  title="前往 KSI mPOS(另開視窗)"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  KSI mPOS
                </nuxt-link>
              </li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const pageTitle = ref("KSI mPOS");
const pageDescription = ref(
  "行動版餐飲 POS 系統擁有多台平板分流、開立電子發票、快速點餐與商品內容客製化等功能，無論你人在哪裡，都能不受限的利用平板為顧客服務，輕鬆提升服務水準，獲取顧客好評。"
);
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
      content: pageTitle.value + " - " + runtimeConfig.public.websiteName,
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
      content: pageTitle.value + " - " + runtimeConfig.public.websiteName,
    },
    {
      hid: "twitter:description",
      name: "twitter:description",
      content: pageDescription.value,
    },
  ],
});
</script>
