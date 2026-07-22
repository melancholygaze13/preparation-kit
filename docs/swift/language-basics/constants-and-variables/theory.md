---
title: "Constants and Variables: Theory"
domain: "Swift"
topic: "Language Basics"
concept: "Constants and Variables"
page_type: theory
levels:
  - senior
interview_priority: reference
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-22
---

# Constants and Variables: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

`let` and `var` control whether a named storage location can receive another
value. They do not change the value's type, recursively freeze referenced data,
or provide synchronization.

```swift
let maximumAttempts = 3
var currentAttempt = 0

currentAttempt += 1       // Allowed.
// maximumAttempts += 1   // Error: a let binding can't change.
// currentAttempt = "one" // Error: currentAttempt remains an Int.
```

## Initialization and Assignment

A stored or local value must be initialized before it is read. A `let` constant
can be declared before assignment when every control-flow path assigns it exactly
once:

```swift
let title: String

if isPremium {
    title = "Premium"
} else {
    title = "Standard"
}
```

Use a type annotation when there is no initializer or when the intended type is
not clear. Otherwise, inference usually produces simpler code.

The compiler rejects both reading before initialization and assigning a `let`
constant more than once. Deferred initialization is therefore still immutable
after the first assignment; it is not a temporarily mutable variable.

## What `var` Allows

A variable can receive another value of the same type. For a value type, `var`
also permits mutating methods and writable-property changes:

```swift
struct Point {
    var x: Int
    var y: Int
}

var point = Point(x: 1, y: 2)
point.x = 3

var names = ["Ana"]
names.append("Sam")
names = []
```

These operations change the value stored in `point` or `names`. By contrast,
the same operations through a `let` binding are rejected for value types.

Local variables are useful when state changes are part of a small, visible
algorithm:

```swift
func total(_ values: [Int]) -> Int {
    var result = 0

    for value in values {
        result += value
    }

    return result
}
```

The variable makes the accumulation explicit. This is different from shared
mutable state that several callbacks or tasks can change.

## Value and Reference Behavior

For a struct, `let` prevents mutation through that binding, while `var` permits
it:

```swift
let point = Point(x: 1, y: 2)
// point.x = 3 // Error
```

For a class, `let` prevents the reference from pointing to another instance. It
does not freeze the object. `var` permits both rebinding and any mutation already
allowed by the class:

```swift
final class Account {
    var name: String
    init(name: String) { self.name = name }
}

let fixedAccount = Account(name: "Ana")
fixedAccount.name = "Sam" // Allowed.
// fixedAccount = Account(name: "Lee") // Error: can't rebind let.

var currentAccount = fixedAccount
currentAccount = Account(name: "Lee") // Allowed: var can rebind.
```

This object may still be shared. `let` does not make access atomic or thread-safe.

The same distinction applies to properties. A `let` stored property must receive
its value during initialization and cannot later be assigned. A computed
property is declared with `var` because it computes access rather than storing a
single value, even when it has only a getter.

For a collection value such as `Array`, a `let` binding prevents mutating
operations through that binding. The standard library may use copy-on-write
internally, but that optimization does not change the source-level rule.

## Engineering Decisions

Prefer `let` because it reduces the number of possible state changes. Use `var`
when mutation is a clear part of the algorithm or lifecycle. The important
boundary is ownership: small local mutation is easier to reason about than
mutable state shared across callbacks or tasks.

Do not change `let` to `var` merely to silence an error. First decide whether the
binding should be replaceable, the value should support mutation, or the model
should expose a specific state-changing operation.

Do not replace a clear local `var` with a reference wrapper only to claim
immutability. That moves mutation behind another object and can make ownership
harder to see. Prefer the form that makes the real state transition explicit.

## References

- [The Swift Programming Language: Constants and Variables](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Constants-and-Variables)
- [The Swift Programming Language: Classes Are Reference Types](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/classesandstructures/#Classes-Are-Reference-Types)
