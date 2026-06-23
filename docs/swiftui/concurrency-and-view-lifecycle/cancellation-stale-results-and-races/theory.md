---
title: "Cancellation, Stale Results, and Races: Theory"
domain: "SwiftUI"
topic: "Concurrency and View Lifecycle"
concept: "Cancellation, Stale Results, and Races"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 8
status: reviewed
last_reviewed: 2026-06-23
tags:
  - cancellation
  - stale-results
  - logical-races
---

# Cancellation, Stale Results, and Races: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Cancellation says that a task's result is no longer wanted. It does not forcibly
stop code. Correct UI concurrency uses two defenses:

1. Cancel obsolete work to save resources and propagate intent.
2. Validate that a result is still relevant immediately before committing it.

The second defense is essential because cancellation can race with completion and
some dependencies do not cooperate.

## How It Works

### Cooperative Cancellation

Calling `cancel()` sets a flag, invokes cancellation handlers, and propagates to
structured child tasks. Code stops only when it checks the flag or calls a
cancellation-aware API.

Use throwing checks in work that can abandon its result:

```swift
func buildIndex(from records: [Record]) async throws -> Index {
    var builder = Index.Builder()
    for record in records {
        try Task.checkCancellation()
        builder.add(record)
    }
    return builder.finish()
}
```

Check at useful boundaries, especially before expensive iterations and before side
effects. Checking every trivial operation adds noise; never checking in a long CPU
loop makes cancellation ineffective.

`withTaskCancellationHandler` bridges cancellation to an underlying operation such
as a legacy request's `cancel()`. Its cancellation closure must be safe to run under
the API's concurrency rules and should not perform arbitrary UI mutation.

### Cancellation Is Not Failure

`CancellationError` normally means the user navigated away, changed a query, or
replaced the work. Do not show an error alert or clear valid content for that path.
Propagate or handle it separately:

```swift
do {
    let value = try await repository.load(id)
    try Task.checkCancellation()
    commit(value, for: id)
} catch is CancellationError {
    return
} catch {
    phase = .failed(error)
}
```

Do not broadly catch errors and then commit fallback UI without checking
cancellation. Some cancellation-aware APIs throw their own error, so the dependency
contract should state how cancellation is represented.

### Stale-Result Races

Consider live search:

```text
request "s" starts
request "swift" starts
request "swift" finishes
request "s" finishes last and overwrites the UI
```

Main-actor isolation serializes assignments but does not make their order match user
intent. `.task(id: query)` cancels the old view task, but a robust model also compares
the requested query or generation before commit.

```swift
@MainActor
func search(_ query: String) async {
    generation += 1
    let requestGeneration = generation

    do {
        let response = try await client.search(query)
        guard requestGeneration == generation else { return }
        phase = .loaded(response)
    } catch is CancellationError {
        return
    } catch {
        guard requestGeneration == generation else { return }
        phase = .failed(error)
    }
}
```

An ID comparison is clearer when one domain key defines relevance. A generation
works when several inputs form a request or when the same key is intentionally
reloaded.

### Debouncing and Rate Control

Search commonly waits briefly before issuing a request. Use a cancellation-aware
clock sleep, then check cancellation:

```swift
try await Task.sleep(for: .milliseconds(300))
try Task.checkCancellation()
let results = try await client.search(query)
```

The debounce duration is a product and measurement decision. It should not be used
to hide an ordering bug. Throttling, debouncing, deduplication, caching, and
concurrency limits solve different resource and interaction problems.

### Side Effects and Commit Points

Cancellation before a reversible calculation can discard it. Cancellation during a
side effect needs a defined transaction boundary. Once a payment, message send, or
upload commit is accepted, the operation may need to finish even if the initiating
screen disappears.

Separate preparation from commit. Check cancellation before the commit, perform the
idempotent domain operation in its proper owner, and reconcile the result afterward.
Do not assume cancellation rolled back a server request; use idempotency keys and
server state where duplicate effects matter.

