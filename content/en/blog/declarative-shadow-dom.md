---
title: "Why Do Web Components Flash? Fixing It with Declarative Shadow DOM"
description: "A web component's Shadow DOM can't appear until JavaScript runs, so it flashes during SSR and vanishes entirely if JavaScript fails. Declarative Shadow DOM lets you write the shadow root straight into HTML. Using demos with JavaScript switched off, this post covers the syntax, how components should take over an existing root, the limits of dynamic insertion, and the traps I hit in Vue/Nuxt and how to get around them."
date: 2026-10-09
tags:
  - HTML
  - JavaScript
  - Web Components
  - Front-End
  - Browser Support
translationKey: declarative-shadow-dom
draft: false
---

> Up front: I tested the behavior in this post in Chromium; the Vue/Nuxt parts were tested with Vue's SSR and this site's Nuxt setup. Other frameworks may behave differently. If I've gotten something wrong, corrections welcome.

### Intro

Work with web components for a while and you'll hit this: the component "flashes" on screen.

The reason is simple: Shadow DOM can only be created with JavaScript. The HTML arrives and paints first, and at that point the component is empty and unstyled; only after JavaScript downloads and runs does the component "grow" its contents. If JavaScript fails to load or is turned off, the component disappears entirely. SSR with frameworks like Nuxt or Next is the same story: the server can output the component's tag, but not the Shadow DOM inside it.

Declarative Shadow DOM fixes exactly this. It's one of the few items in my [CSS & HTML cheat sheet](/en/blog/css-techniques-checklist) that's already 🟢 stable, yet rarely used.

First, here's what your browser supports:

::feature-support{features="dsd" notice="Your browser doesn't support Declarative Shadow DOM, so the declarative versions in the demos below will appear unstyled."}
::

### 1. The problem: what happens with JavaScript off?

Both iframes below start with **JavaScript disabled** (blocked with the `sandbox` attribute). The left uses the traditional approach, the right uses the declarative one, and the card's HTML content is identical:

::dsd-no-js-compare
::

The left side is just two unstyled bits of text run together, because the shadow root was never created. The right side shows the full card, styles included. Only after checking "Allow the iframes to run JavaScript" do they look the same.

This is the "flash" people see on a slow connection, and what they see when JavaScript fails to load.

### 2. The syntax: write the shadow root in HTML

The traditional way creates the shadow root in the component's JavaScript:

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

The declarative way writes it straight into HTML, wrapped in `<template shadowrootmode>`:

```html
<my-card>
  <template shadowrootmode="open">
    <style>.card { border: 2px solid #6042a0; }</style>
    <div class="card"><slot name="title"></slot></div>
  </template>
  <span slot="title">Three days in Kyoto</span>
</my-card>
```

When the browser parses the HTML and sees `<template shadowrootmode>`, it turns it into the parent element's shadow root, and the `<template>` itself disappears. A few things I confirmed in testing:

- **`shadowRoot` exists before the component is even defined with `customElements.define()`.**
- **Styles are still encapsulated**: styles inside the shadow don't leak out.
- **With `shadowrootmode="closed"`, reading `el.shadowRoot` from outside gives `null`**, just like a closed root created in JavaScript.

The `<template>` also takes these attributes:

| Attribute | Effect |
|---|---|
| `shadowrootdelegatesfocus` | Clicking the component itself hands focus to the first focusable element inside; handy for custom form controls |
| `shadowrootserializable` | Lets `getHTML({ serializableShadowRoots: true })` output the shadow root back as HTML |
| `shadowrootclonable` | Copies the shadow root along with `cloneNode()` |

Support starts at Chrome / Edge 111, Firefox 123 and Safari 16.4, and it's been Baseline since February 2024, so it's safe to use.

### 3. The key step: components should take over, not rebuild

This is where converting an existing web component to Declarative Shadow DOM most often goes wrong.

Many components call `attachShadow()` first thing in the constructor. In my tests, if the element **already has** a declarative shadow root, `attachShadow()` doesn't throw; it returns the same shadow root, **but empties it**. The content the server worked to render gets wiped by the component itself.

The two cards below have identical HTML, both drawn first by Declarative Shadow DOM, and the component's JavaScript deliberately arrives 1.5 seconds late:

::dsd-hydrate-compare
::

The left component calls `attachShadow()` right away, so the content is wiped and redrawn later, with a flash in between. The right one checks for an existing shadow root first and simply takes it over, so nothing on screen changes.

The right way looks like this:

```js
class MyCard extends HTMLElement {
  constructor() {
    super();
    // The server already built it with <template shadowrootmode>, so take it over
    const root = this.attachInternals().shadowRoot;
    if (!root) {
      // Only draw it yourself if there isn't one (e.g. components created in the browser)
      this.attachShadow({ mode: "open" }).innerHTML = `...`;
    }
  }
}
```

