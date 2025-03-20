<template>
  <main class="page page--grid">
    <div class="page-container">
      <theBreadcrumbs :list="breadcrumbs" />
      <akContainer />
      <!-- 無選擇產品時，顯示完整列表 -->
      <template v-if="!route.params.name || isModal">
        <h2>{{ pageTitle }}</h2>
        <!-- 🔽 篩選區塊 -->
        <div class="filters">
          <div>
            <label for="sortorder">{{ $t("words.sort") }}：</label>
            <select id="sortorder" v-model="sortorder">
              <option value="desc">{{ $t("words.newToOld") }}</option>
              <option value="asc">{{ $t("words.oldToNew") }}</option>
            </select>
          </div>
          <div>
            <label for="roleFilter">{{ $t("words.roles") }}：</label>
            <select id="roleFilter" v-model="selectedRole">
              <option value="">{{ $t("words.all") }}</option>
              <option v-for="role in uniqueRoles" :key="role" :value="role">
                {{ role }}
              </option>
            </select>
          </div>
          <div>
            <label for="platformFilter">{{ $t("words.platform") }}：</label>
            <select id="platformFilter" v-model="selectedPlatform">
              <option value="">{{ $t("words.all") }}</option>
              <option value="web">Web</option>
              <option value="app">App</option>
            </select>
          </div>
        </div>
        <!-- 分組後的產品列表 -->
        <div
          v-if="groupedlist.length > 0"
          :class="[
            'group-list',
            sortorder === 'desc'
              ? 'group-list--top-space'
              : 'group-list--bottom-space',
          ]"
          aria-live="polite"
        >
          <div class="group-year-present">{{ $t("words.today") }}</div>
          <div
            v-for="group in groupedlist"
            :key="group.year"
            class="portfolio-area"
          >
            <ul class="portfolio-list">
              <li
                v-for="product in group.products"
                :key="product.id"
                class="portfolio-item animation-fade-out"
              >
                <nuxt-link
                  v-if="product.clickable"
                  :to="{
                    path: localePath(
                      `/products/${encodeURIComponent(product.slug)}`
                    ),
                    query: {
                      dialog: 'true',
                      role: selectedRole || undefined,
                      platform: selectedPlatform || undefined,
                      sortorder: sortorder || undefined,
                    },
                  }"
                  :title="`${product.name![$i18n.locale]}`"
                  class="portfolio-link"
                >
                  <h3 class="portfolio-title">
                    {{ product.name[$i18n.locale] }}
                  </h3>
                  <div class="portfolio-content">
                    <img
                      v-if="product.heroImage[$i18n.locale]?.[0]?.src"
                      :src="`${runtimeConfig.public.baseUrl}${product.heroImage[$i18n.locale][0].src}`"
                      :alt="`${product.name[$i18n.locale]}`"
                      class="portfolio-img"
                    />
                    <div
                      v-if="product.intro![$i18n.locale]"
                      class="portfolio-intro"
                    >
                      <p>{{ product.intro![$i18n.locale] }}</p>
                    </div>
                  </div>
                  <div class="portfolio-footer">
                    <span class="visually-hidden">相關標籤：</span>
                    <span class="tag">
                      <span class="visually-hidden">執行起始時間：</span>
                      {{ formatYearRange(product.yearRange) }}
                    </span>
                    <span
                      v-if="
                        product.platform.includes('web') ||
                        product.platform.includes('app')
                      "
                      class="visually-hidden"
                    >
                      平臺種類：
                    </span>
                    <span v-if="product.platform.includes('web')" class="tag">
                      Web
                    </span>
                    <span v-if="product.platform.includes('app')" class="tag">
                      App
                    </span>
                    <span
                      v-if="product.roles[$i18n.locale].length > 0"
                      class="visually-hidden"
                    >
                      擔當角色：
                    </span>
                    <span
                      v-for="(item, index) in product.roles[$i18n.locale]"
                      :key="index"
                      class="tag"
                    >
                      {{ item }}
                    </span>
                  </div>
                </nuxt-link>
                <div v-else class="portfolio-link portfolio-link--disabled">
                  <h3 class="portfolio-title">
                    {{ product.name[$i18n.locale] }}
                  </h3>
                  <div class="portfolio-content">
                    <img
                      :src="`${runtimeConfig.public.baseUrl}${product.heroImage[$i18n.locale][0]!.src}`"
                      alt=""
                      class="portfolio-img"
                    />
                    <div
                      v-if="product.intro![$i18n.locale]"
                      class="portfolio-intro"
                    >
                      <p>{{ product.intro![$i18n.locale] }}</p>
                    </div>
                  </div>
                  <div class="portfolio-footer">
                    <span class="visually-hidden">相關標籤：</span>
                    <span class="tag">
                      <span class="visually-hidden">執行起始時間：</span>
                      {{ formatYearRange(product.yearRange) }}
                    </span>
                    <span
                      v-if="
                        product.platform.includes('web') ||
                        product.platform.includes('app')
                      "
                      class="visually-hidden"
                    >
                      平臺種類：
                    </span>
                    <span v-if="product.platform.includes('web')" class="tag">
                      Web
                    </span>
                    <span v-if="product.platform.includes('app')" class="tag">
                      App
                    </span>
                    <span
                      v-if="product.roles[$i18n.locale].length > 0"
                      class="visually-hidden"
                    >
                      擔當角色：
                    </span>
                    <span
                      v-for="(item, index) in product.roles[$i18n.locale]"
                      :key="index"
                      class="tag"
                    >
                      {{ item }}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
            <div
              :class="[
                'group-year',
                sortorder === 'desc' ? 'group-year--bottom' : 'group-year--top',
              ]"
            >
              {{ group.year }}
            </div>
          </div>
        </div>
        <emptyBlock v-else>{{ $t("data.nodata") }}</emptyBlock>
      </template>

      <!-- 選擇了產品 -->
      <template v-if="route.params.name && isModal">
        <!-- 當 query.dialog 為 true 時，顯示列表與 dialog -->
        <!-- <template v-if="isModal"> -->
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
        <!-- </template> -->
        <!-- 無 query.dialog，直接顯示詳細內容 -->
      </template>
      <template v-if="route.params.name && !isModal">
        <NuxtPage />
      </template>
    </div>
  </main>
