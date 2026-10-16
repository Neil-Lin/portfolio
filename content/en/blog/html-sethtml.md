---
title: "setHTML() Is Safe, but It Stripped All My ARIA"
description: "Element.setHTML() is a safe innerHTML that strips scripts and event attributes as it inserts HTML. In my tests, its default config also removes every aria-*, role and id, and drops button, img, input and label entirely, without any error. This post uses a live demo to compare the default config, an empty config and a custom allowlist, and sums up how to balance security and accessibility."
date: 2026-10-16
tags:
  - HTML
  - JavaScript
  - Front-End
  - Accessibility
  - Browser Support
category: frontend
translationKey: html-sethtml
draft: false
---

> Up front: I tested the behavior in this post in Chromium 153; 141 doesn't support it yet. For other browsers and the finer details, check caniuse and MDN. If I've gotten something wrong, corrections welcome.

## Intro

`innerHTML` has long been a major source of XSS. If any part of the inserted content comes from users, someone can slip in something like `<img onerror="…">`. The usual fix was to clean the string with a library such as DOMPurify first, then hand it to `innerHTML`.

`Element.setHTML()`, from my [CSS & HTML cheat sheet](/en/blog/css-techniques-checklist), is the browser's built-in version:

```js
element.setHTML(html);
```

The browser removes anything dangerous as it inserts. I assumed it would only strip things like `<script>` and `onclick`. After testing, I found that **its default config stripped all my accessibility attributes too**.

First, check your browser's support:

::feature-support{features="set-html" notice="Your browser doesn't support setHTML(), so the demo below can't run; the test results in the post still apply."}
::

## 1. What does the default remove?

I gave `setHTML()` a snippet full of common accessibility patterns, with no config:

| Removed | Impact |
|---|---|
| **Every `aria-*` attribute and `role`** | `aria-expanded`, `aria-live`, `aria-label` and `role="status"` all disappear, taking the component's state and semantics with them |
| `id` | Every id-based relationship breaks: `<label for>`, `aria-describedby`, `aria-controls` |
| `tabindex`, `hidden`, `class`, `style`, `data-*` | Removed |
| **`<button>`, `<img>`, `<input>`, `<label>`, `<details>`, `<dialog>`** | **The whole element disappears, text and all**: the button's label is gone, and the image goes with its `alt` |
| `target` and `rel` on `<a>` | Removed; only `href` stays |

What survives is the more "static" structure:

- Headings `<h1>` to `<h6>`, paragraphs and lists.
- Tables, including `scope` on `th`, `headers` on `td`, and `<caption>`.
- `<abbr title>`, `<time datetime>`, `<kbd>` and `<mark>`.
- The `title`, `lang` and `dir` attributes.

I also read the browser's built-in default config directly: the allowlist has 121 elements and 58 attributes, **with no `aria-*` at all, and no `role`, `id`, `alt`, `button` or `img`**.

The worst part is that **none of this produces an error or warning**. A missing button might be visible, but when `aria-expanded` or `aria-live` is stripped the page looks exactly the same. Only screen reader users will notice that the component is broken.

## 2. Try it

Edit the input HTML and switch between the three configs to see which elements and attributes are removed:

::set-html-demo
::

The HTML in the demo is only compared, never inserted into the page, so the dangerous link in it never runs.

## 3. Choosing between the three configs

**1. Default: `setHTML(html)`**

Keeps only text and basic structure; the most conservative option. It suits content typed entirely by users that shouldn't contain interactive components anyway, such as comments and forum posts.

**2. Empty config: `setHTML(html, { sanitizer: {} })`**

I think this one is the easiest to misread. An empty config doesn't mean "keep nothing". It means **"keep everything except what can run code"**:

- Removed: `<script>`, event attributes like `onclick`, `javascript:` links, `<iframe>`, `<object>`, `<embed>`, and `<use>` inside SVG.
- Kept: every `aria-*`, `role`, `id`, `<button>`, `<img>`, `<input>` and `<label>`.
- **But also kept**: `<style>`, `<link rel="stylesheet">`, `<form>`, `<meta http-equiv="refresh">` and `data:` URLs.

So the empty config only suits HTML **your own system produces and can trust**, such as content editors wrote in a CMS or component fragments from your own API. On user input, nothing can execute, but someone could still inject styles that cover the page, or use `meta refresh` to send people to another site.

