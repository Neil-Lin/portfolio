<template>
  <main class="page page--grid">
    <div class="page-container">
      <theBreadcrumbs :list="breadcrumbs" />
      <akContainer />

      <template v-if="!route.params.name || isModal">
        <h2>{{ pageTitle }}</h2>
        <PortfolioFilters
          v-model:sortorder="sortorder"
          v-model:role="selectedRole"
          v-model:platform="selectedPlatform"
          :roles="uniqueRoles"
        />

        <PortfolioGrid :grouped-list="groupedList" :sortorder="sortorder">
          <template #card="{ item: productItem, idx }">
            <PortfolioCard
              :clickable="productItem.clickable"
              :to="
                productItem.clickable
                  ? {
                      path: localePath(
                        `/products/${encodeURIComponent(productItem.slug)}`,
                      ),
                    }
                  : undefined
              "
              :title="productItem.name[$i18n.locale]"
              @click="onOpenProduct($event, productItem)"
            >
              <PortfolioCardBody
                :title="productItem.name[$i18n.locale]"
                :image-src="productItem.heroImage[$i18n.locale]?.[0]?.src"
                :intro="productItem.intro[$i18n.locale]"
                :year-label="formatYearRange(productItem.yearRange)"
                :platform="productItem.platform"
                :roles="productItem.roles[$i18n.locale]"
                :fetchpriority="idx === 0 ? 'high' : undefined"
              />
            </PortfolioCard>
          </template>
        </PortfolioGrid>
      </template>

      <template v-if="route.params.name && isModal">
        <dialog ref="lightBox" @cancel.prevent="closeProduct">
          <button
            type="button"
            class="btn btn--close-dialog"
            @click="closeProduct"
          >
            {{ t("action.closeDialog") }}
          </button>
          <NuxtPage />
        </dialog>
      </template>
      <template v-if="route.params.name && !isModal">
        <NuxtPage />
      </template>
    </div>
  </main>
</template>

<script setup lang="ts">
import { productsData } from "~~/data/productsData";
import type { Product } from "~~/data/types";

const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();
const localePath = useLocalePath();
const lightBox = ref<HTMLDialogElement | null>(null);
const runtimeConfig = useRuntimeConfig();
const orgUrl = useOrgUrl();
const clickableProducts = productsData.filter((work) => work.clickable);

const pageTitle = computed(() => t("words.products"));
const pageDescription = computed(() => t("words.careerWorks"));
const getProductDateModified = (updatedAt?: string, fallbackYear?: number) =>
  updatedAt ?? fallbackYear ?? new Date().getFullYear();

definePageMeta({ scrollToTop: false });

// 燈箱狀態（不寫進 URL，直接用 app state）
const productModalOpen = useState("productModalOpen", () => false);
const savedScrollY = useState("savedScrollY", () => 0);

const isModal = computed(
  () => Boolean(route.params.name) && productModalOpen.value,
);

const {
  sortorder,
  selectedRole,
  selectedPlatform,
  uniqueRoles,
  groupedList,
  formatYearRange,
} = usePortfolioFilter(productsData);

// 導航交給 NuxtLink（避免雙重 push）；這裡只記錄捲動位置並開燈箱。
// 修飾鍵點擊（開新分頁等）不進燈箱，交給瀏覽器預設行為。
const onOpenProduct = (event: MouseEvent, productItem: Product) => {
  if (!productItem.clickable) return;
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  savedScrollY.value = window.scrollY;
  productModalOpen.value = true;
};

const restoreScrollPosition = async (top: number) => {
  await nextTick();
  requestAnimationFrame(() => {
    const htmlScrollBehavior = document.documentElement.style.scrollBehavior;
    const bodyScrollBehavior = document.body.style.scrollBehavior;

    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.scrollBehavior = "auto";
    window.scrollTo(0, top);
    document.documentElement.style.scrollBehavior = htmlScrollBehavior;
    document.body.style.scrollBehavior = bodyScrollBehavior;
  });
};

