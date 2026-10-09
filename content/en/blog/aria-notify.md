---
title: "Make Screen Readers Speak: Replacing aria-live with ariaNotify()"
description: "Announcing \"Added to cart\" to screen readers used to mean hiding an aria-live region and stuffing text into it, which often went unspoken. ariaNotify() lets you ask the screen reader to speak directly. Starting from an aria-live problem on my own site, this post covers how to use it, the element version and language, the limits of priority, and a fallback to live regions for browsers without it."
date: 2026-10-09
tags:
  - JavaScript
  - HTML
  - Front-End
  - Accessibility
  - Browser Support
translationKey: aria-notify
category: frontend
draft: false
---

> Up front: what `ariaNotify()` produces is sound, not anything you can see. I tested the API's behavior in Chromium, but how (and whether) a screen reader speaks depends on the browser and screen reader combination, so the most reliable check is turning on a screen reader and listening yourself. If I've gotten something wrong, corrections welcome.

### Intro

This post started with my own site.

My [products page](/en/products) can be filtered by role and platform, and sorted. To let screen reader users know "the content changed," I had wrapped the whole list in `aria-live="polite"`. It seemed reasonable, but it's a common anti-pattern: change a filter and the whole list changes, so a screen reader may read every card from top to bottom. What people actually need to hear is a single sentence: "Showing 8 items."

`ariaNotify()`, from my [CSS & HTML cheat sheet](/en/blog/css-techniques-checklist), solves exactly this, so I wrote this up while fixing my own site.

First, here's what your browser supports:

::feature-support{features="aria-notify" notice="Your browser doesn't support ariaNotify(), so the demo below falls back to aria-live automatically."}
::

### 1. The old way: aria-live and its traps

To have a screen reader announce status messages like "Saved" or "8 results found," this used to be the only option:

```html
<div aria-live="polite" class="visually-hidden" id="status"></div>
```

```js
status.textContent = "Added to cart";
```

Everyone uses it, and it's famously unreliable:

| Trap | What happens |
|---|---|
| The region must already exist | Content put into a newly inserted live region often isn't spoken the first time |
| It can't really be hidden | Hiding it with `display: none` or `hidden` breaks it; only visually-hidden works |
| Identical text isn't repeated | Press "Add to cart" twice; the text doesn't change, so the second one may be skipped |
| Modals block it | With a modal open, the background is inert, so a live region there goes silent |
| Too large a region is noisy | My site's case: wrap the whole list, and every update reads the lot |

### 2. How to use ariaNotify()

`ariaNotify()` asks the screen reader to speak a message directly, with no element on the page:

```js
document.ariaNotify("Changes saved");
```

You can also send it from an element:

```js
saveButton.ariaNotify("Changes saved");
```

There's a `priority` option too:

```js
form.ariaNotify("Payment failed, please check your card number", { priority: "high" });
```

| `priority` | Effect | Roughly like |
|---|---|---|
| `normal` (default) | Waits for whatever is being read to finish | `aria-live="polite"` |
| `high` | Tries to jump the queue | `aria-live="assertive"` |

In my Chromium tests, `priority` accepts only these two values; anything else throws an error rather than failing silently.

### 3. Try it

The demo has four scenarios: adding to cart repeatedly, a high-priority error, an English announcement sent from inside a `lang="en"` block, and an announcement from inside a modal. You can also check "Force the aria-live fallback" to compare the two approaches:

::aria-notify-demo
::

If you can see the screen, the log below lists what was sent each time and whether it went through `ariaNotify` or a live region. The real effect still needs a screen reader; on a Mac, ⌘+F5 turns on VoiceOver.

### 4. Element vs. document: it's about language

This is the point I think is easiest to miss, and it matters a lot on bilingual sites:

- `document.ariaNotify()`: spoken in the page's language.
- `element.ariaNotify()`: spoken in the language of the element's **nearest ancestor with `lang`**.

My site is bilingual. If an English announcement comes from an English block on a Chinese page, the element version lets the screen reader switch to English pronunciation. In the demo, the "Add to wishlist" button sits inside `lang="en"`.

So my habit is to **prefer the element version** and send the announcement from the button or block that triggered it, so the language follows the content.

### 5. Without support: a fallback

`ariaNotify()` is supported from Chrome 141 and Firefox 150; the sources I found disagree about Safari, so test it yourself. Browsers without it still need a live region fallback. This is the code my site and the demo actually use:

