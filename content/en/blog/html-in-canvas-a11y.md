---
title: "Testing HTML-in-Canvas for Accessibility: Screen Readers Can Read It Now, but You Still Need to Handle Four Things"
description: "Since Chrome 157, HTML can be drawn straight into a <canvas>. The forms and buttons you draw stay in the accessibility tree, and the keyboard and find-in-page still work. I tested it item by item in Chromium 157: most of what the docs say holds up, but undrawn content, unsupported browsers, zoom, and 3D position syncing are still up to you."
date: 2026-11-06
tags:
  - HTML
  - JavaScript
  - Front-End
  - Accessibility
  - Browser Support
category: accessibility
translationKey: html-in-canvas-a11y
draft: true
---

> Up front: this post was researched and drafted with help from AI (Anthropic's Claude), then read and checked by me. The behavior described was tested in Chromium 157 (the Chrome 157 branch point), 159, and 153; specs, official statements, and support are based on the WICG explainer, Chrome's documentation, MDN, W3C specs, and Chromium source linked at the end. If I've gotten something wrong, corrections welcome.

## What it solves

Anything drawn on a `<canvas>` used to be just a bitmap. Screen readers couldn't read it, the keyboard couldn't reach it, and find-in-page couldn't find it. To make a canvas interface accessible, you had to build a separate hidden copy in HTML and keep it in sync by hand.

HTML-in-Canvas lets you draw **real HTML** into a canvas. The forms and buttons you draw are still DOM, and still in the accessibility tree. Chrome supports it from version 157.

## The basics

```html
<canvas id="canvas" content="drawable">
  <form id="card" drawable>
    <label for="email">Email</label>
    <input id="email" type="email">
    <button>Subscribe</button>
  </form>
</canvas>
```

```js
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const card = document.getElementById("card");

// When the card changes (typing, focus moving), the browser fires paint
canvas.onpaint = () => {
  ctx.reset();
  ctx.drawElementImage(card, 0, 0);
};
```

- Add `content="drawable"` to the `<canvas>` so the HTML inside gets laid out.
- Add `drawable` to the elements you want to draw, then draw them with `drawElementImage()`.
- Before Chrome 157 the attribute was `layoutsubtree`; from 157 only `content="drawable"` remains, and a few other names changed in September 2026. Older tutorials may still use the old names.

## Live demo

First, check what your browser supports:

::feature-support{features="html-in-canvas" notice="Your browser doesn't support HTML-in-Canvas, so the demo below shows plain HTML instead, without the comparison for undrawn content."}
::

::html-in-canvas-demo
::

## What the docs say, confirmed by testing

In Chromium 157, I tested a form drawn into a canvas (a label, an input, a button, and a line of text) item by item:

| Item | Result |
|---|---|
| Accessibility tree | The form, label, input (named “Email”), button, and text are all there |
| Keyboard | Tab, typing, and Enter to submit all work |
| Focus ring | The `:focus-visible` outline is drawn into the canvas |
| Mouse clicks | Clicking the drawn button hits that button, even with the card rotated 30 degrees |
| Find-in-page | Matches are found, and the highlight is drawn into the canvas |
| Text selection | You can select text by dragging |
| Dark mode | Drawn in dark colors following the page's `color-scheme` |

**Clicks still land after rotation because with 2D `drawElementImage()`, the browser automatically updates the element's position to where it was drawn.** Chrome's documentation says this position is used for hit testing and is also reported to assistive technology such as magnifiers.

## Four things you need to handle yourself

### 1. Undrawn content: use `hidden`

A canvas often holds content that isn't showing yet, such as another screen. These elements have `drawable` but aren't drawn: **you can't see them, but the keyboard can still reach them**, so focus lands somewhere invisible. Sighted keyboard users lose track of where they are (WCAG 2.4.7 Focus Visible).

Chrome's documentation says undrawn elements stay in the accessibility tree so screen readers can read them, and that you can hide them with `aria-hidden="true"` or `inert`. I tested three ways to hide them:

| Hiding method | Screen readers can read it | Tab can reach it | Find-in-page finds it |
|---|---|---|---|
| Nothing | Yes | **Yes** | Yes |
| `aria-hidden="true"` | No (read once focus moves in; see below) | **Yes** | Yes |
| `inert` | **Yes** | No | No |
| `hidden` | No | No | No |

- **`aria-hidden` doesn't stop Tab.** The W3C ARIA in HTML spec says `aria-hidden` must not be used on focusable elements. When focus moves inside, Chrome ignores `aria-hidden` and logs the console warning “Blocked aria-hidden on an element because its descendant retained focus”, so screen readers end up reading it anyway. It isn't really hidden.
- **`inert` inside a canvas isn't removed from the accessibility tree**, while the same `inert` outside a canvas is. This differs from Chrome's documentation and may be a Chrome bug.
- **`hidden` is the cleanest** and blocks all three. Use `hidden` for undrawn content, or remove it from the DOM.
- **But CSS can override `hidden`**: `hidden` relies on the browser's default `display: none`, so if the element has a style like `display: grid`, `hidden` stops working and Tab still gets in. I ran into this while building the demo; add `[hidden] { display: none; }`. Inside a canvas it's even harder to notice, because the element is invisible anyway.

`clearElementGeometry()` (which stops the element from being hit-tested) is the same: after calling it, I could no longer click it, but Tab still reached it.

### 2. Unsupported browsers: detect first, fall back to plain HTML

Only Chrome supports this so far. In unsupported browsers, elements inside `<canvas>` are “fallback content”: **invisible on screen, but reachable with Tab**. Testing in Chromium 153, which doesn't support it, focus moved onto the invisible input and button.

So you can't just put the content in a canvas and call it done. Detect support first, and show the content as plain HTML when it isn't supported (the demo does this):

```js
if ("content" in HTMLCanvasElement.prototype) {
  // Supported: put it in <canvas content="drawable">
} else {
  // Not supported: show the same content as plain HTML
}
```

This is the detection from Chrome's official guide. In my tests it returned false in Chromium 153 and true in 157 and 159.

### 3. Zoom: keep the canvas grid on device pixels

`drawElementImage()` takes positions and sizes in canvas grid pixels, not CSS pixels. Chrome's documentation recommends reading `devicePixelContentBoxSize` with a `ResizeObserver` so the canvas grid lines up with device pixels; otherwise drawn text is blurry. It also notes that **the grid changes when the user zooms the page**, so you can't hard-code it.

```js
let scale = 1; // canvas grid pixels per CSS pixel

new ResizeObserver(([entry]) => {
  const dpc = entry.devicePixelContentBoxSize?.[0];
  canvas.width = dpc ? dpc.inlineSize : Math.round(entry.contentRect.width * devicePixelRatio);
  canvas.height = dpc ? dpc.blockSize : Math.round(entry.contentRect.height * devicePixelRatio);
  scale = canvas.width / entry.contentRect.width;
  canvas.requestPaint();
}).observe(canvas, { box: "device-pixel-content-box" });
```

Sizes measured in CSS pixels (such as `offsetWidth`) need to be multiplied by `scale` before you pass them to `drawElementImage()`.

### 4. 3D (WebGL, WebGPU): sync the position yourself

2D updates the position automatically; WebGL and WebGPU don't, because the browser doesn't know where the texture ends up in the 3D scene. You have to compute the transform yourself and call `canvas.updateElementGeometry()`. Chrome's documentation says that without syncing, clicks land at the element's original position; that position is also what screen reader focus rings and magnifiers use to locate it.

## Other accessibility-related limits

The WICG explainer lists some information that is **not drawn into the canvas**, to avoid leaking the user's private data. A few of these affect accessibility (I didn't test the first two; this is from the explainer):