**3. Defaults plus an allowlist**

Start from the defaults and add only what you need:

```js
const sanitizer = new Sanitizer();
sanitizer.allowElement("button");
sanitizer.allowElement("img");
sanitizer.allowAttribute("role");
sanitizer.allowAttribute("aria-label");
sanitizer.allowAttribute("aria-expanded");
sanitizer.allowAttribute("alt");

element.setHTML(html, { sanitizer });
```

When the content comes from users but must keep its accessibility attributes, this is the safest approach.

**Pitfalls:**

- **Passing `{ elements: [...], attributes: [...] }` directly *replaces* the default list; it doesn't add to it.** I first listed only `button` and `img`, and `ul`, `li` and `p` all vanished. To build on the defaults, use `new Sanitizer()` and call `allowElement()` and `allowAttribute()`.
- **SVG icons survive, but lose their names.** `<svg>` itself is in the default list, but the `role` and `aria-label` on `<svg role="img" aria-label="…">` are stripped, so a meaningful icon becomes an unnamed graphic. Adding them back with `allowAttribute("role")` and `allowAttribute("aria-label")` is enough; I tested that it keeps them.
- **`setHTML()` never lets dangerous content through.** I added `onclick` to the allowlist and it was still removed. If you really need it, you have to use `setHTMLUnsafe()`, whose name is the warning.

## 4. What matters is who wrote the content

Putting it together, the config to choose depends on who wrote the HTML:

| Source | Recommendation |
|---|---|
| Typed entirely by users (comments, forums) | Default `setHTML(html)` |
| From users, but an editor generates accessibility attributes (e.g. a custom rich text editor) | Defaults plus an allowlist, adding only the `aria-*` and elements you need |
| Generated by your own system and trusted | `{ sanitizer: {} }` |

Whichever you pick, **check the result in the accessibility tree or with a screen reader after inserting it**. Stripped ARIA doesn't change the page visually, so you can't catch it by looking.

Also, `Document.parseHTML()`, the new method that parses a string into a whole document, uses the same default config. In my test it stripped `aria-label` too.

## 5. When it isn't supported

Feature detection:

```js
if ("setHTML" in Element.prototype) {
  element.setHTML(html, { sanitizer });
} else {
  // Fall back to the old approach, e.g. DOMPurify
  element.innerHTML = DOMPurify.sanitize(html);
}
```

Note that DOMPurify's default config **keeps** `aria-*` and `role`, unlike `setHTML()`'s default. If you switch from DOMPurify to `setHTML()` without noticing this difference, components that used to work will silently lose their accessibility attributes after the switch.

## Conclusion

In short:

- `setHTML()` is a safe `innerHTML` that always strips anything that can run code.
- **The default config strips every `aria-*`, `role` and `id`**, and `<button>`, `<img>`, `<input>` and `<label>` disappear entirely, text and all, without any warning.
- The empty config `{ sanitizer: {} }` keeps all accessibility attributes, but also keeps styles, forms and `meta refresh`, so it only suits trusted content.
- For user input that needs accessibility attributes, use `new Sanitizer()` and add them one by one with `allowAttribute()` and `allowElement()`.
- Be careful when migrating from DOMPurify: the two handle ARIA differently by default.

Security and accessibility shouldn't be a trade-off. This time the browser's default just leans toward security, and it's up to developers to add accessibility back.

## Related reading

- [Why Do Web Components Flash? Fixing It with Declarative Shadow DOM](/en/blog/declarative-shadow-dom/)
- [An Outside label Can Finally Reach the input Inside Shadow DOM: shadowrootreferencetarget](/en/blog/shadow-dom-reference-target/)
- [Modern CSS & HTML Cheat Sheet: 115 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

## Related links

- [MDN — Element.setHTML()](https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTML "Open new window"){target="_blank"}
- [MDN — HTML Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API "Open new window"){target="_blank"}
- [WICG — HTML Sanitizer API specification](https://wicg.github.io/sanitizer-api/ "Open new window"){target="_blank"}
- [DOMPurify](https://github.com/cure53/DOMPurify "Open new window"){target="_blank"}
- [Can I use](https://caniuse.com "Open new window"){target="_blank"}
