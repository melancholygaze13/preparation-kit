---
title: "NavigationStack and Paths"
domain: "SwiftUI"
topic: "Navigation and Presentation"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - navigation-stack
  - navigation-path
  - view-identity
---

# NavigationStack and Paths

> A navigation stack is an ordered collection of route values above a root view.
> Store lightweight, stable values in the path and map each value type to a
> destination view.

## Quick Recall

- Prefer value-based navigation when code must inspect or change the stack.
- Use `[Route]` for one typed route model; use `NavigationPath` for heterogeneous values.
- A path stores navigation data, not destination views or full domain models.
- Register destinations outside lazy containers and within the stack hierarchy.
- The owner of the flow should own the path; leaf views should request navigation.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
