---
title: "Propagation, Recovery, and Boundary Policy: Theory"
domain: "Swift"
topic: "Error Handling"
concept: "Propagation, Recovery, and Boundary Policy"
page_type: theory
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-21
tags: [error-propagation, recovery, cancellation, observability]
---

# Propagation, Recovery, and Boundary Policy: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> Catch an error only where you can make a meaningful policy decision.

- `do-catch` pattern matching selects recovery by error type and associated values.
- Rethrow or propagate when the current layer cannot recover or translate responsibly.
- `defer` performs synchronous scope cleanup on success, return, or throw.
- Cancellation is a control-flow request, not normally a user-visible failure; do not catch and report it as generic error.
- Retry only classified transient, idempotent operations with limits, backoff, and cancellation.

## Mental Model

Errors travel up ownership layers until one has the context and authority to decide.
Each boundary may preserve, translate, retry, compensate, or present—but should not erase.

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

### Core Invariants

- Every catch has recovery, translation, compensation, or presentation policy.
- Cancellation remains distinguishable and promptly propagates.
- Retry is bounded, cancellable, and safe for the operation.
- Cleanup runs on every exit path.
- Observability records one owned failure without duplicate alerting/logging at every layer.

### Constraints and Guarantees

- Catch patterns can bind typed errors and associated data.
- `defer` executes in reverse declaration order when its scope exits and cannot suspend.
- `try?` and optional chaining can collapse distinct causes into nil.
- Throwing does not undo external effects.
- Cancellation flags require cooperative checks by running work.

## Failure Modes

- Catch-and-ignore creates false success.
- Every layer logs the same error, multiplying incidents.
- Generic catch turns cancellation into an alert and retry loop.
- Retry repeats nonidempotent payment or mutation.
- Error translation drops underlying correlation and category.
- Cleanup itself fails silently after partial work.

## Engineering Judgment

Propagate within a layer, translate at stable boundaries, and present only at the user-
experience owner. Retry near the operation owner with idempotency evidence. Use explicit
transactions or compensation for partial side effects.

## Production Considerations

Test cancellation, retry exhaustion, redaction, cleanup, translation, and partial
failure. Emit stable operation/category/retry/cancellation metrics with correlation IDs.
Migrate taxonomies reader-first so old clients tolerate new server categories.

## Staff and Principal Perspective

Define an organization-wide error policy: ownership boundaries, retry budgets,
idempotency keys, cancellation treatment, redaction, alerting, correlation, and public
schema evolution. Error volume without decision ownership is operational debt.

## Common Mistakes

### Catch Every Error Near Its Source

**Why it is wrong:** Low layers usually lack business context and produce duplicated policy.

**Better approach:** Propagate to the nearest owner capable of a real decision.

### Cancellation Is Just Another Failure

**Why it is wrong:** Reporting or retrying expected cancellation creates noise and wasted work.

**Better approach:** Preserve cancellation and handle it separately from failures.

## References

- [The Swift Programming Language: Error Handling](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/errorhandling/)
- [The Swift Programming Language: Concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)
