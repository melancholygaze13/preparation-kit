---
title: "Offline Conflicts, Idempotency, and Retries"
domain: "Architecture"
topic: "Data Layer, Repositories, and Offline State"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-11
tags:
  - offline
  - idempotency
  - conflict-resolution
---

# Offline Conflicts, Idempotency, and Retries

> Persist user intent before attempting delivery. Give each mutation stable identity,
> make replay safe, and use a version-aware conflict rule. A retry is correct only when
> repeating the operation cannot duplicate or overwrite valid work.

## Quick Recall

- Use a durable outbox for offline mutations; memory tasks are not a delivery guarantee.
- Reuse one idempotency key for every retry of the same logical operation.
- Retry transient failures with a bounded backoff and server guidance.
- Detect conflicts with versions or change tags, then apply a domain-specific policy.
- Cancellation can stop waiting without erasing durable user intent already accepted locally.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
