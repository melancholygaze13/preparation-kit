---
title: "View Loading, Appearance, and Disappearance"
domain: "UIKit"
topic: "View Controller Lifecycle and Containment"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
---

# View Loading, Appearance, and Disappearance

> View loading creates the controller's view hierarchy. Appearance callbacks
> describe visibility transitions and can happen many times during one controller
> lifetime.

## Quick Recall

- `loadView` creates the root view when you build views in code.
- `viewDidLoad` is for one-time view setup after the view exists.
- `viewWillAppear`, `viewIsAppearing`, and `viewDidAppear` can run many times.
- `viewIsAppearing` has current traits, geometry, safe-area insets, and margins.
- Start visible-only work on appearance and stop it on disappearance.
- Do not assume disappearance means deallocation or permanent removal.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
