---
title: "Why Does width: 100% Overflow Its Container? Fill It Exactly with stretch"
description: "When an element has margins, width: 100% overflows its container, and box-sizing can't fix it. width: stretch means \"fill the remaining space\", subtracting margins automatically, and it's the standard name for -webkit-fill-available. This post compares 100%, calc() and stretch with a live demo, covers how it behaves on buttons, inputs, flex and grid, and checks this site at 400% zoom width."
date: 2026-10-14
tags:
  - CSS
  - Front-End
  - Accessibility
  - Browser Support
category: frontend
translationKey: css-stretch
draft: false
---

> Up front: I tested the behavior in this post in Chromium 141 and 153, with the same results in both. For other browsers, check caniuse. If I've gotten something wrong, corrections welcome.

## Intro

To make an element fill its container, the first thing most of us reach for is `width: 100%`. It's fine most of the time, until the element gets a margin:

```css
.card {
  width: 100%;
  margin: 0 1rem;
}
```

This card ends up wider than its container, **overflowing to the right by twice the margin**. On a wide screen that might just be a little extra on the right, but at 400% zoom, with only 320px of width, it becomes a horizontal scrollbar on the whole page. That's exactly what WCAG 1.4.10 Reflow asks you to avoid at that width.

The `stretch` sizing keyword, from my [CSS & HTML cheat sheet](/en/blog/css-techniques-checklist), solves this.

First, here's what your browser supports:

::feature-support{features="stretch" notice="Your browser doesn't support width: stretch, so choosing stretch in the demo below falls back to auto."}
::

## 1. Why does 100% overflow?

`width: 100%` means "as wide as 100% of the container's content area", and **margins aren't included**; they're added on top.

The familiar `box-sizing: border-box` only folds padding and borders into the width; it can't do anything about margins. My test: a 400px container holding an element with `width: 100%` and 20px left and right margins:

| Markup | Element width | Result |
|---|---|---|
| `width: 100%` (content-box), plus a 5px border and 10px padding | 430px | Overflows by 70px (430 plus 40 of margins is 70 more than the container) |
| `width: 100%` plus `box-sizing: border-box` | 400px | Still overflows by 40px: the two margins |
| `width: stretch` | 360px | Fills exactly |

The old fix was `width: calc(100% - 40px)`, subtracting both margins yourself. But change the margin and the `calc()` has to change too, which is easy to forget.

## 2. width: stretch: fill the remaining space

```css
.card {
  width: stretch;
  margin: 0 1rem;
}
```

`stretch` means "make the outer edge of the margin line up with the container", in other words, the container's width minus the margins. Whatever the margin becomes, it works it out.

Switch the element and the value in the demo below, then drag the margin:

::stretch-demo
::

Try this:

1. With `<div>`, choose `100%`: the overflow is exactly the two margins added together.
2. Switch to `calc(100% - 32px)`: it fills when the margin is exactly 16px on each side (32px in total), but drag the margin bigger or smaller and it overflows or leaves a gap again.
3. Switch to `stretch`: whatever the margin, it fills exactly.
4. Choose `<button>` or `<input>` with `auto`: they don't fill by default, which is why we used to write `100%`. Switch to `stretch` and they fill exactly too.

## 3. Buttons and inputs are the main use

Block elements like `<div>` already fill the container with `width: auto`, margins subtracted, so they usually don't need a width at all. The elements that really need `stretch` are the ones that are only as wide as their content by default:

- **Buttons**: the full-width buttons common on mobile.
- **Inputs**: form fields that fill their column.

In my test, an `<input>` with `width: 100%`, `box-sizing: border-box` and 20px left and right margins overflowed a 400px container by 40px; with `width: stretch` it was exactly 360px.

`max-width: stretch` is handy too: an element with a fixed `width: 600px` and margins, placed in a 400px container, is capped at 360px with `max-width: stretch` and doesn't overflow. The usual `max-width: 100%` still gets pushed out by the margins.

## 4. How it behaves in different layouts

| Case | Result in my tests |
|---|---|
| The container has padding | Fills the container's content area without covering the padding |
| `height: stretch`, container has a fixed height | Fills the height, minus the top and bottom margins |
| `height: stretch`, container height is auto | Same as `auto`: determined by the content |
| Absolutely positioned with `width: stretch; height: stretch` | Fills the positioning container |
| Grid item with `justify-self: start` | Still fills the grid area |
| Flex item (in a row) | Starts at the container's width, then shrinks along with the other items; it isn't "the remaining space" |
| Images, tables, inline-block | All fill |
| Inline elements like `<span>` | No effect; inline elements ignore width anyway |

Watch the flex row: to "take the remaining space" in a horizontal flex container, you still want `flex: 1`, not `width: stretch`.

## 5. Without support

`stretch` is the standard name; browsers used to have their own prefixed versions: `-webkit-fill-available` in Chromium and Safari, `-moz-available` in Firefox.

```css
.button {
  width: 100%; /* last-resort fallback */
  width: -webkit-fill-available;
  width: -moz-available;
  width: stretch;
}
```

The browser uses the last line it understands. In my test, Chromium 141 supports both, with the same 360px result; I couldn't test Firefox's `-moz-available` here.

## 6. Checking this site

I ran all 83 pages of this site through a 320×256 viewport (a 1280×1024 screen zoomed to 400%), looking for anything that adds a horizontal scrollbar to the page.

- **`width: 100%` plus margin: none found.** The site's reset already sets `box-sizing: border-box`, so padding and borders don't overflow, and in my tests, elements with margins and `width: 100%` stayed inside their containers.
- **One different problem turned up**: in the demo in the English [hidden="until-found" post](/en/blog/hidden-until-found/), the "Collapse all and try again" button had `white-space: nowrap`, and the longer English label pushed 30px past the screen at 320px wide. That has nothing to do with `stretch`; removing `nowrap` so the text can wrap fixed it.

So this time nothing on the site needed changing to `stretch`. But from now on, when buttons or inputs need to fill their space, I'll write `stretch` instead of `100%` plus `calc()`.

## Conclusion

In a few lines:

- `width: 100%` doesn't include margins, so with margins it always overflows; `box-sizing: border-box` only covers padding and borders.
- `width: stretch` fills the container's space minus the margins, and adjusts whenever the margins change.
- It's most useful on buttons, inputs and other elements that don't fill by default; `max-width: stretch` also keeps fixed-width elements from overflowing.
- In a horizontal flex container, use `flex: 1` to take the remaining space.
- Without support, put `-webkit-fill-available` and `-moz-available` before it as fallbacks.

Those few dozen overflowing pixels become a horizontal scrollbar for people who zoom in. One less `calc()` is one less way to get it wrong.

## Related reading

- [Zoomed In and the Top of Your Centered Content Is Gone? Make It Reachable with safe center](/en/blog/css-safe-alignment/)
- [Why Can't Ctrl+F Find Collapsed Content? A Look at hidden="until-found"](/en/blog/hidden-until-found/)
- [Modern CSS & HTML Cheat Sheet: 115 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

## Related links

- [MDN — width](https://developer.mozilla.org/en-US/docs/Web/CSS/width "Open new window"){target="_blank"}
- [CSS Box Sizing Module Level 4 — stretch](https://drafts.csswg.org/css-sizing-4/#sizing-values "Open new window"){target="_blank"}
- [WCAG 2.2 — Understanding 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow "Open new window"){target="_blank"}
- [Can I use](https://caniuse.com "Open new window"){target="_blank"}
