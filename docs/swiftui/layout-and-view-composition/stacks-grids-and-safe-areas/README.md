---
title: "Stacks, Grids, and Safe Areas"
domain: "SwiftUI"
topic: "Layout and View Composition"
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
  - layout
  - grids
  - safe-area
---

# Stacks, Grids, and Safe Areas

> Choose a container from the relationship the content needs. Stacks arrange one
> dimension, grids coordinate rows and columns, lazy containers defer child creation,
> and safe-area APIs define how content shares space with system and custom UI.

## Quick Recall

- `HStack`, `VStack`, and `ZStack` eagerly compose linear or layered content.
- `Grid` aligns both axes; lazy grids trade some cross-cell behavior for scalability.
- Lazy containers do not make expensive child work free or guarantee one-time creation.
- Prefer `safeAreaInset` for persistent bars that must reserve content space.
- Use `ignoresSafeArea` deliberately, usually for backgrounds rather than controls.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
