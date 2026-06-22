---
title: "Property Wrappers and Type Properties: Theory"
domain: "Swift"
topic: "Properties"
concept: "Property Wrappers and Type Properties"
page_type: theory
interview_priority: high
estimated_read_minutes: 4
levels:
  - senior
  - staff
  - principal
status: reviewed
last_reviewed: 2026-06-22
tags:
  - property-wrappers
  - projected-values
  - type-properties
  - shared-state
---

# Property Wrappers and Type Properties: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A wrapper is a small type that owns one property's storage behavior. It should make a
local policy reusable without hiding system ownership. Type properties are global
state scoped by a type name and deserve the same lifecycle and concurrency scrutiny.

## How It Works

### Wrapped and Projected Values

```swift
@propertyWrapper
struct Clamped<Value: Comparable> {
    private var value: Value
    let range: ClosedRange<Value>

    var wrappedValue: Value {
        get { value }
        set { value = min(max(newValue, range.lowerBound), range.upperBound) }
    }

    var projectedValue: ClosedRange<Value> { range }

    init(wrappedValue: Value, _ range: ClosedRange<Value>) {
        self.range = range
        self.value = min(max(wrappedValue, range.lowerBound), range.upperBound)
    }
}

struct AudioChannel {
    @Clamped(0...100) var volume = 50
}
```

`volume` exposes `wrappedValue`; `$volume` exposes `projectedValue`. The compiler
synthesizes backing storage whose name begins with an underscore. Do not make external
clients depend on generated storage names or exact lowering.

### Initialization and API Surface

An `init(wrappedValue:)` enables `@Wrapper var value = initial`. Additional wrapper
arguments configure the wrapper. The declaration's access level, memberwise
initialization, mutability, projected value, and enclosing type semantics all affect
the resulting API. Review the expanded interface rather than treating the attribute
as decoration.

Wrappers can also be used for local variables and parameters under their applicable
language rules. They are not a universal substitute for computed properties or
domain types; a validated `EmailAddress` type preserves meaning wherever the value
travels, while `@Validated var email: String` may protect only one storage location.

### Wrapper Semantics and Composition

Wrappers may be composed, but ordering and nested projections can become difficult
to explain. Each layer adds storage, initialization, access behavior, and possibly
reference semantics. Prefer one domain-specific wrapper or explicit type when callers
must understand several policies together.

### Type Properties

```swift
enum Limits {
    static let maximumRetries = 3
    @MainActor static var activeExperiments: Set<String> = []
}
```

Use `static` for type properties. Classes can use `class` for overridable computed
type properties. Stored type properties are lazily initialized on first access and
Swift guarantees their initialization occurs only once, even with simultaneous access;
they do not need `lazy`. This guarantee does not make subsequent mutation atomic.

Global constants and variables are also initialized lazily. Local variables are not.
Namespace syntax does not create ownership: a mutable static property is shared global
state and should normally be immutable or actor-isolated.

### Core Invariants

- Wrapper behavior matches the property's advertised domain contract.
- Generated storage and reference semantics do not escape accidentally.
- Projected values have a stable, documented purpose.
- Shared type state has explicit isolation, lifecycle, and test reset policy.
- Wrapper composition preserves understandable initialization and access ordering.

### Constraints and Guarantees

- A property-wrapper type declares `wrappedValue` and may declare `projectedValue`.
- Wrapper syntax and generated members follow compiler rules; generated backing
  storage is not a stable cross-module abstraction.
- Stored type-property initialization is lazy and single-execution; mutation after
  initialization is a separate concurrency concern.
- Property wrappers do not inherently make compound read-modify-write operations atomic.
- Module default isolation can affect static state; neighboring modules may differ.

## Engineering Judgment

Use a wrapper for repeated, local storage policy with a small stable interface. Use a
domain type when invariants must follow the value. Use a service or actor when policy
requires I/O, lifecycle, coordination, or asynchronous state. Use immutable type
properties for constants and isolated owners for genuinely shared mutable state.

## References

- [The Swift Programming Language: Properties](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/properties/)
- [SE-0258: Property Wrappers](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0258-property-wrappers.md)
- [SE-0466: Control Default Actor Isolation Inference](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0466-control-default-actor-isolation.md)
