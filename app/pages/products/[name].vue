<template>
  <div v-if="product && product.clickable === true" class="portfolio-detail">
    <h2 v-if="product.name">{{ product.name[$i18n.locale] }}</h2>

    <figure v-if="product.heroImage[$i18n.locale][0]!.src" class="hero-img">
      <img
        :src="`${product.heroImage[$i18n.locale][0]!.src}`"
        :alt="product.heroImage[$i18n.locale][0]!.figcaption"
      />
      <figcaption>
        {{ product.heroImage[$i18n.locale][0]!.figcaption }}
      </figcaption>
    </figure>

    <section
      v-if="product.summary || product.target || product.roles || product.tools"
    >
      <h3>{{ t("page.detail.summary") }}</h3>
      <p v-if="product.summary && product.summary[$i18n.locale]">
        {{ product.summary[$i18n.locale] }}
      </p>
      <br />
      <div class="flex gap-2 flex-wrap">
        <div
          v-if="product.target && product.target[$i18n.locale].length > 0"
          class="flex-item"
        >
          <h4>{{ t("page.detail.target") }}</h4>
          <ul>
            <li
              v-for="(item, index) in product.target[$i18n.locale]"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <div
          v-if="product.roles && product.roles[$i18n.locale].length > 0"
          class="flex-item"
        >
          <h4>{{ t("page.detail.roles") }}</h4>
          <ul>
            <li
              v-for="(item, index) in product.roles[$i18n.locale]"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <div
          v-if="product.tools && product.tools[$i18n.locale].length > 0"
          class="flex-item"
        >
          <h4>{{ t("page.detail.tools") }}</h4>
          <ul>
            <li
              v-for="(item, index) in product.tools[$i18n.locale]"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section v-if="product.observe || product.learn || product.research">
      <h3>{{ t("page.detail.process") }}</h3>
      <div class="flex gap-2 flex-wrap">
        <div
          v-if="product.observe && product.observe[$i18n.locale].length > 0"
          class="flex-item"
        >
          <h4>{{ t("page.detail.observe") }}</h4>
          <ul>
            <li
              v-for="(item, index) in product.observe[$i18n.locale]"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <div
          v-if="product.learn && product.learn[$i18n.locale].length > 0"
          class="flex-item"
        >
          <h4>{{ t("page.detail.learn") }}</h4>
          <ul>
            <li
              v-for="(item, index) in product.learn[$i18n.locale]"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <div
          v-if="product.research && product.research[$i18n.locale].length > 0"
          class="flex-item"
        >
          <h4>{{ t("page.detail.research") }}</h4>
          <ul>
            <li
              v-for="(item, index) in product.research[$i18n.locale]"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section v-if="product.output || product.images || product.videos">
      <h3>{{ t("page.detail.output") }}</h3>
      <div v-if="product.output">
        <ul>
          <li
            v-for="(item, index) in product.output[$i18n.locale]"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>
      </div>
      <div v-if="product.videos">
        <div v-for="(item, index) in product.videos[$i18n.locale]" :key="index">
          <video :title="item.title" controls preload="metadata">
            <source :src="`${item.src}`" type="video/mp4" />
            您的瀏覽器沒有支援 / Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <div v-if="product.images">
        <figure
          v-for="(item, index) in product.images[$i18n.locale]"
          :key="index"
        >
          <img
            :src="`${item.src}`"
            :alt="item.figcaption"
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            {{ item.figcaption }}
          </figcaption>
        </figure>
      </div>
    </section>

    <section v-if="product.relatedLinks">
      <h3>{{ t("page.detail.links") }}</h3>
      <div
        v-if="
          product.relatedLinks && product.relatedLinks[$i18n.locale].length > 0
        "
      >
        <h4>{{ t("page.detail.website") }}</h4>
        <ol>
          <li
            v-for="(item, index) in product.relatedLinks[$i18n.locale]"
            :key="index"
          >
            <nuxt-link
              :to="item.link"
              :title="`${$t('action.openWindow')} ${$t('action.goTo')} ${item.title}`"
              target="_blank"
            >
              {{ item.title }}
            </nuxt-link>
          </li>
        </ol>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { productsData } from "~~/data/productsData";

