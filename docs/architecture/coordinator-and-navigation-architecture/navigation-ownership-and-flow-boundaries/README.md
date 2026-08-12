---
title: "Navigation Ownership and Flow Boundaries"
domain: "Architecture"
topic: "Coordinator and Navigation Architecture"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
tags:
  - coordinators
  - navigation
  - ownership
---

# Navigation Ownership and Flow Boundaries

> A screen reports intent; the component that owns the user journey decides the next
> route and performs framework-specific navigation.

## Quick Recall

- Separate the decision to navigate from the UIKit or SwiftUI mechanism that presents.
- Keep local presentation local; use a flow owner for multi-screen journeys, deep
  links, restoration, or cross-feature rules.
- Pass domain identifiers and results across routes, not live view controllers or
  broad mutable models.
- Navigation state needs one owner just like product state.
- Coordinators reduce screen coupling but add routing contracts, object construction,
  lifetime management, and synchronization with user-driven back navigation.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
