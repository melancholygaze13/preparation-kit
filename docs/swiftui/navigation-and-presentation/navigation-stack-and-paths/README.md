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
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-25
tags:
  - navigation-stack
  - navigation-path
  - view-identity
---

# NavigationStack and Paths

> A navigation stack is an ordered collection of route values above a root view.
> Store lightweight, stable values in the path and map each value type to a
> destination view.

The root is always present. Each path element represents one pushed level above it.
`Hashable` means Swift can give a route a stable identity for matching and storage;
it does not mean the destination's full data belongs in the route.

## Quick Recall

- Prefer value-based navigation when code must inspect or change the stack.
- Use `[Route]` for one typed route model; use `NavigationPath` for mixed-type values.
- A path stores navigation data, not destination views or full domain models.
- Append to push, remove the last element to pop, and replace the path to rebuild a flow.
- Register destinations outside lazy containers and within the stack hierarchy.
- The owner of the flow should own the path; leaf views should request navigation.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