const { t, locale } = useI18n();
const runtimeConfig = useRuntimeConfig();
const route = useRoute();

function getProductSlug(value: unknown): string {
  const slug = Array.isArray(value) ? value[0] : value;
  if (typeof slug !== "string") {
    return "";
  }

  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function isClickableProductSlug(value: unknown): boolean {
  const slug = getProductSlug(value);
  return productsData.some((p) => p.clickable === true && p.slug === slug);
}

definePageMeta({
  validate: (route) =>
    isClickableProductSlug(route.params.name) || {
      statusCode: 404,
      statusMessage: "Product not found",
    },
});

const product = computed(() =>
  productsData.find(
    (p) => p.clickable === true && p.slug === getProductSlug(route.params.name),
  ),
);

const pageTitle = computed(() =>
  product.value ? product.value.name[locale.value] : t("error.notFound"),
);
const pageDescription = computed(() =>
  product.value ? product.value.intro[locale.value] : "",
);
const ogImageUrl = computed(() =>
  product.value
    ? runtimeConfig.public.baseUrl +
      product.value.schemaImage[locale.value][0]?.src
    : "",
);
const dateModified = computed(() =>
  product.value
    ? (product.value.updatedAt ??
      product.value.yearRange.end ??
      product.value.yearRange.start)
    : undefined,
);

useHead(
  computed(() => ({
    link: [
      { rel: "canonical", href: runtimeConfig.public.baseUrl + route.path },
    ],
    meta: [
      {
        name: "keywords",
        content: product.value
          ? product.value.keywords[locale.value].join(", ")
          : "",
      },
    ],
  })),
);

usePageSeoMeta(pageTitle, pageDescription);

useSeoMeta({
  ogImage: () => ogImageUrl.value,
  twitterImage: () => ogImageUrl.value,
  twitterCard: "summary_large_image",
});

useSchemaOrg(
  computed(() => [
    {
      "@type": "CreativeWork",
      name: pageTitle.value,
      description: pageDescription.value,
      image: product.value
        ? runtimeConfig.public.baseUrl +
          product.value.schemaImage[locale.value][0]?.src
        : "",
      url: runtimeConfig.public.baseUrl + route.path,
      author: { "@type": "Person", name: "Neil Lin" },
      datePublished: product.value?.yearRange.start,
      dateModified: dateModified.value,
      inLanguage: locale.value,
      keywords: product.value?.keywords[locale.value].join(", ") ?? "",
    },
  ]),
);

// 詳情頁的 BreadcrumbList 由本頁負責（列表頁的由 products.vue 輸出）
useBreadcrumbSchema(
  computed(() => [
    { link: "/", title: String(t("action.goToHomePage")) },
    { link: "/products", title: String(t("mainMenu.products")) },
    { title: String(product.value?.name[locale.value] ?? "") },
  ]),
);
</script>

<style scoped>
.portfolio-detail {
  max-width: 1440px;
  margin: 0 auto;
  padding: 2rem;
  @media screen and (width <= 768px) {
    padding: 0;
  }
  .hero-img {
    img {
      width: 100%;
    }
  }
}
.flex {
  display: flex;
}

.flex-wrap {
  flex-wrap: wrap;
}

.flex-item {
  flex: 1 1 auto;
}

section {
  padding-bottom: 4rem;
  margin-bottom: 4rem;
  border-bottom: 1px dashed oklch(var(--border-color));
  figure {
    margin-bottom: 2rem;
    text-align: center;
    img {
      max-width: 100%;
    }
  }
  ul,
  ol {
    list-style: initial;
    padding-left: 20px;
    color: oklch(var(--wrapper-color));
    li {
      margin-bottom: 0.5rem;
    }
  }
}

.gap-2 {
  gap: 2rem;
}
</style>
