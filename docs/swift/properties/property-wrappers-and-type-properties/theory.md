---
title: "Property Wrappers and Type Properties: Theory"
domain: "Swift"
topic: "Properties"
concept: "Property Wrappers and Type Properties"
page_type: theory
levels:
  - senior
  - staff
  - principal
status: reviewed
last_reviewed: 2026-06-21
tags:
  - property-wrappers
  - projected-values
  - type-properties
  - shared-state
---

# Property Wrappers and Type Properties: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> A property wrapper separates reusable storage policy from a property's declaration;
> a type property stores or computes state associated with the type rather than an instance.

- A wrapper defines `wrappedValue`; an optional `projectedValue` is exposed with `$name`.
- Compiler-generated backing storage is an implementation detail, while wrapped and
  projected APIs can become part of the caller-visible contract.
- Wrapper initialization syntax determines whether a declaration initializes the
  wrapper itself or its wrapped value.
- A wrapper does not automatically provide validation, atomic compound mutation,
  observation ordering, persistence, or thread safety.
- Stored type properties initialize lazily on first access and are initialized only
  once, but later mutable access still requires isolation.

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

## Failure Modes

- **Hidden reference semantics:** Copies of an enclosing struct share wrapper storage.
- **False atomicity:** Individual access is locked but `value += 1` loses updates.
- **Validation tied to one field:** Invalid raw values escape and travel elsewhere.
- **Projected API leakage:** `$value` exposes mutable implementation details.
- **Wrapper stack opacity:** Initialization and notification order becomes unclear.
- **Mutable static singleton:** Tests, tasks, and features interfere through global state.

## Engineering Judgment

Use a wrapper for repeated, local storage policy with a small stable interface. Use a
domain type when invariants must follow the value. Use a service or actor when policy
requires I/O, lifecycle, coordination, or asynchronous state. Use immutable type
properties for constants and isolated owners for genuinely shared mutable state.

## Production Considerations

### Performance

Wrappers can add allocations, reference counting, locking, persistence, or repeated
transformation behind ordinary access. Inspect generated behavior and profile hot
paths. Type-property first access may create a latency spike; prewarm only with an
explicit startup budget.

### Concurrency and Thread Safety

The concurrency skill's relevant rule is direct: global and static mutable variables
need explicit isolation. Prefer `@MainActor` for UI-owned state or an actor/service
for other shared mutation. A wrapper must not claim general thread safety merely
because its getter and setter each lock; compound operations require one atomic API.

### Testing and Observability

Test wrapper initialization forms, copy behavior, projection, boundary values,
composition, and generated public API. For shared type state, test isolation and
reset behavior without order-dependent global fixtures. Observe slow first access,
contention, and persistence failures at the owning boundary.

### Compatibility and Migration

Adding or changing a public wrapper can alter initialization, key paths, reflection,
serialization, ABI, and projected API. Introduce a new declaration or adapter when
semantics change, migrate persisted formats explicitly, and keep generated storage
out of external contracts.

## Staff and Principal Perspective

Wrappers can standardize telemetry, persistence, dependency access, or observation
across a codebase, but that makes them platform infrastructure. Assign ownership,
version their public semantics, constrain approved use cases, and provide migration
and diagnostics. Treat mutable type properties as architecture-visible dependencies,
not convenient namespaces.

## Common Mistakes

### A Locking Wrapper Makes Every Use Atomic

**Why it is wrong:** A read followed by a write can release the lock between operations.

**Better approach:** Expose one synchronized mutation operation or isolate the state.

### Static Scope Is Not Global State

**Why it is wrong:** One mutable type property is shared by all instances and callers.

**Better approach:** Prefer immutable constants or inject an explicitly isolated owner.

## References

- [The Swift Programming Language: Properties](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/properties/)
- [SE-0258: Property Wrappers](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0258-property-wrappers.md)
- [SE-0466: Control Default Actor Isolation Inference](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0466-control-default-actor-isolation.md)
