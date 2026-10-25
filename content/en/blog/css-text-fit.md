---
title: "Make a Headline Fill the Line Exactly: Testing text-fit, and the Trap Where Zooming Makes Text Smaller"
description: "text-fit grows text to fill its container, or shrinks it to fit, in one line of CSS instead of JavaScript. But in my tests, with plain grow, zooming the page made the text smaller, a larger default font size was cancelled out, and wrapped lines could overflow the container. This post uses a live demo to cover the syntax, where it fits and where it doesn't, and an accessible way to write it."
date: 2026-10-25
tags:
  - CSS
  - Front-End
  - Accessibility
  - Browser Support
category: frontend
translationKey: css-text-fit
draft: false
---

> Up front: I tested the behavior in this post in Chromium 153. Only Chromium supports `text-fit` so far, and the spec is still under discussion, so check caniuse and MDN for the details. If I've gotten something wrong, corrections welcome.

## Intro

Campaign headlines and magazine-cover titles are often designed so the text fills the line exactly. In Figma, a designer just drags the font size until it lines up, but a web page keeps changing width. Until now, the only way to do this was JavaScript that measures the text and recalculates the font size (FitText.js, for example), again every time the window resizes.

Chrome 150 added `text-fit`, which grows or shrinks text to fill its container in one line of CSS. It works well in my tests, but if you use the simplest form, **zooming the page makes the text smaller**.

First, check your browser's support:

::feature-support{features="text-fit" notice="Your browser doesn't support text-fit, so the text in the demo below keeps its original size; the test results in the post still apply."}
::

## 1. Syntax

```css
.hero-title {
  text-fit: grow; /* grow until the text fills the container's width */
}

.tab-label {
  white-space: nowrap; /* keep it on one line, or there's nothing to shrink */
  text-fit: shrink;    /* shrink when it's too long to fit */
}
```

`text-fit` takes up to three values, in a fixed order:

| Position | Values | Meaning |
|---|---|---|
| First (required) | `none` / `grow` / `shrink` | No scaling / grow to fill / shrink to fit |
| Second | `consistent` (default) / `per-line` / `per-line-all` | With multiple lines: one factor for all lines / each line scaled separately, except the last / every line scaled separately |
| Third | Percentage | The **maximum** factor with `grow`, the **minimum** with `shrink` |

```css
text-fit: grow per-line-all 200%; /* scale each line separately, up to 2x */
text-fit: shrink 80%;             /* shrink, but not below 80% */
```

Two things to note:

- **There's no `text-fit: auto`.** I got this wrong in my [cheat sheet](/en/blog/css-techniques-checklist) at first. Browsers don't recognize the value, so the whole declaration is ignored.
- **The computed `font-size` doesn't change.** The scaling is applied after layout, so `getComputedStyle()` still returns the original size. The element's height does grow with the scaled text, though, so it doesn't overlap the content below (except with fixed letter spacing; see section 5).

## 2. Try it

The demo has three scenarios: a campaign headline, an "Add to cart" button next to its German translation, and a headline that wraps. Resize the container, switch values, and tick "double the default font size" to see how much the text is actually scaled:

::text-fit-demo
::

With "double the default font size" ticked, the headline with plain `grow` stays almost the same size; with `grow per-line-all 200%` it grows. In "Wrapping headline", press "Find a width that overflows" to see the bug in section 3.

## 3. Accessibility tests: three things to watch out for

### 1. Zooming makes the text smaller

I tested a full-width campaign headline (the Chinese "週年慶全館五折", "Anniversary sale, 50% off"): the container is as wide as the viewport and the font size is `2rem`. The table shows the text's actual height on screen:

| Code | 100% zoom | 200% zoom | 400% zoom |
|---|---|---|---|
| No `text-fit` | 36px | 72px | 144px |
| `text-fit: grow` | 201px | **195px** | **185px** |
| `text-fit: grow per-line-all 200%` | 72px | 144px | 185px |

With plain `grow`, **zooming the page makes the text smaller and smaller**. Zooming narrows the viewport in CSS pixels, and `grow` then makes the text fill that narrower width, which cancels out the zoom.

This fails WCAG 1.4.4 (Resize Text). A CSSWG issue on this is still open: when the container's width follows the viewport, zooming may not change the text size at all.

