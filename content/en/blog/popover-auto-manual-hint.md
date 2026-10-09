---
title: "Popover auto, manual and hint: What's Actually the Difference? I Built Demos to Find Out"
description: "One popover attribute, three values: auto, manual and hint decide whether a popover closes when you click outside and whether opening it closes others. This post compares them with demos you can play with, plus the accessibility details you still have to add yourself when building tooltips with hint, and what happens in browsers that don't support it."
date: 2026-10-09
tags:
  - HTML
  - CSS
  - Front-End
  - Accessibility
  - Browser Support
translationKey: popover-auto-manual-hint
draft: true
---

> Up front: these are my own notes from practicing `popover="hint"`. Browser support moves fast, so what's true as I write this may not stay true. If I've gotten something wrong, corrections welcome.

### Intro

In my [modern CSS & HTML cheat sheet](/en/blog/css-techniques-checklist), `popover="hint"` was one of the boxes I still hadn't ticked.

Reading the docs, I thought I got it. It's "the popover for tooltips," right? But when I tried to explain how it actually differs from `auto` and `manual`, I realized I couldn't really say. So I put all three side by side and built a demo for each one. Playing with it once beats reading the spec ten times.

Before we start, here's what your browser supports. The demos below adapt to this result:

::popover-support
::

### How the three values differ

The `popover` attribute really decides just two things:

1. **Whether clicking outside or pressing Escape closes it** (light dismiss)
2. **Whether opening it closes other popovers**

| Value | Closes on outside click / Escape | Opening it closes | Common use |
|---|---|---|---|
| `auto` (default) | Yes | Other unrelated `auto` popovers and all `hint` popovers | Menus, dropdown panels |
| `manual` | No, you close it yourself | Nothing | Toasts, persistent panels |
| `hint` | Yes | Only other `hint` popovers | Tooltips, field help |

The table is still a bit abstract, so let's go through them one at a time.

### auto: the default for menus

Writing `popover` with no value gives you `auto`. Only one can be open at a time, and clicking outside or pressing Escape closes it, which makes it a natural fit for menus and dropdown panels.

```html
<button popovertarget="menu">Open menu</button>
<div id="menu" popover>…</div>
```

::popover-mode-demo{mode="auto"}
::

Try it: open A, then B, and A closes on its own. Click an empty part of the page or press Escape, and B closes too.

The nice part is that none of this needs a single line of JavaScript. "Close when clicking outside" used to mean listening for clicks on the document and checking whether they landed inside the menu. Now it's one attribute.

### manual: entirely up to you

A `manual` popover doesn't close on an outside click or Escape, and it doesn't close others, so several can be open at once. It suits things that should stay on screen, like a toast. The trade-off is that **you have to provide the way to close it**.

```html
<div id="panel" popover="manual">
  <button popovertarget="panel" popovertargetaction="hide">Close</button>
</div>
```

::popover-mode-demo{mode="manual"}
::

Try it: open both A and B and they stay open together. Clicking outside or pressing Escape does nothing; only the Close button inside each panel works.

### hint: finally, a value for tooltips

Before `hint`, building a tooltip with popover left you two not-great options:

- **Use `auto`**: with a menu open, you hover a menu item to see its tooltip, the tooltip opens, and **the menu closes**. That's simply unusable.
- **Use `manual`**: nothing interferes, but Escape, outside clicks and several tooltips open at once are all yours to handle.

`hint` fills exactly that gap. It keeps light dismiss, but it ranks below `auto`: opening one only closes other `hint` popovers and leaves an open menu alone.

```html
<button aria-describedby="tip-save">Save</button>
<div id="tip-save" popover="hint" role="tooltip">You can also press Ctrl+S</div>
```

Tooltips usually appear on hover or keyboard focus rather than on click, so the demo uses a tiny bit of JavaScript to call `showPopover()` on `pointerenter` and `focus`. Once Interest Invokers (the `interestfor` attribute) are widely available, that JavaScript can go too.

