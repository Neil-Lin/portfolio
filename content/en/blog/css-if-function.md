---
title: "Writing Accessibility into CSS with if() and @function: Reduced Motion, More Contrast, Minimum Target Size"
description: "CSS if() puts conditions inside a property value, and @function turns repeated calculations into custom functions. This post uses a live demo to write reduced motion, a higher-contrast focus outline and a 24px minimum target size as conditions and functions, and sums up the pitfalls I hit while testing: an if() without else can make the focus outline disappear entirely."
date: 2026-10-16
tags:
  - CSS
  - Front-End
  - Accessibility
  - Browser Support
category: frontend
translationKey: css-if-function
draft: true
---

> Up front: I tested the behavior in this post in Chromium 141 and 153. Both support `if()` and `@function`, and I've marked where they differ. For other browsers, check caniuse and MDN. If I've gotten something wrong, corrections welcome.

## Intro

Accessibility-related CSS tends to be scattered across `@media` blocks: one for reduced motion, one for more contrast, another for forced colors. A single component's styles end up split across several places, and it's easy to miss one when you change something.

`if()` and `@function`, from my [CSS & HTML cheat sheet](/en/blog/css-techniques-checklist), bring those conditions back into the property itself:

- **`if()`**: write a condition inside a property's value.
- **`@function`**: turn repeated calculations into custom functions, like Sass's `@function` but running in the browser.

Every example this time is about accessibility. First, check your browser's support:

::feature-support{features="css-if,css-function" notice="Your browser doesn't support if() or @function, so the button in the demo below falls back to fixed styles."}
::

## 1. if(): conditions inside a property

To respect the user's reduced-motion setting, you used to need a separate `@media` block:

```css
.btn {
  transition-duration: 300ms;
}
@media (prefers-reduced-motion: reduce) {
  .btn {
    transition-duration: 0s;
  }
}
```

With `if()`, it's one declaration:

```css
.btn {
  transition-duration: if(
    media(prefers-reduced-motion: reduce): 0s;
    else: 300ms
  );
}
```

There are three kinds of condition:

| Condition | What it checks | Example |
|---|---|---|
| `media()` | A media query | `media(prefers-contrast: more)` |
| `supports()` | Whether the browser supports a feature | `supports(width: stretch)` |
| `style()` | The element's own custom properties | `style(--size: small)` |

Conditions can be combined with `and`, `or` and `not`, and you can write several branches at once; the first one that matches wins:

```css
padding-inline: if(
  style(--size: small): 0.5rem;
  style(--size: large): 1.5rem;
  else: 1rem
);
```

## 2. @function: turning repeated calculations into functions

WCAG 2.5.8 requires targets of at least 24×24px. With lots of components, each one has to remember `max(24px, …)`, and it's easy to miss one. As a function, you write it once:

```css
@function --target(--h) {
  result: max(24px, var(--h));
}

.icon-btn {
  min-block-size: --target(16px); /* tested: 24px */
}
```

Function names and parameters start with `--`, and `result` is the return value. Some things I tested:

- **Parameters can have defaults**: with `@function --target(--h, --min: 24px)`, calling `--target(16px, 44px)` gives at least 44px.
- **Functions can contain `@media`**, and a matching `result` overrides the earlier one:

```css
@function --ring() {
  result: 2px;
  @media (prefers-contrast: more) {
    result: 4px;
  }
}
```

- **Functions can use `if()`**, and can read custom properties set on the element.
- **Parameters can be typed**: `@function --target(--h <length>) returns <length>`. Pass the wrong type and the whole property becomes invalid.

## 3. Try it

This button's size, transition and focus outline are all written with `if()` and `@function`. A page can't switch your system's "reduce motion" or "more contrast" settings, so the demo simulates them with custom properties; if your system actually has them turned on, they apply too:

::if-function-demo
::

Things to try:

- Choose `small`: the button is written as 16px tall, and `--if-demo-target()` raises it to 24px.
- Check "Reduce motion": the transition becomes 0s, and the button no longer grows on hover.
- Check "More contrast" and Tab to the button: the focus outline gets thicker and switches to the text color.
- Switch to "if() without else", then uncheck "More contrast": the focus outline disappears. The next section explains why.

The demo simulates the preferences like this:

```css
transition-duration: if(
  style(--sim-motion: reduce) or media(prefers-reduced-motion: reduce): 0s;
  else: 300ms
);
```

This pattern is useful in its own right. If your site has its own "reduce motion" toggle, store it as a custom property and put it in the same condition as the system setting: it works whichever place the user turns it on.

## 4. Pitfalls

### 1. An if() without else resets the property to its initial value

This is the one I most want to warn about:

```css
.btn:focus-visible {
  outline: 2px solid blue;
  outline: if(style(--hc: 1): 4px solid black);
}
```

