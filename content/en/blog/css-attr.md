---
title: "Let ARIA Be the Single Source of Truth: Reading aria-valuenow with CSS attr()"
description: "CSS attr() used to work only in content; now it takes a type and works in any property. This post tests it from an accessibility angle: progress bars, ratings and tree indentation that read ARIA attributes directly, so what people see and what screen readers get come from one source and can't drift apart. It also covers the traps I hit while testing, such as children not seeing a parent's attributes and an input's live value."
date: 2026-10-13
tags:
  - CSS
  - Front-End
  - Accessibility
  - Browser Support
category: frontend
translationKey: css-attr
draft: false
---

> Up front: I tested the behavior in this post in Chromium 141 and 153. I couldn't find definitive Safari support data while writing, so check caniuse before shipping. If I've gotten something wrong, corrections welcome.

### Intro

There's a habit that works really well for accessible components: **use ARIA attributes as the hook for your styles**.

For example, when an accordion opens, instead of adding a separate `.is-open` class, write:

```css
[aria-expanded="true"] + .panel {
  display: block;
}
```

Now "visually open" and "the expanded state a screen reader hears" come from one source. Change `aria-expanded` and the screen follows; forget to change it and nothing moves on screen either, so you notice right away during development.

But that only works for on/off states. **Numbers** were out of reach: CSS couldn't turn a progress bar's `aria-valuenow="40"` into a width, so JavaScript had to update both `style.width` and `aria-valuenow`. Two places to change means one can be missed: the bar shows 70% while the screen reader still hears 40%.

`attr()` fills that gap. It's the "`attr()` in any property" item in my [CSS & HTML cheat sheet](/en/blog/css-techniques-checklist).

First, here's what your browser supports:

::feature-support{features="attr-typed" notice="Your browser doesn't support typed attr(), so the demos below copy the value into a CSS variable with JavaScript instead, with the same result."}
::

### 1. The old attr(): content only

`attr()` has been around a long time, but only in `content`, and it always returned a string:

```css
a::after {
  content: " (" attr(href) ")";
}
```

Using it for a width, color or spacing did nothing.

### 2. The new syntax: typed, in any property

Now you can tell the browser what type to treat the attribute as, plus a fallback for when it can't be read:

```css
.bar {
  width: attr(data-width type(<length>), 0px);
  color: attr(data-color type(<color>), black);
}
```

| Syntax | Meaning | Tested |
|---|---|---|
| `attr(data-n type(<number>), 0)` | As a number | `data-n="40"` reads as 40 |
| `attr(data-w type(<length>), 0px)` | As a length | Needs `data-w="50px"`; a bare `50` falls back to the default |
| `attr(data-w px, 5px)` | A number plus a unit | `data-w="50"` reads as 50px |
| `attr(data-n em, 1em)` | Other units work too | `data-n="5"` reads as 5em |
| `attr(data-c type(<color>), black)` | As a color | `data-c="tomato"` reads as tomato |
| `attr(aria-level type(<integer>), 1)` | As an integer | Good for levels like `aria-level` |

Most importantly, **it can read ARIA attributes**.

### 3. Example 1: a progress bar that reads aria-valuenow

```html
<div class="progress" role="progressbar" aria-label="Upload progress"
     aria-valuemin="0" aria-valuemax="100" aria-valuenow="40">
  <span class="progress__fill"></span>
</div>
```

```css
.progress {
  --now: attr(aria-valuenow type(<number>), 0);
}
.progress__fill {
  width: calc(var(--now) * 1%);
}
```

JavaScript only has to update one thing:

```js
progress.setAttribute("aria-valuenow", 70);
```

The width follows automatically. In my tests, changing the value with `setAttribute` recalculated immediately, with no other code.

The demo below switches between the old and new approaches. Check "Simulate the code forgetting to update aria-valuenow" to see how the old one goes wrong:

::attr-aria-demo{kind="progress"}
::

With the new approach there's simply no chance to "forget": the length on screen is read from `aria-valuenow`, so if the length is right, what the screen reader gets is right too.

If the minimum isn't 0, read `aria-valuemin` and `aria-valuemax` as well:

```css
.progress {
  --now: attr(aria-valuenow type(<number>), 0);
  --min: attr(aria-valuemin type(<number>), 0);
  --max: attr(aria-valuemax type(<number>), 100);
}
.progress__fill {
  width: calc((var(--now) - var(--min)) / (var(--max) - var(--min)) * 100%);
}
```

In my tests, `aria-valuemin="10"`, `aria-valuemax="60"` and `aria-valuenow="35"` gave exactly 50%.

### 4. The first trap: children can't read a parent's attributes

Notice that `--now` is set on the outer `.progress`, not directly on `.progress__fill`.

That's a trap I hit while testing. My first attempt was:

```css
/* Doesn't work */
.progress__fill {
  width: calc(attr(aria-valuenow type(<number>), 0) * 1%);
}
```

