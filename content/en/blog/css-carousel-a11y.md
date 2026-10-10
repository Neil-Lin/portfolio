---
title: "Is a CSS-Only Carousel Accessible Enough? Compared Against My UI Kit"
description: "::scroll-marker and ::scroll-button() let CSS build a carousel's dots and previous/next buttons with no JavaScript. But carousels have always been an accessibility trouble spot, so is the native version good enough? With identical content, this post puts a native CSS carousel next to the <au-carousel> I built for Accesserty UI Kit and tests the accessibility tree and keyboard behavior."
date: 2026-10-09
tags:
  - CSS
  - Front-End
  - Accessibility
  - Web Components
  - Browser Support
category: frontend
translationKey: css-carousel-a11y
draft: false
---

> Up front: everything here was tested in Chromium 141 (and retested in Chromium 153 with the same results), and the accessibility tree was read from the browser's accessibility API. How a screen reader actually announces it is best checked by turning one on yourself. If I've gotten something wrong, corrections welcome.

### Intro

The carousel is probably the component that goes wrong for accessibility most often: unnamed dots, buttons that are just an arrow glyph, focus that wanders off, slides that rotate on their own forever.

CSS now has `::scroll-marker` and `::scroll-button()`, which build dots and previous/next buttons with no JavaScript. It's one of the items in my [CSS & HTML cheat sheet](/en/blog/css-techniques-checklist) I was most curious about: if the browser builds it natively, is it more accessible?

