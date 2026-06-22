---
title: "Subclassing, Initialization, and Setter Access: Theory"
domain: "Swift"
topic: "Access Control"
concept: "Subclassing, Initialization, and Setter Access"
page_type: theory
interview_priority: situational
estimated_read_minutes: 2
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Subclassing, Initialization, and Setter Access: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Separate five permissions: name a type, construct it, read state, mutate state, and override behavior.
Swift access modifiers let an API owner publish each deliberately. `open` is an extension protocol,
not a stronger spelling chosen for convenience.

## How It Works

```swift
open class Operation {
    public private(set) var isFinished = false

    public init() { }

    open func execute() {
        isFinished = true
    }
}
```

External clients can construct and subclass `Operation`, read `isFinished`, and override `execute()`.
Only the defining declaration can assign the private setter. A production open hook must document
ordering, super-call, isolation, failure, and reentrancy contracts.

### Core Invariants

- Construction validates all externally reachable states.
- Mutation authority stays with methods/owners that preserve invariants.
- Open hooks are intentionally supported across unknown subclasses.
- Required initializers remain accessible enough for every permitted subclass.
- Synthesized API is reviewed rather than assumed public.

### Constraints and Guarantees

- Public classes can be subclassed within their defining module; open enables subclassing outside it.
- Public class members can be overridden within the module; open enables external override.
- An override can be made more accessible when surrounding type rules permit.
- A required initializer must be at least as accessible as the class that requires it.
- A synthesized memberwise initializer is limited by stored-property access and is not automatically public.

## Engineering Judgment

Prefer final/public types and protocol/composition extension points. Use open only for documented
cross-module inheritance. Publish explicit validated initializers and narrow setters by default.

## References

- [The Swift Programming Language: Access Control](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
- [The Swift Programming Language: Inheritance](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/inheritance/)
