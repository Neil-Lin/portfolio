---
title: 'Why Can''t Ctrl+F Find Collapsed Content? A Look at hidden="until-found"'
description: "Content collapsed with hidden, like FAQs and accordions, can't be found by in-page search. hidden=\"until-found\" keeps content collapsed but findable by search and deep links, and expands it when found. This post compares four ways to collapse content with live demos, plus two traps I ran into while testing."
date: 2026-10-09
tags:
  - HTML
  - CSS
  - Front-End
  - Accessibility
  - Browser Support
translationKey: hidden-until-found
category: frontend
draft: false
---

> Up front: these are my notes from practicing `hidden="until-found"`. My tests were run in Chromium, and support in other browsers changes quickly. If I've gotten something wrong, corrections welcome.

### Intro

In my [modern CSS & HTML cheat sheet](/en/blog/css-techniques-checklist), `hidden="until-found"` was another box I hadn't ticked. I mentioned it in my last post on [popover's auto, manual and hint](/en/blog/popover-auto-manual-hint), saying it "falls back more safely," so this time I wanted to check that properly.

First, the problem it solves. Collapsed content is everywhere: FAQs, accordions, "show more" sections in long articles. When people look for something, they naturally press Ctrl+F (⌘+F on Mac), and the browser tells them there's no match.

But the content is right there on the page, just collapsed. For the user, content that search can't find might as well not exist.

Here's what your browser supports; the demos below rely on it:

::feature-support{features="until-found" notice="Your browser doesn't support until-found, so the until-found blocks in the demos fall back to a plain hidden. Not finding them by search is expected."}
::

### Try it first: four ways to collapse content. Which can search find?

As before, let's play first. The four blocks below are collapsed four different ways, and each is labeled with a keyword to search for (each keyword only appears inside its own block). Press Ctrl+F and try them one by one:

::until-found-compare
::

What you should see:

| Collapsed with | Can search find it? | What happens |
|---|---|---|
| `hidden` | No | — |
| `height: 0; overflow: hidden` | Yes | The browser reports a match, but nothing is visible, which confuses people even more |
| `hidden="until-found"` | Yes | **Expands automatically** and scrolls to the text |
| `until-found` + a common reset | No | The reset undoes it; more on that below |

If you see something different, it's probably a browser support difference, and I'd love to hear about it.

### How does it work?

The markup is simple. Change the value of `hidden` to `until-found`:

```html
<div hidden="until-found">
  Collapsed, but findable
</div>
```

Here's the mechanism:

1. The browser doesn't hide it with `display: none` but with `content-visibility: hidden`. The content isn't shown, but its text still takes part in in-page search.
2. When search matches, or a URL's `#id` points at an element inside, the browser first fires a **`beforematch` event**, then **removes the `hidden` attribute itself**, then scrolls there.
3. While collapsed, the content isn't in the accessibility tree, and buttons inside can't be reached with Tab. I tested this in Chromium; it behaves like a plain `hidden`, so screen readers won't read out content nobody can see.

In other words, it only handles "expand when found." Expanding and collapsing with your own button is still up to you.

### An FAQ demo: events, deep links and `aria-expanded`

Below is an FAQ built with `until-found`. Each answer is `hidden="until-found"` while collapsed, and the event log shows when `beforematch` fires:

::until-found-faq
::

Things to try:

1. Press Ctrl+F and search for "ship free." This article contains the phrase too, so press Enter once more to jump to the next match, and the third question expands on its own.
2. Press Collapse all, then use the deep link in the demo. It expands and scrolls there too, which means you can share a link to a single FAQ answer and people land right on it.
3. Uncheck "Sync aria-expanded" and search again.

Step 3 is the accessibility issue I most want to flag: **the browser only removes `hidden`; it doesn't update your button's `aria-expanded`**. The content is open, but the button still says `false`, so screen reader users hear the wrong state.

So always listen for `beforematch` and sync the state back:

```js
panel.addEventListener("beforematch", () => {
  button.setAttribute("aria-expanded", "true");
});
```

### Trap 1: `el.hidden = !el.hidden` quietly turns it back into a plain `hidden`

I found this one while testing the demos. A common way to toggle visibility looks like this:

