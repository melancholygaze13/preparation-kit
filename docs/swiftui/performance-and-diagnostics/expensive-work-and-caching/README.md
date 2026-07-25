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
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-25
tags:
  - expensive-work
  - caching
  - responsiveness
---

# Expensive Work and Caching

> Expensive work takes enough CPU, memory, I/O, or network time to affect the user.
> A cache stores a reusable result. Move costly work out of view evaluation, and add
> a cache only when its correctness and resource rules are clear.

## Quick Recall

- Do not sort, filter, decode, format, or fetch repeatedly in `body`.
- Derived data should follow one source of truth and explicit invalidation.
- Cache at the narrowest reusable owner, not in arbitrary leaf views.
- Async suspension does not move CPU-heavy synchronous work off the main actor.
- A stale or unbounded cache is a correctness or memory defect, not an optimization.

Every cache needs an owner, a complete key, a freshness rule, and a size limit. A
cached value must remain correct after data, account, locale, permissions, or display
requirements change.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
