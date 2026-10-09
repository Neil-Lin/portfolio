---
title: Web Component 為什麼會閃一下？用宣告式 Shadow DOM 解決
description: "Web Component 的 Shadow DOM 一定要等 JavaScript 跑完才會出現，所以 SSR 時會閃一下，JavaScript 沒載入就整個不見。宣告式 Shadow DOM 讓你直接在 HTML 寫出 shadow root。這篇用關掉 JavaScript 的對照範例說明寫法、元件怎麼接手、動態插入的限制，以及在 Vue／Nuxt 裡實測踩到的坑和解法。"
date: 2026-10-09
tags:
  - HTML
  - JavaScript
  - Web Components
  - 前端開發
  - 瀏覽器支援
translationKey: declarative-shadow-dom
category: frontend
draft: false
---

> 話說在前頭：文中的行為我都在 Chromium 上實測過，Vue／Nuxt 的部分是用 Vue 的 SSR 和這個網站的 Nuxt 實測的，其他框架的狀況可能不同，有講錯的地方歡迎指正。

### 前言

做 Web Component 一陣子之後，一定會遇到這個問題：元件在畫面上會「閃一下」。

原因很單純：Shadow DOM 只能用 JavaScript 建立。HTML 先到、畫面先畫出來，這時候元件裡面是空的、也沒有樣式；等 JavaScript 下載、執行完，元件才「長」出來。如果 JavaScript 載入失敗或被關掉，元件就整個不見了。用 Nuxt、Next 這類框架做 SSR 也一樣，伺服器只能輸出元件的標籤，輸出不了裡面的 Shadow DOM。

宣告式 Shadow DOM（Declarative Shadow DOM）就是在解決這件事。它是 [CSS 與 HTML 技巧清單](/blog/css-techniques-checklist)裡少數已經 🟢 穩定、卻很少人在用的項目。

先看一下你的瀏覽器支援度：

::feature-support{features="dsd" notice="你的瀏覽器不支援宣告式 Shadow DOM，下方範例的宣告式寫法會顯示成沒有樣式的狀態。"}
::

### 一、先看問題：關掉 JavaScript 會怎樣？

下面兩個 iframe 一開始都**不允許執行 JavaScript**（用 `sandbox` 屬性擋掉）。左邊是傳統寫法，右邊是宣告式寫法，卡片的 HTML 內容一模一樣：

::dsd-no-js-compare
::

左邊只剩兩段沒有樣式的文字黏在一起，因為 shadow root 根本沒有被建立；右邊卡片完整顯示，連樣式都在。勾選「允許執行 JavaScript」之後，兩邊才會長得一樣。

這就是一般使用者在網路慢的時候看到的「閃一下」，也是 JavaScript 載入失敗時會看到的畫面。

### 二、寫法：把 shadow root 寫在 HTML 裡

傳統寫法是在元件的 JavaScript 裡建立 shadow root：

