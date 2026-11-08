---
title: "Animating Link Underlines with text-decoration-inset: Hide the Underline at Rest and You Can Easily Fail WCAG 1.4.1"
description: "Since Chrome 157 and Firefox 146, text-decoration-inset can shorten or lengthen an underline, so underline animations no longer need extra elements. But in my tests, an inset of 50% makes the underline disappear entirely; a link that's “hidden at rest, shown on hover” fails WCAG (failure technique F73) when its color contrast with the surrounding text is under 3:1. This post covers the syntax, test results, and a safer way to animate."
date: 2026-11-08
tags:
  - CSS
  - Front-End
  - Accessibility
  - Browser Support
category: accessibility
translationKey: css-text-decoration-inset
draft: true
---

> Up front: this post was researched and drafted with help from AI (Anthropic's Claude), then read and checked by me. The behavior described was tested in Chromium 157, 159, and 153; specs, Chinese typography, accessibility guidance, and support are based on the W3C specs and WCAG documents, the W3C Requirements for Chinese Text Layout, MDN, and Chromium source linked at the end. If I've gotten something wrong, corrections welcome.

## What it solves

`text-decoration` on its own can't change the length of an underline. To animate an underline “growing”, you had to draw a separate line (for example with `::after` or a background gradient), which isn't a real underline.

`text-decoration-inset` moves the two ends of the underline directly:

```css
a {
  text-decoration-inset: 0.3em;      /* inset 0.3em at both ends */
  text-decoration-inset: -0.15em;    /* extend outward at both ends */
  text-decoration-inset: 1em -1em;   /* first value is the start, second is the end */
  text-decoration-inset: 10%;        /* percentages are based on the element's width */
}
```

The spec says positive values trim the line inward and negative values extend it outward; with two values, the first applies to the start and the second to the end. Percentages are based on the element's width, and when it wraps, `box-decoration-break` decides whether that's the whole width or each line's width. It can be animated with transitions.

## Support

| Browser | Version | Source |
|---|---|---|
| Chrome | 157 (shipped November 3, 2026) | Chromium source: experimental in 154–156, enabled by default from 157; MDN compatibility data also says 157 |
| Firefox | 146 | MDN's Firefox 146 release notes |
| Safari | Preview only | MDN compatibility data |

## Live demo

First, check what your browser supports:

::feature-support{features="text-decoration-inset" notice="Your browser doesn't support text-decoration-inset, so the underlines in the demo below always show in full."}
::

::text-decoration-inset-demo
::

## Tested: how long the underline actually is

I tested in Chromium 157 and 159 with 40px text (the link is 267px wide), measuring the underline's pixels in screenshots:

| `text-decoration-inset` | Where the underline is |
|---|---|
| `0` | As wide as the text |
| `0.5em` | 20px shorter at each end |
| `-0.5em` | 20px longer at each end, past the text |
| `1em -1em` | Start moves 40px in, end moves 40px out, shifting the whole line |
| `45%` | Only a short piece in the middle |
| **`50%` or more** | **Gone entirely** |

- **At 50%, the underline disappears.** That's how you'd write the “no underline at rest, expands from the middle on hover” effect.
- **It stays hidden in forced colors mode too**: emulating forced colors in Chromium, the `50%` underline still disappears; the browser doesn't bring it back.
- **Unsupported browsers ignore the property**: in Chromium 153, every value in the table above shows a full underline. So in unsupported browsers the underline actually can't be hidden.

## Accessibility notes

### 1. The link has to be identifiable at rest: hover-only doesn't count

WCAG 1.4.1 Use of Color says color must not be the only way information is conveyed. When a link differs from the surrounding text only by color, W3C's failure technique F73 is blunt:

> “If the non-color cue only happens when the mouse hovers over the link or when the link receives focus, it is still a failure.”

So hiding the underline with `text-decoration-inset: 50%` and expanding it on hover **leaves the link identifiable only by color at rest**.

The exception is W3C's technique G183: a link can go without an underline if its color contrast with the surrounding text is at least 3:1. But G183 also cautions that, especially with dark colors, differences can be hard to see even at 3:1, and suggests adding an underline anyway. I measured this site: the contrast between links and body text is only about 1:1, so without the underline you can't tell them apart at all.

The demo's readout calculates this contrast live and checks whether there's an underline at rest.

**A safer way to animate**: keep a visible underline at rest, and only make it “grow” or “extend”.

```css
a {
  text-decoration-inset: 0.3em;   /* slightly trimmed at rest, still visible */
  transition: text-decoration-inset 300ms ease-out;
}
a:hover,
a:focus-visible {
  text-decoration-inset: 0;       /* expands to full */
}
```

### 2. Give keyboard focus the same effect

With only `:hover`, keyboard users never see the change. In my tests, with only `:hover`, tabbing to the link left `text-decoration-inset` unchanged; adding `:focus-visible` made it expand too. Focus still needs a clear focus indicator; the underline change is just a supplement.

### 3. Respect reduced motion

When users turn on reduced motion in their system settings, remove the transition with `prefers-reduced-motion` (W3C technique C39):

```css
@media (prefers-reduced-motion: reduce) {
  a {
    transition: none;
  }
}
```

The underline still changes; it just doesn't animate. The demo's “Simulate reduced motion” does exactly this.

## `auto`: keep adjacent proper noun marks apart

The spec also defines `auto`: the browser picks an inset so that two adjacent underlined elements don't look like one line. The spec specifically notes that **this matters in Chinese, where underlining is a form of punctuation**, using two adjacent personal names as its example.

That punctuation is the proper noun mark. The W3C Requirements for Chinese Text Layout (clreq) says the proper noun mark “is positioned at the line foot of proper nouns such as a person's name, the name of a place, etc.”, and “when two proper nouns are adjacent to each other, the side of the proper noun mark close to the adjacent one is shortened (to visually separate the two proper noun marks for easier distinction), while the other side remains unchanged.”

```css
u {
  text-decoration-inset: auto;
}
```

In my tests in Chromium 157 and 159 (40px text), two adjacent `<u>` elements show one continuous line by default; with `auto`, they split into two. But Chromium **insets both ends of each segment by about 2px**, including the outer ends, which differs from clreq's “the other side remains unchanged”. You can compare them in the lower part of the demo. Chromium 153 doesn't support it, so the two stay joined.

## Takeaway

`text-decoration-inset` lets underline animations use a real underline again, with simple code. But it can shrink the underline to nothing, so **always keep a visible underline at rest** and only animate it extending; give `:focus-visible` the same effect, and respect reduced motion. Unsupported browsers show the full underline, so they need no special handling.

## Further reading

- [Modern CSS & HTML Cheat Sheet: 116 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)
- [An iframe That Grows with Its Content: frame-sizing Only Measures at Load, So After Users Adjust Text It's Up to You](/en/blog/css-frame-sizing/)

## Related links

- [W3C — CSS Text Decoration Module Level 4: text-decoration-inset](https://drafts.csswg.org/css-text-decor-4/#text-decoration-inset-property "opens in new window"){target="_blank"}
- [MDN — text-decoration-inset](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-decoration-inset "opens in new window"){target="_blank"}
- [MDN — Firefox 146 release notes](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/146 "opens in new window"){target="_blank"}
- [MDN browser-compat-data — text-decoration-inset](https://github.com/mdn/browser-compat-data/blob/main/css/properties/text-decoration-inset.json "opens in new window"){target="_blank"}
- [Chromium source — runtime_enabled_features.json5 (CSSTextDecorationInset)](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/platform/runtime_enabled_features.json5 "opens in new window"){target="_blank"}
- [W3C — Requirements for Chinese Text Layout (clreq): proper noun marks](https://www.w3.org/International/clreq/#id88 "opens in new window"){target="_blank"}
- [Understanding WCAG 2.2 — 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html "opens in new window"){target="_blank"}
- [WCAG failure F73 — links that are not visually evident without color vision](https://www.w3.org/WAI/WCAG22/Techniques/failures/F73 "opens in new window"){target="_blank"}
- [WCAG technique G183 — a contrast ratio of at least 3:1 to distinguish links from surrounding text](https://www.w3.org/WAI/WCAG22/Techniques/general/G183 "opens in new window"){target="_blank"}
- [WCAG technique C39 — using prefers-reduced-motion to prevent motion](https://www.w3.org/WAI/WCAG22/Techniques/css/C39 "opens in new window"){target="_blank"}
