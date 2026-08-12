---
title: "Type Design and Initialization: Theory"
domain: "Swift"
topic: "Classes and Structures"
concept: "Type Design and Initialization"
page_type: theory
interview_priority: high
estimated_read_minutes: 7
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-08-12
tags:
  - classes
  - structures
  - initialization
  - api-design
---

# Type Design and Initialization: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Type choice defines what assignment means. Ask whether two variables should hold
two independently changeable values or intentionally observe one logical instance.
Then make initialization produce only valid states.

## How It Works

### Shared Capabilities and Class-Only Capabilities

Structures and classes use similar declaration and access syntax:

```swift
struct Coordinate {
    var x: Double
    var y: Double
}

final class DownloadSession {
    let id: Int
    var bytesReceived = 0

    init(id: Int) {
        self.id = id
    }
}

let point = Coordinate(x: 10, y: 20)
let session = DownloadSession(id: 42)
```

`struct` declares a value type. `class` declares a reference type. Both store data
in properties and create instances with initializer-call syntax such as
`Coordinate(x:y:)` or `DownloadSession(id:)`.

The compiler creates the memberwise initializer used for `Coordinate` because the
structure declares stored properties and no custom initializer. The class declares
its own `init(id:)`. Its initializer assigns `id`; `bytesReceived` already has a
default value. `self.id` means the property on the new instance, while the `id` on
the right is the initializer parameter.

Both can model rich behavior. A class is justified when reference identity,
shared mutable state, inheritance, or deinitialization is part of the model.
Marking a class `final` communicates that subclassing is not an extension point and
allows reasoning without unknown overrides.

Inheritance mechanics are a separate concern; do not select a class merely because
behavior might someday be reused. Protocols and composition preserve value
semantics when identity is not required.

### Defaults and Synthesized Initializers

If every stored property has a default and no other rule prevents it, a type can
often be created with `Type()`. Swift structures can receive a synthesized
memberwise initializer whose parameters correspond to stored properties:

```swift
struct RetryPolicy {
    var maximumAttempts = 3
    var baseDelay: Duration
}

let policy = RetryPolicy(maximumAttempts: 5, baseDelay: .seconds(1))
```

The exact synthesized signature depends on stored properties, defaults, explicit
initializers, extensions, and access control. It is not a substitute for learning
the full initialization rules.

### Public Construction Must Create Valid Values

An explicit initializer prevents callers from depending on representation:

```swift
struct Percentage {
    let value: Double

    init?(_ value: Double) {
        guard (0...100).contains(value) else { return nil }
        self.value = value
    }
}
```

For a public struct, the synthesized memberwise initializer does not automatically
become a public API. Even where accessible, an initializer that mirrors stored
properties couples callers to property names and storage details. For exported
types and validated domain values, prefer initializers or factories named for what
callers want to create.

### Struct-versus-Class Decision

Use a structure when the value should be copied independently, has no meaningful
instance identity, and its state can be kept valid as a whole. Typical examples are
coordinates, configuration, request descriptions, and immutable snapshots.

Use a class when callers must share one entity, reference identity is observable,
or a resource has a coordinated lifecycle. Typical examples include an owned
session, cache, connection, or framework object already defined by reference
semantics.

Type size alone is insufficient. Swift may optimize value copying, while reference
types pay allocation, indirection, and synchronization costs. Measure the real
workload after choosing the copy and sharing behavior the model requires.

### Rules That Must Stay True

- Every fully initialized instance satisfies its domain constraints.
- Type choice makes assignment behavior match the domain.
- Public construction expresses intent rather than exposing storage accidentally.
- Shared resources have one explicit lifecycle owner.
- Storage changes do not silently change behavior that callers can observe.

### Constraints and Guarantees

- Structure assignment has value semantics; class assignment copies a reference.
- Memberwise initializer synthesis is conditional and access-controlled.
- A `let` structure value cannot have its variable properties changed through that
  binding; a `let` class reference can still observe mutable properties changing.
- A struct can contain class references, so the complete object graph is not
  necessarily independently copied.
- Neither declaration kind guarantees thread safety or a particular memory layout.

## Engineering Judgment

### Decision Table

| Question | Favors structure | Favors class |
|---|---|---|
| Should copies change independently? | Yes | No |
| Does instance identity have domain meaning? | No | Yes |
| Is state a snapshot or description? | Yes | No |
| Is one shared lifecycle required? | No | Yes |
| Is inheritance required by the framework/design? | No | Yes |
| Can reference members violate snapshot expectations? | Must be controlled | Expected and owned |

### Trade-offs and Alternatives

A struct makes local reasoning and snapshot APIs easier but can hide expensive or
shared reference members. A class represents shared entities directly but makes
aliasing and lifecycle part of every consumer's reasoning. An actor is preferable
to a plain mutable class when isolated shared mutation is the defining requirement.
A protocol selects capabilities; it does not itself decide value or reference
semantics.

## Production Application

### Performance

Do not infer performance from the keyword. Profile allocation, retain/release
traffic, copying, cache locality, and mutation frequency. Keep public semantics
stable even if storage later adopts copy-on-write or reference-backed implementation details.

### Concurrency and Thread Safety

Immutable, sendable values make boundary transfer easier. A mutable class needs an
isolation strategy, and a struct containing non-sendable references inherits that
problem. `Sendable` checking expresses transfer safety; it does not serialize
mutation of a shared variable.

### Testing

Test every initializer's valid boundaries and rejection paths. Add semantic tests:
copy a value and mutate one copy, or alias a reference and verify deliberate shared
observation. Public API tests should construct through supported intent-shaped
entry points rather than compiler-generated implementation details.

### Compatibility and Migration

Adding, removing, or renaming stored properties can change synthesized initializer
availability. Moving between struct and class can alter identity, mutation through
`let`, equality expectations, lifetime, and concurrency behavior. Introduce an
adapter or new type, migrate one boundary at a time, and measure bugs caused by old and new models interacting.

## Staff and Principal Perspective

### System and Organizational Impact

A shared model's copy and sharing behavior affects caches, state reducers, network
boundaries, tests, UI observation, concurrency boundaries, and team conventions. Document whether
it is a snapshot, identity-bearing entity, or resource owner. Require review when a
change introduces identity, reference-backed storage, or public construction.

### Decision Framework

Write down the required copy behavior, identity definition, lifecycle owner,
required rules, mutation authority, concurrency boundary, API stability needs, and
measured performance constraints. Select the type only after those answers agree.

## References

- [The Swift Programming Language: Classes and Structures](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/classesandstructures/)
- [The Swift Programming Language: Initialization](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/initialization/)
- [Swift.org: Value and Reference Types](https://www.swift.org/documentation/articles/value-and-reference-types.html)
