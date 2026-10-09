---
title: "Page Jumps While You Read? A Look at Scroll Anchoring and overflow-anchor"
description: "You're halfway through an article when an image or ad above finally loads, and the whole page jumps down. Browsers have a built-in fix called scroll anchoring. With a hands-on demo, this post tests when it works and when it can't help, shares two real examples from my own site, and covers the smooth-scrolling issue I fixed along the way."
date: 2026-10-09
tags:
  - CSS
  - Front-End
  - Accessibility
  - Browser Support
category: frontend
translationKey: scroll-anchoring
draft: false
---

> Up front: I tested the behavior in this post in Chromium. Details may differ in other browsers. If I've gotten something wrong, corrections welcome.

### Intro

You've been there: halfway through an article, an image or ad above finishes loading a few seconds late, the page jumps down, and you've lost your place. If you were about to tap a link, you might hit something else entirely.

Page jumps annoy everyone, but they hit some people harder:

- **People with cognitive disabilities or who are easily distracted**: they finally settle into a paragraph, and the jump breaks it.
- **People with limited motor control**: aiming at a button takes longer, and if the page moves just before they press, they hit the wrong thing.
- **People reading zoomed in**: only a small piece of the page is visible, so one jump and they're completely lost.

Browsers actually have a built-in mechanism for this called **scroll anchoring**, controlled by the CSS property `overflow-anchor`. It's one of the few items in my [CSS & HTML cheat sheet](/en/blog/css-techniques-checklist) that is "on by default, yet little known", and with Safari on board, all three major engines now support it.

First, here's what your browser supports:

::feature-support{features="overflow-anchor" notice="Your browser doesn't support scroll anchoring, so paragraph 5 will get pushed away in the demo below whatever you toggle; the reserve-space option still works."}
::

### 1. What does it do?

The idea is simple: the browser picks an element on screen as an "anchor". When content above gets taller or shorter, the browser adjusts the scroll position so the anchor stays where it was on screen.

It's **on by default**, so you don't write anything. You only write something to turn it off:

```css
.chat-log {
  overflow-anchor: none;
}
```

### 2. Try it

The box below is an article, and the purple paragraph is "the one you're reading". Press "Scroll to paragraph 5", then "Simulate slow loading"; 1.5 seconds later a block of late content appears at the top:

::scroll-anchor-demo
::

Try these combinations:

| Situation | What happens to paragraph 5 |
|---|---|
| Scrolled to paragraph 5, nothing checked | Stays put; scroll anchoring works |
| Scrolled to paragraph 5, "`overflow-anchor: none`" checked | Gets pushed down |
| At the very top, nothing checked | **Gets pushed down** |
| At the very top, "reserve space" checked | Stays put |

The third case is the one to notice: **scroll anchoring does nothing when the scroll position is at the top**. In my tests, inserting content while the scroll position was 0 pushed the paragraphs below straight down.

### 3. Tested: when it works and when it can't help

I also tested a few cases on a simpler page:

| Situation | Result |
|---|---|
| Already scrolled down; new content inserted above | What you're looking at doesn't move |
| Already scrolled down; an image with no size set finishes loading above | Doesn't move |
| Already scrolled down; content above is removed | Doesn't move |
| Already scrolled down; an element completely out of view above grows | Doesn't move |
| Scroll position at the top; content inserted above | **Pushed away** |
| The scroll container has `overflow-anchor: none` | **Pushed away** |
| **The element you're looking at** grows itself | Content below it gets pushed |

The last one happens because the anchor is usually the element you're looking at. When it grows, the browser keeps its top in place, but whatever is below it still gets pushed down.

Also, `overflow-anchor: none` doesn't have to go on the whole scroll container. In my tests, putting it only on "the block that arrives late" stops the browser from picking that block as the anchor, and the other paragraphs stay protected.

### 4. When should you turn it off?

Most of the time, leave the default alone. You usually only turn it off where **you already control the scroll position with JavaScript**, so the two don't fight. For example:

- **Chats and live logs**: new messages are added at the bottom, and your code scrolls to the newest one while the user is at the bottom. Having the browser adjust the position as well causes trouble.
- **Your own infinite scroll or virtualized list**: your code is already computing the scroll position precisely.

### 5. It's a safety net, not the fix

Scroll anchoring cuts down on jumps, but as you've seen, there are cases it can't help. The real fix is **reserving space at the source**, which is what the demo's "reserve space" option does:

```html
<!-- Give images a size so their space is taken before they load -->
<img src="photo.jpg" width="800" height="450" alt="…" />
```

```css
/* Or reserve room for late blocks with aspect-ratio or min-height */
.ad-slot {
  min-height: 250px;
}
```

