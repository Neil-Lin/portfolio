---
title: "Zoomed In and the Top of Your Centered Content Is Gone? Make It Reachable with safe center"
description: "align-items: center is one of the most common lines of CSS, but when the content is bigger than its container it overflows on both sides, and the part that goes off the top and left can't be scrolled to. It happens easily when people zoom to 400%, and keyboard users who Tab there can't see focus. This post tests safe center with live demos, lists which centering methods break and which are safe by default, and checks this site too."
date: 2026-10-13
tags:
  - CSS
  - Front-End
  - Accessibility
  - Browser Support
category: frontend
translationKey: css-safe-alignment
draft: false
---

> Up front: I tested the behavior in this post in Chromium 141 and 153, with the same results in both. Details may differ in other browsers, so check caniuse before shipping. If I've gotten something wrong, corrections welcome.

## Intro

Centering is probably one of the things we do most in CSS:

```css
.page {
  height: 100vh; /* a fixed container height */
  display: flex;
  align-items: center;
  justify-content: center;
}
```

Sign-in pages, empty states, dialogs: these lines are everywhere. They usually look fine, but when the container has a fixed height, as soon as **the content is bigger than the container**, things break. Centering makes the content overflow evenly on both sides, and **the half that goes off the top or left can't be scrolled to**.

When does content get bigger than its container? Most often when people zoom in. WCAG 1.4.10 Reflow requires content to stay usable at 400% zoom (about 320 CSS pixels wide), and 1.4.4 Resize Text requires no loss of content when text is enlarged to 200%. Once you zoom in, a card that used to fit no longer does.

This post is about the "`safe` / `unsafe` overflow alignment" item in my [CSS & HTML cheat sheet](/en/blog/css-techniques-checklist).

First, here's what your browser supports:

::feature-support{features="safe-align" notice="Your browser doesn't support the safe keyword, so choosing safe center in the demos below has no effect."}
::

## 1. What the problem looks like

The dashed box below is a fixed-height screen with a centered sign-in card. The demo starts at 200% zoom:

::safe-align-demo{kind="card"}
::

Try this:

1. Choose `center` and try scrolling the dashed box up: the top of the card (the "Back" button and the title) can't be reached.
2. Press Tab to move to the "Back" button: focus does land on it, but the button is off screen, so you can't see it.
3. Switch to `safe center`: the card now starts at the top, and everything can be scrolled to.
4. Set the zoom back to 100%: when it fits, `center` and `safe center` look exactly the same, both centered.

## 2. Why can't you scroll to it?

A scroll container only scrolls toward the "end": down and right. Content that overflows on the "start" side (top, left) falls outside the scrollable area.

My test: a 200px-wide scroll container holding a 300px-wide element, with `justify-content: center`:

- The element's left edge sits 50px outside the container.
- The container's `scrollWidth` is only 250px, not 300px.

In other words, those 50px on the left were never part of the scrollable area. Even with the scrollbar all the way to the left, you can't see them.

## 3. The fix: put safe in front of center

```css
.page {
  height: 100vh; /* a fixed container height */
  display: flex;
  align-items: safe center;
  justify-content: safe center;
}
```

`safe` means: **center it if it fits; if it doesn't, align it to the start**. Overflow then only goes toward the end, so it can always be scrolled to.

| Keyword | When it doesn't fit |
|---|---|
| `safe center` | Switches to start alignment; all overflow can be scrolled to |
| `unsafe center` | Stays centered and overflows on both sides; the start side can't be reached |
| Just `center` | Depends on the layout; see the tests in section 6 |

`safe` and `unsafe` work with every alignment property: `align-items`, `justify-content`, `align-content`, `align-self`, `justify-self`, `justify-items`, and the `place-*` shorthands. They also work with values other than `center`, such as `safe end`.

Browsers that don't support `safe` treat the whole declaration as invalid. To be safe, write two lines and let those browsers use the first:

```css
.page {
  align-items: center;
  align-items: safe center;
}
```

## 4. The impact on keyboard users

To look at what step 2 of the demo shows, I also tested a full page: a 320×256 viewport (a 1280×1024 screen zoomed to 400%), with `body` using flex to center a sign-in form taller than the screen.

- **With `center`**: the link at the top of the form is 89px off screen. Tab focuses it, but the page doesn't scroll there, because that area isn't scrollable at all. I even tried `scrollIntoView()`, and it couldn't get there either.
- **With `safe center`**: the link is at the very top of the screen, and you can see it when you Tab to it.

For keyboard users, focus effectively disappears: they can't tell where they are, which fails WCAG 2.4.7 Focus Visible. For people who zoom in, the form's title and instructions simply vanish, and they have no way of knowing there's anything above.

## 5. Same thing horizontally: a scrolling tag list

The horizontal case is common too: a row of tags that scrolls left and right, centered on wide screens with `justify-content: center`:

::safe-align-demo{kind="chips"}
::

In my test, a 20rem-wide (about 340px) container with 8 tags: with `center`, the first tag sits 246px outside the container, and the first two or three tags can't be scrolled to at all. Tab to the first tag, and focus is off screen again.