const closeProduct = async () => {
  if (!lightBox.value) return;
  const scrollY = savedScrollY.value;

  lightBox.value.close();
  await router.replace({
    path: localePath("/products"),
    query: {
      role: selectedRole.value || undefined,
      platform: selectedPlatform.value || undefined,
      sortorder: sortorder.value || undefined,
    },
  });

  productModalOpen.value = false;
  await restoreScrollPosition(scrollY);
};

// 瀏覽器上一頁關閉燈箱時，重置 state
watch(
  () => route.params.name,
  (name) => {
    if (!name) {
      productModalOpen.value = false;
      lightBox.value?.close();
    }
  },
);

watch(isModal, async (modal) => {
  if (modal) {
    await nextTick();
    lightBox.value?.showModal();
  }
});

onMounted(() => {
  if (isModal.value) {
    lightBox.value?.showModal();
  }
});

// Schema.org：只在列表頁輸出，詳細頁由 [name].vue 負責
useSchemaOrg(
  computed(() =>
    route.params.name
      ? []
      : [
          {
            "@type": "CollectionPage",
            "@id": `${runtimeConfig.public.baseUrl}${route.path}#collection`,
            name: t("words.portfolio"),
            description: pageDescription.value,
            url: `${runtimeConfig.public.baseUrl}${route.path}`,
            mainEntity: {
              "@type": "ItemList",
              "@id": `${runtimeConfig.public.baseUrl}${route.path}#productsList`,
              numberOfItems: clickableProducts.length,
              itemListElement: clickableProducts.map((work, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${orgUrl.value}/products/${work.slug}`,
                item: {
                  "@type": "CreativeWork",
                  "@id": `${orgUrl.value}/products/${work.slug}#creativework`,
                  name: work.name[locale.value],
                  description: work.intro[locale.value] || "",
                  image: `${runtimeConfig.public.baseUrl}${work.schemaImage[locale.value][0]?.src}`,
                  creator: {
                    "@type": "Person",
                    name: "Neil",
                    url: orgUrl.value,
                  },
                  datePublished: work.yearRange.start,
                  dateModified: getProductDateModified(
                    work.updatedAt,
                    work.yearRange.end ?? work.yearRange.start,
                  ),
                  url: `${orgUrl.value}/products/${work.slug}`,
                  inLanguage: locale.value,
                  keywords: work.roles[locale.value].join(", "),
                },
              })),
            },
          },
        ],
  ),
);

usePageSeoMeta(pageTitle, pageDescription);

const slug = computed(() => {
  const name = route.params.name;
  return name
    ? decodeURIComponent(Array.isArray(name) ? (name[0] ?? "") : name)
    : "";
});
const product = computed(() => productsData.find((p) => p.slug === slug.value));

const breadcrumbs = computed(() => {
  if (slug.value && product.value) {
    return [
      { link: "/", title: String(t("action.goToHomePage")) },
      { link: "/products", title: String(t("mainMenu.products")) },
      { title: String(product.value.name[locale.value] || slug.value) },
    ];
  }
  return [
    { link: "/", title: String(t("action.goToHomePage")) },
    { title: String(t("mainMenu.products")) },
  ];
});

// Schema：列表頁由此輸出；詳情頁（含燈箱）的 BreadcrumbList 由 [name].vue 負責
useBreadcrumbSchema(
  computed(() => (route.params.name ? [] : breadcrumbs.value)),
);

if (!route.params.name) {
  defineOgImage("CustomTemplate", {
    title: pageTitle.value + " - " + t("website.name"),
    description: pageDescription.value,
  });
}
</script>

<style scoped>
.page-container {
  grid-column: 4 / -4;
  @media screen and (width <= 1920px) {
    grid-column: 2 / -2;
  }
  @media screen and (width <= 768px) {
    grid-column: 1 / -1;
  }
}

.btn--close-dialog {
  position: sticky;
  top: 0;
}
</style>
