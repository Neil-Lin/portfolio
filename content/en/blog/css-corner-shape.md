---
title: "Designers Could Always Draw Them, Now Developers Can Build Them: Squircles, Coupons, Step Arrows and Cut-Corner Buttons with corner-shape"
description: "Squircle app icons, coupons with notches, checkout step arrows and game-style cut-corner buttons used to need clip-path or mask, which clipped away the focus outline and borders too. This post uses a live demo to compare the old techniques with corner-shape, includes the full commented code, and tests accessibility details such as forced colors and the clickable area."
date: 2026-10-16
tags:
  - CSS
  - Front-End
  - Accessibility
  - Browser Support
category: frontend
translationKey: css-corner-shape
draft: false
---

> Up front: I tested the behavior in this post in Chromium 141 and 153. Both support `corner-shape`, and I've marked where they differ. For other browsers, check caniuse. If I've gotten something wrong, corrections welcome.

## Intro

These show up in designs all the time:

- The "squircle" corners of an app icon, smoother than ordinary rounded corners.
- A coupon with semicircle notches and a tear line.
- Checkout steps shaped like arrows: "Cart → Details → Payment".
- Buttons with a corner cut off at an angle, common on game and tech sites.

A designer draws them in Figma in seconds. A developer has to take the long way round: `clip-path`, `mask`, SVG, pseudo-elements stacked into triangles. Worse, these techniques often **clip away the focus outline and borders too**, so keyboard users can't see where they are.

`corner-shape`, from my [CSS & HTML cheat sheet](/en/blog/css-techniques-checklist), brings these shapes into the `border-radius` family: borders, outlines and shadows all follow the shape.

First, check your browser's support:

::feature-support{features="corner-shape" notice="Your browser doesn't support corner-shape, so the shapes in the demo below fall back to ordinary rounded corners; you can still compare the old way."}
::

## 1. How corner-shape works

`corner-shape` works together with `border-radius`: **`border-radius` sets how big the corner is, and `corner-shape` sets its shape**. With `corner-shape` and no `border-radius`, the corners stay square and nothing happens.

```css
.box {
  border-radius: 20px; /* the corner size */
  corner-shape: bevel; /* the corner shape: a straight cut */
}
```

The available shapes:

| Keyword | Shape | Equivalent `superellipse()` |
|---|---|---|
| `round` | An ordinary rounded corner (the default) | `superellipse(1)` |
| `squircle` | Between rounded and square | `superellipse(2)` |
| `square` | A square corner | `superellipse(infinity)` |
| `bevel` | A straight diagonal cut | `superellipse(0)` |
| `scoop` | A concave arc | `superellipse(-1)` |
| `notch` | A concave square notch | `superellipse(-infinity)` |

`superellipse()` takes any number: larger is closer to square, 0 is a bevel, and negative numbers curve inward.

Each corner can be set separately, in the same order as `border-radius`: **top-left, top-right, bottom-right, bottom-left**:

```css
.ticket {
  border-radius: 12px;
  corner-shape: round scoop scoop round; /* only the two right corners curve inward */
}
```

There are also per-corner properties such as `corner-top-left-shape`.

**141 vs. 153**: when you read the value with `getComputedStyle()`, 141 returns the keyword (e.g. `scoop`), while 153 converts it to `superellipse(-1)`. If your JavaScript checks this value, handle both.

## 2. Try it

Below are four common designs. Switch between "corner-shape" and "the old way" to compare, and Tab to each button and link to see the focus outline:

::corner-shape-demo
::

Things to try:

- Switch to "the old way" and Tab through: **the focus outlines are all gone**.
- Still on "the old way", look at the diagonal edges and notches: **there's no border along them**.
- Check "Simulate forced colors": once backgrounds are removed, the old way leaves only broken lines, and the app icon's border is missing its corners.

The demo's forced-colors simulation just swaps the background to `Canvas` and the text and borders to `CanvasText`. I also compared it with forced colors emulated in Chromium's DevTools, and the results matched.

## 3. Full code for the four designs

Each design has three parts: the old way, the `corner-shape` way, and a fallback for browsers without support. Swap the colors for your own design.