With `safe center`, it's still centered on wide screens where it fits, and on narrow screens it starts from the first tag and scrolls right normally.

## 6. Tests: which methods break, and which are safe by default?

With just `center`, the result depends on the layout. I gave the container a fixed size and put an element bigger than it inside. Here's what I found:

| Method | With just `center` |
|---|---|
| Flex `justify-content: center` | Start side cut off |
| Flex `align-items: center` with a fixed height | Top cut off |
| Whole-page `body` centered with flex | Top cut off |
| Grid `place-content: center` | Start side cut off |
| Grid `place-items: center`, fixed column width | Start side cut off |
| Grid `place-items: center`, auto column width | The column grows with the content; overflow only goes toward the end and can be scrolled to |
| Block `align-content: center` | Safe by default; only cut off if you write `unsafe` |
| `position: absolute` with `inset: 0` and `justify-self: center` | Safe by default; only cut off if you write `unsafe` |
| `position: absolute` with `inset: 0; margin: auto` | Safe horizontally, but **the top gets cut off vertically** |
| Flex item centered with `margin: auto` | Safe |
| `left: 50%; transform: translateX(-50%)` | Start side cut off |

The key points:

- **In flex and grid, plain `center` is unsafe.** That's the one to watch.
- **`margin: auto` on a flex item is already safe**: auto margins never go below 0, so when content doesn't fit it only overflows toward the end. If you need to support very old browsers, centering a flex item with `margin: auto` gives you the same result as `safe center`.
- **`margin: auto` on an absolutely positioned element is only safe horizontally**: vertically, the two auto margins can go negative. In my test, a 300×300 element with `inset: 0; margin: auto` inside a 200×200 scroll container had its top 50px cut off, out of scroll reach.
- **The `translate(-50%)` trick is unsafe**: the old absolute-positioning centering technique gets cut off too when it doesn't fit.

## 7. When should you add safe?

Not every `center` needs it. Content only overflows when **the container has a fixed size**:

- The container has a fixed height, such as `height: 100vh` or `block-size: 20rem`.
- The container doesn't wrap, such as a horizontal list with `flex-wrap: nowrap`.
- The container scrolls, such as a tag list with `overflow: auto`.

If the container grows with its content or wraps with `flex-wrap: wrap`, it gets taller or wraps when things don't fit, so nothing overflows. A row of a button and an icon with `align-items: center` won't overflow either, because the row's height comes from its tallest item.

My recommendation: **whenever you center inside a fixed-size container, write `safe center`**. When it fits, the result is identical, so there's nothing to lose.

## 8. Checking this site

I used Playwright to run 52 pages of this site through a 320×256 viewport (400% zoom), looking for any element centered with flex or grid whose content overflows on the start side.

There was nothing to fix: this site's button rows, pagination and tag filters all use `flex-wrap: wrap`, and the containers have no fixed height, so zooming in makes them wrap and grow instead of overflowing. The only hit was the accesskey anchor (`:::`) in the header, which is absolutely positioned in the corner on purpose, not an overflow.

I also looked at two places specifically:

- **The loading screen**: full-screen, fixed height, centered both ways, the classic setup that breaks. But it only holds a 6rem spinner, which fits even at 400%, so I left it alone.
- **The carousel dots**: in [my carousel post](/en/blog/css-carousel-a11y/), the `::scroll-marker-group` uses `justify-content: center` without wrapping. With 4 slides it fits, but that CSS is there for readers to borrow, and with more slides on a narrow screen the first few dots would become unreachable. So I added `safe center`.

## Conclusion

In a few lines:

- When centered content doesn't fit, it overflows on both sides, and the part off the top and left can't be scrolled to.
- People who zoom in lose content; keyboard users who Tab there have focus off screen.
- Write `safe center`: centered when it fits, starting from the start when it doesn't.
- In flex and grid, plain `center` is unsafe; `margin: auto` on a flex item and block `align-content` are already safe; `margin: auto` on an absolutely positioned element gets cut off vertically; `translate(-50%)` is unsafe.
- Always add `safe` when centering inside a fixed-size container, with a plain `center` line before it as a fallback.

One extra word stops a whole block of content from disappearing when people zoom in. That's a small habit with a big payoff.

Do your projects have a full-screen centered sign-in page or dialog? Zoom to 400% and take a look. There might be a piece missing at the top.

## Related reading

- [Tooltip Getting Cut Off? Let the Browser Find a Spot with @position-try](/en/blog/position-try/)
- [Page Jumps While You Read? A Look at Scroll Anchoring and overflow-anchor](/en/blog/scroll-anchoring/)
- [Modern CSS & HTML Cheat Sheet: 115 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

## Related links

- [MDN — safe and unsafe in align-items](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items#safe "Open new window"){target="_blank"}
- [CSS Box Alignment Module Level 3 — Overflow Alignment](https://drafts.csswg.org/css-align-3/#overflow-values "Open new window"){target="_blank"}
- [WCAG 2.2 — Understanding 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow "Open new window"){target="_blank"}
- [WCAG 2.2 — Understanding 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible "Open new window"){target="_blank"}
- [Can I use](https://caniuse.com "Open new window"){target="_blank"}
