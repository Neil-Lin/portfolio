---
title: "An Outside label Can Finally Reach the input Inside Shadow DOM: shadowrootreferencetarget"
description: "A long-standing accessibility problem with Web Components: an outside <label for>, aria-labelledby or aria-describedby can't point to anything inside Shadow DOM. shadowrootreferencetarget lets a component say \"when something points at me, it really means this element inside\". This post tests what it can and can't do with live demos, where testing tools report false errors, and how it could help my own UI Kit."
date: 2026-10-14
tags:
  - HTML
  - Web Components
  - Front-End
  - Accessibility
  - Browser Support
category: frontend
translationKey: shadow-dom-reference-target
draft: false
---

> Up front: I tested the behavior in this post in Chromium 153; 141 doesn't support it yet. According to the Chrome 152 release notes, it shipped in 152. I couldn't confirm the status in Firefox and Safari while writing, so check caniuse before shipping. If I've gotten something wrong, corrections welcome.

## Intro

If you've built form components with Shadow DOM, you've probably run into this:

```html
<label for="email">Email</label>
<my-input id="email"></my-input>
```

The Shadow DOM of `<my-input>` holds a real `<input>`. It looks like the label points at the component, but a screen reader hears an input **with no name**, and clicking the label doesn't move focus into the input either.

The reason is that **ids don't cross the Shadow DOM boundary**. `for="email"` finds the outer `<my-input>`, which isn't a form control, so the label has nothing to give its name to; and the input inside the Shadow DOM can't be reached by an id from outside. Every attribute that refers to others by id, like `aria-labelledby` and `aria-describedby`, has the same problem.

`shadowrootreferencetarget`, from my [CSS & HTML cheat sheet](/en/blog/css-techniques-checklist), solves exactly this.

First, here's what your browser supports:

::feature-support{features="reference-target" notice="Your browser doesn't support reference target, so both sides of the demo below will behave the same."}
::

## 1. The old workarounds

Before reference target, there were three common approaches, each with a cost:

| Approach | Cost |
|---|---|
| Put the label inside the component too (e.g. pass the text in as an attribute) | The layout and text are locked inside the component; you can't lay it out freely outside |
| Use JavaScript to copy the outside text into the inner input's `aria-label` | You have to keep it in sync when the text changes, and you only get the name, not the click-the-label-to-focus behavior |
| Make the outer element pretend to be the input (`role`, `tabindex`) | Keyboard, typing and form behavior all have to be rebuilt by hand, and it's easy to miss something |

## 2. The syntax: "pointing at me really means this element inside"

Name the id of an element inside the shadow root, and when something outside points at the component by id, the browser points at that element instead.

The declarative form goes on the `<template>`:

```html
<label for="email">Email</label>
<my-input id="email">
  <template shadowrootmode="open" shadowrootreferencetarget="inp">
    <input id="inp" type="email">
  </template>
</my-input>
```

I covered `<template shadowrootmode>` in [my Declarative Shadow DOM post](/en/blog/declarative-shadow-dom/).

When you create the Shadow DOM with JavaScript, pass it to `attachShadow()`, and you can change it later too:

```js
const root = this.attachShadow({ mode: "open", referenceTarget: "inp" });
root.referenceTarget = "inp";
```

## 3. Try it

On both sides below, an outside `<label for>` points at a Shadow DOM component; the only difference is that the right side sets a reference target. Click "Email" and see whether focus reaches the input:

::reference-target-demo{kind="label"}
::

> Note: the input in the left demo has no name on purpose, to show the problem. If you're reading this with a screen reader, you'll hear an edit field with no name; just skip it. Tools like axe will also flag it on this page.

What I saw in the Chromium 153 accessibility tree:

- **Left**: the input has no name, and clicking the label doesn't move focus.
- **Right**: the input is named "Email", and clicking the label focuses the input, just like a regular `<label>` and `<input>`.

## 4. Not just labels

Every attribute that points at others by id gets forwarded to the inner element when it points at a component with a reference target. Here's what I tested:

| Outside attribute | Result |
|---|---|
| `<label for>` | Name connected; clicking the label focuses the input |
| `aria-labelledby`, `aria-describedby` | Text inside the component can be used as a name or description |
| `commandfor`, `popovertarget` | A button can open a `<dialog>` or popover inside the component |
| `aria-controls`, `aria-activedescendant` | Can point at an element inside the component |
| A component inside a component | The outer one points at the inner one, which points at the input, all the way down |

For example, with a component that only shows a hint, an outside input can point at it with `aria-describedby`, and a screen reader reads the hint inside:

```html
<input aria-label="Phone" aria-describedby="phone-hint">
<form-hint id="phone-hint">
  <template shadowrootmode="open" shadowrootreferencetarget="msg">
    <p id="msg">Format: 0912-345-678</p>
  </template>
</form-hint>
```

In my test, this input's description was "Format: 0912-345-678".

Opening a dialog inside a component works the same way: the `commandfor` from [my dialog post](/en/blog/dialog-modern-guide/) can point straight at the component:

```html
<button commandfor="settings" command="show-modal">Settings</button>
<settings-panel id="settings">
  <template shadowrootmode="open" shadowrootreferencetarget="dlg">
    <dialog id="dlg">…</dialog>
  </template>
</settings-panel>
```

## 5. What it can't do

