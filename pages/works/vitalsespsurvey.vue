<template>
  <div>
    <akContainer />
    <theBreadcrumb :page-title="pageTitle" :page-link="`${route.path}`" />
    <h2>{{ pageTitle }}</h2>
    <div class="page-content">
      <section>
        <figure>
          <img
            src="/images/vitalsespsurvey-thumbnail.webp"
            alt="Vitals ESP Survey 簡介"
          />
          <figcaption>Vitals ESP Survey 簡介</figcaption>
        </figure>
      </section>
      <section>
        <h3>概要</h3>
        <p>
          提供多樣化、有效率的線上問卷調查工具，提供內部滿意度、課後問卷、意見徵求，以及外部活動滿意度調查問卷，並且可將分析結果回存
          Vitals
          ESP，作為組織知識保存與分享。可製作不同型式問卷，包含單選、多選、詳答、矩陣、跳題以及題組方式，此外亦支援行動裝置填寫問卷與查看問卷結果。
        </p>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">目標</h4>
            <ul>
              <li>問卷系統</li>
              <li>資料視覺化問卷統計結果</li>
              <li>所見即所得</li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">角色</h4>
            <ul>
              <li>UX Designer</li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">工具</h4>
            <ul>
              <li>Sketch app</li>
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
              <li>Google Form</li>
              <li>SurveyMonkey</li>
              <li>Typeform</li>
              <li>Jotform</li>
              <li>SoGoSurvey</li>
              <li>Zoho Survey</li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">學習領域知識</h4>
            <ul>
              <li>什麼是問卷系統？</li>
              <li>有什麼競品？</li>
              <li>企業內部與一般外部使用者有何不同？</li>
              <li>學術用與商業用問卷有何不同？</li>
              <li>目前使用痛點</li>
            </ul>
          </div>
        </div>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">Persona 1</h4>
            <ol>
              <li>Jennifer / 28 / Sales</li>
              <li>痛點：現行數據整理太簡單，我還要花時間統整與做圖表。</li>
              <li>目標：當問卷調查結束後，馬上能一眼看出重點輔助決策。</li>
            </ol>
          </div>
          <div>
            <h4 class="flex-list-title">Persona 2</h4>
            <ol>
              <li>Candy / 23 / Marketing</li>
              <li>
                痛點：專業問卷系統操作複雜，根本看不懂要怎麼設定，像 Google Form
                那種人人幾乎都會用的方式就好了。
              </li>
              <li>目標：簡單好用、易操作的但又要能達成專業問卷的功能。</li>
            </ol>
          </div>
        </div>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">研究</h4>
            <ol>
              <li>研究各大競品「製作」操作原理。</li>
              <li>研究回收問卷後需要做什麼行為。</li>
              <li>觀察各大競品操作痛點。</li>
              <li>研究如何專業又易用。</li>
              <li>資料視覺化原理與應用。</li>
              <li>如何管理問卷。</li>
            </ol>
          </div>
        </div>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">產出</h4>
            <figure>
              <img
                src="/images/vitalsespsurvey-wireframe-dashboard.webp"
                alt="Vitals ESP Survey Dashboard"
                loading="lazy"
              />
              <figcaption>
                Vitals ESP Survey Dashboard<br />
                設計重點：不同身份登入者，會看到不同資料。
              </figcaption>
            </figure>
            <figure>
              <img
                src="/images/vitalsespsurvey-wireframe-edit.webp"
                alt="Vitals ESP Survey 問卷編輯"
                loading="lazy"
              />
              <figcaption>
                Vitals ESP Survey 問卷編輯<br />
                設計重點：符合大多數人使用習慣，兼且具備跳題、必填、相片、各種類型、題組、多國語言、預覽、設定以及自動產生錨點快捷等專業功能。
              </figcaption>
            </figure>
            <div class="flex-list">
              <div>
                <figure>
                  <img
                    src="/images/vitalsespsurvey-wireframe-result1.webp"
                    alt="Vitals ESP Survey 資料視覺化總覽"
                    loading="lazy"
                  />
                  <figcaption>Vitals ESP Survey 資料視覺化總覽</figcaption>
                </figure>
              </div>
              <div>
                <figure>
                  <img
                    src="/images/vitalsespsurvey-wireframe-result2.webp"
                    alt="Vitals ESP Survey 資料視覺化問卷細部統計"
                    loading="lazy"
                  />
                  <figcaption>
                    Vitals ESP Survey 資料視覺化問卷細部統計
                  </figcaption>
                </figure>
              </div>
            </div>
            <div class="flex-list">
              <div>
                <figure>
                  <img
                    src="/images/vitalsespsurvey-wireframe-list1.webp"
                    alt="Vitals ESP Survey 列表一"
                    loading="lazy"
                  />
                  <figcaption>Vitals ESP Survey 列表一</figcaption>
                </figure>
              </div>
              <div>
                <figure>
                  <img
                    src="/images/vitalsespsurvey-wireframe-list2.webp"
                    alt="Vitals ESP Survey 列表二"
                    loading="lazy"
                  />
                  <figcaption>Vitals ESP Survey 列表二</figcaption>
                </figure>
              </div>
            </div>
            <figure>
              <img
                src="/images/vitalsespsurvey-mockup.webp"
                alt="Vitals ESP Survey 編輯問卷設計稿"
                loading="lazy"
              />
              <figcaption>Vitals ESP Survey 編輯問卷設計稿</figcaption>
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
                  to="https://www.vitalsesp.com/survey.html"
                  title="前往 Vitals ESP Survey(另開視窗)"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  Vitals ESP Survey
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
const pageTitle = ref("Vitals ESP Survey");
const pageDescription = ref(
  "提供多樣化、有效率的線上問卷調查工具，提供內部滿意度、課後問卷、意見徵求，以及外部活動滿意度調查問卷，並且可將分析結果回存 Vitals ESP，作為組織知識保存與分享。可製作不同型式問卷，包含單選、多選、詳答、矩陣、跳題以及題組方式，此外亦支援行動裝置填寫問卷與查看問卷結果。"
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
