---
title: "h1 Inside a section No Longer Shrinks: and I Fixed My Site's h1 Too"
description: "Browsers changed their built-in styles: an h1 inside section, article, aside or nav no longer shrinks level by level. This post compares the old and new styles with a live demo, explains why they used to shrink and why screen readers never followed along, and whether the change affects your site. I also checked my own site and changed every page's h1 from the site name to the page title."
date: 2026-10-13
tags:
  - HTML
  - CSS
  - Front-End
  - Accessibility
category: frontend
translationKey: html-nested-h1
draft: false
---

> Up front: I tested the behavior in this post in Chromium 141 and 153, and both already have the new behavior. For when other browsers shipped it, check caniuse or MDN. If I've gotten something wrong, corrections welcome.

## Intro

My [CSS & HTML cheat sheet](/en/blog/css-techniques-checklist) has a low-key item: "the nested `<h1>` size fix".

An `<h1>` placed inside `<section>`, `<article>`, `<aside>` or `<nav>` used to be shrunk automatically by the browser, so it looked like an `<h2>`; nested two levels deep, it looked like an `<h3>`. Browsers have now removed those built-in styles, and an `<h1>` is the same size no matter how deeply it's nested.

It's a change to browser default styles, so there's no code to write. But while checking my own site's headings because of it, I found a bigger problem, so the second half of this post is about fixing my own site.

## 1. Old and new styles side by side

The two sides below are the same HTML: an `<h1>` wrapped layer by layer in `<section>`, `<article>` and `<aside>`. The left uses the old built-in styles; the right uses today's:

::nested-h1-demo
::

You can see:

- **Left (old)**: each extra layer shrinks it one step, from 32px all the way down to 16px.
- **Right (now)**: every level is 32px.
- **Last column of the table**: whatever the level, a screen reader says "heading level 1".

Now check "Simulate the site setting its own h1 size", and both sides become identical. That's the point of section 4.

## 2. Why did they shrink?

It goes back to the "document outline algorithm" designed for HTML5.

The idea was that every `<section>` and `<article>` is a self-contained block that always starts with `<h1>`, and the browser works out the real level from how deeply it's nested. An `<h1>` in a `<section>` would count as level two, one more layer would make it level three, and so on. That way a piece of content could be moved anywhere without changing its headings.

The built-in shrinking styles were there to match: if an `<h1>` in a `<section>` is really level two, make it look like an `<h2>`.

The problem is that **no browser or screen reader ever implemented the algorithm**. The HTML spec removed it in 2022, leaving only the "looks smaller" styles behind.

In my tests of the Chromium 141 and 153 accessibility trees, every `<h1>` inside `<section>`, `<article>` and `<aside>` was level 1, the same as the top-level `<h1>`.

## 3. What does this mean for accessibility?

The old situation was: **on screen it looks like level two or three, but a screen reader says "heading level 1" every time**.

- Sighted developers think the heading levels are right, because the sizes step down and it looks well organized.
- Screen reader users navigating by headings (pressing H to jump from heading to heading, or opening a headings list) hear a whole row of "heading level 1" and can't tell the main heading from the subsections.

It's the same idea I wrote about in [my attr() post](/en/blog/css-attr/): **what people see and what screen readers get should come from one source**. The old built-in styles did the opposite, letting the screen pretend there was a hierarchy.

With the shrinking gone, what's on screen matches the real levels: if you get it wrong, you see it right away during development, because several equally large headings on one page are obviously off.

The right approach hasn't changed: **pick `<h1>` to `<h6>` by the real level**, and don't rely on `<section>` to demote headings for you.

## 4. Does this affect my site?

For most sites, no.

**If your CSS sets its own `h1` font size**, you're not affected, because a site's own styles always take priority over the browser's built-in ones. That's why checking "Simulate the site setting its own h1 size" in the demo makes both sides identical. Sites that use a reset, normalize or a design system have usually set it already.

What is affected: pages that **don't set an `h1` size themselves and put `<h1>` inside elements like `<section>`**. Headings that used to shrink will now be bigger.

To check, paste this into the DevTools console to list every `<h1>` wrapped in one of those elements:

