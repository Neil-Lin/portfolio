---
title: "Modern CSS Techniques Cheat Sheet: 60+ Features, Support & What to Try Next"
description: "A scannable checklist of modern CSS techniques—grouped by layout, selectors, color, typography, animation and more—with each feature's purpose, example, and browser support, plus which ones to experiment with first."
date: 2026-07-06
tags:
  - CSS
  - Front-End
  - Web Development
  - Responsive Design
  - Accessibility
  - Browser Support
translationKey: css-techniques-checklist
draft: false
---

### Intro

This is my running checklist of modern CSS features—something I scan to decide which techniques to experiment with next. It's grouped by purpose (layout, selectors, color, typography, animation, forms, responsive, performance, functions & math), and each entry lists what it's for, an example, and browser support, plus whether I've already tried it.

### Legend

**Tried it**

- ✅ = I've experimented with it
- ⬜ = Not yet

**Support status** (as of early 2026; 🟠 / 🔴 move fast—re-check [caniuse](https://caniuse.com "opens in new window"){target="_blank"} / MDN before shipping)

- 🟢 Stable — broadly available across major browsers, safe for production
- 🟡 Newer — supported in most browsers; add a fallback
- 🟠 Experimental — only some browsers / behind a flag / just landed in Chrome
- 🔴 Proposed — not usable in browsers yet, or not actually a real property / selector

### A. Layout

| Property / Feature | Main use & when to use | Example | Support | Tried |
|---|---|---|---|---|
| `grid-template-rows: masonry` | Masonry (waterfall) layout without JS. WebKit proposes a rival "grid-lanes" approach; the spec is still being fought over | `grid-template-rows: masonry;` | 🟠 | ✅ |
| `subgrid` | Lets a child grid inherit the parent's tracks and gaps, so alignment snaps to the parent's lines; great for aligning elements across cards | `grid-template-columns: subgrid;` | 🟢 | ✅ |
| Container Queries | Responsive design based on the container's size (not the screen)—the key to true componentization | `container-type: inline-size;` + `@container (width > 400px){}` | 🟢 | ✅ |
| Anchor Positioning | Anchor one element's position to another (tooltip / popover / menu), replacing a lot of JS math | `anchor-name: --a;` + `top: anchor(--a bottom);` | 🟠 | ✅ |
| `@position-try` | Fallback for anchor positioning: auto-flip when there isn't enough room | `position-try-fallbacks: flip-block;` | 🟠 | ⬜ |
| `reading-flow` / `reading-order` | When flex/grid visual order is reordered, fix keyboard and screen-reader reading order (an accessibility must) | `reading-flow: flex-visual;` / `reading-order: 1;` | 🟠 | ✅ |
| Gap Decorations / styleable gaps | Draw separators in grid/flex gaps and control their style | `column-rule: 1px solid;` (applied to the gap) | 🟠 | ⬜ |
| `margin-inline` | Logical property; set both inline-axis margins at once (often `auto` to center) | `margin-inline: auto;` | 🟢 | ⬜ |

### B. Selectors

| Property / Feature | Main use & when to use | Example | Support | Tried |
|---|---|---|---|---|
| `:has()` | The "parent selector" / select by descendant or sibling state—a logic powerhouse | `.card:has(img){}` | 🟢 | ✅ |
| `::part()` | Style a specific element inside a Web Component from the outside (needs Shadow DOM knowledge) | `my-el::part(label){}` | 🟢 | ✅ |
| `:is()` / `:where()` | Group selectors; `:where()` has 0 specificity (lower than inline), `:is()` takes its highest-specificity member | `:is(h1,h2) :where(.x){}` | 🟢 | ✅ |
| `nth-of` syntax | `:nth-child(An+B of S)`—count the nth item within a filtered subset | `:nth-child(2 of .active){}` | 🟢 | ⬜ |
| `:placeholder-shown` | Style only while the placeholder is still showing (floating-label effect) | `input:placeholder-shown{}` | 🟢 | ✅ |
| `:in-range` / `:out-of-range` | Style form values inside/outside their min/max range | `input:out-of-range{}` | 🟢 | ✅ |
| `:user-valid` / `:user-invalid` | Show validation state only after the user has interacted—no angry red on load | `input:user-invalid{}` | 🟡 | ✅ |
| `sibling-index()` / `sibling-count()` | Get an element's index and total among siblings; enables staggered animation, dynamic widths | `--i: sibling-index();` | 🟠 | ✅ |
| `:snapped` | Want to select the currently snapped scroll-snap item; not a real selector yet—usually faked with scroll-driven animation | (simulated, not official) | 🔴 | ⬜ |
| `nth-letter` | Want to select the nth letter; no such selector—css-tricks fakes it with tricks | (faked, not official) | 🔴 | ⬜ |
| `:heading` | Select all headings at once; still a proposal | `:heading{}` | 🔴 | ⬜ |
| Carousel selectors | `::scroll-marker` / `scroll-marker-group` / `:target-current` for native carousels and scrollspy | `:target-current{}` | 🟠 | ⬜ |

### C. Color

| Property / Feature | Main use & when to use | Example | Support | Tried |
|---|---|---|---|---|
| New color functions (`oklch`-first) | `hwb/lab/lch/color()` for wider gamuts; I've settled on `oklch`, which supports the `oklch(from …)` relative syntax | `color: oklch(0.7 0.15 200 / 50%);` | 🟢 | ✅ |
| `color-mix()` | Mix two colors (best done in `oklch` space) for hover variants and transparent overlays | `color-mix(in oklch, red 40%, blue);` | 🟢 | ✅ |
| `contrast-color()` | Auto-pick a readable foreground color for a given background (compliance / readability) | `color: contrast-color(var(--bg));` | 🟠 | ⬜ |
| `accent-color` | One line to re-theme checkbox/radio/range and other system controls | `accent-color: rebeccapurple;` | 🟢 | ✅ |
| `light-dark()` | Give a property both a light and dark value at once; with `color-scheme` it skips the media query | `color: light-dark(#000, #fff);` | 🟢 | ✅ |
| `font-palette` / `@font-palette-values` | Custom palettes for color (COLR) fonts | `@font-palette-values --p{...}` + `font-palette: --p;` | 🟡 | ✅ |
| Gradient interpolation color space | `linear-gradient(in oklch …)` makes gradient transitions smoother and less muddy | `background: linear-gradient(in oklch, #4ba3f7, #9d2398);` | 🟢 | ⬜ |

### D. Typography

| Property / Feature | Main use & when to use | Example | Support | Tried |
|---|---|---|---|---|
| `text-wrap: balance` / `pretty` | `balance` evens out heading line widths; `pretty` avoids orphan words in body text (pretty is newer) | `text-wrap: balance;` | 🟡 | ✅ |
| `text-decoration-skip-ink` | Break the underline around descenders (g, y) for a cleaner look | `text-decoration-skip-ink: auto;` | 🟢 | ✅ |
| `text-combine-upright` | Lay numbers/Latin horizontally within vertical text ("tate-chu-yoko"); common in CJK long-form | `text-combine-upright: all;` | 🟡 | ✅ |
| `text-emphasis` | Emphasis dots/circles that track the character center; common CJK annotation | `text-emphasis: dot;` | 🟢 | ✅ |
| `ruby-align` | Alignment of ruby annotations (bopomofo / pinyin, etc.) | `ruby-align: center;` | 🟡 | ✅ |
| `paint-order` | Control the paint order of text fill vs. stroke (for outlined text) | `paint-order: stroke fill;` | 🟢 | ✅ |
| `box-decoration-break: clone` | On line/page breaks, apply border/radius/background to each fragment; especially nice for link focus | `box-decoration-break: clone;` | 🟡 | ✅ |
| `text-box-trim` | Trim the extra space above/below a font for precise vertical alignment | `text-box: trim-both cap alphabetic;` | 🟠 | ✅ |
| `line-clamp` (`-webkit-line-clamp`) | Show "…" after N lines; the new standard `line-clamp` is gradually replacing the webkit form | `-webkit-line-clamp: 3;` (needs `-webkit-box`) | 🟢 | ✅ |
| `hanging-punctuation` | Hang leading/trailing punctuation outside the edge for tidier alignment (Safari-first) | `hanging-punctuation: first last;` | 🟠 | ⬜ |
| `font-variant-numeric: tabular-nums` | Monospaced digits—essential for timers/prices/percentages that jitter (font must support it) | `font-variant-numeric: tabular-nums;` | 🟢 | ⬜ |
| `lh` unit | Set margin/spacing in line-height units so they scale with font size | `margin-bottom: 1.5lh;` | 🟡 | ⬜ |
| `margin-trim` | Trim margins of the first/last children in a container, avoiding `:first/:last-child` resets (Safari-first) | `margin-trim: block;` | 🟠 | ⬜ |

### E. Animation & Transition

| Property / Feature | Main use & when to use | Example | Support | Tried |
|---|---|---|---|---|
| Scroll-driven animation (formerly "@scroll-timeline") | Drive animation by scroll progress instead of time; the spec is now `animation-timeline: scroll()/view()` | `animation-timeline: scroll();` | 🟠 | ✅ |
| `@view-transition` / `transition-behavior` | Transitions for page/state changes; `allow-discrete` lets discrete properties like `display` transition | `transition-behavior: allow-discrete;` | 🟡 | ✅ |
| `@starting-style` | Define an element's first-appearance start styles; enables `display:none → shown` entry animations | `@starting-style{ opacity:0; }` | 🟡 | ✅ |
| `backface-visibility` | Whether the back face shows during a 3D flip (card-flip effect) | `backface-visibility: hidden;` | 🟢 | ✅ |
| `prefers-reduced-motion` | Detect the reduced-motion preference, an accessibility must; pairs with `prefers-color-scheme` for light/dark | `@media (prefers-reduced-motion: reduce){}` | 🟢 | ✅ |

### F. Forms & Components

| Property / Feature | Main use & when to use | Example | Support | Tried |
|---|---|---|---|---|
| `field-sizing: content` | Let input/textarea grow automatically to fit their content | `field-sizing: content;` | 🟠 | ✅ |
| Customizable `<select>` (`appearance: base-select`) | Fully style the native dropdown; options can hold icons/HTML | `select{ appearance: base-select; }` | 🟠 | ✅ |
| `<selectlist>` (formerly `<selectmenu>`) | A highly customizable dropdown component; renamed and folded into the "customizable select" track | `<selectlist>…</selectlist>` | 🟠 | ✅ |
| `::backdrop` | Style the layer behind `dialog.showModal()` or fullscreen | `dialog::backdrop{}` | 🟢 | ✅ |

### G. Responsive & Preferences

| Property / Feature | Main use & when to use | Example | Support | Tried |
|---|---|---|---|---|
| Media query range syntax | Write breakpoints with `<=`/`>=`, skipping the `min-width` + `320.01px` pain | `@media (width >= 320px){}` | 🟢 | ✅ |
| `prefers-color-scheme` | Detect dark/light theme preference | `@media (prefers-color-scheme: dark){}` | 🟢 | ✅ |
| `prefers-contrast` | Detect a request for more/less contrast | `@media (prefers-contrast: more){}` | 🟡 | ⬜ |
| `forced-colors` | Adjust for high-contrast / forced-colors mode (Windows High Contrast) | `@media (forced-colors: active){}` | 🟢 | ⬜ |
| `resolution` media | Switch by output device pixel density (e.g. Retina) | `@media (resolution >= 2dppx){}` | 🟢 | ✅ |
| Style Queries `@container style()` | Style by a container's custom-property value (e.g. theme); great for component variants | `@container style(--theme: dark){}` | 🟡 | ✅ |
| Scroll-State Queries | Style by a container's scroll state (e.g. `stuck`, `snapped`); can detect whether a sticky element is stuck | `@container scroll-state(stuck: top){}` | 🟠 | ✅ |

### H. Encapsulation & Performance

| Property / Feature | Main use & when to use | Example | Support | Tried |
|---|---|---|---|---|
| Cascade Layers `@layer` | Manage priority with layers to tame specificity in large projects | `@layer base, components, utilities;` | 🟢 | ✅ |
| `@scope` | Scope styles to a block with an optional lower bound, similar to CSS Modules scoping | `@scope (.card) to (.content){}` | 🟡 | ⬜ |
| `contain` | Declare inner layout/style independence to isolate reflow and boost performance | `contain: layout style;` | 🟢 | ✅ |
| `contain-intrinsic-size` | With `content-visibility: auto`, give an estimated size first to avoid scroll jumps; switches to auto once cached | `contain-intrinsic-size: auto 100px;` | 🟢 | ✅ |
| `scrollbar-gutter: stable` | Reserve the scrollbar gutter so content doesn't shift when the scrollbar appears | `scrollbar-gutter: stable;` | 🟡 | ⬜ |
| `scrollbar-color` / `scrollbar-width` | Customize scrollbar color and thickness | `scrollbar-color: #888 #eee;` | 🟡 | ✅ |
| `@supports` | Feature detection for progressive enhancement and fallbacks | `@supports (display: grid){}` | 🟢 | ✅ |

### I. Functions & Math

| Property / Feature | Main use & when to use | Example | Support | Tried |
|---|---|---|---|---|
| `round()` / `mod()` / `rem()` | Rounding and remainders in CSS, to align to a grid/rhythm | `width: round(down, 15.5px, 4px);` | 🟡 | ⬜ |
| Trig functions `sin/cos/tan` | Circular layouts, waveforms, angle math | `width: calc(sin(30deg) * 100px);` | 🟢 | ⬜ |
| `calc-size()` / `interpolate-size` | Animate transitions to keywords like `auto`/`min-content`, e.g. an accordion expanding to an unknown height | `interpolate-size: allow-keywords;` | 🟠 | ✅ |
| `random()` | Native random values in CSS (scatter, jitter effects) | `rotate: random(-5deg, 5deg);` | 🟠 | ✅ |
| `if()` | Conditional logic inside a property value | `display: if(style(--open: 1): block; else: none);` | 🟠 | ⬜ |
| `@function` | Custom CSS functions / a mixin-like concept, with parameters and a return value | `@function --double(--x){ result: calc(var(--x)*2); }` | 🟠 | ⬜ |

### J. Misc

| Property / Feature | Main use & when to use | Example | Support | Tried |
|---|---|---|---|---|
| Native Nesting | Sass/SCSS-style nesting without a preprocessor | `.card{ & .title{} }` | 🟢 | ✅ |
| `<img loading="lazy">` | Lazy-load images to improve first-paint performance | `<img loading="lazy">` | 🟢 | ✅ |
| `overscroll-behavior: contain` | Stop a scrolled-to-the-end block from scrolling the outer container (common for modals/sidebars) | `overscroll-behavior: contain;` | 🟢 | ✅ |
| `object-view-box` | Crop a region of an image directly in CSS, no separate cropped file needed | `object-view-box: inset(10% 10% 10% 10%);` | 🟠 | ✅ |
| Individual transform properties | `translate`/`rotate`/`scale` as their own properties, easier to animate separately | `rotate: 45deg; scale: 1.2;` | 🟢 | ⬜ |
| `border-image` | Complex borders from a sliced image, avoiding traditional slicing | `border-image: url(frame.png) 30 round;` | 🟢 | ⬜ |
| `corner-shape` | Corner shapes beyond `border-radius` (squircle / notched, etc.), used together with `border-radius` | `corner-shape: squircle; border-radius: 30px;` | 🟠 | ⬜ |
| Font smoothing (`-webkit-font-smoothing`) | The key to non-harsh text in dark mode: on macOS, light text on a dark background looks bold and glowing due to subpixel antialiasing; grayscale antialiasing makes it thinner and gentler. Non-standard, works only on certain platforms | `-webkit-font-smoothing: antialiased;` (+ `-moz-osx-font-smoothing: grayscale;`) | 🟡 | ✅ |
| `@when` / `@else` | CSS if/else conditional blocks; still a proposal, unusable in any browser | `@when supports(...){} @else{}` | 🔴 | ✅ |

### What to try next (recommended)

These are the ones I haven't checked off yet but are "stable 🟢 and high ROI," so they're worth doing first:

1. `margin-inline` and the individual transform properties (`translate`/`rotate`/`scale`)—an instant upgrade to everyday code.
2. `nth-of` syntax (`:nth-child(… of …)`)—a sharp tool for picking subsets.
3. `font-variant-numeric: tabular-nums`—add it to any number that jitters.
4. Gradient `in oklch`—one line to make every gradient cleaner.
5. `forced-colors` and `prefers-contrast`—round out accessibility detection (I've already done reduced-motion / color-scheme).
6. Trig functions and `round()`/`mod()`—handy for circular layouts or aligning to a rhythm.
7. `@scope` and `scrollbar-gutter: stable`—style scoping and scrollbar-shift issues in large projects.

> **Note:** Most items marked 🟠 / 🔴 only landed in Chrome in 2025–2026 or are still proposals, and support changes every quarter. Before shipping to production, treat [caniuse.com](https://caniuse.com "opens in new window"){target="_blank"} and MDN as the source of truth, and remember to add an `@supports` fallback for new features.

### References

- [Can I use (browser support lookup)](https://caniuse.com "opens in new window"){target="_blank"}
- [MDN Web Docs — CSS](https://developer.mozilla.org/en-US/docs/Web/CSS "opens in new window"){target="_blank"}
- [web.dev — Learn CSS](https://web.dev/learn/css "opens in new window"){target="_blank"}
- [Chrome for Developers — CSS](https://developer.chrome.com/tag/css "opens in new window"){target="_blank"}
- [CSS-Tricks](https://css-tricks.com "opens in new window"){target="_blank"}
