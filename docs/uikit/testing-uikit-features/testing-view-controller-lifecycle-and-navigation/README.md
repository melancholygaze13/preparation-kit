---
title: "Testing View Controller Lifecycle and Navigation"
domain: "UIKit"
topic: "Testing UIKit Features"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-26
---

# Testing View Controller Lifecycle and Navigation

> A view-controller test should reproduce only the UIKit setup the behavior
> needs. Load views explicitly, drive appearance through a valid sequence, and
> test navigation intent separately from framework wiring when possible.

## Quick Recall

- Constructing a controller does not load its view or run appearance callbacks.
- Use `loadViewIfNeeded()` for `viewDidLoad` behavior and a container or explicit
  appearance transition for appearance-dependent behavior.
- Test routing policy as data or commands; add a smaller integration test for
  the navigation stack or presentation wiring.
- Keep UIKit tests on the main actor and avoid delays as synchronization.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
