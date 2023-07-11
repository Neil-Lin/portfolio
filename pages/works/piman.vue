<template>
  <div>
    <akContainer />
    <theBreadcrumb :page-title="pageTitle" :page-link="`${route.path}`" />
    <h2>{{ pageTitle }}</h2>
    <article>
      <section>
        <figure>
          <img src="/images/piman-thumbnail.webp" alt="Piman thumbnail" />
          <figcaption>Piman {{ $t('name.intro') }}</figcaption>
        </figure>
      </section>
      <section>
        <h3>{{ $t('name.summary') }}</h3>
        <i18n-t keypath="page.piman.p1" tag="p" scope="global">
          <br />
        </i18n-t>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">{{ $t('name.target') }}</h4>
            <ul>
              <li v-for="(item, index) in $tm('page.piman.target')" :key="index">
                {{ $rt(item) }}
              </li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">{{ $t('name.roles') }}</h4>
            <ul>
              <li v-for="(item, index) in $tm('page.piman.roles')" :key="index">
                {{ $rt(item) }}
              </li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">{{ $t('name.tools') }}</h4>
            <ul>
              <li v-for="(item, index) in $tm('page.piman.tools')" :key="index">
                {{ $rt(item) }}
              </li>
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
              <li>Vital Ui Kit</li>
              <li>Material Design 3</li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">{{ $t('name.learn') }}</h4>
            <ul>
              <li v-for="(item, index) in $tm('page.piman.learn')" :key="index">
                {{ $rt(item) }}
              </li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">{{ $t('name.output') }}</h4>
            <ul>
              <li v-for="(item, index) in $tm('page.piman.output')" :key="index">
                {{ $rt(item) }}
              </li>
            </ul>
            <i18n-t keypath="page.piman.p2" tag="p" scope="global">
              <template #link>
                <nuxt-link
                  to="https://piman.cc"
                  :title="$t('action.goTo') + 'Piman' + $t('action.openWindow')"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  Piman
                </nuxt-link>
              </template>
            </i18n-t>
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
                  :title="$t('action.goTo') + 'Vital UI Kit' + $t('action.openWindow')"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  Vital UI Kit
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