```js
document.querySelectorAll(":is(article, aside, nav, section) h1");
```

If you find some, rather than adding a font size to "shrink them back", change them to `<h2>` or `<h3>` at the right level, and both the screen and screen readers will be correct.

## 5. Checking my own site: the h1 was always the site name

I used Playwright to list the `<h1>` on all 52 pages of this site. Nesting wasn't a problem: each page had exactly one `<h1>`, and none were inside a `<section>`.

But the result made me stop: **every page had the same `<h1>`, a visually hidden site name, "Neil's portfolio"**. Post titles and page names (such as "Projects") were all `<h2>`.

I did that on purpose. In an older post, [my accessibility study notes](/blog/a11y-learning/) (in Chinese), I wrote that the site logo should be the `<h1>` and the page title an `<h2>`. That was a very common approach at the time.

But the more common advice today is: **the `<h1>` should describe this page's main content**. Here's why:

- Screen reader users often jump straight to the `<h1>` when a page loads, to confirm which page they're on. If every page's `<h1>` is the site name, that tells them nothing.
- The site name is already in every page's `<title>` (for example, "projects - Neil's portfolio"), which screen readers announce when the page loads, so it doesn't need to take up a heading.

So I changed the whole site:

| Where | Before | After |
|---|---|---|
| Site name in the header | `<h1>` (hidden) | Removed; the site name is already in `<title>` |
| Post titles and page names | `<h2>` | `<h1>` |
| Home page | Hidden `<h2>` "Home" | Hidden `<h1>` "Neil's portfolio" |
| Sections in posts | `<h3>`, `<h4>`… | `<h2>`, `<h3>`… |

A few things to watch out for:

- **Move everything up one level**: once the page title is an `<h1>`, every heading below it has to move up one level too, or you jump straight from `<h1>` to `<h3>`. That includes headings in page components, in the interactive demos and in every post's Markdown: 636 headings across 54 posts, `###` to `##`, `####` to `###`, and so on. A `#` inside a code block must not be touched, so I used a script that skips code blocks.
- **Keep the look the same**: the CSS heading sizes moved up as well, so the new `h1` uses the old `h2` size, and so on. I took 22 screenshots before and after (11 pages at desktop and mobile widths) and compared them: every heading's size, spacing and position were the same. The only pixel differences were lazy-loaded images and the text cursor in an input.
- **Check again afterwards**: I re-ran the check, this time including the English pages, 83 in all. Each has exactly one `<h1>`, it's that page's title, and no heading levels are skipped. axe found no new issues either.

From now on, sections in my posts start at `##`.

## Conclusion

In a few lines:

- Browsers removed the built-in styles: an `<h1>` inside `<section>`, `<article>`, `<aside>` or `<nav>` no longer shrinks.
- The shrinking existed for the "document outline algorithm", which was never implemented; screen readers always said "heading level 1".
- The old styles let the screen pretend there was a hierarchy; the new ones make the screen match the real levels.
- Sites that set their own `h1` size aren't affected; use `:is(article, aside, nav, section) h1` to look for nested `<h1>` and change them to the right level.
- The `<h1>` should be the page's title, not the site name repeated on every page.

A small change to browser defaults made me go back and fix something I'd been doing for years. What's the `<h1>` on each page of your site?

## Related reading

- [Let ARIA Be the Single Source of Truth: Reading aria-valuenow with CSS attr()](/en/blog/css-attr/)
- [Zoomed In and the Top of Your Centered Content Is Gone? Make It Reachable with safe center](/en/blog/css-safe-alignment/)
- [Modern CSS & HTML Cheat Sheet: 115 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

## Related links

- [MDN — `<h1>`–`<h6>`: The HTML Section Heading elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements "Open new window"){target="_blank"}
- [HTML Living Standard — Headings and outlines](https://html.spec.whatwg.org/multipage/sections.html#headings-and-outlines "Open new window"){target="_blank"}
- [WCAG 2.2 — Understanding 1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships "Open new window"){target="_blank"}
- [WCAG 2.2 — Understanding 2.4.6 Headings and Labels](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels "Open new window"){target="_blank"}
- [Can I use](https://caniuse.com "Open new window"){target="_blank"}
