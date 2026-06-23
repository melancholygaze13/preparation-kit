---
title: "Expensive Work and Caching"
domain: "SwiftUI"
topic: "Performance and Diagnostics"
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
  - expensive-work
  - caching
  - responsiveness
---

# Expensive Work and Caching

> Move costly transformation, decoding, and I/O out of hot view evaluation paths.
> Cache only after measuring, with explicit ownership, key, invalidation, and memory policy.

## Quick Recall

- Do not sort, filter, decode, format, or fetch repeatedly in `body`.
- Derived data should follow one source of truth and explicit invalidation.
- Cache at the narrowest reusable owner, not in arbitrary leaf views.
- Async suspension does not move CPU-heavy synchronous work off the main actor.
- A stale or unbounded cache is a correctness or memory defect, not an optimization.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
