---
title: "The Three Popover Values: auto, manual and hint, with Live Demos"
description: "One popover attribute, three values: auto, manual and hint decide whether a popover closes when you click outside and whether opening it closes others. This post compares them with demos you can try, and covers the accessibility and fallback details of building tooltips with hint."
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

### Intro

In my [modern CSS & HTML cheat sheet](/en/blog/css-techniques-checklist), `popover="hint"` was still one of the items I hadn't tried. This post compares it with the other two values, `auto` and `manual`, and each section comes with a demo you can operate right on the page.

First, here's what your browser supports. The demos below adapt to this result:

::popover-support
::

### How the three values differ

The `popover` attribute decides two things: **whether clicking outside or pressing Escape closes it** (light dismiss), and **whether opening it closes other popovers**.

| Value | Closes on outside click / Escape | Opening it closes | Typical use |
|---|---|---|---|
| `auto` (default) | Yes | Other unrelated `auto` popovers and all `hint` popovers | Menus, dropdown panels |
| `manual` | No, you close it yourself | Nothing | Toasts, persistent panels |
| `hint` | Yes | Only other `hint` popovers | Tooltips, field help |

### auto: the default for menus

Writing `popover` with no value gives you `auto`. Only one can be open at a time, and clicking outside or pressing Escape closes it, which makes it a good fit for menus and dropdown panels.

```html
<button popovertarget="menu">Open menu</button>
<div id="menu" popover>…</div>
```

::popover-mode-demo{mode="auto"}
::

Try it: open A, then B, and A closes on its own. Click an empty part of the page or press Escape and B closes too. None of this needs JavaScript.

### manual: fully under your control

A `manual` popover doesn't close on an outside click or Escape, and it doesn't close others, so several can be open at once. It suits content that should stay on screen, like a toast, but you have to provide a way to close it.

```html
<div id="panel" popover="manual">
  <button popovertarget="panel" popovertargetaction="hide">Close</button>
</div>
```

::popover-mode-demo{mode="manual"}
::

Try it: open both A and B and they stay open together. Clicking outside or pressing Escape does nothing; only the Close button inside each panel works.

### hint: a new value made for tooltips

Before `hint`, tooltips had two poor options:

- Use `auto`: with a menu open, hovering a menu item to see its tooltip opens the tooltip **and closes the menu**.
- Use `manual`: nothing interferes, but you handle Escape, outside clicks and multiple open tooltips yourself.

`hint` fills the gap. It keeps light dismiss but ranks below `auto`: opening one only closes other `hint` popovers, so it leaves an open menu alone.

```html
<button aria-describedby="tip-save">Save</button>
<div id="tip-save" popover="hint" role="tooltip">You can also press Ctrl+S</div>
```

Tooltips usually appear on hover or keyboard focus rather than on click, so the demo uses a little JavaScript to call `showPopover()` on `pointerenter` and `focus`. Interest Invokers (the `interestfor` attribute) will let you do this declaratively, with no JavaScript at all.

::popover-mode-demo{mode="hint"}
::

Try it: hover a button or Tab to it and the tooltip appears. Move from Save to Export formats and the first tooltip closes. You can also move the pointer onto the tooltip without it disappearing.

### Lab: all three together

This lab combines all three: an `auto` menu whose items each have a `hint` tooltip, plus a `manual` toast. The event log lists every popover opening and closing as it happens, so you can see exactly what closes what.

::popover-lab
::

Suggested steps:

1. Press Show toast first to open the `manual` toast.
2. Press File menu to open the `auto` menu. The toast isn't affected, and both stay open.
3. Hover a menu item or Tab to it. The tooltip appears and **the menu stays open**.
4. Move between items. The old tooltip closes, the new one opens, and the menu stays open throughout.
5. Press Escape once to close the tooltip, then again to close the menu. The toast stays until you press its Close button.

It's also worth trying the reverse: with the menu open, press Show toast. The menu closes first, because that click lands outside the menu and triggers the `auto` light dismiss.

If the tooltips on the menu items were `auto`, step 3 would close the menu as soon as a tooltip opened. That's the reason `hint` exists.

### Accessibility when building tooltips with hint

`popover` only handles showing and hiding. **It adds no semantics.** WCAG 1.4.13 Content on Hover or Focus has three requirements, and `hint` covers only part of them:

| Requirement | Built into hint | What you add |
|---|---|---|
| Dismissible without moving focus | Yes (Escape, outside click) | Escape handling where hint isn't supported |
| Hoverable: the pointer can move onto it | No | Wait briefly after the pointer leaves the trigger, and cancel if it enters the tooltip |
| Persistent: doesn't time out | Yes | Don't add a timer that closes it |

Two more points:

- **Add the semantics yourself**: give the tooltip `role="tooltip"` and point to it from the trigger with `aria-describedby`, so screen readers announce it as a description.
- **Keep interactive elements out of tooltips**: content with links or buttons isn't a tooltip. Make it an `auto` panel the user opens instead.

### What happens without support

Unlike `hidden="until-found"`, this needs care: a browser that doesn't recognize a popover value treats it as **`manual`**. In a browser without `hint` support, your tooltips **can't be closed with Escape or an outside click**, which fails the "dismissible" requirement above.

You can detect support like this:

```js
const probe = document.createElement("div");
probe.popover = "hint";
const supportsHint = probe.popover === "hint";
```

Without support, fall back to `auto`, or add Escape handling yourself as the demos here do. `hint` is supported from Chrome 133; support in other browsers changes quickly, so check [caniuse](https://caniuse.com "Open new window"){target="_blank"} and MDN before shipping.

### Summary

- **Menus and dropdown panels**: use `auto`.
- **Toasts and persistent panels**: use `manual`, and provide a way to close them.
- **Tooltips**: use `hint`, and add the semantics, hover tolerance and an Escape fallback yourself.

### Related links

- [MDN — popover global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/popover "Open new window"){target="_blank"}
- [W3C — Understanding WCAG 2.2 SC 1.4.13 Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus "Open new window"){target="_blank"}
- [Can I use](https://caniuse.com "Open new window"){target="_blank"}
