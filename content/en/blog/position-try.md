---
title: "Tooltip Getting Cut Off? Let the Browser Find a Spot with @position-try"
description: "Tooltips and menus get cut off near the edge of the screen, and flipping them used to take JavaScript. position-try-fallbacks and @position-try let CSS handle it: when there isn't room, try another position. With a demo where you can drag the anchor around, this post covers the three ways to write it, how margins flip too, how the browser remembers the position, position-try-order, and what happens when nothing fits."
date: 2026-10-09
tags:
  - CSS
  - Front-End
  - Accessibility
  - Browser Support
translationKey: position-try
draft: false
---

> Up front: I tested the behavior in this post in Chromium. Details may differ in other browsers. If I've gotten something wrong, corrections welcome.

### Intro

In [the popover post](/en/blog/popover-auto-manual-hint/), the tooltips and menus sit next to their buttons using Anchor Positioning. I slipped in a line of `position-try-fallbacks: flip-block` back then without much explanation.

That one line fixes an old problem: tooltips and dropdowns get cut in half as soon as they're near the edge of the screen. The old fix was JavaScript: measure the position, work out the space, and flip to the other side if there isn't enough. That's exactly what the `flip` in libraries like Floating UI does.

This matters for accessibility too. When someone zooms to 200% or 400%, there's far less room on screen, and tooltips get cut off much more often.

`@position-try` is the next step after anchor positioning in my [CSS & HTML cheat sheet](/en/blog/css-techniques-checklist), so this time I took it apart properly.

First, here's what your browser supports:

::feature-support{features="anchor,position-try" notice="Your browser doesn't support anchor positioning or position-try-fallbacks, so the demo below won't work. You can still read the explanations and code."}
::

### 1. Try it

The dashed box below stands in for the screen. Move the anchor with the sliders; the tooltip sits above the anchor by default:

::position-try-demo
::

Things to try:

1. Pick "None" and drag the anchor to the top: the tooltip stays above it and gets cut off.
2. Switch to `flip-block` and drag the anchor to the top again: the tooltip flips below.
3. Now drag the anchor back to the middle: the tooltip **stays below** and doesn't flip back. Press "Show the tooltip again" and it returns to the top. That's not a bug; section 4 explains.
4. Switch to the custom `@position-try` and drag the anchor to the top: this time the tooltip moves to the right first.
5. Switch back to `flip-block`, check `position-try-order`, and put the anchor a little above the middle (vertical position around 35): there's room above, yet the tooltip goes below. Section 5 explains.

### 2. Three ways to write it

`position-try-fallbacks` is a list. The browser starts with the original position, and if that doesn't fit, it tries each entry in order and uses the first one that fits. The list can hold three kinds of things.

**1. Flip keywords: flip the original position**

```css
.tip {
  position-area: top;
  position-try-fallbacks: flip-block;
}
```

| Keyword | Effect | Tested (original → flipped) |
|---|---|---|
| `flip-block` | Flip top and bottom | Above → below |
| `flip-inline` | Flip left and right | Right → left |
| `flip-start` | Flip along the diagonal, swapping the two axes | Above → left |

You can also combine them: `flip-block flip-inline` flips both ways at once, which suits menus in a corner.

**2. Plain `position-area` values**

```css
.tip {
  position-area: top;
  position-try-fallbacks: bottom, right;
}
```

If above doesn't fit, try below, then right. For simple cases this is the most readable.

**3. Custom `@position-try` rules**

When the margin or size needs to change along with the position, define a fallback with `@position-try`:

```css
@position-try --right {
  position-area: right;
  margin: 0 0 0 8px;
  width: 12rem;
}

.tip {
  position-area: top;
  margin-bottom: 8px;
  position-try-fallbacks: --right, flip-block;
}
```

Only position-related properties are allowed inside `@position-try`:

| Allowed | Examples |
|---|---|
| Anchoring | `position-anchor`, `position-area` |
| Insets | `top`, `left`, `inset` and friends |
| Margins | the `margin` family |
| Sizing | `width`, `height`, `min-*`, `max-*` |
| Self-alignment | `align-self`, `justify-self` |

In my tests, a `background` inside `@position-try` is simply ignored: no error, no effect. So "change the colour when it flips below" isn't something `@position-try` can do.

### 3. Margins flip too

With `flip-block` you don't need to worry about spacing. In my tests, a tooltip written with `margin-bottom: 8px` automatically gets `margin-top: 8px` once it flips below, so the 8px gap to the anchor stays and they don't end up stuck together.

So write the margin only on the side facing the anchor, and flipping takes care of the rest. Custom `@position-try` rules don't flip anything for you, so write the margin yourself, as in the example above.

### 4. The browser remembers the last position

This surprised me most while testing, and it's what you saw in step 3 of the demo.

