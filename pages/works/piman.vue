<template>
  <main class="page-container">
    <akContainer />
    <theBreadcrumb :page-title="pageTitle" :page-link="`${route.path}`" />
    <h2>{{ pageTitle }}</h2>
    <article>
      <section>
        <figure>
          <img src="/images/piman-thumbnail.webp" alt="Piman 簡介" />
          <figcaption>Piman 簡介</figcaption>
        </figure>
      </section>
      <section>
        <h3>概要</h3>
        <p>
          近年來「以使用者為中心」的概念已深植人心，而這股力量也開始擴散至無障礙網頁設計領域，藉由不斷改善網頁的親和力，期望能達成通用設計的核心概念：Design
          for All。
        </p>
        <p>
          Piman
          正是為此而生，從人們日常生活常頻繁接觸的網頁開始著手改善，所以首要任務便是推廣開發者使用
          Piman
          開發政府機關網站，進而應用在產品、官網等地方，如此企業可善盡社會責任，也可與國際趨勢接軌。
        </p>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">目標</h4>
            <ul>
              <li>達成網頁的「通用設計」</li>
              <li>開源</li>
              <li>建立設計系統</li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">角色</h4>
            <ul>
              <li>PM</li>
              <li>UI Designer</li>
              <li>UX Designer</li>
              <li>切版</li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">工具</h4>
            <ul>
              <li>Figma</li>
              <li>Github</li>
              <li>npm</li>
              <li>Notion</li>
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
              <li>IBM Carbon</li>
              <li>Bootstrap 5</li>
              <li>Vital ui kit</li>
              <li>Material Design 3</li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">學習領域知識</h4>
            <ul>
              <li>以前只是為了通過無障礙網頁設計標章，透過此專案專研無障礙網頁知識與技術</li>
              <li>開源軟體前、後所需要具備的知識</li>
              <li>如何從無障礙網頁設計技巧擴大到網頁的「通用設計」的觀念</li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">產出</h4>
            <ul>
              <li>設計系統</li>
              <li>設計文件</li>
              <li>前端開發文件</li>
              <li>Figma</li>
              <li>Nuxt template</li>
              <li>Codesandbox</li>
            </ul>
            <p>
              所有皆可至
              <nuxt-link
                to="https://piman.cc"
                title="前往 Piman 網站(另開視窗)"
                target="_blank"
                ref="noreferrer noopener"
              >
                Piman 網站
              </nuxt-link>
              觀看。
            </p>
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
                  to="https://m3.material.io/"
                  title="前往 Material Design 3(另開視窗)"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  Material Design 3
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  to="https://carbondesignsystem.com/"
                  title="前往 IBM Carbon(另開視窗)"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  IBM Carbon
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  to="https://getbootstrap.com/"
                  title="前往 Bootstrap 5(另開視窗)"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  Bootstrap 5
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  to="https://vitaluikit.com/"
                  title="前往 Vital ui kit(另開視窗)"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  Vital ui kit
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  to="https://opensource.guide/zh-hant/"
                  title="前往 開源軟體指南(另開視窗)"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  開源軟體指南
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  to="https://accessibility.moda.gov.tw"
                  title="前往 無障礙網路空間服務網(另開視窗)"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  無障礙網路空間服務網
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  to="https://github.com/ya-sai/piman"
                  title="前往 Piman Github(另開視窗)"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  Piman Github
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  to="https://piman.cc"
                  title="前往 Piman 網站(另開視窗)"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  Piman 網站
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  to="https://www.figma.com/community/file/1107940884755373211"
                  title="前往 Piman Figma Community(另開視窗)"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  Piman Figma Community
                </nuxt-link>
              </li>
            </ol>
          </div>
        </div>
      </section>
    </article>
  </main>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const pageTitle = ref('Piman 無障礙 UI 框架')
const pageDescription = ref('Piman 是一款聚焦於無障礙網頁設計、基於 Vue 的開源 UI Frameworework。')
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