**A maximum fixes it.** `grow 200%` caps the text at twice its size. It may not fill the line on wide screens, but zooming the page enlarges the text as expected.

### 2. A larger default font size is cancelled out

Some users raise the browser's default font size from 16px. I set it to 32px and tested again:

| Code | 16px default | 32px default |
|---|---|---|
| `text-fit: grow` | 201px | 201px (no change) |
| `text-fit: grow per-line-all 200%` | 72px | 144px |

With plain `grow`, the text always ends up scaled to the same width whatever the base size, so the user's setting has no effect.

`shrink` has the same problem. If a button's width is fixed at `300px`, `shrink` scales the text back down after the user enlarges it. Sizing the container in `rem` avoids this, because the container grows with the user's font size too.

### 3. When text wraps, the first line can overflow the container

This one is a bug I ran into. When a headline wraps on a narrow screen, the default `consistent` should use the factor of the widest line, per the spec, so no line overflows. At certain widths, though, Chromium 153 uses the factor of a shorter line instead:

- "週年慶全館商品五折起限時三天" in a 320px container: **the first line grew to 800px wide**, and the page scrolled horizontally.

I tested 4 strings at every 10px from 200 to 700px, 204 cases in total:

| Code | Overflowed |
|---|---|
| `grow` (default `consistent`) | 6 times |
| `grow 150%` | 6 times (capped, but it still overflows) |
| `grow per-line` | 0 times |
| `grow per-line-all` | 0 times |

Which widths trigger it depends on the font, so the widths in the demo may differ from mine; the demo's button lets your browser scan for one. For headlines that wrap, I recommend `per-line-all` for now.

As for WCAG 1.4.12 Text Spacing, `grow` is fine: when a user increases letter spacing, `grow` scales the text down a little to compensate, and nothing gets cut off. `shrink` has one exception; see section 5.

## 4. When is it a good fit?

At its core, `text-fit` **ties the font size to the container's width, not to how important the content is or to the user's settings**. So it suits the few places where the layout matters more than the font size, not a site-wide type system.

### Good fits

| Scenario | Code | Why |
|---|---|---|
| Campaign and landing-page headlines | `grow` + a maximum | Few words on one line, designed to fill the line |
| Magazine-style article cover titles | `grow per-line-all` + a maximum | The title is the visual focus, and filling each wrapped line is a common layout |
| Big numbers on dashboards and pricing cards | `grow` + a maximum | The number should be as large as possible without overflowing, and the card width changes with the layout |
| Translated buttons, tabs and navigation | `shrink` + a minimum + a wrapping fallback | Translated length is unpredictable (German is often several times longer than Chinese), and a little shrinking keeps it on one line |
| User-entered names (nicknames, product names) on fixed-width cards | `shrink` + a minimum | You can't control the length, and the occasional long string won't break the layout |

### Poor fits

| Scenario | Why |
|---|---|
| **Body text** | Each paragraph ends up a different size depending on its line width, so the text jumps between sizes as you read; body text is also where the user's font size matters most |
| **Regular heading levels (h2, h3)** | Heading size signals hierarchy. With `text-fit`, a short h3 can end up bigger than a long h2, and the visual hierarchy falls apart |
| **Form labels, error messages and help text** | People need to read these to complete a task; they shouldn't shrink to fit the layout |
| **Lists that need a consistent size** | Product-card titles, for example: each card has a different number of words, so `shrink` makes every card a different size and the grid looks messy |
| **Using `shrink` on content that shouldn't be crammed in** | When text doesn't fit, adjust the layout first (wrap, widen, or shorten the text); shrinking the font is the last resort |

### Rule of thumb

Ask yourself two questions first:

1. **Does making this text bigger or smaller affect whether people can understand it?** If so, don't use `text-fit`. It only suits places where the font size is decorative.
2. **Does this text get bigger when the user zooms the page?** Always add a percentage limit, and actually zoom to 200% and 400% to check.

## 5. What I recommend

**Headlines (`grow`):**

```css
.hero-title {
  /* rem: the base grows when the user raises the default font size */
  font-size: 3rem;
  /* percentage letter spacing: fixed spacing can make the grown text overlap the content around it */
  letter-spacing: 2%;
  /*
    per-line-all: scale each line separately, avoiding the first-line overflow when wrapping
    200%: grow at most 2x, so the text still gets bigger when the page is zoomed
  */
  text-fit: grow per-line-all 200%;
}
```

