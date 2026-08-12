---
title: "Scrolling Performance and Cell Configuration"
domain: "UIKit"
topic: "Performance, Memory, and Diagnostics"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
---

# Scrolling Performance and Cell Configuration

> Smooth scrolling depends on keeping each visible-cell update fast. The same
> model should produce the same view state, and asynchronous results must still
> match the item that the reused cell currently displays.

## Quick Recall

- Keep `cellForRowAt` and cell registrations small and synchronous.
- Move loading, decoding, and expensive formatting away from the reuse path.
- Reset temporary non-content resources in `prepareForReuse`.
- Cancel obsolete work and verify model identity before applying async results.
- Use prefetching and caching to shift work earlier, but measure the effect.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
