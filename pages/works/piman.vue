<template>
  <div>
    <akContainer />
    <theBreadcrumb :page-title="pageTitle" :page-link="`${route.path}`" />
    <h2>{{ pageTitle }}</h2>
    <article>
      <section>
        <figure>
          <img src="/images/piman-thumbnail.webp" alt="Piman thumbnail" />
          <figcaption>Piman 簡介</figcaption>
        </figure>
      </section>
      <section>
        <h3>{{ $t('name.summary') }}</h3>
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
            <h4 class="flex-list-title">{{ $t('name.target') }}</h4>
            <ul>
              <li>達成網頁的「通用設計」</li>
              <li>開源</li>
              <li>建立設計系統</li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">{{ $t('name.roles') }}</h4>
            <ul>
              <li>PM</li>
              <li>UI Designer</li>
              <li>UX Designer</li>
              <li>切版</li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">{{ $t('name.tools') }}</h4>
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
        <h3>{{ $t('name.process') }}</h3>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">{{ $t('name.observe') }}</h4>
            <ul>
              <li>IBM Carbon</li>
              <li>Bootstrap 5</li>
              <li>Vital ui kit</li>
              <li>Material Design 3</li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">{{ $t('name.learn') }}</h4>
            <ul>
              <li>以前只是為了通過無障礙網頁設計標章，透過此專案專研無障礙網頁知識與技術</li>
              <li>開源軟體前、後所需要具備的知識</li>
              <li>如何從無障礙網頁設計技巧擴大到網頁的「通用設計」的觀念</li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">{{ $t('name.output') }}</h4>
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
                :title="$t('action.goTo') + 'Piman' + $t('action.openWindow')"
                target="_blank"
                ref="noreferrer noopener"
              >
                Piman
              </nuxt-link>
              觀看。
            </p>
          </div>
        </div>
      </section>
      <section>
        <h3>{{ $t('name.relatedLink') }}</h3>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">{{ $t('name.website') }}</h4>
            <ol>
              <li>
                <nuxt-link
                  to="https://m3.material.io/"
                  :title="$t('action.goTo') + 'Material Design 3' + $t('action.openWindow')"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  Material Design 3
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  to="https://carbondesignsystem.com/"
                  :title="$t('action.goTo') + 'IBM Carbon' + $t('action.openWindow')"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  IBM Carbon
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  to="https://getbootstrap.com/"
                  :title="$t('action.goTo') + 'Bootstrap 5' + $t('action.openWindow')"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  Bootstrap 5
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  to="https://vitaluikit.com/"
                  :title="$t('action.goTo') + 'Vital ui kit' + $t('action.openWindow')"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  Vital ui kit
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  to="https://opensource.guide/zh-hant/"
                  :title="$t('action.goTo') + $t('name.openSourceGuideline') + $t('action.openWindow')"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  {{ $t('name.openSourceGuideline') }}
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  to="https://accessibility.moda.gov.tw"
                  :title="$t('action.goTo') + $t('name.modaA11y') + $t('action.openWindow')"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  {{ $t('name.modaA11y') }}
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  to="https://github.com/ya-sai/piman"
                  :title="$t('action.goTo') + 'Piman Github' + $t('action.openWindow')"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  Piman Github
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  to="https://piman.cc"
                  :title="$t('action.goTo') + 'Piman Official Website' + $t('action.openWindow')"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  Piman Official Website
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  to="https://www.figma.com/community/file/1107940884755373211"
                  :title="$t('action.goTo') + 'Piman Figma Community' + $t('action.openWindow')"
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
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const runtimeConfig = useRuntimeConfig()
const pageTitle = ref(t('name.piman'))
const pageDescription = ref(t('des.piman'))
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
      content: pageTitle.value + ' - ' +  t('website.name')
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: pageDescription.value
    }
  ]
})
</script>
