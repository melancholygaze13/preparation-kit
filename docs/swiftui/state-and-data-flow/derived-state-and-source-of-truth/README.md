---
title: "Derived State and Source of Truth"
domain: "SwiftUI"
topic: "State and Data Flow"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-08-12
tags:
  - derived-state
  - source-of-truth
  - state-modeling
---

# Derived State and Source of Truth

> Store the smallest set of independent facts and derive the rest. Duplicate
> mutable representations require synchronization, create invalid combinations,
> and make it unclear which value wins.

Derived state is a value determined completely by other current values. It often
needs no storage at all. The source of truth is the authority for its inputs.

## Quick Recall

- A source of truth is the authoritative owner, not every place a value is visible.
- Compute cheap projections from current inputs instead of storing copies.
- Cache only when measurement justifies explicit invalidation complexity.
- Model mutually exclusive modes with a state type, not unrelated booleans.
- A draft is valid separate state only with defined reset, commit, and conflict rules.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
