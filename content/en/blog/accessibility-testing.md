---
title: Accessibility Testing Should Not Be Confined by Professional Silos
description:  In the past, accessibility was often synonymous with regulatory compliance, formal audits, or a checklist dusted off only at the very end of a project. But things have changed.
date: 2026-05-30
tags:
  - A11Y
  - Accessibility
  - Testing
draft: false
---

In recent years, digital accessibility has evolved from a niche topic for experts into a core consideration for product teams. In the past, accessibility was often synonymous with regulatory compliance, formal audits, or a checklist dusted off only at the very end of a project. But things have changed:

- Designers are now checking text-to-background contrast directly within Figma.
- Frontend engineers are utilizing Lighthouse, axe, and the Accessibility panel in DevTools.
- QA engineers are incorporating keyboard navigation into their test cases.
- Product Managers are realizing that poor accessibility isn’t just a “bad user experience” — it is an exclusionary barrier that shuts out entire groups of users.

These are significant strides, and the growing awareness is encouraging. I believe it is now time to shift our focus from merely “promoting accessibility” to making accessibility testing something that can be performed easily, anytime, and anywhere.

Current workflows and tools still tend to fragment accessibility responsibilities based on job titles:

- Designers use Figma to check contrast.
- Engineers use DevTools to inspect code.
- QA handles keyboard testing.

While this division of labor seems logical, it creates silos. Team members focus only on their specific domains and assume that other aspects of accessibility are “someone else’s job.” This is suboptimal. Accessibility testing should be a shared responsibility — accessible and performable by any team member, regardless of their role. It should not be confined by specific tools or professional titles.

Take a simple example: if a PM wants to verify color contrast, they currently have to master Figma, learn how to navigate DevTools, or rely on external online checkers to manually input hex codes. The barrier to entry remains far too high. Every team member should possess a baseline “accessibility mindset” and understand the fundamental principles that apply throughout the development lifecycle.

I am not suggesting that we blur professional boundaries or replace the need for deep expertise. Comprehensive audits — involving assistive technology testing, nuanced human judgment, regulatory interpretation, and complex interaction patterns — will always require specialists. However, preliminary checks should not be so difficult that only a few people can perform them.

Many issues don’t need to wait for a formal audit to be identified. If we empower team members to take action, we can catch problems much earlier:

- One click to run a scan.
- One click to simulate different visual impairments.
- One click to check for basic PDF structural integrity.
- One click to flag obvious accessibility risks on the page.

These are small actions, but they enable us to catch issues early in the process. We don’t need everyone to memorize the WCAG or become full-time accessibility consultants. We just need to ensure that when someone suspects a potential issue, they don’t stop simply because it’s “not their job.” They should be able to check, verify, and articulate the problem.

This is how I view the role of Accesserty DevCheck. While its current capabilities are just a starting point, it is designed to be cross-functional. Through our Chrome extension, anyone can perform cross-domain checks:

- Anyone can run color-blindness simulations.
- Anyone can observe usability patterns and scenarios.
- Anyone can scan page structures and accessibility rule compliance.
- Anyone can inspect PDF structures.

My goal for the future of accessibility tools is to lower the barrier to entry — not to offload professional responsibilities onto everyone, but to provide everyone with the agency to verify issues the moment they are discovered.

If accessibility testing remains the exclusive domain of a few, it inevitably leads to bottlenecks and burnout. But if it is integrated into our daily routines, it can evolve into a genuine culture — one where we don’t wait until a user is blocked or frustrated to care. Because by the time a user encounters a barrier, they have likely already felt excluded, abandoned the flow, or been shut out entirely.

Accessibility awareness is spreading. Now, we need to ensure that the ability to test for it spreads just as widely — making it simple enough for anyone to verify, at any time, with just a few clicks.