```js
button.addEventListener("click", () => {
  panel.hidden = !panel.hidden;
});
```

The problem is that while collapsed, `panel.hidden` reads as **the string `"until-found"`**, not `true`. So here's what happens:

1. It starts as `hidden="until-found"`; `!panel.hidden` is `false`, so it expands. Fine.
2. Click again to collapse: `!panel.hidden` is `true`, and the attribute becomes `hidden=""`, **a plain hidden**.

After one open-and-close, the content can never be found by search again, and nothing on screen looks any different. A safer approach is to drive it from your own state and write `until-found` back explicitly when collapsing:

```js
let open = false;

button.addEventListener("click", () => {
  open = !open;
  button.setAttribute("aria-expanded", String(open));
  if (open) {
    panel.removeAttribute("hidden");
  } else {
    panel.setAttribute("hidden", "until-found");
  }
});
```

### Trap 2: a `[hidden]` rule in your CSS reset breaks it

Plenty of CSS resets and projects include this line to make sure `hidden` always hides:

```css
[hidden] {
  display: none !important;
}
```

But `hidden="until-found"` matches `[hidden]` too, so it gets forced to `display: none`. Content that isn't rendered can't be found by in-page search, which is the last block in the comparison demo above.

Interestingly, in my tests an `#id` deep link still expanded it in this case, so if you only test links, it's easy to think everything works. The fix is to exclude `until-found`:

```css
[hidden]:not([hidden="until-found" i]) {
  display: none !important;
}
```

Two smaller details:

- **The box is still there while collapsed**: `content-visibility: hidden` only skips painting the contents. The element's own padding, border and background remain. If your panel has padding, remove it while collapsed, or you'll get an empty strip.
- **Mind the Shadow DOM in web components**: `beforematch` bubbles, but it doesn't cross out of a shadow root, so attach the listener to an element inside it.

### What happens without support?

This time the fallback is safe. A browser that doesn't recognize `until-found` treats it as a plain `hidden`: the content stays hidden and simply can't be found by search, and nothing breaks. Compared with `popover="hint"`, which degrades to `manual` and can't even be dismissed, you can use this one confidently as a progressive enhancement.

To detect it:

```js
const supportsUntilFound = "onbeforematch" in HTMLElement.prototype;
```

Chromium-based browsers have supported `until-found` for a long time; Firefox and Safari are changing faster, so check [caniuse](https://caniuse.com "Open new window"){target="_blank"} before shipping.

### What about `<details>`?

For a simple show/hide, native `<details>` also expands automatically when in-page search matches inside it (in Chromium-based browsers), and you don't have to build the button or state yourself.

Here's how I choose:

- **A simple "show more"**: reach for `<details>` first; it's the least work.
- **An accordion that needs a heading hierarchy and custom structure** (for example a heading wrapping a button that controls a panel via `aria-controls`), or an existing component that can't easily become `<details>`: use `hidden="until-found"`.

### Conclusion

In a few lines:

- Collapsed isn't the same as gone. Content hidden with `hidden` doesn't exist as far as search is concerned.
- `hidden="until-found"` keeps content collapsed but findable, expands it when found, and works with deep links too.
- Listen for `beforematch` to sync `aria-expanded`, don't toggle with `el.hidden = !el.hidden`, and check that your CSS reset isn't overriding it.
- Without support it falls back to a plain `hidden`, so it degrades safely.

What this attribute fixes is the frustration of knowing something is on the page and still not being able to find it. The longer I work on accessibility, the more I see that many problems aren't about features that can't be built, but about information hidden where people can't reach it. This is a good example.

One more box ticked on my list. How much collapsed content does your site have? I'd love to hear about it.

### Related reading

- [Popover auto, manual and hint: What's Actually the Difference? I Built Demos to Find Out](/en/blog/popover-auto-manual-hint/)
- [Modern CSS & HTML Cheat Sheet: 102 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

### Related links

- [MDN — hidden global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden "Open new window"){target="_blank"}
- [MDN — beforematch event](https://developer.mozilla.org/en-US/docs/Web/API/Element/beforematch_event "Open new window"){target="_blank"}
- [Can I use](https://caniuse.com "Open new window"){target="_blank"}
