---
title: "MVC and View Controller Boundaries"
domain: "UIKit"
topic: "State, Architecture, and Dependencies"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
---

# MVC and View Controller Boundaries

> In UIKit MVC, the view controller connects views to model data and user actions.
> It should coordinate a screen, not own the product rules
> behind that screen. Keep view code, user-event translation, and presentation
> state close to the controller, but move domain decisions and long-lived state
> into model, service, or view-model boundaries.

## Quick Recall

- UIKit MVC makes the view controller the mediator between views and app data.
- A view controller may validate input and adapt presentation, but it should not
  become the owner of business rules.
- Views should stay reusable and should not know about domain services.
- Extract code when the controller mixes lifecycle, navigation, networking,
  persistence, and policy in one place.
- Good boundaries make lifecycle, testing, and migration to SwiftUI easier.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