Make the base size large enough that the `200%` maximum covers common screen widths.

**Buttons and tabs (`shrink`):**

```css
.tab-list {
  container-type: inline-size; /* lets the container query below check the width */
}

.tab-label {
  letter-spacing: 5%;   /* percentage spacing shrinks along with the text */
  white-space: nowrap;  /* try to fit on one line first */
  text-fit: shrink 80%; /* shrink to 80% at most, so it stays readable */
}

/* When the container is too narrow, wrap instead of shrinking further; find the threshold by testing your longest translation */
@container (width < 12rem) {
  .tab-label {
    white-space: normal;
  }
}
```

`shrink 80%` alone isn't enough: if the text still doesn't fit at 80%, it overflows the button. Pair it with a container query that switches back to wrapping when it's too narrow.

Two more pitfalls I hit while testing:

- **On a `display: flex` or `grid` button, `text-fit` on the button has no effect.** Many design systems use flex buttons to align an icon with the text. Wrap the text in a `<span>`, put `text-fit` on the span, and give it `min-width: 0`. Flex items don't shrink below their content by default, so without it the text stretches the span and there's no room to shrink.

```css
.icon-button {
  display: inline-flex;
  align-items: center;
  gap: 0.25em;
}

.icon-button > .label {
  min-width: 0;         /* lets the span be narrower than its text, so text-fit has room to shrink */
  white-space: nowrap;
  text-fit: shrink 80%;
}
```

- **Use percentages for letter spacing.** With `letter-spacing` in a fixed unit like px, em or rem, I hit two problems:
  - **When growing, the text can overlap the content around it.** The text grows on screen, but the layout height doesn't. Testing 3 fonts, 5 strings, 4 widths and 2 values, fixed letter spacing caused this in 30 to 41 of 120 combinations; `normal` and percentages never did.
  - **When shrinking, `shrink` can give up entirely.** Fixed spacing doesn't shrink, so with a lot of characters in a narrow button the spacing alone can add up to more than the button's width, and `shrink` gives up and the text overflows at full size.

  With a percentage (relative to the font size, e.g. `letter-spacing: 5%`), neither problem showed up again. Users who increase spacing per WCAG 1.4.12 with a tool usually get a fixed `0.12em`, though, so they can still hit this, which is why the fallback above that switches to wrapping matters.

## 6. When it isn't supported

```css
@supports (text-fit: grow) {
  .hero-title {
    text-fit: grow per-line-all 200%;
  }
}
```

Browsers without support show the original font size; the headline just doesn't fill the line. It has to look fine at that size anyway, so there's no need for a JavaScript fallback.

## Conclusion

- `text-fit: grow` makes a headline fill the line in one line of CSS, and `shrink` makes text that's too long fit, replacing the old JavaScript approaches.
- **Always add a percentage limit.** Unlimited `grow` cancels out browser zoom and the user's font size, so zooming makes the text smaller.
- Use `per-line-all` for headlines that wrap. The default `consistent` makes the first line overflow at certain widths in Chromium 153.
- Give `shrink` a minimum and a wrapping fallback so the text never gets too small to read.
- On `text-fit` elements, set `letter-spacing` as a percentage.
- `text-fit` suits short text where the size is part of the visual design (headlines, big numbers, translated buttons), not body text, regular heading levels or form text.

## Related reading

- [Why Does width: 100% Overflow Its Container? Fill It Exactly with stretch](/en/blog/css-stretch/)
- [Zoomed In and the Top of Your Centered Content Is Gone? Make It Reachable with safe center](/en/blog/css-safe-alignment/)
- [Modern CSS & HTML Cheat Sheet: 115 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

## Related links

- [MDN — text-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-fit "Open new window"){target="_blank"}
- [CSS fit-width text explainer (Google)](https://github.com/explainers-by-googlers/css-fit-text "Open new window"){target="_blank"}
- [CSSWG issue #12886 — default scaling limit and accessibility](https://github.com/w3c/csswg-drafts/issues/12886 "Open new window"){target="_blank"}
- [WCAG 2.2 — Understanding 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text "Open new window"){target="_blank"}
- [Can I use](https://caniuse.com "Open new window"){target="_blank"}