To compare focus outlines, the demo's buttons and links all use `outline` for the focus ring:

```css
.demo :focus-visible {
  outline: 3px solid oklch(83% 0.17 82); /* yellow focus ring */
  outline-offset: 3px; /* a little gap, so you can see whether it follows the shape */
}
```

### 1. Squircle app icon

iOS app icons don't use ordinary rounded corners. They use a squircle with continuously changing curvature: the corner flows into the straight edge more smoothly, without the visible "turning point" of a regular rounded corner.

**The old way**: most people approximate it with `border-radius: 22%`, which isn't quite the right shape. To match it exactly, you had to draw the path in SVG and use it as a mask:

```css
.app-icon {
  /* Use an SVG path as a mask; everything outside the path is clipped */
  mask: url(squircle.svg) center / 100% 100% no-repeat;
}
```

`mask` clips everything outside the element, including `outline`. The focus ring is drawn outside the element, so the whole ring disappears.

**The corner-shape way**:

```css
.app-icon {
  inline-size: 6rem;
  block-size: 6rem;
  /* Transparent border: invisible normally; forced colors turns it into the
     text color, so the icon's shape doesn't disappear with the background */
  border: 2px solid transparent;
  border-radius: 22%; /* without corner-shape support: ordinary rounded corners */
  background: linear-gradient(oklch(62% 0.2 294), oklch(40% 0.2 294));
}

@supports (corner-shape: squircle) {
  .app-icon {
    border-radius: 50%; /* make the corners as big as possible */
    corner-shape: squircle; /* the whole thing becomes a squircle */
  }
}
```

Note the `border-radius` values: ordinary rounded corners need `22%` to look like an app icon, but the `squircle` curve is "squarer" and needs `50%` to become a full squircle. So the two values are written separately, inside and outside `@supports`, rather than shared.

I only noticed the **transparent border** while testing forced colors: without a border, forced colors removes the background and the icon is just an "N", with no shape at all. With a transparent border, nothing changes normally, and in forced colors you get a squircle outline.

### 2. Coupon with notches

A typical e-commerce coupon: the offer on the left, a "Claim" button on the right, and a tear line between them with a semicircle notch at the top and bottom.

**The old way**: use `radial-gradient` as a mask to cut transparent circles out of the corners:

```css
.coupon-info {
  border-radius: 0.75rem 0 0 0.75rem;
  mask:
    /* Cut a transparent circle of radius 0.75rem at the top right, top half only */
    radial-gradient(circle 0.75rem at 100% 0, #0000 98%, #000) top / 100% 51% no-repeat,
    /* Same at the bottom right, bottom half only */
    radial-gradient(circle 0.75rem at 100% 100%, #0000 98%, #000) bottom / 100% 51% no-repeat;
}
/* The Claim button cuts its two left corners the same way, at 0 0 and 0 100% */
```

Two problems: the notches are "cut out", so **there's no border along the curve**, and since the mask is on the button, **the button's focus outline is clipped too**.

**The corner-shape way**:

```html
<div class="coupon">
  <p class="coupon-info">
    <strong>$10 off</strong>
    <span>Orders $100+, until 12/31</span>
  </p>
  <button type="button" class="coupon-btn">Claim</button>
</div>
```

```css
.coupon {
  display: flex; /* the two halves side by side, no gap */
}
.coupon > * {
  margin: 0;
  border: 2px solid oklch(50% 0.13 55);
  background-color: oklch(92% 0.1 90);
}
.coupon-info {
  border-right-style: dashed; /* a dashed right border is the tear line */
  border-radius: 0.75rem;
}
.coupon-btn {
  border-left: 0; /* the left half already draws the tear line */
  border-radius: 0.75rem;
}

@supports (corner-shape: scoop) {
  /* Order: top-left, top-right, bottom-right, bottom-left */
  .coupon-info {
    corner-shape: round scoop scoop round; /* the two right corners curve inward */
  }
  .coupon-btn {
    corner-shape: scoop round round scoop; /* the two left corners curve inward */
  }
}
```