```js
class MyCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = `
      <style>.card { border: 2px solid #6042a0; }</style>
      <div class="card"><slot name="title"></slot></div>
    `;
  }
}
```

宣告式寫法則是直接寫在 HTML，用 `<template shadowrootmode>` 包起來：

```html
<my-card>
  <template shadowrootmode="open">
    <style>.card { border: 2px solid #6042a0; }</style>
    <div class="card"><slot name="title"></slot></div>
  </template>
  <span slot="title">京都三日行程</span>
</my-card>
```

瀏覽器在解析 HTML 時，一看到 `<template shadowrootmode>` 就會把它變成父元素的 shadow root，`<template>` 本身會消失。我實測確認了幾件事：

- **元件還沒定義（`customElements.define()`）之前，`shadowRoot` 就已經存在了**。
- **樣式一樣是隔離的**：shadow 裡的樣式不會影響外面。
- **`shadowrootmode="closed"` 時，外部讀 `el.shadowRoot` 會是 `null`**，跟用 JavaScript 建立的 closed 一樣。

`<template>` 還可以加這幾個屬性：

| 屬性 | 效果 |
|---|---|
| `shadowrootdelegatesfocus` | 點到元件本身時，焦點交給裡面第一個可以聚焦的元素，做自訂表單元件很實用 |
| `shadowrootserializable` | 讓 `getHTML({ serializableShadowRoots: true })` 可以把 shadow root 一起輸出回 HTML |
| `shadowrootclonable` | `cloneNode()` 時連 shadow root 一起複製 |

支援度方面，Chrome / Edge 111、Firefox 123、Safari 16.4 起支援，2024 年 2 月起成為 Baseline，可以放心使用。

### 三、最重要的一步：元件要「接手」，不要重建

把現有的 Web Component 改成支援宣告式 Shadow DOM 時，最容易踩的坑在這裡。

很多元件的 constructor 一開始就是 `attachShadow()`。我實測發現，如果元素上**已經有**宣告式的 shadow root，`attachShadow()` 不會報錯，而是回傳同一個 shadow root，**但會把裡面的內容清空**。等於伺服器辛苦畫好的內容，被元件自己清掉了。

下面兩張卡片的 HTML 一模一樣，都用宣告式 Shadow DOM 先畫出來；元件的 JavaScript 刻意晚 1.5 秒才載入：

::dsd-hydrate-compare
::

左邊的元件直接 `attachShadow()`，內容被清空，之後才重新畫出來，中間就閃了一下；右邊先檢查有沒有現成的 shadow root，有就直接接手，畫面完全沒變。

正確的寫法是這樣：

```js
class MyCard extends HTMLElement {
  constructor() {
    super();
    // 伺服器已經用 <template shadowrootmode> 建好了，就直接接手
    const root = this.attachInternals().shadowRoot;
    if (!root) {
      // 沒有的話（例如在瀏覽器裡用 JavaScript 建立的元件），才自己畫
      this.attachShadow({ mode: "open" }).innerHTML = `...`;
    }
  }
}
```

這裡用 `attachInternals().shadowRoot` 而不是 `this.shadowRoot`，是因為前者**連 `closed` 模式的 shadow root 都拿得到**，我也實測確認過。

### 四、動態插入：innerHTML 不行

如果內容是用 JavaScript 插進頁面的，要注意 `innerHTML` 不會處理宣告式 Shadow DOM，`<template shadowrootmode>` 只會變成一個普通的 template：

| 方法 | 會不會建立 shadow root |
|---|---|
| `el.innerHTML = "..."` | 不會 |
| `el.setHTMLUnsafe("...")` | 會，但只限字串裡的子元素；**被呼叫的那個元素本身不會** |
| `Document.parseHTMLUnsafe("...")` | 會 |

`setHTMLUnsafe()` 那個限制是我實測時發現的：如果字串最外層直接就是 `<template shadowrootmode>`，想讓 `el` 自己變成 host，是不會成功的；要像 `<my-card><template shadowrootmode>…</template></my-card>` 這樣，讓字串裡的元素當 host 才行。

### 五、在 Vue／Nuxt 裡用要小心

我原本以為在 Vue 的模板裡直接寫 `<template shadowrootmode>` 就好，實測之後發現三個問題：

1. **`<slot>` 會被 Vue 吃掉**：Vue 把 `<slot>` 當成自己的插槽語法，SSR 輸出的是 Vue 插槽的標記，不是原生的 `<slot>`，shadow root 裡就沒有插槽了。
2. **`<style>` 兩邊不一致**：SSR 輸出的 HTML 裡有 `<style>`，但瀏覽器端編譯模板時會把它忽略掉，又是一個對不上的地方。
3. **hydration 對不上**：瀏覽器解析 HTML 時已經把 `<template>` 變成 shadow root 了，但 Vue 在瀏覽器端還以為那裡有一個 `<template>`，結果出現 hydration mismatch 警告，還在頁面上多插了一個 `<template>`。

比較穩的做法是**讓 Vue 完全不知道 shadow root 的存在**：Vue 模板只寫元件和 light DOM，等 SSR 產生完整的 HTML 之後，再把 `<template shadowrootmode>` 插到元件標籤後面。在 Nuxt 裡可以用 Nitro 的 `render:html` hook 做到：

```ts
// server/plugins/declarative-shadow-dom.ts
const MY_CARD_SHADOW = `<template shadowrootmode="open">
  <style>.card { border: 2px solid #6042a0; }</style>
  <div class="card"><slot name="title"></slot></div>
</template>`;

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("render:html", (html) => {
    html.body = html.body.map((chunk) =>
      chunk.replace(/<my-card(\s[^>]*)?>/g, (tag) => tag + MY_CARD_SHADOW),
    );
  });
});
```

這個思路我用 Vue 的 SSR 驗證過：沒有任何 hydration 警告、元件成功接手 shadow root、關掉 JavaScript 也有樣式，Vue 的響應式也照常運作；`render:html` hook 可以改寫 `html.body` 這點，我也在這個網站的 Nuxt 上確認過。

要注意的是，這裡用正規表示式改 HTML 字串，只適合標籤很單純的情況；元件多了，可能會需要更完整的 HTML 解析，或是改用 Lit SSR 這類專門處理 Web Component SSR 的工具。

### 六、取捨

宣告式 Shadow DOM 不是沒有代價：

- **樣式會重複**：每個元件實例都要帶一份 `<style>`，頁面上有 20 張卡片就有 20 份。可以在元件接手之後改用 `adoptedStyleSheets` 共用，或是接受這個成本。
- **HTML 會變大**：shadow root 的內容會被輸出到每一個實例裡。
- **框架不會自動幫你做**：就像上一節，Vue、React 這類框架都需要額外處理。

所以我的建議是：**會出現在首屏、內容重要、或需要在沒有 JavaScript 時也能用的元件**，值得用宣告式 Shadow DOM；純互動、首屏看不到的元件，維持原本的寫法就好。

### 結論

整理成幾句話：

- 傳統 Web Component 一定要等 JavaScript，SSR 時會閃一下，JavaScript 失敗就不見。
- 宣告式 Shadow DOM 用 `<template shadowrootmode>` 把 shadow root 寫在 HTML 裡，已經是 Baseline 2024。
- 元件要先用 `attachInternals().shadowRoot` 檢查，有就接手，不要直接 `attachShadow()` 把內容清空。
- 動態插入要用 `setHTMLUnsafe()` 或 `parseHTMLUnsafe()`，`innerHTML` 不行。
- 在 Vue／Nuxt 裡，不要直接寫在模板，改在 SSR 輸出之後插入。

這幾篇寫下來，越來越覺得「先讓 HTML 能用，JavaScript 再來加強」這個老觀念一直都沒過時。宣告式 Shadow DOM 讓 Web Component 也終於能做到這件事，對網路慢、裝置舊，或是用輔助科技的使用者來說，都是實實在在的差別。

你的專案裡有在用 Web Component 嗎？歡迎一起討論！

### 延伸閱讀

- [讓報讀軟體開口說話：用 ariaNotify() 取代 aria-live](/blog/aria-notify/)
- [現在的 dialog 要怎麼寫？從 showModal() 到 command、closedby 一次整理](/blog/dialog-modern-guide/)
- [現代 CSS 與 HTML 技巧整理清單：102 個特性、支援度與實驗優先序](/blog/css-techniques-checklist/)

### 相關連結

- [web.dev — 宣告式 Shadow DOM](https://web.dev/articles/declarative-shadow-dom?hl=zh-tw "另開新視窗"){target="_blank"}
- [MDN — HTMLTemplateElement.shadowRootMode](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTemplateElement/shadowRootMode "另開新視窗"){target="_blank"}
- [Nuxt — Lifecycle Hooks（render:html）](https://nuxt.com/docs/4.x/guide/going-further/hooks "另開新視窗"){target="_blank"}
- [Can I use（瀏覽器支援度查詢）](https://caniuse.com "另開新視窗"){target="_blank"}
