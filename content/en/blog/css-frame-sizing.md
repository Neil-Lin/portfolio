---
title: "An iframe That Grows with Its Content: frame-sizing Only Measures at Load, So After Users Adjust Text It's Up to You"
description: "Since Chrome 154, adding frame-sizing: content-height to an iframe and an opt-in meta tag to the embedded page makes the iframe as tall as its content, with no postMessage code. But testing in Chromium, I found the height is only measured at load: after expanding a question, applying text spacing, or narrowing the layout, the iframe doesn't grow unless the embedded page calls requestResize(). This post covers the syntax, test results, and how it relates to accessibility."
date: 2026-11-07
tags:
  - CSS
  - HTML
  - JavaScript
  - Front-End
  - Accessibility
  - Browser Support
category: accessibility
translationKey: css-frame-sizing
draft: true
---

> Up front: this post was researched and drafted with help from AI (Anthropic's Claude), then read and checked by me. The behavior described was tested in Chromium 159, 157, and 153; specs, accessibility guidance, and support are based on the W3C specs and Understanding documents, WPT tests, MDN, and Chromium source linked at the end. If I've gotten something wrong, corrections welcome.

## What it solves

An iframe is 150px tall by default, and longer content gets a scrollbar inside the frame. To make an iframe as tall as its content, you used to measure the height in the embedded page, send it to the parent with `postMessage`, and set `height` in the parent.

`frame-sizing` lets the browser do this. The CSS Working Group's explainer names scrollbars inside frames as the problem to solve: when the content would fit, iframe scrollbars are a worse experience for users.

## The basics: both sides opt in

```css
/* Parent page */
iframe {
  frame-sizing: content-height;
}
```

```html
<!-- Embedded page: in <head>, before <body> starts -->
<meta name="responsive-embedded-sizing" content="allow-origins=https://parent.example">
```

- **The parent** opts in to sizing by content with `frame-sizing: content-height` (there's also `content-width`, plus the writing-mode-based `content-block-size` and `content-inline-size`).
- **The embedded page** opts in to sharing its size with the `<meta>`. Content size can leak information, so both sides have to agree.
- **`content="allow-origins=..."` is required.** It lists which parents may get the size: a full origin, `*` (any), or `'self'` (only parents with the same origin as the embedded page). The CSS spec text currently only mentions `<meta name="responsive-embedded-sizing">`, but the CSS Working Group's explainer, the WPT tests, and Chromium source all use `content="allow-origins=..."`. In my tests, **without `content` it does nothing at all**, and the height stays at 150px.
- The `<meta>` has to appear before `<body>` starts; adding it later has no effect.

In my tests it also works cross-origin: with the parent and embedded page on different domains, `allow-origins` set to the parent's origin or `*` makes the iframe grow; `'self'` doesn't (`'self'` means the embedded page's own origin).

## Live demo

First, check what your browser supports:

::feature-support{features="frame-sizing" notice="Your browser doesn't support frame-sizing, so when content-height is selected, the demo below reads the content height with JavaScript and sets the iframe height instead."}
::

::responsive-iframe-demo
::

## Tested: what updates automatically

The spec says the size is measured at two points: the first layout after the embedded page fires `DOMContentLoaded`, and `load`. **Later changes to content, styles, or layout don't affect the iframe automatically**; the embedded page has to call `window.requestResize()`.

Tested in Chromium 159 (iframe 400px wide):

| Situation | Does the iframe grow on its own? | After `requestResize()` |
|---|---|---|
| Finished loading | Yes | — |
| Expand a `<details>` | **No**, the content scrolls inside the frame | Grows to fit |
| Apply WCAG 1.4.12 text spacing | **No** | Grows to fit |
| Change the iframe width to 200px | **No** (the content rewraps, but the height isn't updated) | Grows to fit |
| Content gets shorter (collapse) | Doesn't shrink back | Shrinks to fit |

Also:

- **If the iframe has `height` or `max-height`, those win.** `frame-sizing` only sets the iframe's natural size, like an image's natural dimensions, and sizes written in CSS override it.
- **Calling it automatically with `ResizeObserver` in the embedded page** didn't cause an infinite loop in my tests, and it follows the content both up and down:

```js
// Embedded page
new ResizeObserver(() => {
  window.requestResize();
}).observe(document.body);
```

- Without the `<meta>` opt-in, or outside an iframe, `requestResize()` throws `NotAllowedError`.

## How it relates to accessibility

### 1. What users adjust is exactly what happens after load

Many of the things that make content taller are things assistive technology users do:

- **Adjusting text spacing** (WCAG 1.4.12): larger line height, paragraph spacing, letter spacing, and word spacing make content longer.
- **Zooming the page** (WCAG 1.4.4, 1.4.10): the layout gets narrower and text wraps more. The WCAG 1.4.10 Understanding document says 320 CSS px wide is equivalent to a 1280px-wide screen at 400% zoom.
- **Expanding content**: FAQs, accordions, “show more”.

All of these happen after load. With `frame-sizing` alone, the iframe stays at its original height and the extra content gets pushed into a scroll area inside the frame, which is the very “scrollbar inside a frame” this feature set out to fix. In the demo, once you turn on calling `requestResize()` automatically, all three cases grow to fit.

I simulated zoom by narrowing the iframe; I couldn't test real browser zoom in my sandbox, so that needs checking locally.

### 2. Scrolling inside the frame isn't lost content, but don't turn the scrollbar off

WCAG 1.4.12 and 1.4.4 require “no loss of content or functionality”. Content pushed into the frame's scroll area that can still be scrolled to isn't lost.

But if the iframe has `scrolling="no"`, or the embedded page uses `overflow: hidden` to hide the scrollbar, then when the height falls behind, you can't scroll to it. In my tests the mouse wheel didn't scroll; tabbing to a button inside still scrolled the frame to it, but extra plain text has nowhere for focus to land, so it can't be seen, which amounts to lost content. When using `frame-sizing`, it's safer to keep the scrollbar as a safety net.

### 3. The iframe needs a name

Not specific to `frame-sizing`, but always worth remembering: describe the iframe's content with the `title` attribute so screen readers know what the frame is (WCAG 4.1.2; W3C technique H64).

## Unsupported browsers: keep the old approach as a fallback

Only Chrome 154 and later support it so far. Other browsers keep using `postMessage`, sent only when it's not supported:

```js
// Embedded page
new ResizeObserver(() => {
  if (typeof window.requestResize === "function") {
    window.requestResize();
  } else {
    parent.postMessage(
      {
        type: "height",
        // scrollHeight is never smaller than the iframe, so it wouldn't shrink back
        height: Math.ceil(document.documentElement.getBoundingClientRect().height),
      },
      "https://parent.example",
    );
  }
}).observe(document.body);
```

```js
// Parent page
window.addEventListener("message", (e) => {
  if (e.origin !== "https://child.example" || e.data?.type !== "height") return;
  // Content height plus the iframe's border
  iframe.style.height = `${e.data.height + iframe.offsetHeight - iframe.clientHeight}px`;
});
```

- Always check `e.origin`, and give `postMessage` a target origin rather than `*`.
- In supporting browsers, **don't set `height` with JavaScript as well**: `height` overrides `frame-sizing`. The code above only calls `requestResize()` when it's supported and sends no message.
- In CSS, use `@supports (frame-sizing: content-height) { … }`.

## Support and standardization

- **Chrome**: in Chromium source it's experimental in 153 and **enabled by default from 154**. MDN's compatibility data also says Chrome 154.
- **Firefox, Safari**: MDN's compatibility data marks them as unsupported, and the feature as experimental.
- **WebKit**: the standards position issue (#653) has no position and no discussion yet.
- **Mozilla**: the standards position issue (#1394) has no position yet. In October 2026, a participant (GitHub handle jakearchibald) raised a concern: “It only resizing on domready + load seems like a huge limitation.”
- **HTML Standard**: the PR adding `<meta name="responsive-embedded-sizing">` to the HTML Standard (#12444) hasn't been merged, and the `allow-origins` syntax has changed during the discussion. Check the latest syntax before using it.

So for now it's a Chrome-only feature whose syntax is still changing. If you use it, have the embedded page call `requestResize()`, and keep the old approach as a fallback.

## Further reading

- [Building a Custom Player with :playing and :paused: the Icon Follows the State, but Screen Readers Don't Know](/en/blog/css-media-state-pseudos/)
- [Modern CSS & HTML Cheat Sheet: 116 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

## Related links

- [W3C — CSS Box Sizing Module Level 4: Responsively-sized iframes](https://drafts.csswg.org/css-sizing-4/#responsive-iframes "opens in new window"){target="_blank"}
- [CSS Working Group — Responsively-sized iframes explainer](https://github.com/w3c/csswg-drafts/blob/main/css-sizing-4/responsive-iframes-explainer.md "opens in new window"){target="_blank"}
- [WPT — responsive-iframe tests (including allow-origins)](https://github.com/web-platform-tests/wpt/tree/master/css/css-sizing/responsive-iframe "opens in new window"){target="_blank"}
- [MDN — frame-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/frame-sizing "opens in new window"){target="_blank"}
- [MDN — Window.requestResize()](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestResize "opens in new window"){target="_blank"}
- [MDN browser-compat-data — frame-sizing](https://github.com/mdn/browser-compat-data/blob/main/css/properties/frame-sizing.json "opens in new window"){target="_blank"}
- [Chromium source — html_meta_element.cc (the allow-origins check)](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/html/html_meta_element.cc "opens in new window"){target="_blank"}
- [WHATWG HTML — Add `<meta name="responsive-embedded-sizing">` (#12444)](https://github.com/whatwg/html/pull/12444 "opens in new window"){target="_blank"}
- [WebKit standards positions — Responsively-sized iframes (#653)](https://github.com/WebKit/standards-positions/issues/653 "opens in new window"){target="_blank"}
- [Mozilla standards positions — Responsively-sized iframes (#1394)](https://github.com/mozilla/standards-positions/issues/1394 "opens in new window"){target="_blank"}
- [Understanding WCAG 2.2 — 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html "opens in new window"){target="_blank"}
- [Understanding WCAG 2.2 — 1.4.12 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html "opens in new window"){target="_blank"}
- [Understanding WCAG 2.2 — 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html "opens in new window"){target="_blank"}
- [WCAG Technique H64 — Using the title attribute of the iframe element](https://www.w3.org/WAI/WCAG22/Techniques/html/H64 "opens in new window"){target="_blank"}