- **Spelling and grammar markers**: users who rely on spellcheck don't see them in inputs inside the canvas.
- **Visited link colors**: links in the canvas don't show the visited style.
- **Cross-origin content**: images from other origins aren't drawn. In my test, cross-origin images were indeed blank.

The explainer also lists captions and video controls as not drawn, but in my test in Chromium 157, **both were drawn**.

## Support and open debate

- **Chrome**: in Chromium source, 153–156 had it as experimental (behind `chrome://flags/#canvas-draw-element` or an origin trial), and it's **enabled by default from 157**.
- **Firefox, Safari**: MDN's compatibility data marks it as unsupported, experimental, and non-standard-track.
- **WebKit**: in the standards position issue, a WebKit engineer (GitHub handle smfr) wrote in early August 2026: “We will mark this proposal as support in a week pending objections. There are some ongoing discussions around parts of the API shape that we'd like to see continue.” As of November 6, the issue still had no support label.
- **Mozilla**: no official position yet. The engineer handling it (GitHub handle nical) wrote in the issue: “We believe that rendering documents to a Canvas2d instead of the DOM is the wrong approach at multiple levels”, and later: “We want the web platform to evolve away from folks using canvas to build rich UIs”.
- **Standardization**: the PR adding it to the HTML Standard hasn't been merged.

So for now it's a Chrome-only feature. If an interface can be built with plain HTML, build it with plain HTML. When you really need a canvas (games, charts, 3D), it's far better than “building a separate hidden HTML copy”, but remember to handle the four things above.

## Further reading

- [Building a Video Call Waiting Room with `<usermedia>`: the Browser Handles Permissions, but You Still Need to Do Six Things](/en/blog/html-usermedia/)
- [Modern CSS & HTML Cheat Sheet: 116 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

## Related links

- [WICG — HTML-in-Canvas explainer](https://github.com/WICG/html-in-canvas "opens in new window"){target="_blank"}
- [Chrome for Developers — HTML-in-Canvas in Chrome 157](https://developer.chrome.com/blog/html-in-canvas "opens in new window"){target="_blank"}
- [Chrome for Developers — HTML-in-Canvas concepts](https://developer.chrome.com/docs/web-platform/html-in-canvas/concepts "opens in new window"){target="_blank"}
- [Chrome for Developers — Render HTML to a 2D canvas](https://developer.chrome.com/docs/web-platform/html-in-canvas/2d "opens in new window"){target="_blank"}
- [Modern Web Guidance — Expose canvas content to browser features](https://developer.chrome.com/docs/modern-web-guidance/guides/visual-design/expose-canvas-content-to-browser-features "opens in new window"){target="_blank"}
- [WICG — breaking changes announcement (#174)](https://github.com/WICG/html-in-canvas/issues/174 "opens in new window"){target="_blank"}
- [W3C — ARIA in HTML (aria-hidden must not be used on focusable elements)](https://www.w3.org/TR/html-aria/ "opens in new window"){target="_blank"}
- [Understanding WCAG 2.2 — 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html "opens in new window"){target="_blank"}
- [MDN browser-compat-data — HTMLCanvasElement](https://github.com/mdn/browser-compat-data/blob/main/api/HTMLCanvasElement.json "opens in new window"){target="_blank"}
- [WebKit standards positions — html-in-canvas (#630)](https://github.com/WebKit/standards-positions/issues/630 "opens in new window"){target="_blank"}
- [Mozilla standards positions — HTML-in-Canvas (#1076)](https://github.com/mozilla/standards-positions/issues/1076 "opens in new window"){target="_blank"}
- [WHATWG HTML — Add HTML-in-Canvas APIs (#11588)](https://github.com/whatwg/html/pull/11588 "opens in new window"){target="_blank"}