With space reserved, even the "at the top" case that scroll anchoring can't handle doesn't jump. This is exactly what CLS (Cumulative Layout Shift) in Core Web Vitals measures: scroll anchoring only keeps what you see in place; the layout still shifted.

### 6. Applying it to my site

While writing this, I checked my own site and found two real examples: one where scroll anchoring is already quietly helping, and one where it can't help and the fix has to happen at the source.

#### Example 1: category tags on the blog list

On the [blog list](/en/blog/) I recently built, each post has a clickable category tag that filters the list down to that category. I scrolled down to the 10th post and clicked its "Design & AI" tag (on the Chinese version of the list):

- **Default (scroll anchoring on)**: after filtering, only 5 posts remain. The browser used the post I clicked as the anchor and kept it where it was; it happened to be the first result, so the screen showed "5 posts" and the start of the results right away.
- **With `overflow-anchor: none` on the list, for comparison**: the page suddenly got shorter, the screen sat in the middle of empty space, and the start of the results ended up far above the viewport, so I had to scroll back up to find it.

**No code needed here**; the default does the right thing. It has limits, though: if the post you clicked isn't the first result, the earlier results end up above the screen. Scroll anchoring makes sure "what you were just looking at doesn't run off"; it doesn't make sure "you see what matters most".

#### Example 2: product pages with unsized images

I measured layout shift on my site's pages with PerformanceObserver, deliberately delaying images by 1.5 seconds to simulate a slow connection. The [product pages](/en/products/) scored a CLS of **0.1263**, above Google's recommended 0.1. The cause: none of the product page images had `width` and `height`, so each image was 0 tall until it loaded, then pushed the content below it down.

That made a nice test of both sides of scroll anchoring:

- **If I'd already scrolled down** and was reading text mid-page when an image above loaded, scroll anchoring kept the heading I was looking at in place (off by less than 1px in my test).
- **If I was still at the top**, which is right after opening the page, scroll anchoring didn't kick in and everything was pushed down.

So this one needed fixing at the source. I wrote a small script that reads the original width and height of every image on the site into a list, and the product page `<img>` tags now get `width` and `height` from that list:

```html
<img src="/images/accesserty-thumbnail.webp" width="1280" height="685" alt="…" />
```

Combined with the site's existing `img { max-width: 100%; height: auto; }`, the browser reserves space at the right aspect ratio, and images look exactly the same size as before. Measured again under the same conditions, CLS dropped from **0.1263 to 0**.

To avoid forgetting this when adding images later, I also added a check to the build's data validation: if a product page uses an image that isn't in the size list, the build fails and reminds me to regenerate the list.

### 7. A fix along the way: smooth scrolling

While checking, I noticed the site set smooth scrolling for the whole page:

```css
html {
  scroll-behavior: smooth;
}
```

But it didn't check whether the user had asked for reduced motion. For motion-sensitive people, one click on a link sliding the page a long way can cause dizziness. That's what WCAG 2.3.3 Animation from Interactions is about. The fix is to enable it only when the user hasn't asked for reduced motion:

```css
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
```

The site's "back to top" button, which uses `window.scrollTo({ behavior: "smooth" })`, needs the same treatment; CSS doesn't reach JavaScript, so it checks separately:

```js
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
```

### Conclusion

In a few lines:

- Scroll anchoring is on by default: when content above changes, what you're looking at stays put.
- It does nothing when the scroll position is at the top, and it can't stop the anchor itself from growing.
- Where you control scrolling with JavaScript, turn it off with `overflow-anchor: none`, or turn it off only on the block that arrives late.
- It's a safety net; reserving space at the source is the real fix.
- On my site: the blog list's category tags already benefit, and adding sizes to product page images took CLS from 0.1263 to 0.
- While you're at it, check whether your `scroll-behavior: smooth` respects `prefers-reduced-motion`.

This is an accessibility feature that "needs no code": the browser quietly helps, and all we need to do is know it exists and not break it without realizing.

What kind of page jump catches you out most often? I'd love to hear about it.

### Related reading

- [Is a CSS-Only Carousel Accessible Enough? Compared Against My UI Kit](/en/blog/css-carousel-a11y/)
- [Spaces Between Chinese and English? Let text-autospace Add Them for You](/en/blog/text-autospace/)
- [Modern CSS & HTML Cheat Sheet: 102 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

### Related links

- [MDN — overflow-anchor](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor "Open new window"){target="_blank"}
- [MDN — Guide to scroll anchoring](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor/Guide_to_scroll_anchoring "Open new window"){target="_blank"}
- [web.dev — Cumulative Layout Shift (CLS)](https://web.dev/articles/cls "Open new window"){target="_blank"}
- [WCAG 2.2 — Understanding 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions "Open new window"){target="_blank"}
- [Can I use](https://caniuse.com "Open new window"){target="_blank"}
