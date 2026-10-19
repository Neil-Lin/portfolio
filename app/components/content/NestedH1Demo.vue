<template>
  <div class="nested-h1-demo demo">
    <p class="demo__label">{{ text.label }}</p>

    <label class="demo__option">
      <input v-model="authored" type="checkbox" />
      <span>{{ text.authored }}</span>
    </label>

    <div class="nested-h1-demo__grid">
      <figure
        v-for="col in columns"
        :key="col.key"
        class="nested-h1-demo__col"
        :class="`is-${col.key}`"
      >
        <figcaption>{{ col.caption }}</figcaption>
        <!-- 只是畫面示意：裡面的 h1 不放進無障礙樹，免得這一頁多出好幾個 h1；實際層級寫在下方表格 -->
        <div
          :ref="(el) => setSample(col.key, el)"
          class="nested-h1-demo__sample"
          aria-hidden="true"
        >
          <h1 :style="authoredStyle">h1</h1>
          <section>
            <span class="nested-h1-demo__tag">&lt;section&gt;</span>
            <h1 :style="authoredStyle">h1</h1>
            <article>
              <span class="nested-h1-demo__tag">&lt;article&gt;</span>
              <h1 :style="authoredStyle">h1</h1>
              <aside>
                <span class="nested-h1-demo__tag">&lt;aside&gt;</span>
                <h1 :style="authoredStyle">h1</h1>
              </aside>
            </article>
          </section>
        </div>
      </figure>
    </div>

    <div class="nested-h1-demo__table">
      <table>
        <caption>
          {{
            text.caption
          }}
        </caption>
        <thead>
          <tr>
            <th scope="col">{{ text.depth }}</th>
            <th scope="col">{{ text.old }}</th>
            <th scope="col">{{ text.now }}</th>
            <th scope="col">{{ text.sr }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rows" :key="i">
            <th scope="row">{{ text.depths[i] }}</th>
            <td>{{ row.old }}</td>
            <td>{{ row.now }}</td>
            <td>{{ text.level1 }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：h1 放在 section／article／aside 裡，舊的瀏覽器預設樣式會一層層縮小，新的不會
// 用法：::nested-h1-demo
type Key = "old" | "now";

const { locale } = useI18n();
const authored = ref(false);
// 作者樣式一定比瀏覽器預設優先；範例裡用 inline style 模擬，才不會跟模擬的舊預設樣式比權重
const authoredStyle = computed(() =>
  authored.value ? { fontSize: "1.5rem" } : undefined,
);
const samples = new Map<Key, HTMLElement>();
const sizes = ref<Record<Key, string[]>>({ old: [], now: [] });

function setSample(key: Key, el: unknown) {
  if (el instanceof HTMLElement) samples.set(key, el);
}

const messages = {
  "zh-Hant-TW": {
    label:
      "互動範例：同樣的 HTML，左邊套舊的瀏覽器預設樣式，右邊是現在的預設樣式",
    authored: "模擬網站自己寫了 h1 的字級（h1 { font-size: 1.5rem; }）",
    oldCaption: "舊的預設樣式（模擬）",
    nowCaption: "現在的預設樣式",
    caption: "每一層 h1 的畫面字級，和報讀軟體唸出的層級",
    depth: "位置",
    old: "舊的預設字級",
    now: "現在的預設字級",
    sr: "報讀軟體唸",
    depths: ["最外層", "section 裡", "section > article 裡", "再加一層 aside"],
    level1: "標題 1",
    print: "此處為互動範例，請在網頁上操作。",
  },
  en: {
    label:
      "Live demo: the same HTML, with the old browser default styles on the left and today's defaults on the right",
    authored:
      "Simulate the site setting its own h1 size (h1 { font-size: 1.5rem; })",
    oldCaption: "Old default styles (simulated)",
    nowCaption: "Today's default styles",
    caption:
      "On-screen size of each h1, and the level a screen reader announces",
    depth: "Where",
    old: "Old default size",
    now: "Today's default size",
    sr: "Screen reader says",
    depths: [
      "Top level",
      "In a section",
      "In section > article",
      "Plus an aside",
    ],
    level1: "Heading level 1",
    print: "This is an interactive demo. Try it on the web page.",
  },
};

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);

const columns = computed(() => [
  { key: "old" as const, caption: text.value.oldCaption },
  { key: "now" as const, caption: text.value.nowCaption },
]);

const rows = computed(() =>
  [0, 1, 2, 3].map((i) => ({
    old: sizes.value.old[i] ?? "—",
    now: sizes.value.now[i] ?? "—",
  })),
);

async function measure() {
  await nextTick();
  const next: Record<Key, string[]> = { old: [], now: [] };
  samples.forEach((el, key) => {
    next[key] = [...el.querySelectorAll("h1")].map(
      (h) =>
        `${Math.round(parseFloat(getComputedStyle(h).fontSize) * 10) / 10}px`,
    );
  });
  sizes.value = next;
}

watch(authored, measure);
onMounted(measure);
</script>
