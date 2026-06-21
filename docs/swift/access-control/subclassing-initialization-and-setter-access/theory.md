---
title: "Subclassing, Initialization, and Setter Access: Theory"
domain: "Swift"
topic: "Access Control"
concept: "Subclassing, Initialization, and Setter Access"
page_type: theory
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Subclassing, Initialization, and Setter Access: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> `public` permits external use; `open` opts classes and members into external subclassing/overriding.

- A subclass cannot be more accessible than its superclass.
- External subclassing requires an open class; external overriding requires an open member.
- `final` closes inheritance/override even where access would otherwise permit it.
- Synthesized initializers do not automatically become public for public structs/classes.
- A setter can be less accessible than its getter, such as `public private(set)`.

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

## Failure Modes

- A public struct has no public initializer.
- Public mutable setters let callers violate state invariants.
- An open method calls unknown overrides during partially initialized or inconsistent state.
- A required initializer is too narrow for supported subclasses.
- A class is marked open without compatibility tests for external override behavior.

## Engineering Judgment

Prefer final/public types and protocol/composition extension points. Use open only for documented
cross-module inheritance. Publish explicit validated initializers and narrow setters by default.

## Production Considerations

### Performance

Open dispatch and resilience can limit optimization, but semantics lead. Benchmark and use final where
the extension contract is intentionally closed.

### Concurrency and Thread Safety

Private setters do not synchronize state. Open hooks complicate isolation because unknown overrides
run in base-class lifecycle; document actor/sendability requirements explicitly.

### Testing

Compile external subclasses, invalid setter calls, and construction fixtures. Test override ordering,
super calls, reentrancy, initialization failure, and state invariants.

### Compatibility and Migration

Closing open API or narrowing initializers/setters is source-breaking. Introduce intent methods,
deprecate direct mutation, migrate clients, and retain shims for supported releases.

## Staff and Principal Perspective

Open hierarchies distribute implementation across organizations. Require owners, downstream subclass
fixtures, lifecycle contracts, and retirement policy; prefer smaller stable composition seams.

## Common Mistakes

### Using Open as More Public

**Why it is wrong:** It grants external code control through subclassing/overriding and creates stronger compatibility obligations.

**Better approach:** Use public for use; use open only for intentionally supported inheritance variation points.

## References

- [The Swift Programming Language: Access Control](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
- [The Swift Programming Language: Inheritance](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/inheritance/)
