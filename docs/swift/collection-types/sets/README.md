---
title: "Sets"
domain: "Swift"
topic: "Collection Types"
page_type: concept-index
levels:
  - senior
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-22
---

# Sets

> `Set` is an unordered value collection of unique `Hashable` elements. Equality
> defines uniqueness; hashing makes lookup efficient.

## Quick Recall

- Equal elements must produce equal hashes during one execution.
- Hash collisions are allowed; equality resolves them.
- Do not mutate hash-relevant state while an element is stored.
- Never depend on set iteration order.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