</template>

<script setup lang="ts">
import productsData from "~~/data/productsData";
const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();
const localePath = useLocalePath();
const lightBox = ref<HTMLDialogElement | null>(null);
const products = ref(productsData);
const runtimeConfig = useRuntimeConfig();
const pageTitle = computed(() => t("words.products"));
const pageDescription = computed(() => t("words.careerWorks"));

definePageMeta({
  scrollToTop: false,
});

// 新增排序狀態，預設為新到舊 (desc)
const sortorder = ref(
  route.query.sortorder ? String(route.query.sortorder) : "desc"
);

// **從網址讀取篩選條件**
const selectedRole = ref(route.query.role ? String(route.query.role) : ""); // 單選角色
const selectedPlatform = ref(
  route.query.platform ? String(route.query.platform) : ""
); // 單選平台（web / app）

const isModal = computed(
  () => route.query.dialog === "true" && route.params.name
);

// 🔥 取得所有角色，生成篩選選單
const uniqueRoles = computed(() => {
  const roleSet = new Set();
  products.value.forEach((p) => {
    p.roles[locale.value].forEach((role) => roleSet.add(role));
  });
  return Array.from(roleSet);
});

// 🔥 更新網址的 `query` 參數
const updateQueryParams = () => {
  router.replace({
    path: route.path,
    query: {
      role: selectedRole.value || undefined,
      platform: selectedPlatform.value || undefined,
      sortorder: sortorder.value || undefined,
    },
  });
};

// 🔥 監聽篩選條件變化，更新網址參數
watch([selectedRole, selectedPlatform, sortorder], updateQueryParams);

// 🔥 監聽網址 `query` 變化，當使用者修改網址時，自動更新篩選條件
watch(
  () => route.query,
  (query) => {
    selectedRole.value = query.role ? String(query.role) : "";
    selectedPlatform.value = query.platform ? String(query.platform) : "";
    sortorder.value = query.sortorder ? String(query.sortorder) : "desc";
  }
);

