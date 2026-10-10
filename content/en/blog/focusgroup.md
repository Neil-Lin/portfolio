---
title: "No More Hand-Rolled Roving tabindex: Arrow-Key Navigation with focusgroup"
description: "Toolbars, tabs and menus are supposed to take a single Tab stop and move with the arrow keys inside, which used to mean writing a roving tabindex by hand. focusgroup makes it one HTML attribute. Tested in Chromium 153, this post covers the six behavior types, modifiers, the roles it adds for you, two traps (the tab entry point, and a bare focusgroup doing nothing), and a fallback for browsers without support."
date: 2026-10-10
tags:
  - HTML
  - Front-End
  - Accessibility
  - Browser Support
category: frontend
translationKey: focusgroup
draft: false
---

> Up front: I tested the behavior in this post in Chromium 153. `focusgroup` is still new, so the spec and implementation may change, and how a screen reader actually announces it is best checked with one turned on. If I've gotten something wrong, corrections welcome.

### Intro

If you've built accessible components, you've probably written a roving tabindex.

The WAI-ARIA keyboard patterns say that "groups of buttons" like toolbars, tabs and menus should **take a single Tab stop as a whole**, with the arrow keys moving around inside. Otherwise a toolbar with 10 buttons takes a keyboard user 10 presses of Tab just to get past it.

