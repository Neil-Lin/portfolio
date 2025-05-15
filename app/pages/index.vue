<template>
  <main class="page page--index">
    <div class="page-container">
      <h2 class="visually-hidden">{{ pageTitle }}</h2>
      <div class="card animation-fade-out podcast">
        <akContainer />
        <div class="podcast-container">
          <div>
            <i18n-t
              keypath="page.podcast.p1"
              tag="span"
              scope="global"
            ></i18n-t>
          </div>
          <figure>
            <figcaption class="visually-hidden">
              <i18n-t
                keypath="page.podcast.p1"
                tag="span"
                scope="global"
              ></i18n-t>
            </figcaption>
            <div class="audio-container">
              <audio
                ref="audioRef"
                controls
                src="https://neil-lin.github.io/portfolio/audio/podcast-portfolio.wav"
              ></audio>
            </div>
          </figure>
        </div>
      </div>
      <div class="card animation-fade-out intro">
        <h3>{{ t("words.intro") }}</h3>
        <i18n-t keypath="page.about.p1" tag="p" scope="global"><br /></i18n-t>
        <i18n-t keypath="page.about.p2" tag="p" scope="global">
          <template #link>
            <nuxt-link
              ref="noreferrer noopener"
              to="https://github.com/Neil-Lin/portfolio"
              :title="$t('action.goTo') + 'Github' + $t('action.openWindow')"
              target="_blank"
            >
              Github
            </nuxt-link>
          </template>
        </i18n-t>
      </div>
      <div class="card animation-fade-out programming">
        <h3>{{ t("words.programming") }}</h3>
        <ul>
          <li>HTML5</li>
          <li>CSS/SCSS</li>
          <li>Javascript/jQuery</li>
          <li>Vue/Nuxt</li>
          <li>Version Control</li>
        </ul>
      </div>
      <div class="card animation-fade-out promote">
        <h3>{{ t("words.promote") }}</h3>
        <ul>
          <li>
            <nuxt-link
              to="https://ithelp.ithome.com.tw/users/20152260/ironman/5614"
              :title="`${$t('action.goTo')} ${$t('des.ithomeA11y')} ${$t('action.openWindow')}`"
              target="_blank"
            >
              Accessibility
            </nuxt-link>
          </li>
          <li>Data visualization</li>
          <li>DesignOps/Design System</li>
          <li>OKR/OGSM</li>
          <li>Scrum</li>
          <li>SEO</li>
        </ul>
      </div>
      <div class="card animation-fade-out tools">
        <h3>{{ t("words.tools") }}</h3>
        <ul>
          <li>Figma</li>
          <li>VScode</li>
          <li>Sourcetree</li>
          <li>Wordpress</li>
        </ul>
      </div>
      <div class="card animation-fade-out experience">
        <h3>{{ t("words.experience") }}</h3>
        <ul>
          <li v-for="(item, index) in experienceList" :key="index">
            <div>
              {{ item.title }}
            </div>
            <div>
              <span v-if="item.current">{{ t("words.current") }}</span>
              &nbsp;
              <span>{{ item.years }} {{ t("words.years") }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const { t } = useI18n();
const pageTitle = ref(t("words.home"));

// SEO
useHead({
  title: pageTitle,
  meta: [
    {
      hid: "og:title",
      property: "og:title",
      content: pageTitle.value + " - " + t("website.name"),
    },
    {
      hid: "twitter:title",
      name: "twitter:title",
      content: pageTitle.value + " - " + t("website.name"),
    },
  ],
});

const experienceList = computed(() => [
  {
    title: t("jobTitle.manager"),
    current: true,
    years: "2",
  },
  {
    title: t("jobTitle.supervisor"),
    current: false,
    years: "2",
  },
  {
    title: t("jobTitle.uiux"),
    current: false,
    years: "7",
  },
]);

const audioRef = ref<HTMLAudioElement | null>(null);

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.playbackRate = 1.25;
  }
});
</script>

<style scoped>
.page--index {
  @media screen and (width <= 768px) {
    padding: 0 0.5rem 1.5rem;
  }
}
.page-container {
  display: grid;
  gap: 1.5rem;
  grid-template:
    "l5 l5 l5 l5"
    "l1 l1 r1 r2"
    "l1 l1 r3 r4";
  @media screen and (width <= 1280px) {
    grid-template:
      "l5 l5 l5 l5"
      "l1 l1 l1 l1"
      "r1 r1 r2 r2"
      "r3 r3 r4 r4";
  }
  @media screen and (width <= 768px) {
    grid-template:
      "l5"
      "l1"
      "r1"
      "r2"
      "r3"
      "r4";
  }
}

#ak-container {
  position: absolute;
  top: 0;
  left: 0;
}

.card {
  background-color: oklch(var(--card-bg));
  border-radius: 1.5rem;
  padding: 3rem;
  position: relative;
  @media screen and (width <= 768px) {
    padding: 1.5rem;
  }
}

.intro {
  grid-area: l1;
}

.programming {
  grid-area: r1;
}

.promote {
  grid-area: r2;
}

.tools {
  grid-area: r3;
}

.experience {
  grid-area: r4;
  ul {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-left: 2rem;
  }
  li {
    display: flex;
    justify-content: space-between;
    position: relative;
    &:last-child {
      &:before {
        display: none;
      }
    }
    &:before {
      content: "";
      width: 1px;
      height: 100%;
      background-color: oklch(var(--border-color));
      position: absolute;
      top: 1.4rem;
      left: -1.3725rem;
    }
    &:after {
      content: "";
      width: 0.75rem;
      height: 0.75rem;
      background-color: oklch(var(--color-primary));
      border-radius: 50%;
      position: absolute;
      top: 0.5rem;
      left: -1.75rem;
    }
  }
}

.podcast {
  position: relative;
  grid-area: l5;
  .podcast-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    @media screen and (width <= 768px) {
      flex-direction: column;
    }
  }
  .audio-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }
  .icon {
    svg {
      width: 1.5rem;
    }
  }
}

ul,
ol {
  color: oklch(var(--wrapper-color));
  list-style: inherit;
  padding-left: 20px;
}
</style>
