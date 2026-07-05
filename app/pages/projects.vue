<template>
  <main class="page page--grid">
    <div class="page-container">
      <theBreadcrumbs :list="breadCrumbsList" />
      <akContainer />

      <h2>{{ pageTitle }}</h2>
      <PortfolioFilters
        v-model:sortorder="sortorder"
        v-model:role="selectedRole"
        v-model:platform="selectedPlatform"
        :roles="uniqueRoles"
      />

      <PortfolioGrid :grouped-list="groupedList" :sortorder="sortorder">
        <template #card="{ item: project, idx }">
          <PortfolioCard
            :clickable="Boolean(project.clickable && project.link)"
            :to="project.link"
            :title="
              project.clickable && project.link
                ? `${$t('action.openWindow')} ${$t('action.goTo')}${project.name[$i18n.locale]}`
                : undefined
            "
            :external="true"
          >
            <PortfolioCardBody
              :title="project.name[$i18n.locale]"
              :image-src="project.heroImage?.[$i18n.locale]?.[0]?.src"
              :image-alt="project.clickable ? '' : project.name[$i18n.locale]"
              :intro="project.intro?.[$i18n.locale]"
              :year-label="formatYearRange(project.yearRange)"
              :platform="project.platform"
              :roles="project.roles[$i18n.locale]"
              :fetchpriority="idx === 0 ? 'high' : undefined"
            />
          </PortfolioCard>
        </template>
      </PortfolioGrid>
    </div>
  </main>
</template>

<script setup lang="ts">
import { projectsData } from "~~/data/projectsData";

const { t, locale } = useI18n();
const runtimeConfig = useRuntimeConfig();
const orgUrl = useOrgUrl();

const pageTitle = computed(() => t("words.projects"));
const pageDescription = computed(() => t("words.careerWorks"));

definePageMeta({ scrollToTop: false });

const {
  sortorder,
  selectedRole,
  selectedPlatform,
  uniqueRoles,
  groupedList,
  formatYearRange,
} = usePortfolioFilter(projectsData);

useSchemaOrg(
  computed(() => [
    {
      "@type": "CollectionPage",
      "@id": `${orgUrl.value}/projects#webpage`,
      name: pageTitle.value,
      description: pageDescription.value,
      url: `${orgUrl.value}/projects`,
      inLanguage: locale.value,
      isPartOf: { "@id": `${orgUrl.value}/#website` },
      mainEntity: {
        "@type": "ItemList",
        "@id": `${orgUrl.value}/projects#projectsList`,
        name: pageTitle.value,
        numberOfItems: projectsData.length,
        itemListElement: projectsData.map((work, index) => {
          const hasExternal = Boolean(work.link) && work.clickable !== false;
          const imageSrc = work.heroImage?.[locale.value]?.[0]?.src
            ? `${runtimeConfig.public.baseUrl}${work.heroImage[locale.value][0]!.src}`
            : undefined;

          const creativeWork: Record<string, unknown> = {
            "@type": "CreativeWork",
            "@id": `${orgUrl.value}/projects#${work.slug}-creativework`,
            identifier: work.slug,
            name: work.name?.[locale.value] ?? work.name?.["zh-Hant-TW"] ?? "",
            description: work.intro?.[locale.value] || "",
            ...(imageSrc ? { image: imageSrc } : {}),
            creator: { "@id": `${orgUrl.value}/#person` },
            datePublished: work.yearRange?.start,
            dateModified: work.yearRange?.end ?? work.yearRange?.start,
            inLanguage: locale.value,
            keywords: Array.isArray(work.roles?.[locale.value])
              ? work.roles[locale.value].join(", ")
              : "",
            audience: {
              "@type": "EducationalAudience",
              educationalRole: "Designer, Developer",
            },
          };

          if (hasExternal && work.link) {
            creativeWork.url = work.link;
          } else {
            creativeWork.creativeWorkStatus = "Archived";
          }

          const listItem: Record<string, unknown> = {
            "@type": "ListItem",
            position: index + 1,
            item: creativeWork,
          };
          if (hasExternal && work.link) listItem.url = work.link;

          return listItem;
        }),
      },
    },
  ]),
);

usePageSeoMeta(pageTitle, pageDescription);

const breadCrumbsList = computed(() => [
  { link: "/", title: t("action.goToHomePage") },
  { link: "", title: t("mainMenu.projects") },
]);

useBreadcrumbSchema(breadCrumbsList);

defineOgImage("CustomTemplate", {
  title: pageTitle.value + " - " + t("website.name"),
  description: pageDescription.value,
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
</style>
