---
title: "Scrolling Performance and Cell Configuration"
domain: "UIKit"
topic: "Performance, Memory, and Diagnostics"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-05
---

# Scrolling Performance and Cell Configuration

> Smooth scrolling comes from making each visible-cell update cheap,
> deterministic, and tied to the current model identity. Reuse is not just an
> optimization; it is a correctness constraint.

## Quick Recall

- Keep `cellForRowAt` and cell registrations small and synchronous.
- Move loading, decoding, and expensive formatting away from the reuse path.
- Reset transient state in `prepareForReuse`.
- Cancel obsolete work and verify model identity before applying async results.
- Use prefetching and caching to shift work earlier, but measure the effect.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
