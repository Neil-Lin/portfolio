<template>
  <div>
    <akContainer />
    <theBreadcrumb :page-title="pageTitle" :page-link="`${route.path}`" />
    <h2>{{ pageTitle }}</h2>
    <div class="page-container">
      <section>
        <figure>
          <img src="/images/choose-chart-thumbnail.webp" alt="Choose" />
          <figcaption>{{ pageTitle }} {{ $t("name.intro") }}</figcaption>
        </figure>
      </section>
      <section>
        <h3>{{ $t("name.summary") }}</h3>
        <i18n-t keypath="page.choose.p1" tag="p" scope="global">
          <br />
        </i18n-t>
        <i18n-t keypath="page.choose.p2" tag="p" scope="global">
          <br />
        </i18n-t>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">{{ $t("name.target") }}</h4>
            <ul>
              <li
                v-for="(item, index) in $tm('page.choose.target')"
                :key="index"
              >
                {{ $rt(item) }}
              </li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">{{ $t("name.roles") }}</h4>
            <ul>
              <li
                v-for="(item, index) in $tm('page.choose.roles')"
                :key="index"
              >
                {{ $rt(item) }}
              </li>
            </ul>
          </div>
          <div>
            <h4 class="flex-list-title">{{ $t("name.tools") }}</h4>
            <ul>
              <li
                v-for="(item, index) in $tm('page.choose.tools')"
                :key="index"
              >
                {{ $rt(item) }}
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section>
        <h3>{{ $t("page.choose.p3") }}</h3>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">{{ $t("name.learn") }}</h4>
            <ul>
              <li
                v-for="(item, index) in $tm('page.choose.learn')"
                :key="index"
              >
                {{ $rt(item) }}
              </li>
            </ul>
          </div>
        </div>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">{{ $t("name.output") }}</h4>
            <ul>
              <li
                v-for="(item, index) in $tm('page.choose.output')"
                :key="index"
              >
                {{ $rt(item) }}
              </li>
            </ul>
            <p>{{ $t("page.choose.p4") }}</p>
            <figure>
              <img
                src="/images/choose-chart-hotkeywords.webp"
                :alt="$t('page.choose.p5')"
                loading="lazy"
              />
              <figcaption>{{ $t("page.choose.p5") }}</figcaption>
            </figure>
            <figure>
              <img
                src="/images/choose-chart-hotkeywords-hover.webp"
                :alt="$t('page.choose.p6')"
                loading="lazy"
              />
              <figcaption>{{ $t("page.choose.p6") }}</figcaption>
            </figure>
            <figure>
              <img
                src="/images/choose-chart-hotkeywords-detail.webp"
                :alt="$t('page.choose.p7')"
                loading="lazy"
              />
              <figcaption>{{ $t("page.choose.p7") }}</figcaption>
            </figure>
            <figure>
              <img
                src="/images/choose-chart-hotkeywords-detail-hover.webp"
                :alt="$t('page.choose.p8')"
                loading="lazy"
              />
              <figcaption>{{ $t("page.choose.p8") }}</figcaption>
            </figure>
          </div>
        </div>
        <h3>{{ $t("page.choose.p9") }}</h3>
        <p>coming soon...</p>
        <h3>{{ $t("page.choose.p10") }}</h3>
        <p>coming soon...</p>
      </section>
      <section>
        <h3>{{ $t("name.relatedLink") }}</h3>
        <div class="flex-list">
          <div>
            <h4 class="flex-list-title">{{ $t("name.website") }}</h4>
            <ol>
              <li>
                <nuxt-link
                  to="https://choose.blueplanet.com.tw/intro/"
                  title="前往 Choose 蛛思介紹頁(另開視窗)"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  Choose Intro 蛛思介紹頁
                </nuxt-link>
              </li>
              <li>
                <nuxt-link
                  to="https://choose.blueplanet.com.tw/lab"
                  title="前往 Choose Choose 蛛思蛛思熱詞影響力診斷體驗(另開視窗)"
                  target="_blank"
                  ref="noreferrer noopener"
                >
                  Choose Chart Demo 蛛思蛛思熱詞影響力診斷體驗
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
const { t } = useI18n();
const runtimeConfig = useRuntimeConfig();
const pageTitle = ref(t("page.choose.title"));
const pageDescription = ref(t("page.choose.des"));
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
