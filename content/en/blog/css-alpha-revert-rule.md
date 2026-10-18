---
title: "One Line to Change Opacity with alpha(), One Line to Roll Back with revert-rule: Testing Two Small CSS Tools"
description: "alpha() changes the opacity of a color stored in a variable, whether it was written as hex, rgb, hsl or oklch; revert-rule rolls a property back to the value it would have \"if this rule didn't exist\". This post uses a live demo to compare what each color format becomes after alpha(), tests the contrast of semi-transparent colors on light and dark backgrounds, and sorts out how revert-rule differs from revert and revert-layer."
date: 2026-10-15
tags:
  - CSS
  - Front-End
  - Accessibility
  - Browser Support
category: frontend
translationKey: css-alpha-revert-rule
draft: false
---

> Up front: I could only test `alpha()` and `revert-rule` in Chromium 153; 141 doesn't support them yet. For other browsers, check caniuse. If I've gotten something wrong, corrections welcome.

## Intro

My [CSS & HTML cheat sheet](/en/blog/css-techniques-checklist) has two small Baseline 2026 tools, and I practiced them together this time:

- **`alpha()`**: changes only a color's opacity.
- **`revert-rule`**: rolls a property back to the value it would have "if this rule didn't exist".

First, here's what your browser supports:

::feature-support{features="alpha-color,revert-rule" notice="Your browser doesn't support alpha() or revert-rule, so the demo below uses relative color syntax instead."}
::

## 1. alpha(): how awkward opacity used to be

Semi-transparent colors are everywhere: hover backgrounds, borders, shadows, overlays. The problem is that colors usually live in variables, and you can't just add opacity to a variable's color:

```css
:root {
  --brand: #7c3aed;
}
.tag {
  background: var(--brand) / 20%; /* not a thing */
}
```

The old approaches each have a cost:

| Approach | Code | Cost |
|---|---|---|
| Store a separate semi-transparent color | `--brand-20: rgb(124 58 237 / 20%)` | One more variable for every opacity |
| Store only the color channels | `--brand: 124 58 237` with `rgb(var(--brand) / 20%)` | The variable isn't a complete color and can't be used on its own |
| Relative color syntax | `rgb(from var(--brand) r g b / 20%)` | You need to know the original color space and spell out every channel |

My site uses the second approach: the color variables hold the three oklch channels, used as `oklch(var(--pd-c) / 40%)`.

`alpha()` makes it one line:

```css
.tag {
  background: alpha(from var(--brand) / 20%);
}
```

The same code works whether `--brand` was hex, rgb, hsl or oklch.

## 2. Testing every color format

The demo below stores the same purple (`#7c3aed`) in a variable in different formats, then changes its opacity with `alpha()`. You can see the browser's computed value and the contrast on a white and a dark background. The demo starts at 100%; lower the opacity and watch the contrast change:

::alpha-color-demo
::

Here's what each format computed to after `alpha(from … / 50%)` in my tests:

| Original format | Computed value |
|---|---|
| `#7c3aed` | `rgba(124, 58, 237, 0.5)` |
| `rebeccapurple` | `rgba(102, 51, 153, 0.5)` |
| `rgb(124 58 237)` | `rgba(124, 58, 237, 0.5)` |
| `hsl(262 83% 58%)` | `rgba(124, 59, 237, 0.5)` |
| `hwb(262 23% 7%)` | `rgba(124, 59, 237, 0.5)` |
| `oklch(54.1% 0.247 293)` | `oklch(0.541 0.247 293 / 0.5)` |
| `oklab(…)`, `lab(…)`, `lch(…)` | Keep their own color space, plus `/ 0.5` |
| `color(display-p3 …)` | `color(display-p3 … / 0.5)` |
| `currentColor` | Resolved to the current text color first, then given the opacity |
| `transparent` | `rgba(0, 0, 0, 0.5)`: **half-transparent black** |

The key points:

- **Hex, named colors, rgb, hsl and hwb all become `rgba()`.** They're all sRGB to begin with, so the browser represents them uniformly as `rgba()`. Converting from hsl rounds the green channel by 1.
- **oklch, oklab, lab, lch and display-p3 keep their own color space.** They aren't converted to sRGB, so wide-gamut colors aren't clipped.
- **The opacity replaces, it doesn't multiply**: `#7c3aedcc` or `rgba(…, 0.8)`, already at 80%, becomes 50% with `/ 50%`, not 40%.
- **No opacity means the original color**: `alpha(from red)` is still red.
- **The `transparent` trap**: `transparent` is really "fully transparent black", so at 50% it becomes half-transparent black, and at 100% it even becomes solid black.

## 3. Contrast for semi-transparent colors uses the composited color

This is the part of the demo I most want people to see. For the same purple, `#7c3aed`, my measurements:

| Opacity | White background | Dark background (`#121212`) |
|---|---|---|
| 100% | 5.70:1, normal text ✓ | 3.29:1, normal text ✗, large text & UI ✓ |
| 50% | 2.27:1, all ✗ | 1.66:1, all ✗ |

A few things:

