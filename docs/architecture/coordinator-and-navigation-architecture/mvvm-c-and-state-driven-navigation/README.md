---
title: "MVVM-C and State-Driven Navigation"
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
  - mvvm-c
  - state-driven-navigation
  - swiftui
---

# MVVM-C and State-Driven Navigation

> MVVM-C sends view-model route intent to an imperative coordinator. State-driven
> navigation stores the route and derives presentation from it. Both require one owner
> and synchronization with user-driven dismissals.

## Quick Recall

- MVVM-C keeps UIKit presentation mechanics out of view models.
- State-driven navigation makes paths, sheets, and selections inspectable and restorable.
- Do not let coordinator commands and route state independently control the same destination.
- Views may send route actions, but flow policy belongs to a coordinator, router, or reducer.
- Choose from platform, migration, restoration, testing, and flow complexity rather
  than treating one style as universally modern.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
