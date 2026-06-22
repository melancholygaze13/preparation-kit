---
title: "Deinitializer Semantics and Lifetime"
domain: "Swift"
topic: "Deinitialization"
page_type: concept-index
interview_priority: situational
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Deinitializer Semantics and Lifetime

> A class deinitializer runs automatically before instance storage is reclaimed; it
> is a final synchronous teardown hook, not a general business-lifecycle event.

## Quick Recall

- Only classes declare deinitializers, with no parameters or parentheses.
- A deinitializer cannot be called directly.
- Subclass teardown runs before superclass teardown; superclass deinitializers are called automatically.
- The instance remains accessible during its deinitializer, but it must not escape again.
- Actor-isolated classes need `isolated deinit` when teardown accesses isolated state.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Deterministic Cleanup and Resource Ownership](../deterministic-cleanup-and-resource-ownership/README.md)