**Each semicircle notch is made of two halves**: the left part's top-right corner scoops a quarter circle, and so does the button's top-left corner; side by side, they form a semicircle. Both sides need the same `border-radius` for the notches to line up.

The border follows the concave curve, and so does the button's focus outline. Browsers without support see two rounded boxes side by side, without the notches, but the content and button work normally.

### 3. Checkout step arrows

Arrow-shaped steps like "Cart → Details → Payment", where each step is a link.

**The old way**: cut the right side into an arrow with `clip-path`:

```css
.steps a {
  clip-path: polygon(
    0 0,                       /* top left */
    calc(100% - 1.25rem) 0,    /* where the arrow starts (top) */
    100% 50%,                  /* the arrow tip */
    calc(100% - 1.25rem) 100%, /* where the arrow starts (bottom) */
    0 100%                     /* bottom left */
  );
}
```

Like `mask`, `clip-path` clips the outline away, and the border is left with just the top, bottom and left edges: **the two diagonal edges of the arrow have no border**. The other approach is stacking a triangle with `::after`, but giving the triangle a border means stacking yet another layer, and the focus outline still won't follow the arrow.

**The corner-shape way**:

```html
<ol class="steps" aria-label="Checkout steps">
  <li><a href="/cart">Cart</a></li>
  <li><a href="/checkout" aria-current="step">Details</a></li>
  <li><a href="/payment">Payment</a></li>
</ol>
```

```css
.steps {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.steps a {
  display: block;
  /* Extra padding on the right, so the text doesn't run into the arrow's slant */
  padding: 0.5rem 1.5rem 0.5rem 0.75rem;
  border: 2px solid oklch(46% 0.15 295);
  border-radius: 0 0.5rem 0.5rem 0; /* without support: rounded right corners */
}
/* The current step, marked with aria-current; screen readers announce "current step" */
.steps [aria-current] {
  background-color: oklch(46% 0.15 295);
  color: white;
  font-weight: 700;
}

@supports (corner-shape: bevel) {
  .steps a {
    /* Horizontal radii before the slash, vertical radii after it:
       the two right corners reach 1.25rem left and 50% up and down,
       so the two bevels meet exactly at the middle of the right edge: an arrow */
    border-radius: 0 1.25rem 1.25rem 0 / 0 50% 50% 0;
    corner-shape: bevel;
  }
}
```

The key is **setting the vertical radius to 50%** in `border-radius`: the top and bottom corners each take half the height, so once they're beveled they meet in a point at the middle. The arrow lines up automatically whatever the text length or line height.

### 4. Game-style cut-corner button

A common button on game and tech sites, with the top-left and bottom-right corners cut at an angle.

**The old way**:

```css
.hud-btn {
  clip-path: polygon(
    0.875rem 0,                    /* right end of the top-left cut */
    100% 0,                        /* top right */
    100% calc(100% - 0.875rem),    /* top end of the bottom-right cut */
    calc(100% - 0.875rem) 100%,    /* left end of the bottom-right cut */
    0 100%,                        /* bottom left */
    0 0.875rem                     /* bottom end of the top-left cut */
  );
}
```

The same problems: no focus outline, and no border on the two cut corners. The border is often the whole point of this kind of button, and the usual fix was another wrapper element, stacking two `clip-path` layers into a "fake border" and handling the focus ring separately.

**The corner-shape way**:

```css
.hud-btn {
  padding: 0.75rem 1.75rem;
  border: 2px solid oklch(80% 0.13 210);
  /* Two values: 0.875rem for top-left and bottom-right, 0 for top-right and bottom-left */
  border-radius: 0.875rem 0;
  background-color: oklch(22% 0.04 260);
  color: oklch(88% 0.12 200);
}

@supports (corner-shape: bevel) {
  .hud-btn {
    corner-shape: bevel; /* corners with a radius become bevels; the others stay square */
  }
}
```

One line. `border-radius` only gives the top-left and bottom-right corners a radius, so `bevel` only cuts those two. Browsers without support see rounded top-left and bottom-right corners: a different style, but nothing breaks.

## 4. Accessibility checklist

### 1. Use outline for focus rings, not just box-shadow

