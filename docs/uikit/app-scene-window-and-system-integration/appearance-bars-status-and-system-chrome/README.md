---
title: "Appearance, Bars, Status, and System Chrome"
domain: "UIKit"
topic: "App, Scene, Window, and System Integration"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
---

# Appearance, Bars, Status, and System Chrome

> System chrome means UIKit-managed interface around app content, such as
> navigation bars, tab bars, and the status bar. Prefer standard components.
> Configure shared style through appearance APIs and screen-specific choices
> through the active controller.

## Quick Recall

- Configure standard, compact, and scroll-edge states with bar appearance objects.
- Prefer standard bars and semantic colors so new platform materials and
  accessibility settings adapt automatically.
- Route status-bar style through the visible child controller and call the
  matching invalidation method when the preference changes.
- Treat home-indicator hiding and system-gesture deferral as requests, not
  guarantees.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
