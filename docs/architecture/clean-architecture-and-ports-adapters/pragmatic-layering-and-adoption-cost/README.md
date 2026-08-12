---
title: "Pragmatic Layering and Adoption Cost"
domain: "Architecture"
topic: "Clean Architecture and Ports and Adapters"
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
  - clean-architecture
  - adoption
  - trade-offs
---

# Pragmatic Layering and Adoption Cost

> Apply clean boundaries where they contain costly change or protect important policy.
> Do not copy a fixed layer diagram into every feature.

## Quick Recall

- Start from risk, change, ownership, and testing pressure rather than layer count.
- A direct dependency is acceptable when it is stable, local, and cheap to replace.
- Begin with source boundaries; add protocols or modules when enforcement has value.
- Migrate by placing an adapter around current behavior and moving one path at a time.
- Measure delivery, build, defect, and runtime outcomes. Remove boundaries that cost
  more than the change they contain.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
