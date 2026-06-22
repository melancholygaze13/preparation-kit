---
title: "Constants and Variables: Theory"
domain: "Swift"
topic: "Language Basics"
concept: "Constants and Variables"
page_type: theory
levels:
  - senior
interview_priority: reference
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-22
---

# Constants and Variables: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

`let` and `var` control whether a binding can receive another value. They do not
change the value's underlying type or provide synchronization.

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

## Value and Reference Behavior

For a struct, `let` prevents mutation through that binding:

```swift
let point = Point(x: 1, y: 2)
// point.x = 3 // Error
```

For a class, `let` prevents the reference from pointing to another instance. It
does not freeze the object:

```swift
let account = Account()
account.name = "Ana" // Allowed when name is mutable
```

This object may still be shared. `let` does not make access atomic or thread-safe.

## Engineering Decisions

Prefer `let` because it reduces the number of possible state changes. Use `var`
when mutation is a clear part of the algorithm or lifecycle. The important
boundary is ownership: small local mutation is easier to reason about than
mutable state shared across callbacks or tasks.

## References

- [The Swift Programming Language: Constants and Variables](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Constants-and-Variables)
- [The Swift Programming Language: Classes Are Reference Types](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/classesandstructures/#Classes-Are-Reference-Types)