// 篩選產品 computed 屬性 (保留原有排序邏輯)
const filteredList = computed(() => {
  return products.value
    .filter((p) => {
      const matchesRole =
        selectedRole.value === "" ||
        p.roles[locale.value].includes(selectedRole.value);
      const matchesPlatform =
        selectedPlatform.value === "" ||
        p.platform.includes(selectedPlatform.value);

      return matchesRole && matchesPlatform;
    })
    .sort((a, b) => {
      if (sortorder.value === "asc") {
        return a.yearRange.start - b.yearRange.start;
      } else {
        return b.yearRange.start - a.yearRange.start;
      }
    });
});

// 新增依據 yearRange.start 分組的 computed 屬性
const groupedlist = computed(() => {
  const groups: { products: typeof products.value }[] = [];

  filteredList.value.forEach((product) => {
    const year = product.yearRange.start;
    let group = groups.find((g) => g.year === year);
    if (!group) {
      group = { year, products: [] };
      groups.push(group);
    }
    group.products.push(product);
  });

  // 根據 sortorder 排序分組，若為 asc 則由小到大，否則由大到小
  groups.sort((a, b) => {
    if (sortorder.value === "asc") {
      return a.year - b.year;
    } else {
      return b.year - a.year;
    }
  });

  return groups;
});

// 🔥 轉換年份格式
const formatYearRange = (yearRange: { start: number; end: number | null }) => {
  return yearRange.end === null
    ? `${yearRange.start} - ` + t("words.present")
    : `${yearRange.start} - ${yearRange.end}`;
};

// 關閉 dialog 時，導向至 "/products" 清除 encodedName 與 query 參數
const closeProduct = async () => {
  lightBox.value?.close();
  await router.replace({
    path: localePath("/products"),
    query: {
      role: selectedRole.value || undefined,
      platform: selectedPlatform.value || undefined,
      sortorder: sortorder.value || undefined,
    },
  });
};

// 監聽 route.fullPath，若不符合條件則關閉 dialog
watch(
  () => route.fullPath,
  () => {
    if (!isModal.value) {
      lightBox.value?.close();
    }
  }
);

// 監聽 isModal，當其變為 `true` 時，開啟 dialog
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
  if (Object.keys(route.query).length > 0) {
    // ⚠️ `replace()` 只保留純 `/products`，移除所有參數
    router.replace(route.path);
  }
});

// 🔥 設定 Schema.org 資料
useSchemaOrg([
  // 作品集列表 (ItemList)
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${runtimeConfig.public.baseUrl}${route.path}#productsList`,
    name: t("words.portfolio"),
    description: pageDescription.value,
    url: `${runtimeConfig.public.baseUrl}${route.path}`,
    numberOfItems: productsData.length,
    itemListElement: productsData.map((work, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${runtimeConfig.public.baseUrl}/products/${work.slug}`,
      item: {
        "@type": "CreativeWork",
        "@id": `${runtimeConfig.public.baseUrl}/products/${work.slug}#creativework`,
        name: work.name[locale.value],
        description: work.intro?.[locale.value] || "",
        image: `${runtimeConfig.public.baseUrl}${work.heroImage[locale.value][0]?.src}`,
        creator: {
          "@type": "Person",
          name: "Neil",
          url: runtimeConfig.public.baseUrl,
        },
        datePublished: work.yearRange.start,
        dateModified: work.yearRange.end ?? new Date().getFullYear(),
        url: `${runtimeConfig.public.baseUrl}/products/${work.slug}`,
        inLanguage: locale.value,
        keywords: work.roles[locale.value].join(", "),
        audience: {
          "@type": "EducationalAudience",
          educationalRole: "Designer, Developer",
        },
      },
    })),
  },
]);

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
      content: pageTitle.value + " - " + t("website.name"),
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
      content: pageTitle.value + " - " + t("website.name"),
    },
    {
      hid: "twitter:description",
      name: "twitter:description",
      content: pageDescription.value,
    },
  ],
});

const breadcrumbs = computed(() => {
  if (route.params.name) {
    return [
      { link: "/", title: t("action.goToHomePage") },
      { link: "/products", title: t("mainMenu.products") },
      { title: route.params.name },
    ];
  } else {
    return [
      { link: "/", title: t("action.goToHomePage") },
      { link: "", title: t("mainMenu.products") },
    ];
  }
});
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

.group-list {
  @media screen and (width <= 768px) {
    margin-left: 0.75rem;
    padding-right: 0.5rem;
  }
}

.btn--close-dialog {
  position: sticky;
  top: 0;
}
</style>