- **The same color has different contrast on a different background.** A text color that works on white may not be enough in dark mode.
- **The contrast of a semi-transparent color depends on what's underneath.** You first blend the color with the background into the color people actually see, then calculate contrast from that. That's what the demo does: paint the background on a canvas, paint the semi-transparent color over it, read the resulting color, then apply the WCAG formula.
- **Both WCAG 1.4.3 and 1.4.11 apply**: normal text needs 4.5:1, while large text (about 24px, or about 18.66px bold) and UI components and graphics need 3:1. Semi-transparent borders and icons still need 3:1.
- **Testing tools use the composited color too**: when I ran axe on the demo set to 50%, it reported 2.27:1 and 1.65:1; the demo's own calculation gives 2.27:1 and 1.66:1, so they differ only by rounding in the second decimal place. That's why the demo starts at 100%; the contrast failures appear as you lower it.

So `alpha()` makes semi-transparent colors easy to write, but you still have to check contrast on every background they'll appear on.

## 4. revert-rule: roll back to "as if this rule didn't exist"

CSS already has `revert` and `revert-layer`; `revert-rule` is the third in the family. The difference is where they roll back to:

```css
@layer base, theme;
@layer base  { .t { color: green; } }
@layer theme { .t { color: blue; } }
.t { color: red; }

.t.a { color: revert; }       /* tested: black */
.t.b { color: revert-layer; } /* tested: blue */
.t.c { color: revert-rule; }  /* tested: red */
```

| Keyword | Rolls back to | Result above |
|---|---|---|
| `revert` | The browser's default styles | Black |
| `revert-layer` | The previous `@layer`. Unlayered rules are skipped as a whole, going straight to the last layer | Blue (the `theme` layer) |
| `revert-rule` | Skips only its own rule | Red (the previous `.t`) |

`revert-rule` has the smallest reach: it only takes its own rule out.

**Watch out: it's the whole rule, not one declaration**

```css
.base { color: green; }
.y { color: blue; color: revert-rule; }
```

I expected blue (rolling back to the `blue` earlier in the same rule), but the result was **green**: the entire `.y` rule is treated as if it didn't exist, including the `blue` before it.

## 5. Where revert-rule shines: with if()

A rule containing nothing but `color: revert-rule` is pointless; you could just delete the rule. Where it really helps is in conditions with `if()`:

```css
.btn {
  display: inline-flex;
}
.btn {
  display: if(style(--hidden: 1): none; else: revert-rule);
}
```

When the condition holds, it's hidden; otherwise it's "as if this rule didn't exist", so it goes back to `inline-flex`. In my test, a button without `--hidden` was `inline-flex`, and one with `--hidden: 1` was `none`.

Before, you had to write `else: inline-flex`, repeating the original value. Change the original and this has to change too, which is easy to miss. Media queries work as well:

```css
.card { padding: 16px; }
.card { padding: if(media(width < 600px): 8px; else: revert-rule); }
```

In my test it was 16px on a wide screen and 8px on a narrow one.

For accessibility, this "otherwise keep the original" pattern means fewer places to forget an update across dark mode, forced colors and zoom. The original styles are written once, and the conditional branch doesn't need a copy.

## 6. Without support

**alpha()**: put relative color syntax first as a fallback. Chromium 141 doesn't support `alpha()`, but it does support relative color syntax:

```css
.tag {
  background: rgb(from var(--brand) r g b / 20%);
  background: alpha(from var(--brand) / 20%);
}
```

That's what the demo does in browsers without `alpha()`. Note that relative color syntax needs a color space: `rgb(from …)` converts to sRGB, so for wide-gamut colors use `oklch(from var(--brand) l c h / 20%)` instead.

**revert-rule**: browsers without support treat the whole declaration as invalid and skip it. In my 141 test, `revert-rule` in a **separate rule** happened to give the same result as with support, rolling back to the previous rule. In the **same rule** it differs: 141 used the earlier `blue` in that rule, while 153 rolled back to the green further up.

## Conclusion

In a few lines:

- `alpha(from var(--c) / 50%)` changes the opacity of a color in a variable, whatever format it was written in.
- sRGB formats like hex, rgb and hsl become `rgba()`; oklch, lab and display-p3 keep their color space.
- The opacity replaces rather than multiplies; `transparent` with an opacity turns black.
- Contrast for semi-transparent colors uses the composited color, checked on every background.
- `revert-rule` skips only its own rule, and the whole of it; it's best paired with `if()` for "otherwise keep the original".

Both are tiny bits of syntax, and both cut repetition: no more storing a color several times, no more writing a default value twice.

## Related reading

- [Zoomed In and the Top of Your Centered Content Is Gone? Make It Reachable with safe center](/en/blog/css-safe-alignment/)
- [Why Does width: 100% Overflow Its Container? Fill It Exactly with stretch](/en/blog/css-stretch/)
- [Modern CSS & HTML Cheat Sheet: 115 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

## Related links

- [CSS Color Module Level 5 (alpha() and relative color syntax)](https://drafts.csswg.org/css-color-5/ "Open new window"){target="_blank"}
- [MDN — Relative colors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Relative_colors "Open new window"){target="_blank"}
- [CSS Cascading and Inheritance (the revert keywords)](https://drafts.csswg.org/css-cascade/ "Open new window"){target="_blank"}
- [WCAG 2.2 — Understanding 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum "Open new window"){target="_blank"}
- [WCAG 2.2 — Understanding 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast "Open new window"){target="_blank"}
- [Can I use](https://caniuse.com "Open new window"){target="_blank"}