`corner-shape` makes `outline`, `border` and `box-shadow` all follow the shape; I tested all three. But **forced colors removes `box-shadow`**, so a focus ring drawn only with `box-shadow` disappears entirely. Keep using `outline` for focus rings, or at least add a transparent `outline` as a fallback.

Also, 141 draws `box-shadow` on `scoop` and `notch` shapes with visible seams; 153 is fine.

### 2. Give borderless components a transparent border

Forced colors removes background colors and images. A button or icon whose shape comes only from its background ends up as bare text in forced colors, with no visible boundary. Add `border: 2px solid transparent`: invisible normally, and a text-colored outline in forced colors.

### 3. The clickable area shrinks with the shape

In my tests with a `bevel` button, **clicking the cut-off corner doesn't hit the button**: the clickable area matches the visible shape. That's a good thing; users get a response where they can see the button.

But it also means the clickable area is smaller than the bounding rectangle. WCAG 2.5.8 requires targets of at least 24×24px, so if the button is already small, check again after cutting the corners. `notch` and `scoop` cut in further than rounded corners, so they have a bigger effect.

### 4. Leave padding for content near the corners

When a corner is cut off or curves inward, text that used to sit in the corner can be clipped or end up outside the shape. `bevel`, `scoop` and `notch` all take more space than rounded corners, so leave more padding than you would for `border-radius`. That's why the step arrows have extra padding on the right.

### 5. Large radii can produce odd shapes

Set the radius to half the height and use `notch`, and both sides get cut away entirely, leaving a narrow block. With extreme shapes, test with both the longest and shortest text.

## 5. When it isn't supported

Browsers without support ignore `corner-shape` and just apply `border-radius`, so the shapes fall back to ordinary rounded corners. Content, borders and focus outlines all work; only the shape differs from the design, which makes this a very safe progressive enhancement.

Watch out for the `border-radius` value: the same value looks very different with rounded corners and other shapes (a squircle needs `50%`, while `22%` looks more like an icon with ordinary rounded corners). So, as in the demo, write the fallback radius outside and the supported radius inside `@supports`:

```css
.app-icon {
  border-radius: 22%; /* without support */
}
@supports (corner-shape: squircle) {
  .app-icon {
    border-radius: 50%; /* with support */
    corner-shape: squircle;
  }
}
```

To detect it in JavaScript:

```js
CSS.supports("corner-shape: bevel");
```

## Conclusion

In short:

- Use `corner-shape` with `border-radius`: `border-radius` sets the size, `corner-shape` the shape.
- Squircle app icons, coupon notches, step arrows and cut-corner buttons used to need `clip-path`, `mask` or SVG; now they take a line or two.
- The old techniques **clip away the focus outline and borders**; with `corner-shape`, borders, outlines and shadows all follow the shape.
- Use `outline` for focus rings, and give borderless components a transparent border so they're visible in forced colors.
- The clickable area shrinks with the shape, and content near the corners needs more padding.
- Without support it falls back to rounded corners and nothing breaks, so it's safe to use as a progressive enhancement.

The shapes designers draw can finally go straight into CSS, and this time keyboard users can see their outline too.

## Related reading

- [Writing Accessibility into CSS with if() and @function: Reduced Motion, More Contrast, Minimum Target Size](/en/blog/css-if-function/)
- [Zoomed In and the Top of Your Centered Content Is Gone? Make It Reachable with safe center](/en/blog/css-safe-alignment/)
- [Modern CSS & HTML Cheat Sheet: 115 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

## Related links

- [CSS Borders and Box Decorations Level 4 (corner-shape)](https://drafts.csswg.org/css-borders-4/#corner-shaping "Open new window"){target="_blank"}
- [MDN — corner-shape](https://developer.mozilla.org/en-US/docs/Web/CSS/corner-shape "Open new window"){target="_blank"}
- [WCAG 2.2 — Understanding 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible "Open new window"){target="_blank"}
- [WCAG 2.2 — Understanding 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum "Open new window"){target="_blank"}
- [Can I use](https://caniuse.com "Open new window"){target="_blank"}