Once the tooltip has flipped below, it **stays below** even after the anchor moves back to the middle where above would fit again. It only flips back up once below no longer fits either (for example, when you drag the anchor to the bottom).

The spec calls this remembering the "last successful position". It makes sense: if the tooltip jumped between above and below while someone was scrolling, it would be hard to read, and even more of a problem for people with cognitive disabilities or who are easily distracted.

When is the memory cleared? In my tests, hiding the element and showing it again (`display: none` and back) clears it, and the position is chosen afresh. Popovers work the same way: close and reopen one, and it decides again based on the space available right then. The demo's "Show the tooltip again" button simulates exactly that.

So for popovers, every open starts fresh; the memory matters when something stays open while the page scrolls or the anchor moves. Knowing about it stops you from filing it as a bug while testing.

### 5. position-try-order: pick the side with the most room

The default rule is "use the original position if it fits". Sometimes what you want is "use whichever side has more room", say for a long dropdown:

```css
.menu {
  position-area: top;
  position-try-fallbacks: flip-block;
  position-try-order: most-height;
}
```

In my tests, with the anchor a little above the middle, where above would still fit, the menu with `most-height` chose below because it had more room. The values are `most-height`, `most-width`, `most-block-size` and `most-inline-size`.

One catch: it only sorts when a position is being chosen. In my tests, adding `most-height` to an element already showing above, with room still above, didn't move it; it only switched below after being hidden and shown again. That's the same memory from the previous section: a position already in place stays as long as it fits.

You can also write it all with the `position-try` shorthand:

```css
.menu {
  position-try: most-height flip-block;
}
```

### 6. When nothing fits

If neither the original position nor any fallback fits, the browser **falls back to the original position**, even if that means getting cut off. I tested this with a separate, very short container, and the tooltip did stay above, cut off.

So make the original position the most common, most sensible one. Fallbacks are only fallbacks; there's no guarantee any of them will fit.

### 7. Pairing it with popover

In practice, the most common combination is a popover plus anchor positioning. An open popover is in the top layer, so "does it fit" is measured against the whole viewport, which is exactly what we want:

```html
<button popovertarget="menu" style="anchor-name: --menu-btn">More</button>
<div id="menu" popover>…</div>
```

```css
#menu {
  position-anchor: --menu-btn;
  position-area: bottom span-right;
  margin: 8px 0 0;
  position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline;
}
```

No room below, go above; no room on the right, go left; in a corner, flip both. These few lines replace what used to be a whole block of JavaScript positioning.

What about browsers without support? I wrap it in `@supports (position-area: bottom)` and position with JavaScript otherwise, which is what the demos in [the popover post](/en/blog/popover-auto-manual-hint/) do.

### Accessibility notes

- **Only the visual position changes**: flipping doesn't touch DOM order, so the screen reader reading order and keyboard Tab order stay the same.
- **The tooltip's own rules still apply**: WCAG 1.4.13 Content on Hover or Focus requires that the tooltip can be dismissed, stays while the pointer moves onto it, and doesn't vanish by itself. Getting the position right doesn't take care of those; you still have to.
- **Zoom is where it counts**: with less room on screen when zoomed, having fallbacks makes a bigger difference than usual. When testing, zoom to 200% and 400%.

### Conclusion

In a few lines:

- `position-try-fallbacks` lets an anchored element try fallback positions in order when it runs out of room.
- Fallbacks can be flip keywords, `position-area` values, or custom `@position-try` rules.
- `flip-block` flips the margin too; `@position-try` only accepts position-related properties.
- Once flipped, it remembers the position instead of jumping back and forth; hiding and showing it again (such as reopening a popover) makes it choose afresh.
- For "use whichever side has more room", add `position-try-order: most-height`.
- When nothing fits, it falls back to the original position.

What used to need a library and a pile of event listeners now takes a few lines of CSS. And people who zoom the page feel the difference most, which makes it a very real accessibility improvement.

Are your tooltips and menus still positioned with JavaScript? I'd love to hear about it.

### Related reading

- [Popover auto, manual and hint: What's Actually the Difference? I Built Demos to Find Out](/en/blog/popover-auto-manual-hint/)
- [How to Write a Dialog Today: From showModal() to command and closedby](/en/blog/dialog-modern-guide/)
- [Modern CSS & HTML Cheat Sheet: 102 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

### Related links

- [MDN — position-try-fallbacks](https://developer.mozilla.org/en-US/docs/Web/CSS/position-try-fallbacks "Open new window"){target="_blank"}
- [MDN — @position-try](https://developer.mozilla.org/en-US/docs/Web/CSS/@position-try "Open new window"){target="_blank"}
- [MDN — Fallback options and conditional hiding for overflow](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning/Try_options_hiding "Open new window"){target="_blank"}
- [WCAG 2.2 — Understanding 1.4.13 Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus "Open new window"){target="_blank"}
- [Can I use](https://caniuse.com "Open new window"){target="_blank"}
