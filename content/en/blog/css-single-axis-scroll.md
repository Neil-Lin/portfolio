---
title: "A Header Stuck to the Page and a First Column Stuck to the Left: Data Tables with Single-Axis Scroll Containers, and Three Accessibility Fixes"
description: "Put a wide data table in an overflow-x: auto wrapper, and the header can no longer stay at the top while the page scrolls. Since Chrome 156, single-axis scroll containers fix this: with overflow: auto clip on the wrapper, the header sticks to the page and the first column sticks to the wrapper. I tested it with a live demo and cover the three accessibility fixes you still need: a role and name for the wrapper, keeping focus from hiding under sticky cells, and no horizontal page scrolling at 320px wide."
date: 2026-11-05
tags:
  - CSS
  - Front-End
  - Accessibility
  - Browser Support
category: frontend
translationKey: css-single-axis-scroll
draft: false
---

> Up front: this post was researched and drafted with help from AI (Anthropic's Claude), then read and checked by me. The behavior described was tested in Chromium 153 and 159; specs, accessibility guidance, and support are based on the W3C specs, WCAG Understanding documents, MDN, and Chromium source linked at the end. If I've gotten something wrong, corrections welcome.

## The old problem

For a wide data table, the usual approach is a wrapper that lets the table scroll horizontally:

```css
.table-wrap {
  overflow-x: auto;
}
```

Then you want the header to stay at the top while **the page scrolls down**, and the first column to stay on the left while **the table scrolls right**:

```css
thead th {
  position: sticky;
  top: 0;
}
tbody th {
  position: sticky;
  left: 0;
}
```

The first column works; the header doesn't. There are two reasons:

1. The CSS Overflow spec says that when one axis has a scrollable value (such as `auto`), `visible` in the other axis computes to `auto`. So the wrapper is actually a **scroll container in both directions**.
2. `position: sticky` sticks to the nearest scroll container. The wrapper never scrolls vertically, so the header sticks to it and scrolls away with the whole table when the page moves.

Even writing `overflow-y: clip` didn't help before: `clip` was automatically changed to `hidden`, which is still a scroll container, with the same result.

## Single-axis scroll containers

Since Chrome 156, `clip` can be combined with a scrollable value without being changed to `hidden`:

```css
.table-wrap {
  overflow: auto clip; /* auto horizontally, clip vertically */
}
```

The spec calls an element that scrolls in only one axis, with `clip` in the other, a **single-axis scroll container**.

This pairs with how the CSS Position spec defines sticky: in each axis, a sticky box looks for the nearest scroll container that **scrolls in that axis**. So:

- The header's `top: 0`: the wrapper doesn't scroll vertically, so it looks further up, finds the page, and sticks to **the top of the page**.
- The first column's `left: 0`: the wrapper scrolls horizontally, so it sticks to **the wrapper's left edge**.

If the page also has a header fixed to the top, the table header's `top: 0` overlaps it, so `top` needs to be the page header's height. This site's header only appears when you scroll up, and in my test the table header and the site header covered each other. That's why the demo adjusts the table header's `top` with JavaScript to follow the site header.

There's one more difference between `clip` and `hidden`: an axis set to `hidden` can't be scrolled by the user but can still be scrolled by script; an axis set to `clip` stays at 0 even with APIs like `scrollIntoView()` and `scrollBy()`.

## Live demo

First, your browser's support:

::feature-support{features="single-axis-scroll" notice="Your browser doesn't support single-axis scroll containers, so both options in the demo below look the same: the header doesn't stick to the top of the page."}
::

::single-axis-table-demo
::

## Test results: old vs. new

I put the same table (13 columns, 40 rows) in two wrappers, scrolled the page and the table, and measured where the header and first column ended up:

| | Chromium 153 | Chromium 159 |
|---|---|---|
| Computed value of `overflow-y: clip` | `hidden` | `clip` |
| Header when the page scrolls down | Scrolls away | Sticks to the top of the page |
| First column when the table scrolls right | Sticks to the wrapper's left edge | Sticks to the wrapper's left edge |

The old approach (`overflow-x: auto` only) behaves the same in both versions: the header scrolls away.

## Three accessibility fixes you still need

### 1. The wrapper must be keyboard-operable and have a role and name

Keyboard users need to be able to scroll the wrapper (WCAG 2.1.1 Keyboard). MDN's guidance: a focusable scroll area should get `tabindex="0"` and **should have a role and an accessible name**; if the content doesn't warrant a page landmark, use the `group` role.

```html
<div class="table-wrap" role="group" aria-labelledby="sales-caption" tabindex="0">
  <table>
    <caption id="sales-caption">Monthly sales by product, 2026 (in thousands)</caption>
    …
  </table>
</div>
```

I tested a table with no links or buttons in Chromium 159. Without `tabindex`, Chrome made the wrapper focusable with Tab on its own: left and right arrows scrolled the table, up and down arrows scrolled the page, and the keyboard wasn't trapped. **But the wrapper had no role and no name in the accessibility tree**, so a screen reader wouldn't say what it is when focus lands on it. You still need to add the `role`, the name, and `tabindex` yourself.

Adding `position: sticky` doesn't break table semantics: the column headers (13), row headers (40), and cells were all correct in the accessibility tree.

### 2. Focus must not hide under the sticky first column

When the table contains links or buttons, moving focus with Tab or Shift+Tab makes the browser scroll the focused element into the wrapper. But in my tests, focus sometimes landed right under the sticky first column, completely out of sight.

WCAG 2.4.11 Focus Not Obscured (Minimum) is Level AA: a component receiving focus **must not be entirely hidden by author-created content**, and the Understanding document specifically mentions sticky headers and footers.

In a table with a link in every cell, I pressed Tab 150 times and Shift+Tab 150 times (299 of those landed on a link). It happened in both directions:

| | Focus entirely hidden |
|---|---|
| No `scroll-padding` | **24 times** |
| `scroll-padding-inline-start` on the wrapper (the first column's width) | **0 times** |

`scroll-padding` shrinks the part of a scroll container that counts as "in view". The CSS Scroll Snap spec states that it should affect whether an element is considered scrolled into view for operations such as focusing. So the browser scrolls a little further and focus stops to the right of the first column:

```css
.table-wrap {
  --first-col: 7.5rem;
  scroll-padding-inline-start: var(--first-col);
}
tbody th {
  min-inline-size: var(--first-col);
}
```

### 3. At 320px wide, the page must not scroll horizontally

WCAG 1.4.10 Reflow requires that content zoomed to 400% (about 320 CSS pixels wide) doesn't need scrolling in two directions. The Understanding document notes that data tables have a two-dimensional relationship between headers and data, so **the data table itself** is an exception and may scroll horizontally.

But the exception covers the table only. I set the viewport to 320px wide: only the table inside the wrapper scrolled horizontally, and the page itself had no horizontal scrollbar. Don't give the wrapper a fixed width, and don't let the table push out the layout around it.

## Support and progressive enhancement

- **Chrome**: in Chromium's source, the feature was experimental in 153–155 and **enabled by default from 156**.
- **Firefox and Safari**: at the time of writing, MDN's browser compatibility data has no entry for this feature, and I found no official information that either supports it.

Browsers without support treat `clip` as `hidden`, which gives you the old behavior: the first column still sticks, the header doesn't stick to the page, and the table still works.

To write styles for supporting browsers only, CSS Conditional 5 defines `named-feature()`:

```css
@supports named-feature(single-axis-scroll-container) {
  /* applies only with single-axis scroll container support */
}
```

In my tests, Chromium 159 applied it and Chromium 153 didn't.

## Full code

```html
<div class="table-wrap" role="group" aria-labelledby="sales-caption" tabindex="0">
  <table>
    <caption id="sales-caption">Monthly sales by product, 2026 (in thousands)</caption>
    <thead>
      <tr>
        <th scope="col">Product</th>
        <th scope="col">Jan</th>
        <!-- … -->
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Product 01</th>
        <td>412</td>
        <!-- … -->
      </tr>
    </tbody>
  </table>
</div>
```

```css
.table-wrap {
  --first-col: 7.5rem;
  overflow: auto clip; /* scroll horizontally; leave vertical scrolling to the page */
  scroll-padding-inline-start: var(--first-col);
}

table {
  /* with collapse, the borders of sticky cells stay behind */
  border-collapse: separate;
  border-spacing: 0;
}

thead th {
  position: sticky;
  top: 0;
  z-index: 1;
}

tbody th {
  position: sticky;
  left: 0;
  min-inline-size: var(--first-col);
}

thead th:first-child {
  left: 0;
  z-index: 2; /* the top-left cell sticks in both directions, so it goes on top */
}

/* sticky cells need a background, or content scrolling underneath shows through */
th {
  background-color: Canvas;
}
```

## Further reading

- [Zoomed In and the Top of Your Centered Content Is Gone? Make It Reachable with safe center](/en/blog/css-safe-alignment/)
- [Modern CSS & HTML Cheat Sheet: 116 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

## Related links

- [CSS Overflow Module Level 3 — single-axis scroll containers and computed values of overflow](https://drafts.csswg.org/css-overflow-3/#overflow-control "opens in new window"){target="_blank"}
- [CSS Positioned Layout Module Level 3 — sticky looks for a scroll container per axis](https://drafts.csswg.org/css-position-3/#stickypos-insets "opens in new window"){target="_blank"}
- [CSS Scroll Snap Module Level 1 — scroll-padding](https://drafts.csswg.org/css-scroll-snap-1/#scroll-padding "opens in new window"){target="_blank"}
- [CSS Conditional Rules Module Level 5 — named-feature()](https://drafts.csswg.org/css-conditional-5/#support-definition-named-features "opens in new window"){target="_blank"}
- [Single-Axis Scroll Containers explainer (Google)](https://github.com/explainers-by-googlers/single-axis-scroll-containers "opens in new window"){target="_blank"}
- [Chromium source — runtime_enabled_features.json5 (SingleAxisScrollContainers)](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/platform/runtime_enabled_features.json5 "opens in new window"){target="_blank"}
- [Understanding WCAG 2.2 — 2.4.11 Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html "opens in new window"){target="_blank"}
- [Understanding WCAG 2.2 — 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html "opens in new window"){target="_blank"}
- [Understanding WCAG 2.2 — 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html "opens in new window"){target="_blank"}
- [MDN — ARIA group role: scrollable content areas](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/group_role#scrollable_content_areas "opens in new window"){target="_blank"}
- [Interop proposal — Single-axis scroll containers (tracks browser progress)](https://github.com/web-platform-tests/interop/issues/1436 "opens in new window"){target="_blank"}