I expected the previous `2px solid blue` to apply when the condition is false. In my test the result was **`outline-style: none`; the focus outline was gone entirely**.

When no branch in `if()` matches and there's no `else`, the whole value becomes invalid. That only happens at computed-value time, when the later declaration has already beaten the earlier one in the cascade, so the browser doesn't go back to it and falls back to the property's initial value instead. The initial value of `outline-style` is `none`.

It's less obvious with just `outline-width`: its initial value is `medium` (3px), so the outline is still there, just not the width you wrote.

Without a focus outline, keyboard users can't tell where they are (WCAG 2.4.7). So **for any accessibility-related property, always give `if()` an `else`**.

### 2. A misspelled function name does the same

```css
.box {
  min-height: 30px;
  min-height: --nope(10px); /* no such function */
}
```

In my test `min-height` was 0px, not 30px. Browsers that support `@function` accept any `--`-prefixed function name at parse time and only find out it doesn't exist at computed-value time. `CSS.supports("width: --whatever(1)")` returns `true` in both 141 and 153.

### 3. style() compares text, not values

```css
.a { --size: Small; }  /* not equal to small */
.b { --gap: 8.0px; }   /* not equal to 8px */
```

For unregistered custom properties, `style()` compares the text: a different case, or `8.0px` versus `8px`, doesn't match. Leading and trailing whitespace is ignored.

Once you register the type with `@property`, it compares computed values, so `8.0px` and `0.5rem` (with a 16px root font size) both equal `8px`.

### 4. style() checks the element itself, but custom properties inherit

`style()` inside `if()` checks the element's own custom properties. But custom properties inherit by default, so if a parent sets `--size: small`, `style(--size: small)` is true for every descendant. The demo sets it on the wrapper and the button inherits it.

### 5. Range comparisons need a newer version

Range comparisons like `style(--n > 2)` work in 153 in my tests; 141 doesn't support them and goes straight to `else`.

## 5. When it isn't supported

Feature detection:

```css
@supports (color: if(else: red)) {
  /* if() styles */
}
```

```js
CSS.supports("color: if(else: red)"); // if()
"CSSFunctionRule" in window;           // @function
```

CSS's `@supports at-rule(@function)` can also detect `@function`, but in my tests 141 supports `@function` without supporting the `at-rule()` syntax, so it returns `false`; only 153 returns `true`.

Be careful with `var()` in the fallback:

- **No `var()` in the `if()`**: browsers without support drop the declaration at parse time, so the previous fallback line applies.
- **`var()` inside the `if()` or the function call**: any value containing `var()` is accepted at parse time and only fails at computed-value time, so you get the same result as the first pitfall: the initial value.

I don't have a browser without support to test with, so the second point is inferred from how `var()` works. To be safe, the demo wraps every `if()` rule in `@supports` and writes fixed styles outside it as the fallback, so the focus outline is always there.

## Conclusion

In short:

- `if()` puts conditions inside properties, so reduced motion and more contrast no longer need their own `@media` blocks.
- `@function` turns repeated calculations like `max(24px, …)` into functions, so the minimum target size is written once.
- `style(--custom-property) or media(…)` lets your site's own preference toggle and the system setting share one condition.
- **An `if()` without `else`, or a misspelled function name, resets the property to its initial value**, which can make the focus outline disappear.
- `style()` compares unregistered custom properties as text; to compare values, register them with `@property` first.
- When the value contains `var()`, wrap it in `@supports` instead of relying on the previous line.

`if()` and `@function` let accessibility styles live in one place. Just remember that the more conditions you write, the more important it is that every path has a result.

## Related reading

- [One Line to Change Opacity with alpha(), One Line to Roll Back with revert-rule: Testing Two Small CSS Tools](/en/blog/css-alpha-revert-rule/)
- [Zoomed In and the Top of Your Centered Content Is Gone? Make It Reachable with safe center](/en/blog/css-safe-alignment/)
- [Modern CSS & HTML Cheat Sheet: 115 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

## Related links

- [CSS Values and Units Level 5 (if())](https://drafts.csswg.org/css-values-5/#if-notation "Open new window"){target="_blank"}
- [CSS Functions and Mixins (@function)](https://drafts.csswg.org/css-mixins-1/ "Open new window"){target="_blank"}
- [MDN — if()](https://developer.mozilla.org/en-US/docs/Web/CSS/if "Open new window"){target="_blank"}
- [WCAG 2.2 — Understanding 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions "Open new window"){target="_blank"}
- [WCAG 2.2 — Understanding 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible "Open new window"){target="_blank"}
- [WCAG 2.2 — Understanding 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum "Open new window"){target="_blank"}
- [Can I use](https://caniuse.com "Open new window"){target="_blank"}
