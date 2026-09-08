---
title: "Modern CSS & HTML Cheat Sheet: 95 Features, Support & What to Try Next"
description: "A scannable checklist of modern CSS and HTML features—grouped by layout, selectors, color, typography, animation and more, plus declarative HTML additions like `<geolocation>`, `focusgroup` and Invoker Commands—each with its purpose, an example, and browser support."
date: 2026-07-06
updatedAt: 2026-09-08
tags:
  - CSS
  - HTML
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

The last section (K) is HTML rather than CSS. It lives in the same checklist because it's doing the same job: **turning things that used to need a pile of JavaScript into one declarative line**—and several entries are two halves of the same feature (`appearance: base-select` and `<selectedcontent>`, anchor positioning and popover, `reading-flow` and `focusgroup`), so splitting them apart would make the list harder to use, not easier.

### Legend

**Tried it**

- ✅ = I've experimented with it
- ⬜ = Not yet

**Support status** (as of September 2026; 🟠 / 🔴 move fast—re-check [caniuse](https://caniuse.com "opens in new window"){target="_blank"} / MDN before shipping)

- 🟢 Stable — broadly available across major browsers, safe for production
- 🟡 Newer — supported in most browsers; add a fallback
- 🟠 Experimental — only some browsers / behind a flag / just landed in Chrome
- 🔴 Proposed — still at the proposal stage, not usable in browsers yet

### A. Layout

| Property / Feature | Main use & when to use | Example | Support | Tried |
|---|---|---|---|---|
| `grid-template-rows: masonry` | Masonry (waterfall) layout without JS. WebKit proposes a rival "grid-lanes" approach; the spec is still being fought over | `grid-template-rows: masonry;` | 🟠 | ✅ |
| `subgrid` | Lets a child grid inherit the parent's tracks and gaps, so alignment snaps to the parent's lines; great for aligning elements across cards | `grid-template-columns: subgrid;` | 🟢 | ✅ |
| Container Queries | Responsive design based on the container's size (not the screen)—the key to true componentization | `container-type: inline-size;` + `@container (width > 400px){}` | 🟢 | ✅ |
| Anchor Positioning | Anchor one element's position to another (tooltip / popover / menu), replacing a lot of JS math | `anchor-name: --a;` + `top: anchor(--a bottom);` | 🟠 | ✅ |
| `@position-try` | Fallback for anchor positioning: auto-flip when there isn't enough room | `position-try-fallbacks: flip-block;` | 🟠 | ⬜ |
| `reading-flow` / `reading-order` | When flex/grid visual order is reordered, fix keyboard and screen-reader reading order (an accessibility must) | `reading-flow: flex-visual;` / `reading-order: 1;` | 🟠 | ✅ |
| Gap Decorations (`row-rule` / `column-rule` / `rule`) | Draw and style separators directly in grid/flex gaps—no more divider elements; plus fine-grain `rule-inset`/`rule-overlap`/`rule-visibility-items` (Chrome/Edge 149+) | `column-rule: 1px solid; row-rule: 1px solid;` or shorthand `rule: 1px solid;` | 🟡 | ✅ |
| `margin-inline` | Logical property; set both inline-axis margins at once (often `auto` to center) | `margin-inline: auto;` | 🟢 | ✅ |
| Two-value display | Write outer × inner display separately: `display: block flex` etc.; `flex` = `block flex`, `inline-flex` = `inline flex`. Clarifies display's two layers; single-value shorthands still fine day-to-day | `display: inline flex;` | 🟡 | ✅ |

### B. Selectors

| Property / Feature | Main use & when to use | Example | Support | Tried |
|---|---|---|---|---|
| `:has()` | The "parent selector" / select by descendant or sibling state—a logic powerhouse | `.card:has(img){}` | 🟢 | ✅ |
| `::part()` | Style a specific element inside a Web Component from the outside (needs Shadow DOM knowledge) | `my-el::part(label){}` | 🟢 | ✅ |
| `:is()` / `:where()` | Group selectors; `:where()` has 0 specificity (lower than inline), `:is()` takes its highest-specificity member | `:is(h1,h2) :where(.x){}` | 🟢 | ✅ |
| `nth-of` syntax | `:nth-child(An+B of S)`—count the nth item within a filtered subset | `:nth-child(2 of .active){}` | 🟢 | ✅ |
| `:placeholder-shown` | Style only while the placeholder is still showing (floating-label effect) | `input:placeholder-shown{}` | 🟢 | ✅ |
| `:in-range` / `:out-of-range` | Style form values inside/outside their min/max range | `input:out-of-range{}` | 🟢 | ✅ |
| `:user-valid` / `:user-invalid` | Show validation state only after the user has interacted—no angry red on load | `input:user-invalid{}` | 🟡 | ✅ |
| `sibling-index()` / `sibling-count()` | Get an element's index and total among siblings; enables staggered animation, dynamic widths | `--i: sibling-index();` | 🟠 | ✅ |
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
| Gradient interpolation color space | `linear-gradient(in oklch …)` makes gradient transitions smoother and less muddy | `background: linear-gradient(in oklch, #4ba3f7, #9d2398);` | 🟢 | ✅ |

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
| `font-variant-numeric: tabular-nums` | Monospaced digits—essential for timers/prices/percentages that jitter (font must support it) | `font-variant-numeric: tabular-nums;` | 🟢 | ✅ |
| `lh` unit | Set margin/spacing in line-height units so they scale with font size | `margin-bottom: 1.5lh;` | 🟡 | ✅ |
| `margin-trim` | Trim margins of the first/last children in a container, avoiding `:first/:last-child` resets (Safari-first) | `margin-trim: block;` | 🟠 | ⬜ |
| `text-fit` | Auto-scales font size so text exactly fills its container's width—responsive headlines without manual math or JS (new in Chrome 150) | `h1 { text-fit: auto; }` | 🟠 | ⬜ |

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
| Customizable `<select>` (`appearance: base-select`) | Fully style the native dropdown; options can hold icons/HTML. Pair it with `::picker(select)` and `::picker-icon` to style the popup, and `<selectedcontent>` to clone the chosen option. You finally don't have to rebuild a select out of divs just to style it — and rebuilding it is a classic source of accessibility disasters (Chrome first; Safari has caught up) | `select{ appearance: base-select; }` | 🟡 | ✅ |
| `<selectlist>` (formerly `<selectmenu>`) | A highly customizable dropdown component; renamed and folded into the "customizable select" track | `<selectlist>…</selectlist>` | 🟠 | ✅ |
| `::backdrop` | Style the layer behind `dialog.showModal()` or fullscreen | `dialog::backdrop{}` | 🟢 | ✅ |

### G. Responsive & Preferences

| Property / Feature | Main use & when to use | Example | Support | Tried |
|---|---|---|---|---|
| Media query range syntax | Write breakpoints with `<=`/`>=`, skipping the `min-width` + `320.01px` pain | `@media (width >= 320px){}` | 🟢 | ✅ |
| `prefers-color-scheme` | Detect dark/light theme preference | `@media (prefers-color-scheme: dark){}` | 🟢 | ✅ |
| `prefers-contrast` | Detect a request for more/less contrast | `@media (prefers-contrast: more){}` | 🟡 | ✅ |
| `forced-colors` | Adjust for high-contrast / forced-colors mode (Windows High Contrast) | `@media (forced-colors: active){}` | 🟢 | ✅ |
| `resolution` media | Switch by output device pixel density (e.g. Retina) | `@media (resolution >= 2dppx){}` | 🟢 | ✅ |
| Style Queries `@container style()` | Style by a container's custom-property value (e.g. theme); great for component variants | `@container style(--theme: dark){}` | 🟡 | ✅ |
| Scroll-State Queries | Style by a container's scroll state (e.g. `stuck`, `snapped`); can detect whether a sticky element is stuck | `@container scroll-state(stuck: top){}` | 🟠 | ✅ |

### H. Encapsulation & Performance

| Property / Feature | Main use & when to use | Example | Support | Tried |
|---|---|---|---|---|
| Cascade Layers `@layer` | Manage priority with layers to tame specificity in large projects | `@layer base, components, utilities;` | 🟢 | ✅ |
| `@scope` | Scope styles to a block with an optional lower bound, similar to CSS Modules scoping | `@scope (.card) to (.content){}` | 🟡 | ✅ |
| `contain` | Declare inner layout/style independence to isolate reflow and boost performance | `contain: layout style;` | 🟢 | ✅ |
| `contain-intrinsic-size` | With `content-visibility: auto`, give an estimated size first to avoid scroll jumps; switches to auto once cached | `contain-intrinsic-size: auto 100px;` | 🟢 | ✅ |
| `scrollbar-gutter: stable` | Reserve the scrollbar gutter so content doesn't shift when the scrollbar appears | `scrollbar-gutter: stable;` | 🟡 | ✅ |
| `scrollbar-color` / `scrollbar-width` | Customize scrollbar color and thickness | `scrollbar-color: #888 #eee;` | 🟡 | ✅ |
| `@supports` | Feature detection for progressive enhancement and fallbacks | `@supports (display: grid){}` | 🟢 | ✅ |

### I. Functions & Math

| Property / Feature | Main use & when to use | Example | Support | Tried |
|---|---|---|---|---|
| `round()` / `mod()` / `rem()` | Rounding and remainders in CSS, to align to a grid/rhythm | `width: round(down, 15.5px, 4px);` | 🟡 | ✅ |
| Trig functions `sin/cos/tan` | Circular layouts, waveforms, angle math | `width: calc(sin(30deg) * 100px);` | 🟢 | ✅ |
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
| Individual transform properties | `translate`/`rotate`/`scale` as their own properties, easier to animate separately | `rotate: 45deg; scale: 1.2;` | 🟢 | ✅ |
| `border-image` | Complex borders from a sliced image, avoiding traditional slicing | `border-image: url(frame.png) 30 round;` | 🟢 | ✅ |
| `background-clip: border-area` | Clips the background to the area painted by the border strokes (respecting `border-width`/`border-style`, ignoring `border-color` transparency), so gradient borders work natively instead of via `border-image` workarounds (new in Chrome 150) | `border: 3px solid transparent; background: linear-gradient(45deg, red, blue); background-clip: border-area;` | 🟠 | ⬜ |
| `corner-shape` | Corner shapes beyond `border-radius` (squircle / notched, etc.), used together with `border-radius` | `corner-shape: squircle; border-radius: 30px;` | 🟠 | ⬜ |
| Font smoothing (`-webkit-font-smoothing`) | The key to non-harsh text in dark mode: on macOS, light text on a dark background looks bold and glowing due to subpixel antialiasing; grayscale antialiasing makes it thinner and gentler. Non-standard, works only on certain platforms | `-webkit-font-smoothing: antialiased;` (+ `-moz-osx-font-smoothing: grayscale;`) | 🟡 | ✅ |
| `@when` / `@else` | CSS if/else conditional blocks; still a proposal, unusable in any browser | `@when supports(...){} @else{}` | 🔴 | ✅ |

### K. HTML Elements & Attributes (Not CSS, but the Same "Declarative Instead of JS" Trend)

Strictly speaking this section isn't CSS, but it points the same way modern CSS does: **taking things that used to need a pile of JavaScript and making them declarative** — and most of them affect accessibility quality directly, so they belong in the same checklist.

#### K-1. New HTML elements

| Element | Main use & when to use | Example | Support | Tried |
|---|---|---|---|---|
| `<geolocation>` | A declarative button for location requests: the browser owns the permission flow and — crucially — offers a recovery path for users who previously denied access (which used to be a dead end). Degrades to a `<span>` where unsupported, so it progressively enhances | `<geolocation onlocation="fn(event)">` | 🟠 | ⬜ |
| `<usermedia>` | Declarative camera/microphone access that hands the page a `MediaStream` directly, with no `getUserMedia()` call of your own. Video-only `<camera>` and audio-only `<microphone>` variants are planned | `<usermedia>` | 🟠 | ⬜ |
| `<install>` | An install button for PWAs whose label and appearance the browser controls (users who click "Install" aren't surprised by what happens next). Point `installurl` elsewhere to install apps from other origins — enough to build a catalogue page | `<install installurl="…" manifestid="…">` | 🟠 | ⬜ |
| `<model>` | Embed an interactive 3D model (USDZ) as easily as an `<img>`; supply multiple formats via `<source>` and custom lighting via `environmentmap` | `<model src="a.usdz">` | 🟠 | ⬜ |

#### K-2. New HTML attributes & behaviours

| Property / Feature | Main use & when to use | Example | Support | Tried |
|---|---|---|---|---|
| `focusgroup` | Declaratively gives composite widgets (toolbars, tab lists, menus) arrow-key navigation, a guaranteed tab stop, and last-focused memory — exactly the WAI-ARIA keyboard pattern you previously had to hand-roll with roving tabindex (new in Chrome 150) | `<div focusgroup>…</div>` | 🟠 | ⬜ |
| Invoker Commands (`command` / `commandfor`) | Control a popover/dialog with declarative HTML buttons, no scripting. Landed stable: `show-modal`, `close`, `request-close`, `toggle-popover`, `show-popover`, `hide-popover` (Baseline 2025; more coming — media controls, copy text, etc.) | `<button command="show-modal" commandfor="dlg">Open</button>` | 🟡 | ⬜ |
| Interest Invokers | The same command mechanism, but triggered by "showing interest" (hover/focus) rather than a click — enough to build a native tooltip with no JS | `<button interestfor="tip">` | 🟠 | ⬜ |
| `hidden="until-found"` | Content stays collapsed but is still reachable by in-page search, and expands automatically when matched. The right way to collapse long-form sections and FAQs without making their content unfindable | `<div hidden="until-found">` | 🟡 | ⬜ |
| `popover="hint"` | A popover category meant for tooltips: it keeps light-dismiss, but only closes other hints instead of tearing down your main popover with it | `<div popover="hint">` | 🟡 | ⬜ |
| `sizes="auto"` | Stop hand-computing `sizes` for responsive images and let the browser work it out; pairs with `srcset` and `loading="lazy"` | `<img srcset="…" sizes="auto">` | 🟡 | ⬜ |
| Declarative Shadow DOM | Build a shadow root with no JavaScript, so SSR output can carry it | `<template shadowrootmode="open">` | 🟢 | ⬜ |
| `shadowrootreferencetarget` | Lets a `<label>` or `aria-*` outside the shadow root point at the real input inside it — the long-standing labelling problem for web components | `<template shadowrootmode="open" shadowrootreferencetarget="real-input">` | 🟠 | ⬜ |
| `<h1>` nested sizing fix | UA stylesheet change: an `<h1>` inside a `<section>` is no longer shrunk automatically, so heading hierarchy finally renders predictably | — | 🟢 | ⬜ |

#### K-3. Proposal / prototype stage (just worth knowing about)

| Feature | Main use | Support | Tried |
|---|---|---|---|
| Declarative Partial Updates | Streaming partial HTML updates that inject content without a navigation; a native `<include>` element may follow | 🔴 | ⬜ |
| `<persistentwidget>` | Embedded content that survives same-origin navigations (a player that doesn't stop, for instance) | 🔴 | ⬜ |
| HTML-in-Canvas (`layoutsubtree`) | Render interactive HTML onto a canvas | 🔴 | ⬜ |

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
- [New in Chrome 150 (`text-fit`, `background-clip: border-area`, `focusgroup`)](https://developer.chrome.com/blog/new-in-chrome-150 "opens in new window"){target="_blank"}
- [CSS Gap Decorations Now Available (`row-rule`/`column-rule`/`rule`, CSS-Tricks)](https://css-tricks.com/css-gap-decorations-now-available/ "opens in new window"){target="_blank"}
- [New Things You Should Know About HTML Here in Mid 2026 (source for the newly added section K entries)](https://blog.master.dev/new-things-you-should-know-about-html-here-in-mid-2026 "opens in new window"){target="_blank"}
- [Chrome for Developers — the `<geolocation>` element](https://developer.chrome.com/blog/geolocation-html-element "opens in new window"){target="_blank"}
- [Chrome for Developers — the `<usermedia>` element](https://developer.chrome.com/blog/usermedia-html-element "opens in new window"){target="_blank"}
- [Chrome for Developers — the `<install>` element (origin trial)](https://developer.chrome.com/blog/install-element-ot "opens in new window"){target="_blank"}
- [Apple WWDC26 — Get started with the HTML Model element](https://developer.apple.com/videos/play/wwdc2026/215/ "opens in new window"){target="_blank"}
- [CSS-Tricks](https://css-tricks.com "opens in new window"){target="_blank"}
