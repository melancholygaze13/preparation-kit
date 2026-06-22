---
title: "Sendability and Swift 6 Migration"
domain: "Swift"
topic: "Concurrency"
page_type: concept-index
interview_priority: core
estimated_read_minutes: 1
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Sendability and Swift 6 Migration

> `Sendable` describes values that can safely cross isolation boundaries.
> Migration succeeds when types express real ownership instead of hiding warnings.

## Quick Recall

- Value types are sendable only when their stored values are sendable.
- A mutable class is not safe to transfer without isolation or synchronization.
- `@Sendable` applies sendability checks to closure captures.
- Use `@unchecked Sendable` only with a documented, reviewed safety proof.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
