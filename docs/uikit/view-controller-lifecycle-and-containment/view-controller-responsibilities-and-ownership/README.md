---
title: "View Controller Responsibilities and Ownership"
domain: "UIKit"
topic: "View Controller Lifecycle and Containment"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
---

# View Controller Responsibilities and Ownership

> A view controller manages the UIKit lifecycle and views for one screen or
> screen region. It should coordinate
> user intent, navigation, and presentation state without becoming the owner of
> unrelated business rules or long-lived app state.

## Quick Recall

- Keep UIKit lifecycle and view wiring in the controller.
- Move business rules, formatting policy, networking, and persistence behind
  models, services, or view models when they grow past simple presentation.
- The controller usually strongly owns its root view and child controllers.
- Delegates are usually weak because the delegating object should not own its
  coordinator.
- A large controller is not always wrong, but mixed ownership is a warning sign.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
