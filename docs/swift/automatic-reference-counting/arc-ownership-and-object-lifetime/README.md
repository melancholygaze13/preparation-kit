---
title: "ARC Ownership and Object Lifetime"
domain: "Swift"
topic: "Automatic Reference Counting"
page_type: concept-index
interview_priority: core
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# ARC Ownership and Object Lifetime

> ARC keeps a class instance alive while at least one strong reference owns it.
> The instance can be released after its last strong owner is gone.

## Quick Recall

- ARC inserts retain and release operations at compile time.
- Strong references express ownership and keep an instance alive.
- Scope end does not always equal the exact release point.
- ARC manages memory, not files, sockets, observers, or task cancellation.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Identity, Aliasing, and Mutation Ownership](../../classes-and-structures/identity-aliasing-and-mutation-ownership/README.md)
- [Deinitializer Semantics and Lifetime](../../deinitialization/deinitializer-semantics-and-lifetime/README.md)

## Related Concepts

- [Object Graph Cycles and Non-Owning References](../object-graph-cycles-and-non-owning-references/README.md)
- [Deterministic Cleanup and Resource Ownership](../../deinitialization/deterministic-cleanup-and-resource-ownership/README.md)
