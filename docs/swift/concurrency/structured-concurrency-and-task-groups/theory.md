---
title: "Structured Concurrency and Task Groups: Theory"
domain: "Swift"
topic: "Concurrency"
concept: "Structured Concurrency and Task Groups"
page_type: theory
interview_priority: core
estimated_read_minutes: 5
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-08-12
---

# Structured Concurrency and Task Groups: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Structured concurrency organizes tasks as a tree. The code block that creates a
child task owns it. That block cannot return until all of its children finish.
This structure does not limit how many children run at once. It makes ownership
clear so the code can define limits, error handling, and result handling.

## How It Works

`async let` creates a fixed number of child tasks known when you write the code. Task groups add a
dynamic number of children and expose results asynchronously as each child completes.

<figure class="schematic-figure">
  <iframe class="schematic-frame" src="../diagram.html" style="--schematic-aspect: 960 / 580" title="Structured Concurrency and Task Groups" loading="lazy"></iframe>
  <figcaption><a href="../diagram.html">Open the Structured Concurrency and Task Groups diagram</a></figcaption>
</figure>

```swift
typealias ID = Int

struct Record: Sendable {
    let id: ID
}

func fetch(_ id: ID) async throws -> Record {
    Record(id: id)
}

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

let records = try await fetchAll([1, 2, 3], limit: 2)
print(records.map(\.id).sorted()) // [1, 2, 3]
```

Use `withDiscardingTaskGroup` when child tasks produce no values you need to keep.
It avoids storing a growing list of empty `Void` results. Child tasks inherit task-local
values and an effective priority, but scheduling remains runtime-controlled.

For fail-fast behavior, consume with throwing `next()` and allow the error to escape,
which cancels siblings. Children still stop cooperatively. For partial success, catch
inside each child and return a typed outcome such as `(ID, Result<Value, Error>)`.

### Rules That Must Stay True

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

Choose `async let` for a fixed set of independent operations. Choose a group for a
dynamic number of operations, results processed as they finish, or a limited pool of workers.

### When Not to Use It

Do not run dependent steps in parallel. Do not create a group for one operation.
A task group also cannot replace a durable job system when work must survive the process.

### Trade-offs

| Choice | Benefits | Costs | Best fit |
|---|---|---|---|
| `async let` | Concise, mixed-type results | Fixed task shape | Small fixed fan-out |
| Throwing group | Dynamic, fail-fast | Cooperative shutdown can delay return | All-or-nothing batch |
| Per-child `Result` | Preserves partial outcomes | More result-handling rules | Batch where some failures are acceptable |
| Bounded group | Protects dependencies | Lower peak throughput | Finite resources |

### Alternatives

Use sequential iteration for strict ordering or low volume, `AsyncSequence` for an
open-ended feed, and a persisted queue for work that must survive a crash or run across processes.

## Production Application

### Performance

Set limits from measured downstream capacity rather than core count alone. Include
memory used by each child, connection pools, server quotas, and extra load from retries.

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
ordering, priority, cancellation, and error behavior instead of translating syntax only.

## Staff and Principal Perspective

### System Impact

Starting many local child tasks can multiply traffic across service layers. Choose a
limit that accounts for retries, other clients, server quotas, and memory budgets.

### Decision Framework

Define the task shape, ordering, failure policy, capacity, deadline, and monitoring before
selecting the structured primitive.

### Organizational Impact

Define shared concurrency limits and overload behavior for each dependency. Otherwise,
every feature may choose a reasonable local limit whose combined load is unsafe.

## References

- [The Swift Programming Language: Tasks and task groups](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/#Tasks-and-Task-Groups)
- [SE-0304: Structured concurrency](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0304-structured-concurrency.md)
- [WWDC23: Beyond the basics of structured concurrency](https://developer.apple.com/videos/play/wwdc2023/10170/)
