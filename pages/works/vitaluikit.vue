<template>
  <div>
    <akContainer />
    <theBreadcrumb :page-title="pageTitle" :page-link="`${route.path}`" />
    <h2>{{ pageTitle }}</h2>
    <div class="page-content">
      <section>
        <figure>
          <img
            src="/images/vitaluikit-thumbnail.webp"
            alt="Vital UI Kit 簡介"
          />
          <figcaption>Vital UI Kit 簡介</figcaption>
        </figure>
      </section>
      <section>
        <h3>概要</h3>
        <p>Vital UI Kit 是一款優雅且容易客製化的前端 UI 框架。</p>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">目標</h4>
            <ul>
              <li>建造設計系統</li>
              <li>屬於台灣開源的 UI Kit</li>
              <li>建造工程師與設計師之謙的橋樑</li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">角色</h4>
            <ul>
              <li>UX Designer</li>
              <li>切版</li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">工具</h4>
            <ul>
              <li>Sketch app</li>
              <li>Fabricator</li>
            </ul>
          </div>
        </div>
      </section>
      <section>
        <h3>過程</h3>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">觀察市場產品</h4>
            <ul>
              <li>jQuery UI</li>
              <li>Bootstrap</li>
              <li>Foundation</li>
              <li>Semantic UI</li>
              <li>Material UI</li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">學習領域知識</h4>
            <ul>
              <li>什麼是設計系統？</li>
              <li>什麼是 UI kit？</li>
              <li>有什麼競品？</li>
              <li>誰會使用？</li>
              <li>為什麼台灣沒有開源 UI Kit？</li>
            </ul>
          </div>
        </div>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">Persona 1</h4>
            <ol>
              <li>Neil / 28 / UI Designer</li>
              <li>痛點：設計稿版本控管、重複使用設計與快速協作。</li>
              <li>目標：初始化專案時，設計稿便已經準備好且共同修改容易。</li>
            </ol>
          </div>
          <div>
            <h4 class="flex-list-title">Persona 2</h4>
            <ol>
              <li>CJ / 26 / Front-end engineer</li>
              <li>痛點：產品間沒有共同設計語言以及浪費時間重工元件。</li>
              <li>
                目標：專案初始化時，元件全部到定位、修改容易以及與其他套件兼容。
              </li>
            </ol>
          </div>
        </div>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">研究</h4>
            <ol>
              <li>研究前述各大前端 UI 框架設計稿與切版如何搭配。</li>
              <li>
                研究 Sketch App 設計稿管理與協作規則制定，例如參數設定等。
              </li>
              <li>研究 CSS 管理與命名規則。</li>
              <li>研究融合 設計稿 與 CSS 命名規則，方便一眼便知是哪個元件。</li>
              <li>研究以何種方式建立 Document 網站內容。</li>
              <li>研究LandingPage 文案、個性朔造。</li>
            </ol>
          </div>
        </div>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">產出</h4>
            <figure>
              <img
                src="/images/vitaluikit-sketch.webp"
                alt="Sketch App檔案示意圖"
                loading="lazy"
              />
              <figcaption>Sketch App檔案示意圖</figcaption>
            </figure>
            <figure>
              <img
                src="/images/vitaluikit-docs.webp"
                alt="文件示意圖"
                loading="lazy"
              />
              <figcaption>使用 Fabricator 建立文件</figcaption>
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
                  to="https://vitaluikit.com/"
                  title="前往 Vital UI Kit(另開視窗)"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  Vital UI Kit
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
const pageTitle = ref("Vital UI Kit");
const pageDescription = ref("一個優雅且容易客製化的前端 UI 框架。");
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