Until now that meant JavaScript: keep one element at `tabindex="0"` and the rest at `-1`, listen for the arrow keys, Home and End, and shuffle `tabindex` around as focus moves. In my own [Accesserty UI Kit](https://github.com/Accesserty/UI-Kit "Open new window"){target="_blank"}, I've written one for the tabs, the carousel and the tree.

`focusgroup` turns this into an HTML attribute. It's one of the items in my [CSS & HTML cheat sheet](/en/blog/css-techniques-checklist) I was most looking forward to.

First, here's what your browser supports:

::feature-support{features="focusgroup" notice="Your browser doesn't support focusgroup, so the demos below fall back to a JavaScript version that behaves the same way, and you can still get a feel for it."}
::

### 1. The first trap: a bare `focusgroup` does nothing

Plenty of introductions (including the example originally in my own cheat sheet) write it like this:

```html
<div focusgroup>…</div>
```

In my tests in Chromium 153, **that does nothing at all**: the arrow keys don't move focus, and Tab still stops on every button.

The current syntax takes a **behavior type**:

```html
<div focusgroup="toolbar" aria-label="Text formatting">
  <button>Bold</button>
  <button>Italic</button>
  <button>Underline</button>
</div>
```

Now the group takes a single Tab stop and the left and right arrow keys move between the buttons, with no JavaScript at all.

### 2. Try it

Pick a type, Tab in from "Button before", then use the arrow keys, Home and End. The key log below shows where each key press landed focus:

::focusgroup-lab
::

### 3. The six behavior types

Here's how each type behaved in my tests:

| Type | Container role | Item role | Arrow keys | Wraps at the ends |
|---|---|---|---|---|
| `toolbar` | `toolbar` | Unchanged | ← → | No |
| `tablist` | `tablist` | `tab` | ← → | Yes |
| `radiogroup` | `radiogroup` | `radio` | ← → ↑ ↓ | Yes |
| `listbox` | `listbox` | Unchanged (tested with `button`) | ↑ ↓ | No |
| `menu` | `menu` | `menuitem` | ↑ ↓ | Yes |
| `menubar` | `menubar` | `menuitem` | ← → | Yes |

Every type supports Home and End to jump to the first and last items. PageUp and PageDown do nothing.

As you can see, **the type doesn't just set the keyboard behavior; it adds roles for you too**. A container with `focusgroup="tablist"` is a `tablist` in the accessibility tree, and its buttons automatically become `tab`s. More on that below.

### 4. Modifiers: wrap, nomemory, block

You can add modifiers after the type, separated by spaces:

| Modifier | Effect | Tested |
|---|---|---|
| `wrap` | Wrap around at the ends | `toolbar wrap`: ← on the first item jumps to the last |
| `nowrap` | Don't wrap | `tablist nowrap`: stops at the ends |
| `nomemory` | Don't remember the last item when tabbing back | Starts from the first item every time |
| `block` | Use the up/down arrow keys | `toolbar block`: a vertical toolbar |
| `inline` | Use the left/right arrow keys | — |

### 5. Details from testing

Beyond the arrow keys, these are the things I paid attention to:

**Tab behavior**

- **The whole group is a single Tab stop**: Tab inside the group leaves it straight away rather than stopping on each item.
- **It remembers where you were**: leave and come back with Shift+Tab, and focus returns to the last item, including one you clicked with the mouse. With `nomemory`, it starts from the first item every time.
- **The first entry lands on the first item**: whether you Tab in from before or Shift+Tab back from after, the first time lands on the first item.
- **`focusgroupstart` sets the entry point**: put `focusgroupstart` on an item, and the first entry lands on it.

**Which items get skipped**

- `disabled` buttons are skipped.
- `aria-disabled="true"` buttons are **not** skipped and can still be focused. That's a good thing: the APG suggests that disabled items in a toolbar should usually stay discoverable.
- `tabindex="-1"` and elements that aren't focusable at all (such as a `<span>`) are skipped.

**Other details**

- **Arrow keys in text fields aren't hijacked**: with an `<input>` in the group, the arrow keys move the caret and focus stays put; use Tab to leave.
- **Right-to-left languages are mirrored**: with `dir="rtl"`, ← goes to the next item.
- **Links work too**: `<a href>` elements can be items.
- **Opting part of it out**: give a child `focusgroup="none"` and it doesn't take part in arrow-key navigation; it becomes its own Tab stop.
- **A nested focusgroup** also becomes its own Tab stop, and the outer group's arrow keys don't go into it.
- **It doesn't touch your `tabindex`**: items keep their original `tabindex` of `0`; the "single Tab stop" is handled inside the browser.

### 6. Roles are automatic, state isn't

As mentioned, `focusgroup` adds roles automatically. But in my tests, **it only handles roles, not state**:

- With `focusgroup="tablist"`, items become `tab`s, but get no `aria-selected`. Which tab is selected and which panel it controls are still up to you.
- With `focusgroup="radiogroup"`, items become `radio`s, but get no `aria-checked`.

Also, if you write a `role` yourself, yours wins. For example, `<div role="group" focusgroup="toolbar">` is a `group`.

So my recommendation: **still write the roles out explicitly**, and manage states like `aria-selected` and `aria-controls` alongside them. That way browsers without support get correct semantics too, and you're not guessing what the browser will add.

There's a practical reason too: **testing tools don't recognize these automatic roles yet**. When I ran axe on the tabs demo with only `focusgroup="tablist"` on the container and no `role="tablist"`, every `tab` was reported as "Required ARIA parent role not present: tablist", even though the browser's accessibility tree was correct. Adding `role="tablist"` cleared it.

### 7. The tabs trap: Tab lands on the first tab, not the selected one

The APG tabs pattern says that when you Tab into a tab list from outside, focus should land on **the currently selected tab**.

But `focusgroup` always lands on the first item the first time. If the second tab is selected by default, a keyboard user tabbing in lands on the first; and if your tabs switch on focus, the selection changes too.

In the demo below, "Specs" is selected by default. Try tabbing in with the box unchecked, then check `focusgroupstart` and compare:

::focusgroup-tabs
::

The fix is to keep `focusgroupstart` on the selected tab:

```html
<div focusgroup="tablist" aria-label="Product info">
  <button role="tab" aria-selected="false" aria-controls="p1">Overview</button>
  <button role="tab" aria-selected="true" aria-controls="p2" focusgroupstart>Specs</button>
  <button role="tab" aria-selected="false" aria-controls="p3">Reviews</button>
</div>
```

When the selected tab changes, move `focusgroupstart` along with it.

Keep in mind that `focusgroup` only **moves focus**. Whether focusing a tab also selects it, and showing and hiding panels, are still yours to write. The tabs in my UI Kit select as you arrow through them; switching to `focusgroup` would remove the keyboard handling (arrow keys, Home, End, right-to-left, wrapping), but the selection and panel logic would stay.

### 8. What happens without support?

Browsers without support ignore the attribute, and the component falls back to "one Tab stop per button". It still works; it just doesn't follow the APG keyboard pattern.

Feature detection:

```js
const supportsFocusgroup = "focusGroup" in HTMLElement.prototype;
```

Note that the JavaScript property is camel-cased: `focusGroup`. I first checked `"focusgroup" in HTMLElement.prototype`, and it reported no support in a browser that clearly had it.

Without support, fall back to your own roving tabindex. That's what the demos in this post do: hand it to the browser when supported, and emulate the same behavior table in JavaScript when not. Open them in Safari or Firefox and they should behave the same. The core logic looks roughly like this:

```js
if (!("focusGroup" in HTMLElement.prototype)) {
  const items = [...toolbar.querySelectorAll("button")];
  items.forEach((el, i) => (el.tabIndex = i === 0 ? 0 : -1));
  toolbar.addEventListener("keydown", (e) => {
    const i = items.indexOf(e.target);
    let next = null;
    if (e.key === "ArrowRight") next = Math.min(i + 1, items.length - 1);
    if (e.key === "ArrowLeft") next = Math.max(i - 1, 0);
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = items.length - 1;
    if (next === null) return;
    e.preventDefault();
    items[i].tabIndex = -1;
    items[next].tabIndex = 0;
    items[next].focus();
  });
}
```

### Conclusion

In a few lines:

- `focusgroup` turns "one Tab stop for the group, arrow keys inside" into an HTML attribute.
- Write it with a type, like `focusgroup="toolbar"`; a bare `focusgroup` does nothing.
- The six types set the arrow keys, wrapping and automatically added roles; `wrap`, `nomemory` and `block` fine-tune them.
- Roles are added for you, but states like `aria-selected` and `aria-checked` are still yours; I'd write the roles out explicitly too.
- For tabs, use `focusgroupstart` so the entry point is the selected tab.
- Detect with `"focusGroup" in HTMLElement.prototype`, and fall back to a roving tabindex without support.

After writing so many roving tabindexes, seeing it become an attribute is a little bittersweet, but mostly I'm glad: the more accessibility basics browsers build in, the fewer people skip them because they're "too much work".

Have you hand-written a roving tabindex in your projects? I'd love to hear about it.

### Related reading

- [Is a CSS-Only Carousel Accessible Enough? Compared Against My UI Kit](/en/blog/css-carousel-a11y/)
- [Popover auto, manual and hint: What's Actually the Difference? I Built Demos to Find Out](/en/blog/popover-auto-manual-hint/)
- [Modern CSS & HTML Cheat Sheet: 102 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

### Related links

- [Open UI — Scoped focusgroup explainer](https://open-ui.org/components/scoped-focusgroup.explainer/ "Open new window"){target="_blank"}
- [WAI-ARIA APG — Managing focus within composites (roving tabindex)](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex "Open new window"){target="_blank"}
- [WAI-ARIA APG — Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ "Open new window"){target="_blank"}
- [Accesserty UI Kit (GitHub)](https://github.com/Accesserty/UI-Kit "Open new window"){target="_blank"}
- [Can I use](https://caniuse.com "Open new window"){target="_blank"}
