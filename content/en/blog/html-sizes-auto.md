---
title: "Phones Downloading 1920px Images? Fixing My Portfolio with sizes=\"auto\""
description: "The sizes attribute for responsive images is hard to get right, and when it's wrong the browser picks an image that's too big. sizes=\"auto\" lets the browser pick by the image's actual width. This post first answers whether it helps when you only have one image, then tests its rules and traps with a live demo, and finally applies it to my own portfolio: image data on the project list dropped by about 60% on phones."
date: 2026-10-14
tags:
  - HTML
  - Front-End
  - Performance
  - Browser Support
category: frontend
translationKey: html-sizes-auto
draft: false
---

> Up front: I tested the behavior in this post in Chromium 141 and 153, with the same results in both. For other browsers, check caniuse. If I've gotten something wrong, corrections welcome.

## Intro

`sizes="auto"`, from my [CSS & HTML cheat sheet](/en/blog/css-techniques-checklist), is this round's practice.

Before digging in, I checked my own site, and it was a little embarrassing: **every image in my portfolio had only a `src`**. A project card is only 214px wide on a phone, yet it was downloading the 1440px or 1920px original.

That's unkind to people on slow connections or limited data: images load slowly and data is wasted. So besides testing `sizes="auto"`, this post fixes my portfolio too.

## 1. First: does sizes help if there's only one image?

No. `sizes` doesn't resize anything. It just tells the browser roughly how wide the image will be on screen, so it can pick one of the files prepared in `srcset`. With no candidates, there's nothing to pick.

My test: an image 300px wide on screen, in an 800px-wide viewport:

| Markup | File the browser downloaded |
|---|---|
| Only `src`, plus `sizes="auto"` | The one and only file, same as without it |
| `srcset` with 480 / 960 / 1440 widths, **no `sizes`** | 960 |
| `srcset` with three widths, plus `sizes="auto"` | 480 |

So to use `sizes="auto"`, **step one is always producing the image in several sizes**.

## 2. Why is sizes hard to write?

Row two of the table picked 960 because, without `sizes`, the browser assumes the image is as wide as the viewport (`100vw`), so an 800px viewport got 960. But the image is really only 300px wide, so 480 would have been enough.

To get the browser to pick correctly, you used to spell out the image's width at every screen size:

```html
<img
  srcset="card-480.webp 480w, card-960.webp 960w, card-1440.webp 1440w"
  sizes="(width <= 768px) calc(100vw - 160px), (width <= 1024px) 62vw, 33vw"
  src="card.webp" alt="…">
```

Those numbers have to track your CSS layout. Change the layout or tweak the spacing and `sizes` is wrong, and hardly anyone goes back to fix it.

## 3. sizes="auto": let the browser measure

```html
<img
  loading="lazy"
  srcset="card-480.webp 480w, card-960.webp 960w, card-1440.webp 1440w"
  sizes="auto"
  src="card.webp" alt="…">
```

A lazy image only downloads after layout, when it's about to scroll into view. By then the browser already knows how wide it is, so it may as well use that width to pick the file, with no math from you.

That's why `sizes="auto"` **only works on `loading="lazy"` images**.

## 4. Try it

The image below is a thumbnail from my portfolio, prepared at 480, 960 and 1280 wide. Change the image width and see which file the browser picks:

::sizes-auto-demo
::

Try this:

1. Choose "No sizes" and make the image small: however small it gets, the pick is based on the viewport width.
2. Switch to `sizes="auto"`: the file follows the image width, just big enough.
3. Check "Remove loading="lazy"": `auto` stops working and the pick goes back to the viewport width.

"Pixels needed" is the image width times the device pixel ratio. On a 2× screen, a 300px image needs a 600px file to look sharp, so it picks 960.

## 5. Things to watch out for

**1. On a non-lazy image, even the fallback is ignored**

To cover browsers without support, a common pattern is to add a fallback after `auto`:

```html
<img sizes="auto, (width <= 768px) 100vw, 33vw" …>
```

That's fine on lazy images. But in my tests, **on an image without `loading="lazy"`, `sizes="auto, 30vw"` made Chromium ignore the `30vw` too** and pick as if it were `100vw`; only `sizes="30vw"` on its own picked by `30vw`.

Above-the-fold images (like the one with `fetchpriority="high"`) usually shouldn't be lazy, so remember: **above-the-fold images still need a hand-written `sizes`**, not `auto`.

**2. A wider image switches to a bigger file; a narrower one doesn't switch back**

When I widened an image from 300px to 700px, the browser downloaded the 960 file. Going from 700px back to 300px, it kept using the bigger file it already had and didn't download the smaller one. That makes sense: it already has a sharper image, so there's no reason to spend more data. The demo forces a reload on every change so you can see each pick.

**3. The image's width needs to be known**

