---
title: "Stored-Property Initialization and Delegation: Theory"
domain: "Swift"
topic: "Initialization"
concept: "Stored-Property Initialization and Delegation"
page_type: theory
interview_priority: high
estimated_read_minutes: 6
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-07-22
---

# Stored-Property Initialization and Delegation: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

An initializer converts raw inputs into one fully valid value. It is not an ordinary
method on an already usable instance.

## How It Works

```swift
struct User {
    let name: String
    var loginCount = 0

    init(name: String) {
        self.name = name
    }
}

let user = User(name: "Ari")
print(user.name, user.loginCount) // Ari 0
```

An initializer is declared with `init`. Calling `User(name:)` creates an instance.
Before the initializer returns, every stored property must have a value. Here it
assigns `name`, while `loginCount` already has a valid default.

Swift's definite-initialization checks prevent reading uninitialized stored state.
Defaults reduce the number of initializer parameters, but they must be valid domain values rather than
placeholder values that create invalid instances.

### Delegating Between Value-Type Initializers

Delegation means one initializer calls another so one path owns the main setup:

```swift
struct Size {
    let width: Double
    let height: Double

    init(width: Double, height: Double) {
        self.width = width
        self.height = height
    }

    init(square side: Double) {
        self.init(width: side, height: side)
    }
}

let iconSize = Size(square: 24)
print(iconSize.width, iconSize.height) // 24 24
```

For a structure or enumeration, `self.init(...)` delegates to another initializer
from the same type. Classes use separate designated and convenience rules.

Value-type delegation keeps construction rules consistent. If custom initializers are
declared in the original structure declaration, synthesized memberwise behavior can
change; place supplemental initializers in extensions when the language rules and API
design require preserving synthesis.

Definite initialization proves that storage has a value. It does not prove that an
email is valid, a range is ordered, or two fields agree. Put those related checks in
one construction boundary so no public initializer can create a weaker state.

Property defaults are evaluated as part of creating each instance. A default closure
can allocate or perform expensive synchronous work even when the call site looks
simple. Prefer explicit inputs or lazy, owned work when the cost or failure matters.

### Rules That Must Stay True

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

Separate parsing from validated construction when raw input has many failure reasons.
The parser can return detailed errors; the initializer can remain the small boundary
that accepts only values capable of satisfying the type's rules.

## Production Application

Profile construction volume, allocations, and expensive default closures. Test every
boundary and verify failed construction leaves no registration or external side effect.
Changing defaults or synthesized initializer availability is an API migration.

For public value types, inspect the generated interface after adding a stored property,
default, or custom initializer. Source clients may depend on an explicit initializer
even when the type's stored representation is not intended to be public API.

## References

- [The Swift Programming Language: Initialization](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/initialization/)
