<template>
  <div>
    <akContainer />
    <theBreadcrumb :page-title="pageTitle" :page-link="`${route.path}`" />
    <h2>{{ pageTitle }}</h2>
    <div class="page-content">
      <section>
        <figure>
          <img src="/images/vitalcrm-app.webp" alt="Vital CRM APP" />
          <figcaption>Vital CRM APP</figcaption>
        </figure>
      </section>
      <section>
        <h3>概要</h3>
        <p>
          Vital CRM 是一款專為中小企業量身打造的雲端顧客關係管理系統。2014
          年推出新版
          App，設計首重於使用者在戶外跑業務時，如何迅速找到客戶、記錄拜訪重點、行事曆管理以及處理後續任務。
        </p>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">目標</h4>
            <ul>
              <li>
                改善舊版使用套件預設的 UI
                樣式導致產品沒有個性、操作不符合內容類型以及適逢各行動裝置尺寸的興起。
              </li>
              <li>增進主管管理、業務外出使用的便利性。</li>
              <li>引進設計流程。</li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">角色</h4>
            <ul>
              <li>UI Designer</li>
              <li>UX Designer</li>
              <li>切版</li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">工具</h4>
            <ul>
              <li>紙與筆</li>
              <li>Illustrator</li>
              <li>Sketch app</li>
              <li>4ourth Mobile Touch Template</li>
            </ul>
          </div>
        </div>
      </section>
      <section>
        <h3>過程</h3>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">人物誌 1</h4>
            <ol>
              <li>Susan / 34 / 經理 / 辦公室內</li>
              <li>
                痛點：舊版無任務管理系統、無法掌握員工位置、沒有佈告欄的系統。
              </li>
              <li>
                目標：立即取得資訊、知道下屬位置、指派任務、傳達重要資訊。
              </li>
            </ol>
          </div>
          <div>
            <h4 class="flex-list-title">人物誌 2</h4>
            <ol>
              <li>John / 25 / 業務 / 汽、機車</li>
              <li>
                痛點：舊版不能一眼就觀看完客戶資料、地圖上不可以選擇客戶、在網路不穩的情況下不能使用。
              </li>
              <li>
                目標：輕易的找到客戶、記錄與安排會議/約會、不管在哪都可以使用。
              </li>
            </ol>
          </div>
        </div>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">整合痛點</h4>
            <ol>
              <li>快速且輕易地尋找目標人物。</li>
              <li>要比舊版更好的填寫紀錄。</li>
              <li>新增任務系統。</li>
              <li>新增分享系統( 地點、留言、任務/約會與會議 )。</li>
            </ol>
          </div>
        </div>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">研究</h4>
            <p>
              研究當時各種行動裝置尺寸、使用者操作模式以及可觸及範圍，作為日後設計版面之依據。
            </p>
            <figure>
              <img
                src="/images/device-situation.webp"
                alt="裝置與手勢"
                loading="lazy"
              />
              <figcaption>裝置與手勢</figcaption>
            </figure>
            <p>同一時間進行 Functional Map、UI Flow 以及 Wireframe</p>
            <figure>
              <img
                src="/images/vitalcrm-app-wireframe.webp"
                alt="functional map 和 wireframe"
                loading="lazy"
              />
              <figcaption>functional map 和 wireframe</figcaption>
            </figure>
          </div>
        </div>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">設計稿</h4>
            <ol>
              <li>
                既要符合現有產品的視覺規範與個性，且還要盡量遵循 iOS 與 Android
                Guideline。
              </li>
              <li>
                使用者經常在外奔波，操作範圍要大且符合情境操作，例如機/汽車、單/雙手、點/握/拿...等。
              </li>
              <li>資訊量龐大，不作無謂裝飾，聚焦於資訊呈現簡單易懂。</li>
            </ol>
            <figure>
              <img
                src="/images/vitalcrm-design-mobile.webp"
                alt="Vital CRM APP"
                loading="lazy"
              />
              <figcaption>
                Vital CRM APP
                重點截圖，使用手機通常使用單手/握，所以重要操作置於中央與下方（列表、功能按鈕以及快捷按鈕），次要操作（搜尋、選單以及修改）放置於較上方，且均符合當時作業系統版本的
                Guideline。針對左右手操作距離都相等，只有快捷按鈕偏右側（但符合作業系統
                Guideline）。
              </figcaption>
            </figure>
            <figure>
              <img
                src="/images/vitalcrm-design-tablet.webp"
                alt="Vital CRM APP (Tablet)"
                loading="lazy"
              />
              <figcaption>
                Vital CRM APP (Tablet)
                重點截圖，平板打橫可操作範圍較直式的區域廣。另外，因為中央區域會變得比較難按到，所以會把需要專注且較花時間的操作，放在靠近中央區域（因為此時操作情境偏向較常使用單手/點/放置平穩的模式），例如：編輯客戶資料。如果只是瀏覽資訊，情境會變成雙手/握/拇指滑動，會盡量靠近兩側可滑動區域。
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section>
        <h3>相關連結</h3>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">App 下載</h4>
            <ol>
              <li>
                <nuxt-link
                  to="https://apps.apple.com/us/app/vital-crm/id932283661"
                  title="前往 iOS App Store(另開視窗)"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  App Store
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  to="https://play.google.com/store/apps/details?id=com.gss.videgreeapp2&hl=zh_TW&gl=US"
                  title="前往 Google Play(另開視窗)"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  Google Play
                </nuxt-link>
              </li>
            </ol>
          </div>
          <div>
            <h4 class="flex-list-title">網站</h4>
            <ol>
              <li>
                <a
                  href="https://www.gsscloud.com/tw/vital/crm"
                  title="前往 Vital CRM(另開視窗)"
                  target="_blank"
                  ref="noreferrer noopener"
                  >Vital CRM</a
                >
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
const pageTitle = ref("Vital CRM APP");
const pageDescription = ref(
  "業績提升、增加回購率及熟客經營最佳首選，中小企業數位轉型-以客戶為核心、更人性化的互動關係管理；業務管理、行銷推廣、客戶服務無縫接軌；提升客戶滿意度、回流率；業績持續成長、企業永續經營。"
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
