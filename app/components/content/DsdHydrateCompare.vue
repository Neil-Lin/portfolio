<template>
  <div class="dsd-demo dialog-demo">
    <p class="dialog-demo__label">{{ text.label }}</p>

    <button type="button" class="dialog-demo__close" @click="replay++">
      {{ text.replay }}
    </button>

    <div class="dsd-demo__grid">
      <figure class="dsd-demo__frame">
        <figcaption>{{ text.wrong }}</figcaption>
        <iframe
          :key="`wrong-${replay}-${locale}`"
          :title="text.wrong"
          sandbox="allow-scripts"
          :srcdoc="wrongDoc"
          loading="lazy"
        ></iframe>
      </figure>
      <figure class="dsd-demo__frame">
        <figcaption>{{ text.right }}</figcaption>
        <iframe
          :key="`right-${replay}-${locale}`"
          :title="text.right"
          sandbox="allow-scripts"
          :srcdoc="rightDoc"
          loading="lazy"
        ></iframe>
      </figure>
    </div>
    <p class="popover-demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：元件定義晚到時，「直接 attachShadow」與「接手既有 shadow root」的差別
// 用法：::dsd-hydrate-compare
const { locale } = useI18n();
const replay = ref(0);

const messages = {
  "zh-Hant-TW": {
    label: "互動範例：兩張卡片的 HTML 都一樣，元件的 JavaScript 1.5 秒後才載入",
    replay: "重播",
    wrong: "直接 attachShadow()",
    right: "先檢查，有就接手",
    print: "此處為互動範例，請在網頁上操作。",
    doc: {
      lang: "zh-Hant",
      title: "京都三日行程",
      body: "清水寺、伏見稻荷、嵐山",
      note: "",
      waiting:
        "元件 JavaScript：<b>載入中…</b>（現在看到的是 HTML 直接畫出來的）",
      kept: "元件 JavaScript：<b>已載入</b>，接手既有的 shadow root，畫面沒有變化",
      wiped: "元件 JavaScript：<b>已載入</b>，attachShadow() 把內容清空了",
      rerendered: "元件自己重新畫出內容，但中間已經閃了一下",
    },
  },
  en: {
    label:
      "Live demo: both cards have identical HTML; the component's JavaScript arrives 1.5 seconds later",
    replay: "Replay",
    wrong: "attachShadow() right away",
    right: "Check first, reuse if present",
    print: "This is an interactive demo. Try it on the web page.",
    doc: {
      lang: "en",
      title: "Three days in Kyoto",
      body: "Kiyomizu-dera, Fushimi Inari, Arashiyama",
      note: "",
      waiting:
        "Component JavaScript: <b>loading…</b> (what you see is drawn straight from the HTML)",
      kept: "Component JavaScript: <b>loaded</b>, reused the existing shadow root; nothing changed",
      wiped:
        "Component JavaScript: <b>loaded</b>, attachShadow() wiped the content",
      rerendered: "The component redrew its content, but it already flashed",
    },
  },
};

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);

const wrongDoc = computed(() => hydrateDoc(text.value.doc, "wrong"));
const rightDoc = computed(() => hydrateDoc(text.value.doc, "right"));
</script>