I use `attachInternals().shadowRoot` rather than `this.shadowRoot` because the former **also returns `closed` shadow roots**, which I confirmed in testing too.

### 4. Dynamic insertion: innerHTML won't do it

If content is inserted with JavaScript, note that `innerHTML` doesn't process Declarative Shadow DOM; `<template shadowrootmode>` just becomes an ordinary template:

| Method | Creates the shadow root? |
|---|---|
| `el.innerHTML = "..."` | No |
| `el.setHTMLUnsafe("...")` | Yes, but only for elements inside the string; **not the element you call it on** |
| `Document.parseHTMLUnsafe("...")` | Yes |

I found the `setHTMLUnsafe()` limit while testing: if the string starts directly with `<template shadowrootmode>` in the hope of making `el` itself the host, it won't work. An element inside the string has to be the host, as in `<my-card><template shadowrootmode>…</template></my-card>`.

### 5. Be careful in Vue/Nuxt

I assumed I could just write `<template shadowrootmode>` in a Vue template. Testing turned up three problems:

1. **Vue swallows `<slot>`**: Vue treats `<slot>` as its own slot syntax, so SSR outputs Vue slot markers instead of native `<slot>` elements, and the shadow root ends up with no slots.
2. **`<style>` doesn't match up**: the SSR output includes `<style>`, but the client-side template compile ignores it, which is another mismatch.
3. **Hydration doesn't match**: the browser already turned the `<template>` into a shadow root while parsing, but Vue on the client still expects a `<template>` there, so you get hydration mismatch warnings and an extra `<template>` inserted into the page.

The more reliable approach is to **keep Vue entirely unaware of the shadow root**: the Vue template contains only the component and its light DOM, and after SSR produces the full HTML, you insert `<template shadowrootmode>` right after the component's opening tag. In Nuxt, Nitro's `render:html` hook does this:

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

I verified this approach with Vue's SSR: no hydration warnings, the component took over the shadow root, it was styled with JavaScript off, and Vue's reactivity kept working. I also confirmed on this site's Nuxt setup that the `render:html` hook can rewrite `html.body`.

One caution: editing the HTML string with a regular expression only suits simple tags. With more components, you may need proper HTML parsing, or a tool built for web component SSR such as Lit SSR.

### 6. Trade-offs

Declarative Shadow DOM isn't free:

- **Styles are duplicated**: every component instance carries its own `<style>`, so 20 cards on a page means 20 copies. You can switch to shared `adoptedStyleSheets` after the component takes over, or accept the cost.
- **HTML gets bigger**: the shadow root's content is output into every instance.
- **Frameworks won't do it for you**: as the previous section showed, frameworks like Vue and React need extra handling.

So my recommendation: Declarative Shadow DOM is worth it for **components above the fold, with important content, or that should work without JavaScript**. Purely interactive components that aren't visible on first load can stay as they are.

### Conclusion

In a few lines:

- Traditional web components must wait for JavaScript, so they flash during SSR and vanish if JavaScript fails.
- Declarative Shadow DOM writes the shadow root into HTML with `<template shadowrootmode>`, and it's Baseline 2024.
- Components should check `attachInternals().shadowRoot` first and take it over, rather than wiping it with `attachShadow()`.
- For dynamic insertion, use `setHTMLUnsafe()` or `parseHTMLUnsafe()`; `innerHTML` won't work.
- In Vue/Nuxt, don't write it in templates; insert it after SSR output instead.

Writing these posts, I keep finding that the old idea of "make the HTML work first, then enhance with JavaScript" has never gone out of date. Declarative Shadow DOM finally lets web components do that too, which makes a real difference for people on slow networks, older devices, or assistive technology.

Do you use web components in your projects? I'd love to hear about it.

### Related reading

- [Make Screen Readers Speak: Replacing aria-live with ariaNotify()](/en/blog/aria-notify/)
- [How to Write a Dialog Today: From showModal() to command and closedby](/en/blog/dialog-modern-guide/)
- [Modern CSS & HTML Cheat Sheet: 102 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

### Related links

- [web.dev — Declarative Shadow DOM](https://web.dev/articles/declarative-shadow-dom "Open new window"){target="_blank"}
- [MDN — HTMLTemplateElement.shadowRootMode](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTemplateElement/shadowRootMode "Open new window"){target="_blank"}
- [Nuxt — Lifecycle Hooks (render:html)](https://nuxt.com/docs/4.x/guide/going-further/hooks "Open new window"){target="_blank"}
- [Can I use](https://caniuse.com "Open new window"){target="_blank"}
