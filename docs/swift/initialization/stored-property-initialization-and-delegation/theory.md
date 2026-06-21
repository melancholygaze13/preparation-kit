---
title: "Stored-Property Initialization and Delegation: Theory"
domain: "Swift"
topic: "Initialization"
concept: "Stored-Property Initialization and Delegation"
page_type: theory
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Stored-Property Initialization and Delegation: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> Every stored property must have an initial value before initialization completes.

- Defaults are assigned at declaration; remaining properties must be assigned by an initializer.
- A constant property can be assigned once during initialization by the type that declares it.
- Structure and enum initializers delegate with `self.init`; class rules additionally distinguish designated and convenience initializers.
- Closure defaults run when an instance is created and cannot use the not-yet-initialized instance.
- Centralize validation in the smallest initializer set that owns all invariants.

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

## Failure Modes

- Sentinel defaults create temporarily invalid objects.
- Multiple initializers duplicate validation and drift.
- Delegation cycles fail to establish one source of truth.
- Public memberwise construction exposes representation.
- Expensive hidden defaults inflate startup or per-instance latency.

## Engineering Judgment

Use defaults for universally valid policy, explicit initializers for required inputs,
failable/throwing construction for validation, and factories for effectful or cached work.
Keep I/O out of synchronous initializers when cancellation and recovery matter.

## Production Considerations

Profile construction volume, allocations, and expensive default closures. Test every
boundary and verify failed construction leaves no registration or external side effect.
Changing defaults or synthesized initializer availability is an API migration.

## Staff and Principal Perspective

Shared model construction is a schema boundary. Standardize validation ownership,
default evolution, decoding behavior, observability, and rollout for changed invariants.

## Common Mistakes

### Use a Placeholder Then Repair It

**Why it is wrong:** Invalid state can escape and every consumer must defend against it.

**Better approach:** Require valid input or fail construction before publishing the value.

## References

- [The Swift Programming Language: Initialization](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/initialization/)
