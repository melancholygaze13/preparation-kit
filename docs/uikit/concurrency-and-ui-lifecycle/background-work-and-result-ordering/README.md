---
title: "Background Work and Result Ordering"
domain: "UIKit"
topic: "Concurrency and UI Lifecycle"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
---

# Background Work and Result Ordering

> Async results do not always finish in the order users start them. UIKit code
> must reject an old result when it no longer matches current screen state, then publish
> UI changes on the main actor.

## Quick Recall

- Background work should produce data, not mutate UIKit directly.
- Use generation tokens, request IDs, or model identity to reject stale results.
- Prefer structured concurrency for batches of related work.
- Limit concurrency when many requests could overload memory, network, or CPU.
- Build UI snapshots from accepted state, not from arbitrary callback order.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