The width was always 0, because **`attr()` only reads attributes of the element the declaration applies to**. `aria-valuenow` is on the outer `.progress`; `.progress__fill` has no such attribute, so it got the fallback, 0.

The fix is to read the value into a CSS variable on the element that has the attribute, and let children and pseudo-elements inherit it:

```css
.progress { --now: attr(aria-valuenow type(<number>), 0); }  /* read where the attribute lives */
.progress__fill { width: calc(var(--now) * 1%); }             /* children use the inherited variable */
```

### 5. Example 2: rating stars

A rating display uses the same pattern. Use `role="meter"` with `aria-valuenow`, and have the star length read it:

```html
<span class="rating" role="meter" aria-label="Kyoto rating"
      aria-valuemin="0" aria-valuemax="5" aria-valuenow="4.5"
      aria-valuetext="4.5 out of 5 stars"></span>
```

```css
.rating {
  --now: attr(aria-valuenow type(<number>), 0);
}
.rating::before { content: "★★★★★" / ""; }
.rating::after {
  content: "★★★★★" / "";
  width: calc(var(--now) / 5 * 100%);
  overflow: hidden;
}
```

::attr-aria-demo{kind="rating"}
::

Two accessibility details:

- **The stars are decoration**: an empty string after the slash in `content` stops screen readers from reading out five star characters. The name and value come from `aria-label` and `aria-valuetext`.
- **`aria-valuetext` is the version for people**: `aria-valuenow` is the number for code and CSS, while `aria-valuetext` is the sentence a screen reader actually says, such as "4.5 out of 5 stars".

### 6. Example 3: tree indentation from aria-level

Each level of a tree already needs `aria-level` to tell screen readers how deep it is. The visual indentation can read the same value:

```css
[role="treeitem"] {
  padding-inline-start: calc((attr(aria-level type(<integer>), 1) - 1) * 1.5rem);
}
```

In my tests, items with `aria-level` 1, 2 and 4 were indented 0, 24px and 72px. Here `attr()` is on the `treeitem` itself, which also has the attribute, so no variable hand-off is needed.

From then on, adjusting the tree means changing `aria-level` and the indentation follows. Conversely, if the indentation looks wrong, the problem must be in `aria-level`, which also affects screen reader users, so you catch both at once during development.

### 7. Other details from testing

- **Invalid values fall back to the default**: `aria-valuenow="abc"` and `aria-level="x"` both use the default after the comma, so the layout doesn't break. That's why **you should always provide a default**.
- **It reads attributes, not live element state**: drag an `<input type="range" value="30">` and `input.value` changes, but the HTML `value` attribute is still 30, so `attr(value)` still reads 30. Live form values still need JavaScript.
- **It can't be used in URLs**: `background-image: url(attr(data-img))` does nothing, and `type(<url>)` doesn't read either. This is deliberately blocked for security, so attributes on a page can't be used to load external resources.

### 8. What happens without support?

Feature detection:

```css
@supports (width: attr(data-x type(<length>))) {
  .progress {
    --now: attr(aria-valuenow type(<number>), 0);
  }
}
```

Without support, fall back to copying the value into a CSS variable with JavaScript, which is what the demos in this post do:

```js
if (!CSS.supports("width: attr(data-x type(<length>))")) {
  progress.style.setProperty("--now", progress.getAttribute("aria-valuenow"));
}
```

That way the CSS is written once: it reads the attribute when supported, and the variable written by JavaScript when not.

### Conclusion

In a few lines:

- `attr()` now takes a type and works in any property, e.g. `attr(aria-valuenow type(<number>), 0)`.
- Use it to read ARIA attributes so what people see and what screen readers get come from one source: progress bars, ratings, tree indentation.
- `attr()` only reads the element's own attributes; for children, read it into a CSS variable where the attribute lives and let it inherit.
- Always provide a default; it reads attributes, not live state; it can't be used inside `url()`.
- Without support, copy the value into a CSS variable with JavaScript.

"Let ARIA be the single source of truth" used to work only for on/off states; now it works for numbers too. One less thing to keep in sync is one less thing to go wrong.

Where in your projects is JavaScript updating both styles and ARIA at once? I'd love to hear about it.

### Related reading

- [No More Hand-Rolled Roving tabindex: Arrow-Key Navigation with focusgroup](/en/blog/focusgroup/)
- [Make Screen Readers Speak: Replacing aria-live with ariaNotify()](/en/blog/aria-notify/)
- [Modern CSS & HTML Cheat Sheet: 115 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

### Related links

- [MDN — attr()](https://developer.mozilla.org/en-US/docs/Web/CSS/attr "Open new window"){target="_blank"}
- [Chrome for Developers — CSS attr() gets an upgrade](https://developer.chrome.com/blog/advanced-attr "Open new window"){target="_blank"}
- [WAI-ARIA APG — Meter Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/meter/ "Open new window"){target="_blank"}
- [Can I use](https://caniuse.com "Open new window"){target="_blank"}