::popover-mode-demo{mode="hint"}
::

Try it: hover a button or Tab to it and the tooltip appears. Move from Save to Export formats and the first tooltip closes on its own. You can also move the pointer onto the tooltip without it disappearing.

### Lab: all three together

Each one makes sense on its own, but you only see why `hint` exists when they're combined. This lab has an `auto` menu whose items each have a `hint` tooltip, plus a `manual` toast. The event log lists every popover opening and closing as it happens, so you can see exactly what closes what.

::popover-lab
::

Suggested order:

1. Press Show toast first to open the `manual` toast.
2. Press File menu to open the `auto` menu. The toast isn't affected, and both stay open.
3. Hover a menu item or Tab to it. The tooltip appears, **and the menu stays open**.
4. Move between items. The old tooltip closes, the new one opens, and the menu stays put.
5. Press Escape once to close the tooltip, then again to close the menu. The toast stays until you press its own Close button.

If the tooltips on the menu items were `auto`, step 3 would close the menu as soon as a tooltip opened. That's the whole reason `hint` exists.

One small gotcha I only noticed while building this: with the menu open, pressing Show toast closes the menu first. That click lands outside the menu, so it triggers the `auto` light dismiss. It's exactly the right behavior, I just didn't see it coming, which is why the steps say to open the toast first.

### Building tooltips with hint: you still own the accessibility

This is the part I think matters most: `popover` only handles showing and hiding. **It adds no semantics for you.**

WCAG 1.4.13 Content on Hover or Focus has three requirements, and `hint` covers only part of them:

| Requirement | Built into hint? | What you add |
|---|---|---|
| Dismissible without moving focus | Yes (Escape, outside click) | Escape handling in browsers without hint |
| Hoverable: the pointer can move onto it | No | Wait briefly after the pointer leaves the trigger, and cancel if it enters the tooltip |
| Persistent: doesn't time out | Yes | Just don't add a timer that closes it |

Two more points:

- **Add the semantics yourself**: give the tooltip `role="tooltip"` and point to it from the button with `aria-describedby`, so screen readers announce it as a description.
- **Keep interactive elements out of tooltips**: once there's a link or button in it, it isn't a tooltip anymore. Make it an `auto` panel the user opens instead.

### What happens without support?

This is different from `hidden="until-found"`, which I looked at earlier, so it needs extra care.

In a browser without support, `until-found` just falls back to a plain `hidden`: the content can't be found by search, but nothing breaks. A browser that doesn't recognize a popover value, though, treats it as **`manual`**. So in a browser without `hint` support, your tooltips **can't be closed with Escape or an outside click**, which fails the "dismissible" requirement above.

Detecting it isn't hard:

```js
const probe = document.createElement("div");
probe.popover = "hint";
const supportsHint = probe.popover === "hint";
```

Without support, you can fall back to `auto`, or add Escape handling yourself as the demos here do. `hint` is supported from Chrome 133; support in other browsers changes quickly, so check [caniuse](https://caniuse.com "Open new window"){target="_blank"} and MDN before shipping.

### Conclusion

In short:

- **Menus and dropdown panels**: use `auto`.
- **Toasts and persistent panels**: use `manual`, and give people a way to close them.
- **Tooltips**: use `hint`, but the semantics, hover tolerance and an Escape fallback are still on you.

`hint` doesn't solve a big problem. It fixes one small thing: tooltips and menus fighting each other. But small things like this are exactly what used to get rushed and then turn into accessibility issues later. Less code and one fewer trap to fall into seems well worth it to me.

That's one more box ticked on my list. How do you build tooltips in your projects? I'd love to hear about it.

### Related reading

- [Modern CSS & HTML Cheat Sheet: 102 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

### Related links

- [MDN — popover global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/popover "Open new window"){target="_blank"}
- [W3C — Understanding WCAG 2.2 SC 1.4.13 Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus "Open new window"){target="_blank"}
- [Can I use](https://caniuse.com "Open new window"){target="_blank"}
