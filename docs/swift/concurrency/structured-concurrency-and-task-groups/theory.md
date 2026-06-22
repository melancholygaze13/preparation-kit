---
title: "Structured Concurrency and Task Groups: Theory"
domain: "Swift"
topic: "Concurrency"
concept: "Structured Concurrency and Task Groups"
page_type: theory
interview_priority: core
estimated_read_minutes: 4
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Structured Concurrency and Task Groups: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Structured concurrency is a tree. The lexical parent owns every child, and leaving the
scope joins outstanding children. Structure does not impose a safe capacity; it makes
ownership visible so capacity, error, and result policies can be implemented deliberately.

## How It Works

`async let` creates child tasks for a statically known topology. Task groups add a
dynamic number of children and expose results asynchronously as each child completes.

```swift
func fetchAll(_ ids: [ID], limit: Int) async throws -> [Record] {
    precondition(limit > 0)
    return try await withThrowingTaskGroup(of: Record.self) { group in
        var iterator = ids.makeIterator()
        for _ in 0..<limit {
            guard let id = iterator.next() else { break }
            group.addTask { try await fetch(id) }
        }

        var records: [Record] = []
        while let record = try await group.next() {
            records.append(record)
            if let id = iterator.next() {
                group.addTask { try await fetch(id) }
            }
        }
        return records
    }
}
```

Use `withDiscardingTaskGroup` when successful child values are intentionally unused;
it avoids retaining an accumulation of `Void` results. Child tasks inherit task-local
values and an effective priority, but scheduling remains runtime-controlled.

For fail-fast semantics, consume with throwing `next()` and allow the error to escape,
which cancels siblings. Children still stop cooperatively. For partial success, catch
inside each child and return a typed outcome such as `(ID, Result<Value, Error>)`.

### Core Invariants

- No child escapes its structured scope.
- Every result, failure, and cancellation has a defined owner.
- Concurrency never exceeds the declared resource budget.
- Input ordering is restored explicitly when required.
- Partial success is distinguishable from full success.

### Constraints and Guarantees

- The scope waits for all children before returning, including cancelled children that
  have not yet cooperated.
- Cancelling a parent marks structured descendants cancelled; it does not forcibly stop them.
- Task-group iteration is completion-ordered. The runtime does not guarantee start or finish order.

## Engineering Judgment

### When to Use It

Choose `async let` for fixed independent branches and groups for dynamic fan-out,
streaming completion, or bounded worker pools.

### When Not to Use It

Do not fan out dependent steps, create a group merely to call one operation, or use a
group as a substitute for a durable job system whose work must survive process lifetime.

### Trade-offs

| Choice | Benefits | Costs | Best fit |
|---|---|---|---|
| `async let` | Concise, heterogeneous results | Fixed topology | Small fixed fan-out |
| Throwing group | Dynamic, fail-fast | Cooperative shutdown can delay return | All-or-nothing batch |
| Per-child `Result` | Preserves partial outcomes | More aggregation policy | Best-effort batch |
| Bounded group | Protects dependencies | Lower peak throughput | Finite resources |

### Alternatives

Use sequential iteration for strict ordering or low volume, `AsyncSequence` for an
open-ended feed, and a persisted queue for crash-resilient or cross-process work.

## Production Application

### Performance

Set limits from measured downstream capacity rather than core count alone. Include
per-child memory, connection pools, server quotas, and retry amplification.

### Concurrency and Thread Safety

Child closures crossing isolation must capture sendable values. Do not mutate a shared
collection from children; aggregate inside the parent scope.

### Testing

Use a controllable dependency that records active calls to assert the limit, inject
failure at a chosen child, and verify cancellation plus partial/fail-fast policy.

### Observability and Debugging

Track active and queued children, completion latency, cancellation drain time, error
distribution, and downstream saturation. Name tasks where the supported API adds value.

### Compatibility and Migration

Replace `DispatchGroup` or manually collected task handles incrementally. Preserve
ordering, QoS intent, cancellation, and error semantics instead of translating syntax only.

## Staff and Principal Perspective

### System Impact

Local fan-out multiplies traffic across service layers. A limit must compose with retries,
other clients, server quotas, and memory budgets.

### Decision Framework

Define topology, ordering, failure policy, capacity, deadline, and observability before
selecting the structured primitive.

### Organizational Impact

Centralize dependency-specific concurrency budgets and overload policy; otherwise each
feature independently chooses a locally reasonable limit that is globally unsafe.

## References

- [The Swift Programming Language: Tasks and task groups](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/#Tasks-and-Task-Groups)
- [SE-0304: Structured concurrency](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0304-structured-concurrency.md)
- [WWDC23: Beyond the basics of structured concurrency](https://developer.apple.com/videos/play/wwdc2023/10170/)