As it happens, I built an accessible carousel, `<au-carousel>`, for [Accesserty UI Kit](https://github.com/Accesserty/UI-Kit "Open new window"){target="_blank"}. So this time I put the two side by side with exactly the same content.

First, here's what your browser supports:

::feature-support{features="scroll-marker" notice="Your browser doesn't support ::scroll-marker, so the first demo below is just a row of cards you can scroll sideways. The second, UI Kit demo isn't affected."}
::

### 1. Writing a native CSS carousel

First, turn the content into a sideways-scrolling list that snaps into place. This part is `scroll-snap`, which is well established:

```css
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
.carousel > li {
  flex: 0 0 100%;
  scroll-snap-align: start;
}
```

Then add the new pieces:

```css
/* Dots: one per li, grouped after the carousel */
.carousel {
  scroll-marker-group: after;
}
.carousel > li::scroll-marker {
  content: "" / attr(data-title); /* a dot on screen; after the slash is the name for screen readers */
}
.carousel > li::scroll-marker:target-current {
  /* the current slide's dot */
}

/* Previous/next buttons */
.carousel::scroll-button(inline-start) {
  content: "‹" / attr(data-prev);
}
.carousel::scroll-button(inline-end) {
  content: "›" / attr(data-next);
}
```

```html
<ul class="carousel" aria-label="Travel plans" data-prev="Previous slide" data-next="Next slide">
  <li data-title="Kyoto">…</li>
  <li data-title="Osaka">…</li>
</ul>
```

What follows the slash in `content` is the alternative text, the name a screen reader announces. In my tests `attr()` works inside the alternative text, so names can come from `data-*` attributes in the HTML, which makes localization much easier.

Here it is in action:

::carousel-native-demo
::

A pitfall I hit while building the demo: `::scroll-marker-group` is a full-width row, so if you position the previous/next buttons at the two ends of that same row, the row covers them and mouse clicks don't reach them (the keyboard still works). Giving the buttons a `z-index` fixes it:

```css
.carousel::scroll-button(*) {
  position: absolute;
  z-index: 1;
}
```

### 2. What it becomes in the accessibility tree

I read the accessibility tree of the demo above:

| On screen | Role in the tree | Name | State |
|---|---|---|---|
| Previous/next | `button` | Alternative text ("Previous slide") | `disabled` at either end |
| The group of dots | `tablist` | **No name** | — |
| Each dot | `tab` | Alternative text ("Kyoto") | `selected` on the current slide |
| Each slide | Stays a `listitem` | — | — |

Two things stand out:

- **The dots use tab semantics**: they become `tab`s, but the slides don't become matching `tabpanel`s; they stay plain list items. A screen reader user who hears "tab" expects it to switch a panel.
- **The `tablist` has no name**: put two carousels on a page and you get two unnamed tab lists that can't be told apart.

### 3. Keyboard testing

Starting from a button before the carousel and pressing Tab:

1. **The dots take a single tab stop**, landing on the current slide's dot.
2. **Left and right arrow keys move between dots**; pressing left on the first wraps around to the last.
3. **The next Tab goes to the "next" button.** "Previous" starts out `disabled`, so it's skipped.
4. **Then come the buttons inside the slides**, all of them, not just the current slide's.

One surprise in the order: with the dots after the carousel (`scroll-marker-group: after`) and with them before (`before`), the Tab order was "dots → next → content" either way, which doesn't match their position on screen.

The biggest problem is at the last slide:

- Keep pressing "next" until the last slide and the button becomes `disabled`, **with focus still sitting on the now-unusable button**, its focus ring fading too.
- Press Tab now and focus jumps to the button in the **first** slide, and **the carousel scrolls all the way back to the start**.

In other words, once a keyboard user reaches the last slide, the next step takes them back to the beginning.

The native version also **announces nothing**. Press "next", the slide changes, and the screen reader isn't told which slide is now showing.

### 4. How I built it in the UI Kit

Here's the same content using `<au-carousel>` from Accesserty UI Kit:

::carousel-au-demo
::

It looks much the same, but these are deliberate choices:

- **The carousel has a name and a role description**: the outer element is `role="group"`, named "Travel plans", with an `aria-roledescription` of "carousel", so a screen reader knows what the whole block is.
- **The dots are real buttons and say where they are**: their names are like "Kyoto, 1 of 4", and the current one gets `aria-current`, with no tab semantics.
- **The group of dots has a name and instructions too**: "Choose a slide", plus "Use the arrow keys to move between slides" through `aria-describedby`.
- **The dots come before the content**: you learn how many slides there are first, then read them; previous/next come after the content.
- **Tab from the dots goes straight into the current slide**: not the first slide, and not whichever is leftmost on screen.
- **The end buttons use `aria-disabled`, not `disabled`**: they stay focusable, so focus isn't lost and you're not thrown back to the start.
- **Slide changes are announced in a live region**: for example "Nara, slide 3 of 4". It stays quiet while focus is on a dot, since the dot's name has just been read.
- **No autoplay**: which sidesteps WCAG 2.2.2 Pause, Stop, Hide altogether.
- **Other details**: no smooth scrolling under `prefers-reduced-motion`, styles for forced colors mode, and dots and buttons with hit areas of at least 24px.

Its accessibility tree in my tests: the outer element is a named `group`, the dots sit in a `group` named "Choose a slide", and each dot is a `button`. At the last slide, focus stays on "next" and the live region announces the last slide's name.

### 5. Side by side

| Aspect | Native CSS | `<au-carousel>` |
|---|---|---|
| Needs JavaScript | No | Yes |
| Browsers | Chromium only, for now | Not limited to Chromium (a regular web component) |
| Name for the carousel | Add `aria-label` to the container yourself | Yes, plus a role description |
| Dot semantics | `tablist`/`tab` | Plain buttons + `aria-current` |
| Name for the dot group | None | Yes, plus instructions |
| Dot names | Alternative text | Title + position ("1 of 4") |
| Arrow keys | Yes, wrapping at the ends | Yes, stopping at the ends, plus Home/End |
| Entering the content | DOM order, from the first slide | Straight to the current slide |
| End buttons | `disabled`, focus is lost | `aria-disabled`, focus stays |
| Announcing slide changes | None | Yes |

### 6. What can the native version patch?

The native version's biggest limitation: **the dots and buttons are pseudo-elements**, so you can't add HTML attributes to them. That means:

**What you can't patch:**

- You can't give the `tablist` a name.
- You can't swap `disabled` for `aria-disabled`.
- You can't replace the tab semantics with buttons.
- You can't change the Tab order or send focus straight to the current slide.

**What you can patch: announcements.** Browsers fire a `scrollsnapchange` event when scrolling snaps to a new slide; in my tests it fired both for button presses and for scrolling. Combine it with the approach from [the ariaNotify() post](/en/blog/aria-notify/):

```js
carousel.addEventListener("scrollsnapchange", (event) => {
  const slide = event.snapTargetInline;
  if (slide) announce(carousel, slide.dataset.title);
});
```

But by this point you're writing JavaScript anyway, and the most important problem, focus, is still unsolved.

### Conclusion

In a few lines:

- `::scroll-marker` and `::scroll-button()` let CSS build a complete carousel interface with no JavaScript.
- Alternative text can use `attr()`, so button and dot names can come from the HTML.
- For accessibility, though, there are real gaps: the dot group has no name, it uses tab semantics, focus is lost at the ends and you're taken back to the first slide, and nothing is announced.
- Most of these come from pseudo-elements themselves, and JavaScript can't patch them.

So my conclusion for now: **a native CSS carousel can't yet replace a carefully built accessible carousel component**. The layout techniques behind it, such as `scroll-snap` and container queries, are genuinely useful, and my `<au-carousel>` uses them for layout too. Once the spec lets these pseudo-elements adjust their semantics, or handles the end buttons in a way that doesn't drop focus, I'll happily come back and rewrite this post.

And the old advice still stands: avoid carousels if you can, and if you must use one, at least don't autoplay it.

Do you have carousels in your projects? Built in-house or from a library? I'd love to hear about it.

### Related reading

- [Make Screen Readers Speak: Replacing aria-live with ariaNotify()](/en/blog/aria-notify/)
- [Tooltip Getting Cut Off? Let the Browser Find a Spot with @position-try](/en/blog/position-try/)
- [Modern CSS & HTML Cheat Sheet: 102 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

### Related links

- [Accesserty UI Kit (GitHub)](https://github.com/Accesserty/UI-Kit "Open new window"){target="_blank"}
- [MDN — ::scroll-marker](https://developer.mozilla.org/en-US/docs/Web/CSS/::scroll-marker "Open new window"){target="_blank"}
- [MDN — ::scroll-button()](https://developer.mozilla.org/en-US/docs/Web/CSS/::scroll-button "Open new window"){target="_blank"}
- [Chrome for Developers — Carousels with CSS](https://developer.chrome.com/blog/carousels-with-css "Open new window"){target="_blank"}
- [WAI-ARIA APG — Carousel Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/ "Open new window"){target="_blank"}
- [Can I use](https://caniuse.com "Open new window"){target="_blank"}
