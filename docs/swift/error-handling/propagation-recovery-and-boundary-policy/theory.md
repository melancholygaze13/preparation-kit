---
title: "Propagation, Recovery, and Boundary Policy: Theory"
domain: "Swift"
topic: "Error Handling"
concept: "Propagation, Recovery, and Boundary Policy"
page_type: theory
interview_priority: high
estimated_read_minutes: 4
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-07-12
tags: [error-propagation, recovery, cancellation, observability]
---

# Propagation, Recovery, and Boundary Policy: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Errors travel up through layers until one has enough context and responsibility to act.
Each boundary may preserve, translate, retry, undo effects, or present the error. It
should not erase useful information.

## How It Works

```swift
do {
    return try repository.load(id)
} catch RepositoryError.notFound {
    throw ProfileError.missing
} catch {
    throw ProfileError.unavailable(underlying: error)
}
```

Order catches from specific to general. A broad catch must rethrow, translate, or
resolve deliberately. `defer` is useful for locks and scoped resources but cannot await.

### Cancellation

Swift cancellation is cooperative. Long-running throwing work should call
`Task.checkCancellation()`. Structured child tasks inherit cancellation; unstructured
tasks need explicit ownership. Filter `CancellationError` before generic alert/retry
policy, and bridge cancellation to underlying APIs with cancellation handlers when needed.

### Boundary Translation

Translate low-level errors once at the layer that owns domain meaning. Preserve safe
diagnostic context and causality, but expose stable categories to callers. HTTP status,
database codes, and localized strings should not leak as the domain contract.

### Retry and Failure Ownership

Retry only when the failure is classified as transient, the operation is safe to repeat,
and one layer owns the attempt budget. Nested automatic retries multiply traffic and can
push work beyond the user's deadline. Operations that are not safe to repeat need an
idempotency key, transaction, or undo policy before retry is safe.

Choose one layer to record the owned failure event. Lower layers can add context,
but logging and alerting at every `catch` produces duplicate events and can expose raw
payloads. Preserve a correlation identifier as the error crosses boundaries.

### Rules That Must Stay True

- Every `catch` has a recovery, translation, undo, or presentation policy.
- Cancellation remains distinguishable and promptly propagates.
- Retry is bounded, cancellable, and safe for the operation.
- Cleanup runs on every exit path.
- Metrics and logs record one owned failure without duplicates at every layer.

### Constraints and Guarantees

- Catch patterns can bind typed errors and associated data.
- `defer` executes in reverse declaration order when its scope exits and cannot suspend.
- `try?` and optional chaining can collapse distinct causes into nil.
- Throwing does not undo external effects.
- Cancellation flags require cooperative checks by running work.

## Engineering Judgment

Propagate within a layer, translate at stable boundaries, and present only in the layer
that owns the user experience. Retry near the operation owner only when repetition is
safe. Use explicit transactions or undo actions for partial side effects.

When a `catch` converts an error to a fallback, record that reduced behavior if it
changes freshness or completeness. Silent fallback can turn an incident into plausible
stale data that is harder to diagnose than a visible failure.

## Production Application

Test cancellation, retry exhaustion, redaction, cleanup, translation, and partial
failure. Emit stable operation/category/retry/cancellation metrics with correlation IDs.
Update readers first so old clients tolerate new server error categories.

## Staff and Principal Perspective

Define an organization-wide error policy. Cover ownership boundaries, retry limits,
safe repetition, cancellation, redaction, alerts, request identifiers, and public
schema changes. Many errors without a clear decision owner create ongoing operations work.

## References

- [The Swift Programming Language: Error Handling](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/errorhandling/)
- [The Swift Programming Language: Concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)
