---
title: "Stored-Property Initialization and Delegation: Theory"
domain: "Swift"
topic: "Initialization"
concept: "Stored-Property Initialization and Delegation"
page_type: theory
interview_priority: high
estimated_read_minutes: 2
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Stored-Property Initialization and Delegation: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

An initializer converts raw inputs into one fully valid value. It is not an ordinary
method on an already usable instance.

## How It Works

```swift
struct Percentage {
    let value: Double

    init?(_ value: Double) {
        guard (0...100).contains(value) else { return nil }
        self.value = value
    }
}
```

Swift's definite-initialization checks prevent reading uninitialized stored state.
Defaults reduce initializer surface, but defaults must be domain-correct rather than
placeholder values that create invalid instances.

Value-type delegation keeps construction rules consistent. If custom initializers are
declared in the original structure declaration, synthesized memberwise behavior can
change; place supplemental initializers in extensions when the language rules and API
design require preserving synthesis.

### Core Invariants

- Successful construction returns a complete valid value.
- Failed validation exposes no partially initialized instance.
- Delegation has one direction and no cycles.
- Default values are valid domain states.
- Public initializers express intent rather than stored representation.

### Constraints and Guarantees

- Stored properties require defaults or initialization before return.
- `let` properties cannot be changed after initialization.
- Value-type designated/convenience terminology does not apply as it does to classes.
- Initializer closure defaults cannot access instance properties or `self`.
- Initialization syntax does not imply cheap, pure, or thread-safe construction.

## Engineering Judgment

Use defaults for universally valid policy, explicit initializers for required inputs,
failable/throwing construction for validation, and factories for effectful or cached work.
Keep I/O out of synchronous initializers when cancellation and recovery matter.

## Production Application

Profile construction volume, allocations, and expensive default closures. Test every
boundary and verify failed construction leaves no registration or external side effect.
Changing defaults or synthesized initializer availability is an API migration.

## References

- [The Swift Programming Language: Initialization](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/initialization/)
