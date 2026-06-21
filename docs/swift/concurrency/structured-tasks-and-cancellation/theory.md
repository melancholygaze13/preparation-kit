---
title: "Structured Tasks and Cancellation: Theory"
domain: "Swift"
topic: "Concurrency"
concept: "Structured Tasks and Cancellation"
page_type: theory
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Structured Tasks and Cancellation: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> Child tasks cannot outlive their structured scope; the parent awaits completion and propagates cancellation and priority.

- Use `async let` for a fixed small set of independent heterogeneous results.
- Use task groups for a dynamic homogeneous set and limit concurrency when resources are bounded.
- `Task {}` and `Task.detached` are unstructured and require explicit lifetime ownership.
- Cancellation is cooperative: check it in CPU loops and preserve `CancellationError`.
- Throwing groups cancel remaining children on error, but children must cooperate.

## How It Works

```swift
async let profile = loadProfile()
async let settings = loadSettings()
return try await (profile, settings)
```

Task groups collect completion-order results. Creating one task per item can exhaust
connections or memory; seed a bounded number and add work as results finish.

### Core Invariants

- Every task has a lifetime owner.
- Parent completion accounts for all structured children.
- Cancellation reaches work and is checked at safe points.
- Concurrency respects downstream capacity.
- Partial-result versus fail-fast policy is explicit.

## Failure Modes

- Fire-and-forget tasks leak after owner teardown.
- Unbounded groups overload dependencies.
- Cancellation is caught and retried.
- CPU loops never check cancellation.
- Task-local errors disappear because handles are discarded.

## Engineering Judgment

Prefer structured work. Use unstructured tasks only for genuinely independent lifetime
with a stored handle and cancellation policy. Choose fail-fast or per-child `Result`
deliberately; do not accidentally turn failures into partial success.

## Production Considerations

Test parent cancellation, child failure, concurrency limits, priority, and owner teardown.
Trace task names/operation IDs, active counts, queueing, cancellation latency, and retries.

## Staff and Principal Perspective

Concurrency limits are system architecture. Set budgets per dependency, define overload
behavior, propagate deadlines/cancellation, and make task ownership visible in reviews.

## References

- [The Swift Programming Language: Concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)