### Deduplication and Shared Work

If several views request the same resource, a repository can reuse an in-flight
task. Cancellation policy then becomes important: one consumer canceling should not
necessarily cancel work still needed by another. The repository can reference-count
consumers, keep shared work alive, or offer per-consumer observation of a durable
operation.

Avoid storing arbitrary task handles in views as a global cache. Shared work needs a
named owner, synchronization, eviction policy, and tests for failure and cancellation.

### Structured Children and Timeouts

When a parent cancels, structured child tasks and task groups receive cancellation.
Children still need to cooperate. A throwing task group cancels remaining children
when one throws, but the group scope cannot return until its children finish. One
child that ignores cancellation can therefore delay the whole operation.

A timeout is a race between useful work and a clock, followed by cancellation of the
loser. The underlying work must cooperate, and a timed-out server request may still
have produced a side effect. Report timeout separately from user cancellation when
the product needs different recovery, but do not invent a cancellation “reason” in
the task itself because Swift cancellation only stores a Boolean state.

Use `ContinuousClock` and duration-based sleep for elapsed-time policy. Wall-clock
changes should not affect a request timeout. Centralize timeout and retry behavior in
the service boundary so nested layers do not each start independent timers.

### Ownership of Errors

An error should be presented only by the request that still owns the visible state.
An old failure arriving after a new success is as stale as an old success arriving
late. Apply the same generation or key guard to every completion path.

If several consumers share one request, distinguish the shared operation's error
from each consumer's cancellation. One screen leaving should not turn the operation
into a failure for remaining consumers, and a shared failure should be normalized
once rather than producing duplicate alerts from every observer.

### Testing Races Deterministically

Do not use fixed sleeps. Inject a dependency that suspends until the test resumes
specific requests. Complete request B before request A and assert that A cannot
overwrite B. Cancel while production code is suspended and verify it exits without
committing failure.

Test rapid input, navigation away and back, retries, duplicate requests, and account
changes. These scenarios expose relevance mistakes better than a single successful
load.

Also exercise completion and cancellation at nearly the same boundary. The expected
outcome should be based on the model's relevance rule, not which callback happened
to win on one test machine. This makes the policy stable even when executor
scheduling changes.

## Constraints and Guarantees

- Task cancellation is cooperative and idempotent.
- Structured child tasks receive parent cancellation.
- Cancellation does not carry a reason and does not roll back external side effects.
- Actor isolation prevents concurrent mutation, not stale ordering across suspension.
- A task may finish before a cancellation request is observed.
- Error and cancellation semantics depend partly on the called API's contract.

## Engineering Decisions

| Problem | Primary mechanism |
|---|---|
| View input changed | `.task(id:)` plus relevance validation |
| Long CPU loop | Periodic `Task.checkCancellation()` |
| Legacy cancellable request | `withTaskCancellationHandler` |
| Rapid search input | Debounce, cancel, and generation or query guard |
| Duplicate resource loads | Repository-level in-flight deduplication |
| Irreversible operation | Explicit commit boundary and idempotency |

## Production Application

Record privacy-safe request keys, generations, cancellations, discarded stale
results, and commit outcomes. A high cancellation rate can be normal during search;
a high stale-discard rate may expose latency or excessive restarts.

At broader scope, publish cancellation contracts for repositories and feature APIs.
Callers need to know whether cancellation stops network work, stops only awaiting,
or leaves a shared operation running. Consistent semantics reduce feature-specific
task-handle code and make incidents diagnosable.

## References

- [`Task.cancel()`](https://developer.apple.com/documentation/swift/task/cancel%28%29)
- [`Task.checkCancellation()`](https://developer.apple.com/documentation/swift/task/checkcancellation%28%29)
- [`withTaskCancellationHandler`](https://developer.apple.com/documentation/swift/withtaskcancellationhandler%28operation%3Aoncancel%3Aisolation%3A%29)
- [Concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)