`auto` picks by the laid-out width, so the image needs a definite width: a `width` attribute, or CSS like `width: 100%`. My project cards fill the card with CSS, and that worked fine in my tests.

**4. With a framework like Vue, attribute order matters**

I hit this one while updating the site. The server-rendered HTML was fine, but when I navigated to the project list from another page (without a reload), the cards were downloading the originals again.

The reason: when a framework creates an image in the browser, it sets the attributes one by one in template order. I had `src` first, and as soon as `src` is set the browser starts picking a file, before `loading="lazy"` and `sizes` exist, so it grabbed a big image using the default `100vw`.

Moving `loading`, `sizes` and `srcset` before `src` fixed it. After the change, navigating to the page made the 338px-wide cards download the 480 version.

## 6. Fixing my portfolio

**1. Produce several sizes**

I wrote a small script using [sharp](https://sharp.pixelplumbing.com/ "Open new window"){target="_blank"} that outputs every image in `public/images` at 480, 960, 1440 and 1920 wide (only the ones smaller than the original), as webp. 110 images produced 293 files, 11MB in total.

I chose to **commit these files to the repo** rather than generate them at deploy time. If the hosting platform's build command didn't run the step that makes them, every image on the site would break; committing them removes that worry.

I also added a build-time check: if a new image is missing its smaller versions, the build fails, so a full-size image can't slip out by accident.

**2. Pick the markup by position**

| Image | Markup |
|---|---|
| Project list cards (lazy) | `sizes="auto, …fallback"` |
| First card on the list (above the fold, not lazy) | Hand-written `sizes` |
| First image on a product page (not lazy) | Hand-written `sizes` |
| Other images on a product page (lazy) | `sizes="auto, …fallback"` |

The hand-written `sizes` aren't guesses. I used Playwright to measure each image's actual width at five viewport widths (375, 768, 1024, 1280 and 1920) and turned those into `sizes`.

**3. Results**

With Playwright scrolling through the whole page so every lazy image loaded, here's the image data downloaded before and after:

| Page | Viewport × pixel ratio | Before | After |
|---|---|---|---|
| Project list | 375 × 3 (phone) | 1634 KB | 638 KB (61% less) |
| Project list | 1280 × 1 (laptop) | 1778 KB | 397 KB (78% less) |
| Product list | 1280 × 1 | 620 KB | 290 KB (53% less) |
| Product page (Accesserty) | 375 × 3 | 421 KB | 215 KB (49% less) |
| Project list | 1920 × 2 (large high-res screen) | 1979 KB | 1979 KB (no change) |

The last row not changing is correct: a large screen at 2× needs the originals to look sharp. `srcset` isn't about always going smaller; it's about **picking just enough**.

I also loaded all 17 pages that use these images (home, plus the project and product lists and detail pages) at phone and laptop widths after the change. All 216 images displayed correctly with nothing broken, and side by side, the smaller versions and the originals look the same on screen.

## 7. Browsers without support

According to the spec, browsers that don't support `auto` skip it and use the fallback after it. So writing `sizes="auto, …fallback"` on lazy images means supporting browsers pick by actual width and others pick by the fallback, and neither ends up worse than before.

With only `sizes="auto"` and no fallback, a browser without support treats it as having no `sizes`, meaning `100vw`. It might pick a bigger image, but nothing breaks.

## Conclusion

In a few lines:

- `sizes` only helps the browser pick from `srcset`; with one image it does nothing, so produce several sizes first.
- `sizes="auto"` lets the browser pick by the image's actual width with no math, but only on `loading="lazy"` images.
- On a non-lazy image, `sizes="auto, …"` ignores even the fallback, so above-the-fold images need a hand-written `sizes`.
- A wider image switches to a bigger file; a narrower one doesn't switch back.
- With a framework, put `loading`, `sizes` and `srcset` before `src`.
- On my portfolio, image data on the project list dropped by 61% on phones and 78% on laptops.

The biggest takeaway was finding out my own site had been making phones download big images all along. What size file does your site's biggest image download on a phone?

## Related reading

- [Page Jumps While You Read? A Look at Scroll Anchoring and overflow-anchor](/en/blog/scroll-anchoring/)
- [h1 Inside a section No Longer Shrinks: and I Fixed My Site's h1 Too](/en/blog/html-nested-h1/)
- [Modern CSS & HTML Cheat Sheet: 115 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

## Related links

- [MDN — The sizes attribute of `<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#sizes "Open new window"){target="_blank"}
- [MDN — Responsive images](https://developer.mozilla.org/en-US/docs/Web/HTML/Responsive_images "Open new window"){target="_blank"}
- [HTML Living Standard — Sizes attributes](https://html.spec.whatwg.org/multipage/images.html#sizes-attributes "Open new window"){target="_blank"}
- [sharp](https://sharp.pixelplumbing.com/ "Open new window"){target="_blank"}
- [Can I use](https://caniuse.com "Open new window"){target="_blank"}
