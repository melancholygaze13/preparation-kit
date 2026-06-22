---
title: "Closure, Callback, and Task Lifetimes"
domain: "Swift"
topic: "Automatic Reference Counting"
page_type: concept-index
interview_priority: core
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Closure, Callback, and Task Lifetimes

> Escaping closures and tasks retain their captured values. Capture strength must
> match who owns the operation and how the operation ends.

## Quick Recall

- A stored closure can form a cycle with the object that stores it.
- `[weak self]` is not a default rule; it changes whether work may continue.
- Long-lived tasks need an owner and a cancellation point.
- One-shot callbacks should release their captures after completion.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Capture Semantics and Lifetime](../../closures/capture-semantics-and-lifetime/README.md)
- [Object Graph Cycles and Non-Owning References](../object-graph-cycles-and-non-owning-references/README.md)

## Related Concepts

- [Cancellation, Timeouts, and Lifecycle](../../concurrency/cancellation-timeouts-and-lifecycle/README.md)
- [Unstructured Tasks and Task Context](../../concurrency/unstructured-tasks-and-task-context/README.md)
