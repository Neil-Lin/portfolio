<template>
  <header :class="[headerClass, isScrolled ? 'scrolled' : '']">
    <a id="ak-jump" href="#ak-container" :title="$t('shortcut.skipToContent')">
      {{ $t("shortcut.skipToContent") }}
    </a>
    <h1 class="visually-hidden">{{ $t("website.name") }}</h1>
    <div class="header-container">
      <div class="left">
        <a
          id="ak-header"
          href="#ak-header"
          :title="$t('shortcut.header')"
          accesskey="U"
        >
          :::
        </a>

        <div class="logo">
          <nuxt-link :to="localePath('/')" :title="$t('action.goToHomePage')">
            <img src="@/assets/images/avatar.webp" :alt="$t('words.avatar')" />
            <div class="slogan intro">
              <span>{{ formatAMPM(new Date()) }}</span>
              <span>{{ $t("intro.greet") }}</span>
            </div>
            <span class="visually-hidden">回首頁</span>
          </nuxt-link>
        </div>
      </div>
      <div class="right">
        <div class="intro">
          <p>{{ $t("intro.des1") }}</p>
          <br />
        </div>
        <nav :aria-label="$t('mainMenu.mainMenu')" class="main-menu">
          <ul>
            <li v-for="(item, index) in mainMenuList" :key="index">
              <nuxt-link
                :to="localePath(item.link)"
                :title="`${$t('action.goTo')} ${item.title}`"
                class="btn"
              >
                {{ item.title }}
              </nuxt-link>
            </li>
          </ul>
        </nav>
      </div>
      <div class="sub-menu">
        <theLangSwitcher />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

const formatAMPM = (date) => {
  const hours = date.getHours();
  let ampm;
  if (hours < 12 && hours > 5) {
    ampm = t("action.morning");
  } else if (hours >= 12 && hours < 20) {
    ampm = t("action.afternoon");
  } else {
    ampm = t("action.evening");
  }
  return ampm;
};

const mainMenuList = computed(() => [
  {
    link: "/sitemap",
    title: t("mainMenu.sitemap"),
  },
  {
    link: "/products",
    title: t("mainMenu.products"),
  },
  {
    link: "/projects",
    title: t("mainMenu.projects"),
  },
  {
    link: "/blog",
    title: t("mainMenu.blog"),
  },
]);

// 🔥 依據目前頁面設定 `header` 的 `class`
const headerClass = computed(() => {
  if (route.path === "/" || route.path === "/en") {
    return;
  } else {
    return "collapsed";
  }
});

const isScrolled = ref(false);
let lastScrollPosition = 0; // 儲存最後的滾動位置
const scrollUpThreshold = 10; // 向上滾動的閾值

const handleScroll = () => {
  const headerHeight =
    document.querySelector("header")?.getBoundingClientRect().height || 0;
  const currentScrollPosition = window.scrollY;

  if (currentScrollPosition > headerHeight) {
    // 若滾動超過 header 高度且向下滾動，isScrolled 設為 true
    if (currentScrollPosition > lastScrollPosition) {
      isScrolled.value = true;
    } else if (lastScrollPosition - currentScrollPosition > scrollUpThreshold) {
      // 向上滾動超過閾值，將 isScrolled 設為 false
      isScrolled.value = false;
    }
  } else {
    // 若滾動未超過 header 高度，則保持 isScrolled 為 false
    isScrolled.value = false;
  }

  // 更新最後的滾動位置
  lastScrollPosition = currentScrollPosition;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
</script>

<style scoped>
header {
  width: 100%;
  margin: 0 auto;
  padding: 0 4rem 1.5rem;
  transition: transform 120ms ease-in;
  @media screen and (width <= 768px) {
    padding: 0 0.5rem 1.5rem;
  }
  &.collapsed {
    position: sticky;
    top: 0;
    z-index: 1;
    &.scrolled {
      transform: translate3d(0, -100%, 0);
    }
  }
}

#ak-header {
  position: absolute;
  top: 0;
  left: 0;
  width: max-content;
}

.sub-menu {
  position: absolute;
  top: 1.5rem;
  right: 1rem;
  width: max-content;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.header-container {
  position: relative;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
  background-color: oklch(var(--header-bg));
  border-radius: 1.5rem;
  align-items: center;
  padding: 5rem 3rem 3rem;
  margin-top: 1rem;
  transition: padding 120ms linear;
  @media screen and (width <= 768px) {
    gap: 1rem;
    padding: 1.5rem;
  }
  .left {
    grid-column: 1 / 6;
    display: grid;
    place-content: center;
    gap: 1rem;
    @media screen and (width <= 768px) {
      grid-column: 1 / -1;
    }
  }
  .right {
    grid-column: 6 / -1;
    @media screen and (width <= 768px) {
      grid-column: 1 / -1;
    }
  }
  .logo {
    a {
      display: flex;
      gap: 1rem;
      align-items: center;
      text-decoration: none;
    }
    img {
      width: 4rem;
      height: 4rem;
      border-radius: 50%;
      object-fit: contain;
    }
    .slogan {
      font-size: clamp(1.75rem, calc(100cqw / 40), 3rem);
      text-wrap: pretty;
      font-weight: bold;
      text-transform: capitalize;
      color: oklch(var(--title-color));
      span {
        display: inline-block;
      }
    }
    @media screen and (width <= 768px) {
      padding-top: 3rem;
    }
  }
  .main-menu {
    ul {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      position: relative;
      a {
        text-transform: capitalize;
        position: relative;
        &.router-link-active {
          @media (prefers-color-scheme: dark) {
            border: 2px solid oklch(var(--border-color));
          }
          &:before {
            content: "👀";
            position: absolute;
            top: -0.875rem;
            left: -0.875rem;
            font-size: 0.75rem;
            padding: 0.25rem 1rem;
            border-radius: 1.25rem;
            color: oklch(var(--color-white));
            background: linear-gradient(
              90deg,
              oklch(var(--color-primary)),
              oklch(var(--color-primary) / 70%),
              oklch(var(--color-primary))
            );
            background-size: 200% 200%;
            animation: now-watching-badge 5000ms linear infinite;
          }
          &:after {
            box-shadow: 0 0 0 0.25rem oklch(var(--color-primary));
          }
        }
      }
    }
  }
  .collapsed & {
    padding: 1rem;
    display: flex;
    justify-content: space-evenly;
    box-shadow: var(--box-shadow);
    @media (prefers-color-scheme: dark) {
      box-shadow: none;
    }
    @media screen and (width <= 1280px) {
      display: block;
      white-space: nowrap;
      overflow: auto;
      scrollbar-width: none;
    }
    .intro {
      display: none;
    }
    .slogan {
      font-size: clamp(1.25rem, calc(100cqw / 40), 2rem);
    }
    .left {
      display: flex;
      align-items: center;
      @media screen and (width <= 1280px) {
        display: inline-block;
        vertical-align: middle;
      }
      .logo {
        @media screen and (width <= 1280px) {
          display: inline-block;
          vertical-align: middle;
        }
        @media screen and (width <= 768px) {
          padding-top: 0;
        }
      }
    }
    .right {
      @media screen and (width <= 1280px) {
        display: inline-block;
        vertical-align: middle;
      }
      .main-menu {
        ul {
          @media screen and (width <= 1280px) {
            display: block;
          }
        }
        li {
          @media screen and (width <= 1280px) {
            display: inline-block;
            vertical-align: middle;
            margin-left: 1rem;
          }
        }
      }
    }
    .sub-menu {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      margin-left: 2rem;
      top: 0;
    }
  }
}
</style>
