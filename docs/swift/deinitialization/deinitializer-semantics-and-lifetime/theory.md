---
title: "Deinitializer Semantics and Lifetime: Theory"
domain: "Swift"
topic: "Deinitialization"
concept: "Deinitializer Semantics and Lifetime"
page_type: theory
interview_priority: situational
estimated_read_minutes: 2
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Deinitializer Semantics and Lifetime: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

ARC determines object lifetime; `deinit` is the last synchronous chance to release
instance-owned resources. It does not guarantee when a business operation ends.

## How It Works

```swift
final class FileLease {
    private let descriptor: Int32
    init(descriptor: Int32) { self.descriptor = descriptor }
    deinit { close(descriptor) }
}
```

Strong references can extend lifetime beyond lexical scope. Retain cycles can prevent
teardown entirely. Deinitializer order between unrelated objects is not a coordination protocol.

Swift 6.2 permits `isolated deinit` on actor-isolated classes. A normal deinitializer
is nonisolated; it cannot access actor-protected state merely because the class is isolated.

### Core Invariants

- Teardown is synchronous, bounded, and nonthrowing.
- `self` does not escape or resurrect during teardown.
- Superclass cleanup occurs automatically.
- Correctness does not depend on unrelated deallocation order.
- Isolated state is accessed only from the correct executor.

### Constraints and Guarantees

- Deinitializers take no arguments and return no value.
- They cannot be overloaded or invoked manually.
- ARC timing depends on the last strong reference, not source-scope appearance alone.
- Deinitialization cannot perform awaited asynchronous cleanup.

## Engineering Judgment

Use `deinit` for bounded release of exclusively owned synchronous resources and as a
fallback assertion. Use explicit close/cancel APIs for observable or asynchronous shutdown.

## References

- [The Swift Programming Language: Deinitialization](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/deinitialization/)
- [The Swift Programming Language: Automatic Reference Counting](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/)
- [SE-0371: Isolated Synchronous Deinit](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0371-isolated-synchronous-deinit.md)