```js
const REGION_ATTR = "data-announcer";

function getRegion(host, priority) {
  // With a modal open the background is inert, so the region must go inside the dialog
  const container = host.closest("dialog[open]") ?? document.body;
  let region = container.querySelector(`:scope > [${REGION_ATTR}="${priority}"]`);
  if (!region) {
    region = document.createElement("div");
    region.setAttribute(REGION_ATTR, priority);
    region.setAttribute("aria-live", priority === "high" ? "assertive" : "polite");
    region.className = "visually-hidden";
    container.append(region);
  }
  return region;
}

function announce(host, message, priority = "normal") {
  if (typeof host.ariaNotify === "function") {
    host.ariaNotify(message, { priority });
    return;
  }
  const region = getRegion(host, priority);
  // Clear first, so identical messages are spoken again
  region.textContent = "";
  // Content put into a brand-new live region right away is often skipped, so wait a moment
  setTimeout(() => {
    region.textContent = message;
  }, 100);
}
```

This fallback handles each trap from section 1:

- **The region must already exist**: besides the delay, I also call `getRegion()` once when the page loads, so the live region is in place early.
- **Identical text isn't repeated**: clear, then fill.
- **Modals block it**: when a `<dialog>` is open, the region goes inside it.
- **Visually hidden**: use visually-hidden rather than `hidden`, so screen readers can read it.

### 6. What I changed on my site

Back to the products page. Before, the whole list was a live region:

```html
<div class="group-list" aria-live="polite">
  <!-- every product card -->
</div>
```

After, the list no longer has `aria-live`. Instead, when a filter changes, the filter controls send one announcement:

```js
watch([sortorder, role, platform], async () => {
  await nextTick();
  announce(filtersEl, t("data.resultCount", count));
});
```

The message depends on the count: "No matching items" when nothing matches, and "Updated, showing 8 items" otherwise. Screen reader users who change a filter now hear one sentence instead of a whole row of cards.

The "Edit note" demo in my [dialog post](/en/blog/dialog-modern-guide) uses the same `announce()`: once the dialog closes, nothing on screen says "saved," so it announces "Note saved."

### 7. Things to watch out for

- **Don't flood people**: `ariaNotify()` can speak without any user interaction, which makes it easy to abuse. Use it only when people genuinely need to know and nothing else on screen tells them.
- **`high` doesn't always jump the queue**: an NVDA issue reports that in Chrome 149 and Firefox 155, `high` didn't move ahead, and the spec doesn't mandate the order. Don't rely on `high` to convey sequence.
- **It doesn't replace focus management**: when focus should move, move it, for example when a dialog opens. `ariaNotify()` informs; it doesn't guide.
- **It can be blocked inside iframes**: `Permissions-Policy` can disallow `aria-notify`, and blocked calls fail silently.
- **Browser support doesn't guarantee screen reader support**: always test with VoiceOver or NVDA.

### Conclusion

In a few lines:

- Use `ariaNotify()` for status messages (saved, added, N results) instead of hiding a live region.
- Prefer the element version; the language follows `lang`, which matters especially on bilingual sites.
- Save `priority: "high"` for genuinely urgent messages, but don't rely on it jumping the queue.
- Fall back to a live region in browsers without support: clear then fill, fill after a delay, and put it inside an open dialog.
- An oversized `aria-live` region is noisy. A whole list wrapped in one, like on my site, can become a one-sentence announcement.

After all these years in accessibility, `aria-live` has always felt like the most unpredictable tool to me: getting it right doesn't guarantee it's spoken, and getting it wrong often goes unnoticed. `ariaNotify()` finally makes this direct, and precisely because it's so direct, it deserves to be used with restraint.

Where does your site use `aria-live`? I'd love to hear about it.

### Related reading

- [How to Write a Dialog Today: From showModal() to command and closedby](/en/blog/dialog-modern-guide/)
- [Why Can't Ctrl+F Find Collapsed Content? A Look at hidden="until-found"](/en/blog/hidden-until-found/)
- [Popover auto, manual and hint: What's Actually the Difference? I Built Demos to Find Out](/en/blog/popover-auto-manual-hint/)

### Related links

- [MDN — Element.ariaNotify()](https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaNotify "Open new window"){target="_blank"}
- [MDN — Document.ariaNotify()](https://developer.mozilla.org/en-US/docs/Web/API/Document/ariaNotify "Open new window"){target="_blank"}
- [Microsoft Edge Blog — Creating a more accessible web with Aria Notify](https://blogs.windows.com/msedgedev/2025/05/05/creating-a-more-accessible-web-with-aria-notify/ "Open new window"){target="_blank"}
- [NVDA issue #20872 — priority "high" not moving ahead](https://github.com/nvaccess/nvda/issues/20872 "Open new window"){target="_blank"}
- [Can I use](https://caniuse.com "Open new window"){target="_blank"}
