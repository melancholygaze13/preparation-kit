---
title: "Composition Roots and Object Graphs"
domain: "Architecture"
topic: "Dependency Injection and Composition"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-11
tags:
  - dependency-injection
  - composition-root
  - object-graph
---

# Composition Roots and Object Graphs

> A composition root is the application boundary where concrete implementations are
> selected, scoped, and assembled. Feature code uses the graph but does not build it.

## Quick Recall

- Compose near app, scene, feature, or extension entry points—not throughout business code.
- Build stable long-lived infrastructure first, then feature-scoped models and flows.
- Factories may create runtime children, but they should expose narrow feature creation.
- Detect dependency cycles instead of resolving them with lazy service lookup.
- Manual composition is often enough in Swift; containers and generation must justify
  their debugging and build cost.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