Testing also turned up a few things it doesn't handle:

| Case | Result |
|---|---|
| **The other direction**: an input inside the component with `aria-describedby="an outside id"` | No effect. Reference target only handles "outside pointing in" |
| `aria-label` on the component's host | Not forwarded; only id-reference attributes are |
| The named id doesn't exist inside the component | Fails silently, with no error |
| Only one target per component | Moving `aria-activedescendant` between options would mean constantly changing `referenceTarget`, which isn't practical |
| Form submission | The inner input isn't submitted with an outside `<form>`; you still need a form-associated custom element (ElementInternals) |
| `label.control` | Returns the host, not the inner input |

For the other direction, use ARIA's element reference properties to hand the outside element straight to the inner input. In my test, this connects:

```js
input.ariaDescribedByElements = [document.getElementById("outside-hint")];
```

## 6. Testing tools report false errors

When I ran axe-core 4.10.2 on the right-hand pattern from section 3, it reported "Form elements must have labels". But in the actual accessibility tree, the input's name is correct.

So for components using reference target, **don't rely on automated tools alone**. Check with the accessibility panel in DevTools or with a screen reader. Newer versions of these tools may support it later, so it's worth re-testing then.

## 7. A real example: my UI Kit

My [Accesserty UI Kit](https://github.com/Accesserty/UI-Kit "Open new window"){target="_blank"} is a set of Web Components built with Shadow DOM, which makes it a good place to see what this feature could help with.

Take `<au-input>` in version 2.0.8. To connect outside labels and descriptions, it currently does quite a lot:

- It watches the whole page with a MutationObserver and re-syncs whenever an outside `aria-labelledby` or `aria-describedby` changes.
- In browsers that support `ariaLabelledByElements`, it hands the outside elements straight to the inner input; otherwise, it copies the text into `aria-label`. Descriptions are copied into a hidden element inside the Shadow DOM.
- An outside `<label for>` is picked up through the form-associated custom element's `internals.labels`.

In my Chromium 153 test, the name, description and form submission all work. But there's one small gap: **clicking an outside `<label>` doesn't move focus into the input**. Mouse users are used to clicking a label to focus its field, and that behavior is missing.

Below is a real `<au-input>`. When you check the box, the demo sets `referenceTarget` on this component to simulate adding the feature (the UI Kit itself is unchanged):

::reference-target-demo{kind="kit"}
::

With reference target added:

- **What it fixes**: clicking the label focuses the input, and labels and descriptions no longer need JavaScript to stay in sync; the browser connects them natively.
- **What has to stay**: the `list` attribute pointing at an outside `<datalist>` goes "from inside to outside", which reference target doesn't handle, so it still needs copying; form submission still relies on ElementInternals; and plenty of browsers don't support it yet, so the existing sync code stays as a fallback.

So in the short term this isn't about "deleting a pile of code", it's about **letting supporting browsers go native while the others keep the existing path**.

## 8. What if it isn't supported?

Detection:

```js
const supported = "referenceTarget" in ShadowRoot.prototype;
```

Browsers without support ignore the `shadowrootreferencetarget` attribute, so it behaves as if it weren't there. Nothing breaks; the label just doesn't connect. So you can write it now, and use detection to decide whether to run your existing sync code:

```js
if (!("referenceTarget" in ShadowRoot.prototype)) {
  // The old approach: copy the outside text into the inner input's aria-label
  syncLabelFallback();
}
```

## Conclusion

In a few lines:

- ids don't cross the Shadow DOM boundary, so an outside `<label for>` or `aria-*` can't reach elements inside a component.
- `shadowrootreferencetarget` (or `referenceTarget` in `attachShadow`) lets a component say "pointing at me really means this element inside".
- It works for every id-reference attribute: `for`, `aria-labelledby`, `aria-describedby`, `commandfor`, `popovertarget` and more.
- It only handles "outside pointing in"; for the other direction, use properties like `ariaDescribedByElements`, and form submission still relies on ElementInternals.
- Automated testing tools may report false errors, so confirm with the accessibility tree or a screen reader.

This is the biggest accessibility gap in Web Components, and it finally has a native fix. How much of your components' code exists just to carry text around for labels and ARIA?

## Related reading

- [Why Do Web Components Flash? Fixing It with Declarative Shadow DOM](/en/blog/declarative-shadow-dom/)
- [How to Write a Dialog Today: From showModal() to command and closedby](/en/blog/dialog-modern-guide/)
- [Modern CSS & HTML Cheat Sheet: 115 Features, Support & What to Try Next](/en/blog/css-techniques-checklist/)

## Related links

- [MDN — ShadowRoot](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot "Open new window"){target="_blank"}
- [Chrome 152 release notes](https://developer.chrome.com/release-notes/152 "Open new window"){target="_blank"}
- [Eric Meyer — Targeting by Reference in the Shadow DOM](https://meyerweb.com/eric/thoughts/2025/12/19/targeting-by-reference-in-the-shadow-dom/ "Open new window"){target="_blank"}
- [Nolan Lawson — Shadow DOM and accessibility: the trouble with ARIA](https://nolanlawson.com/2022/11/28/shadow-dom-and-accessibility-the-trouble-with-aria/ "Open new window"){target="_blank"}
- [Can I use](https://caniuse.com "Open new window"){target="_blank"}
