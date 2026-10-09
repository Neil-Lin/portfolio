<template>
  <div class="dsd-demo dialog-demo">
    <p class="dialog-demo__label">{{ text.label }}</p>

    <label class="until-found-faq__sync">
      <input v-model="allowScripts" type="checkbox" />
      {{ text.toggle }}
    </label>

    <div class="dsd-demo__grid">
      <figure class="dsd-demo__frame">
        <figcaption>{{ text.imperative }}</figcaption>
        <iframe
          :key="`imp-${allowScripts}-${locale}`"
          :title="text.imperative"
          :sandbox="allowScripts ? 'allow-scripts' : ''"
          :srcdoc="imperative"
          loading="lazy"
        ></iframe>
      </figure>
      <figure class="dsd-demo__frame">
        <figcaption>{{ text.declarative }}</figcaption>
        <iframe
          :key="`dec-${allowScripts}-${locale}`"
          :title="text.declarative"
          :sandbox="allowScripts ? 'allow-scripts' : ''"
          :srcdoc="declarative"
          loading="lazy"
        ></iframe>
      </figure>
    </div>
    <p class="popover-demo__print">{{ text.print }}</p>
  </div>
</template>

<script setup lang="ts">
// 部落格文章用：關掉 JavaScript 時，傳統 Web Component 與宣告式 Shadow DOM 的差別
// 用法：::dsd-no-js-compare
const { locale } = useI18n();
const allowScripts = ref(false);

const messages = {
  "zh-Hant-TW": {
    label: "互動範例：兩個 iframe 一開始都不允許執行 JavaScript",
    toggle: "允許 iframe 執行 JavaScript",
    imperative: "傳統寫法：attachShadow()",
    declarative: "宣告式：<template shadowrootmode>",
    print: "此處為互動範例，請在網頁上操作。",
    card: {
      lang: "zh-Hant",
      title: "京都三日行程",
      body: "清水寺、伏見稻荷、嵐山",
    },
    noteOff: "目前 JavaScript：<b>關閉</b>",
    noteOn: "目前 JavaScript：<b>開啟</b>",
  },
  en: {
    label: "Live demo: both iframes start with JavaScript disabled",
    toggle: "Allow the iframes to run JavaScript",
    imperative: "Imperative: attachShadow()",
    declarative: "Declarative: <template shadowrootmode>",
    print: "This is an interactive demo. Try it on the web page.",
    card: {
      lang: "en",
      title: "Three days in Kyoto",
      body: "Kiyomizu-dera, Fushimi Inari, Arashiyama",
    },
    noteOff: "JavaScript: <b>off</b>",
    noteOn: "JavaScript: <b>on</b>",
  },
};

const text = computed(() =>
  locale.value === "en" ? messages.en : messages["zh-Hant-TW"],
);

const card = computed(() => ({
  ...text.value.card,
  note: allowScripts.value ? text.value.noteOn : text.value.noteOff,
}));
const imperative = computed(() => imperativeCardDoc(card.value));
const declarative = computed(() => declarativeCardDoc(card.value));
</script>
